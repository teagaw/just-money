"""Tests for Novel Studio Phase 0. Fast tests need no network."""
import json
import sys
from pathlib import Path

import pytest

BASE = Path(__file__).parent
sys.path.insert(0, str(BASE))
import studio


# ---------- split_scene_and_choices ----------

def test_split_with_markers():
    raw = "SCENE:\nRain fell.\n\nCHOICES:\n1. Run\n2. Hide\n"
    scene, choices = studio.split_scene_and_choices(raw)
    assert scene == "Rain fell."
    assert choices == ["Run", "Hide"]


def test_split_trailing_numbered_list():
    raw = "SCENE:\nRain fell.\n\n1. Run\n2. Hide\n"
    scene, choices = studio.split_scene_and_choices(raw)
    assert "Rain fell." in scene
    assert choices == ["Run", "Hide"]


def test_split_no_choices():
    raw = "SCENE:\nJust prose, no choices."
    scene, choices = studio.split_scene_and_choices(raw)
    assert "Just prose" in scene
    assert choices == []


def test_split_strips_scene_label():
    raw = "SCENE:\nHello world.\n\nCHOICES:\n1. Go"
    scene, choices = studio.split_scene_and_choices(raw)
    assert not scene.startswith("SCENE:")
    assert scene == "Hello world."


# ---------- parse_json_robust ----------

def test_parse_clean():
    d = studio.parse_json_robust('{"a": 1, "b": [2,3]}')
    assert d == {"a": 1, "b": [2, 3]}


def test_parse_fenced():
    d = studio.parse_json_robust("```json\n{\"x\": 5}\n```")
    assert d == {"x": 5}


def test_parse_embedded_in_prose():
    text = "Here is the result:\n{\"events\": [], \"n\": 3}\nDone."
    d = studio.parse_json_robust(text)
    assert d["n"] == 3
    assert d["events"] == []


def test_parse_fails_on_garbage():
    with pytest.raises(Exception):
        studio.parse_json_robust("no json here at all")


# ---------- atomic_write / sha256 ----------

def test_atomic_write(tmp_path):
    p = tmp_path / "out.txt"
    studio.atomic_write(p, "hello")
    assert p.read_text() == "hello"
    # overwrite
    studio.atomic_write(p, "world")
    assert p.read_text() == "world"


def test_sha256_file(tmp_path):
    p = tmp_path / "f.txt"
    p.write_text("abc", encoding="utf-8")
    h = studio.sha256_file(p)
    assert len(h) == 64
    # deterministic
    assert h == studio.sha256_file(p)


# ---------- apply_state_updates ----------

def test_apply_state_updates():
    state = {"c1": {"location": "A", "inventory": [], "relationships": {}, "status": "alive"}}
    updates = {"c1": {"location": "B", "inventory_add": ["key"], "status": "hurt",
                      "relationships": {"c2": "ally"}}}
    studio.apply_state_updates(state, updates)
    assert state["c1"]["location"] == "B"
    assert "key" in state["c1"]["inventory"]
    assert state["c1"]["status"] == "hurt"
    assert state["c1"]["relationships"]["c2"] == "ally"


def test_apply_state_updates_remove():
    state = {"c1": {"location": "A", "inventory": ["key", "sword"], "relationships": {}, "status": "alive"}}
    studio.apply_state_updates(state, {"c1": {"inventory_remove": ["key"]}})
    assert state["c1"]["inventory"] == ["sword"]


def test_apply_state_updates_new_char():
    state = {}
    studio.apply_state_updates(state, {"c9": {"location": "X", "status": "alive"}})
    assert "c9" in state
    assert state["c9"]["location"] == "X"


# ---------- integration (slow, hits network) ----------

@pytest.mark.slow
def test_generate_one_stream():
    from web_ui import generate_one_stream
    events = list(generate_one_stream("Continue the story naturally."))
    types = [e[0] for e in events]
    assert "stage" in types
    assert types[-1] == "done"
    done = events[-1][1]
    assert isinstance(done["scene"], str) and len(done["scene"]) > 100
    assert isinstance(done["choices"], list) and len(done["choices"]) >= 1
    assert "state" in done and "events" in done


# ---------- Phase 1: edit detection ----------

def test_detect_edit_clean(tmp_path, monkeypatch):
    """A scene whose hash matches meta is not dirty."""
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "scenes").mkdir()
    (tmp_path / "scenes" / "scene_01.md").write_text("hello", encoding="utf-8")
    import hashlib
    h = hashlib.sha256(b"hello").hexdigest()
    (tmp_path / "scenes" / "scene_01_meta.json").write_text(
        json.dumps({"hash": h, "status": "accepted"}), encoding="utf-8")
    assert studio.detect_edit(1) is False


def test_detect_edit_dirty(tmp_path, monkeypatch):
    """A scene whose content changed is flagged dirty."""
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "scenes").mkdir()
    (tmp_path / "scenes" / "scene_01.md").write_text("changed", encoding="utf-8")
    (tmp_path / "scenes" / "scene_01_meta.json").write_text(
        json.dumps({"hash": "deadbeef", "status": "accepted"}), encoding="utf-8")
    assert studio.detect_edit(1) is True
    meta = json.loads((tmp_path / "scenes" / "scene_01_meta.json").read_text())
    assert meta["status"] == "dirty"


def test_detect_edit_missing_meta(tmp_path, monkeypatch):
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "scenes").mkdir()
    (tmp_path / "scenes" / "scene_01.md").write_text("x", encoding="utf-8")
    assert studio.detect_edit(1) is False


def test_scan_for_edits(tmp_path, monkeypatch):
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "scenes").mkdir()
    (tmp_path / "scenes" / "scene_01.md").write_text("a", encoding="utf-8")
    (tmp_path / "scenes" / "scene_01_meta.json").write_text(
        json.dumps({"hash": "nope", "status": "accepted"}), encoding="utf-8")
    (tmp_path / "scenes" / "scene_02.md").write_text("b", encoding="utf-8")
    import hashlib
    h = hashlib.sha256(b"b").hexdigest()
    (tmp_path / "scenes" / "scene_02_meta.json").write_text(
        json.dumps({"hash": h, "status": "accepted"}), encoding="utf-8")
    assert studio.scan_for_edits() == [1]


# ---------- Phase 1: rebuild_state_from_events ----------

def test_rebuild_respects_retcon(tmp_path, monkeypatch):
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "codex").mkdir(parents=True, exist_ok=True) if False else None
    (tmp_path).mkdir(exist_ok=True)
    chars = [{"id": "c1", "name": "A"}]
    (tmp_path / "characters.json").write_text(json.dumps(chars), encoding="utf-8")
    (tmp_path / "events").mkdir()
    # two events: one grants item, one retcons it
    e1 = {"event_id": 1, "scene": 1, "type": "item_gain", "actor": "c1",
          "summary": "gains key", "target": None, "uncertain": False,
          "state_updates": {"c1": {"inventory_add": ["key"]}}}
    e2 = {"event_id": 2, "scene": 1, "type": "retcon", "actor": None,
          "summary": "retcon", "target": None, "uncertain": False,
          "nullifies_event_id": 1}
    with (tmp_path / "events" / "event_log.jsonl").open("w") as f:
        f.write(json.dumps(e1) + "\n")
        f.write(json.dumps(e2) + "\n")
    state = studio.rebuild_state_from_events()
    assert "key" not in state["c1"]["inventory"]


def test_rebuild_applies_non_nullified(tmp_path, monkeypatch):
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path).mkdir(exist_ok=True)
    chars = [{"id": "c1", "name": "A"}]
    (tmp_path / "characters.json").write_text(json.dumps(chars), encoding="utf-8")
    (tmp_path / "events").mkdir()
    e1 = {"event_id": 1, "scene": 1, "type": "item_gain", "actor": "c1",
          "summary": "gains key", "target": None, "uncertain": False,
          "state_updates": {"c1": {"inventory_add": ["key"]}}}
    with (tmp_path / "events" / "event_log.jsonl").open("w") as f:
        f.write(json.dumps(e1) + "\n")
    state = studio.rebuild_state_from_events()
    assert "key" in state["c1"]["inventory"]


# ---------- Phase 1: flag_downstream ----------

def test_flag_downstream_filters_by_scene(tmp_path, monkeypatch):
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "scenes").mkdir()
    (tmp_path / "scenes" / "scene_01.md").write_text("the key appears here", encoding="utf-8")
    (tmp_path / "scenes" / "scene_02.md").write_text("nothing", encoding="utf-8")
    (tmp_path / "scenes" / "scene_03.md").write_text("the key returns", encoding="utf-8")
    res = studio.flag_downstream(["key"], after_scene=1)
    assert "scene_02.md" not in res
    assert "scene_03.md" in res
    assert "scene_01.md" not in res


# ---------- Phase 1: apply_proposals validation ----------

def test_apply_proposals_skips_invalid_ids(tmp_path, monkeypatch):
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "events").mkdir()
    # empty log -> no valid ids
    (tmp_path / "events" / "event_log.jsonl").write_text("", encoding="utf-8")
    proposals = [{"op": "nullify", "target_event_id": 999, "description": "x", "accepted": True}]
    applied = studio.apply_proposals(proposals)
    assert applied == 0


def test_apply_proposals_appends_retcon(tmp_path, monkeypatch):
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "events").mkdir()
    (tmp_path / "events" / "event_log.jsonl").write_text(
        json.dumps({"event_id": 5, "scene": 1, "type": "action", "summary": "x"}) + "\n",
        encoding="utf-8")
    proposals = [{"op": "nullify", "target_event_id": 5, "description": "retcon", "accepted": True, "scene": 1}]
    applied = studio.apply_proposals(proposals)
    assert applied == 1
    lines = (tmp_path / "events" / "event_log.jsonl").read_text().splitlines()
    retcons = [json.loads(l) for l in lines if json.loads(l).get("type") == "retcon"]
    assert len(retcons) == 1
    assert retcons[0]["nullifies_event_id"] == 5


# ---------- Phase 1: reconcile_scene ----------

def test_reconcile_scene_no_snapshot(tmp_path, monkeypatch):
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "scenes").mkdir()
    (tmp_path / "scenes" / "scene_01.md").write_text("edited", encoding="utf-8")
    (tmp_path / "scenes" / "scene_01_meta.json").write_text(
        json.dumps({"hash": "x", "status": "accepted", "events": []}), encoding="utf-8")
    # no snapshot -> None
    assert studio.reconcile_scene(1) is None


def test_retrieve_relevant_scenes(tmp_path, monkeypatch):
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "scenes").mkdir()
    (tmp_path / "scenes" / "scene_01.md").write_text("Maren found the key in the harbor.", encoding="utf-8")
    (tmp_path / "scenes" / "scene_02.md").write_text("Tovin bought fish at the market.", encoding="utf-8")
    (tmp_path / "scenes" / "scene_03.md").write_text("Maren and Tovin walked to the dock.", encoding="utf-8")
    chars = [{"id": "c1", "name": "Maren"}]
    result = studio.retrieve_relevant_scenes("Maren and the key", chars, 3)
    assert "Scene 01" in result  # entity match
    assert "Scene 03" in result  # recency


def test_find_fact_support(tmp_path, monkeypatch):
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "events").mkdir()
    (tmp_path / "events" / "event_log.jsonl").write_text(
        json.dumps({"event_id": 8, "scene": 1, "type": "discovery", "summary": "Maren finds the key"}) + "\n" +
        json.dumps({"event_id": 9, "scene": 1, "type": "retcon", "summary": "retcon key", "nullifies_event_id": 8}) + "\n",
        encoding="utf-8")
    res = studio.find_fact_support("key")
    assert len(res) == 1
    assert res[0]["event_id"] == 8
    assert res[0]["nullified"] is True
    assert res[0]["source_scene_file"] == "scene_01.md"


def test_phase2_exit_flow(tmp_path, monkeypatch):
    """Phase 2 exit test: point to supporting records + flag affected scenes on edit."""
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "scenes").mkdir()
    (tmp_path / "events").mkdir()
    (tmp_path / "characters.json").write_text(json.dumps([{"id": "c1", "name": "Maren"}]), encoding="utf-8")

    # Scenes 1-3: fact established in scene 1, referenced in 2-3
    (tmp_path / "scenes" / "scene_01.md").write_text("Maren found the key.", encoding="utf-8")
    (tmp_path / "scenes" / "scene_01_snapshot.md").write_text("Maren found the key.", encoding="utf-8")
    (tmp_path / "scenes" / "scene_02.md").write_text("Maren used the key to open the door.", encoding="utf-8")
    (tmp_path / "scenes" / "scene_03.md").write_text("The key was gone.", encoding="utf-8")
    import hashlib
    (tmp_path / "scenes" / "scene_01_meta.json").write_text(
        json.dumps({"hash": "oldhash", "status": "accepted", "events": [
            {"event_id": 8, "summary": "Maren finds the key", "state_updates": {"c1": {"inventory_add": ["key"]}}}
        ]}), encoding="utf-8")
    (tmp_path / "scenes" / "scene_02_meta.json").write_text(
        json.dumps({"hash": "h2", "status": "accepted", "events": []}), encoding="utf-8")
    (tmp_path / "scenes" / "scene_03_meta.json").write_text(
        json.dumps({"hash": "h3", "status": "accepted", "events": []}), encoding="utf-8")

    (tmp_path / "events" / "event_log.jsonl").write_text(
        json.dumps({"event_id": 8, "scene": 1, "type": "discovery", "actor": "c1",
                    "summary": "Maren finds the key", "target": None, "uncertain": False,
                    "state_updates": {"c1": {"inventory_add": ["key"]}}}) + "\n",
        encoding="utf-8")
    (tmp_path / "character_state.json").write_text(
        json.dumps({"c1": {"location": "x", "inventory": ["key"], "relationships": {}, "status": "alive"}}),
        encoding="utf-8")

    # Step 1: point to records supporting the fact "key"
    support = studio.find_fact_support("key")
    assert len(support) == 1
    assert support[0]["event_id"] == 8
    assert support[0]["source_scene_file"] == "scene_01.md"
    assert support[0]["nullified"] is False

    # Step 2: edit scene 1 to remove the key
    (tmp_path / "scenes" / "scene_01.md").write_text("Maren walked on. No key.", encoding="utf-8")

    # Step 3: detect
    assert studio.detect_edit(1) is True

    # Step 4: reconcile (mocked LLM)
    fake = json.dumps({
        "summary": "Author deleted the key paragraph",
        "passages_changed": ["Maren found the key"],
        "affected_events": [8],
        "proposals": [{"proposal_id": "p1", "op": "nullify", "target_event_id": 8,
                       "description": "Remove key from inventory", "confidence": 0.95,
                       "auto_safe": False, "downstream_entities": ["key"]}],
        "downstream_entities": ["key"],
    })
    monkeypatch.setattr(studio, "llm_call", lambda *a, **k: fake)
    r = studio.reconcile_scene(1)
    assert r is not None
    assert len(r["proposals"]) == 1
    # downstream scenes flagged (scene_02, scene_03 mention "key")
    assert "scene_02.md" in r.get("downstream_scenes", [])
    assert "scene_03.md" in r.get("downstream_scenes", [])

    # Step 5: apply
    for p in r["proposals"]:
        p["accepted"] = True
    res = studio.apply_reconciliation(r["proposals"], scene=1, downstream_entities=r.get("downstream_entities", []))
    assert res["applied"] == 1
    assert res["rebuilt"] is True
    assert "scene_02.md" in res["flagged_scenes"]

    # Step 6: verify retcon in log
    lines = (tmp_path / "events" / "event_log.jsonl").read_text().splitlines()
    retcons = [json.loads(l) for l in lines if json.loads(l).get("type") == "retcon"]
    assert len(retcons) == 1
    assert retcons[0]["nullifies_event_id"] == 8

    # Step 7: verify state rebuilt (key removed)
    state = json.loads((tmp_path / "character_state.json").read_text())
    assert "key" not in state["c1"]["inventory"]

    # Step 8: verify fact now shows as nullified
    support = studio.find_fact_support("key")
    assert len(support) == 1
    assert support[0]["nullified"] is True

    # Step 9: verify meta status
    meta = json.loads((tmp_path / "scenes" / "scene_01_meta.json").read_text())
    assert meta["status"] == "reconciled"


def test_reconcile_scene_no_change(tmp_path, monkeypatch):
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "scenes").mkdir()
    (tmp_path / "scenes" / "scene_01.md").write_text("same", encoding="utf-8")
    (tmp_path / "scenes" / "scene_01_snapshot.md").write_text("same", encoding="utf-8")
    (tmp_path / "scenes" / "scene_01_meta.json").write_text(
        json.dumps({"hash": "x", "status": "dirty", "events": []}), encoding="utf-8")
    assert studio.reconcile_scene(1) is None
    meta = json.loads((tmp_path / "scenes" / "scene_01_meta.json").read_text())
    assert meta["status"] == "accepted"


def test_reconcile_scene_with_mock(tmp_path, monkeypatch):
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "scenes").mkdir()
    (tmp_path / "scenes" / "scene_01.md").write_text("edited text", encoding="utf-8")
    (tmp_path / "scenes" / "scene_01_snapshot.md").write_text("original text", encoding="utf-8")
    (tmp_path / "scenes" / "scene_01_meta.json").write_text(
        json.dumps({"hash": "x", "status": "dirty", "events": [{"event_id": 5, "summary": "old"}]}),
        encoding="utf-8")
    (tmp_path / "characters.json").write_text("[]", encoding="utf-8")
    (tmp_path / "events").mkdir()
    import json as _j
    (tmp_path / "events" / "event_log.jsonl").write_text(
        _j.dumps({"event_id": 5, "scene": 1, "type": "discovery", "summary": "old"}) + "\n",
        encoding="utf-8")
    fake = json.dumps({
        "summary": "deleted a fact",
        "passages_changed": ["the key paragraph"],
        "affected_events": [5],
        "proposals": [{"proposal_id": "p1", "op": "nullify", "target_event_id": 5,
                       "description": "nullify event 5", "confidence": 0.9, "auto_safe": False}],
        "downstream_entities": ["key"],
    })
    monkeypatch.setattr(studio, "llm_call", lambda *a, **k: fake)
    res = studio.reconcile_scene(1)
    assert res is not None
    assert res["summary"] == "deleted a fact"
    assert len(res["proposals"]) == 1
    assert res["proposals"][0]["target_event_id"] == 5
    assert "scene_01.md" not in (res.get("downstream_scenes") or [])


# ---------- Home page: project summaries ----------

def test_project_summaries(tmp_path, monkeypatch):
    monkeypatch.setattr(studio, "BASE", tmp_path)
    # 0 projects
    assert studio.project_summaries() == []

    # 1 project
    (tmp_path / "projects" / "novel_a").mkdir(parents=True)
    (tmp_path / "projects" / "novel_a" / "scenes").mkdir()
    (tmp_path / "projects" / "novel_a" / "scenes" / "scene_01.md").write_text("First scene prose here", encoding="utf-8")
    (tmp_path / "projects" / "novel_a" / "project_config.json").write_text('{"language":"en","genre":"Fantasy","subgenre":"Grimdark"}', encoding="utf-8")
    (tmp_path / "active_project.txt").write_text("novel_a", encoding="utf-8")
    summaries = studio.project_summaries()
    assert len(summaries) == 1
    assert summaries[0]["name"] == "novel_a"
    assert summaries[0]["genre"] == "Fantasy"
    assert summaries[0]["subgenre"] == "Grimdark"
    assert summaries[0]["language"] == "en"
    assert summaries[0]["scene_count"] == 1
    assert "First scene" in summaries[0]["last_scene_preview"]
    assert len(summaries[0]["last_scene_preview"]) <= 80

    # preview truncation
    long_text = "A" * 200
    (tmp_path / "projects" / "novel_a" / "scenes" / "scene_02.md").write_text(long_text, encoding="utf-8")
    summaries = studio.project_summaries()
    assert summaries[0]["scene_count"] == 2
    # highest-numbered scene = scene_02
    assert summaries[0]["last_scene_preview"] == long_text[:80]

    # missing config / missing scenes dir handled
    (tmp_path / "projects" / "bare").mkdir()
    summaries = studio.project_summaries()
    assert len(summaries) == 2
    bare = [s for s in summaries if s["name"] == "bare"][0]
    assert bare["genre"] == ""
    assert bare["subgenre"] == ""
    assert bare["language"] == "en"
    assert bare["scene_count"] == 0
    assert bare["last_scene_preview"] == ""
    assert isinstance(bare["last_modified"], str)


# ---------- Phase 1: integration test (exit test simulation) ----------

def test_phase1_exit_flow(tmp_path, monkeypatch):
    """Simulate the Phase 1 exit test: edit scene, detect, reconcile, apply, verify retcon."""
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "scenes").mkdir()
    (tmp_path / "events").mkdir()
    (tmp_path / "characters.json").write_text(json.dumps([{"id": "c1", "name": "Maren"}]), encoding="utf-8")

    # Scene 1: original accepted (has key discovery)
    original = "Maren found the key. She put it in her pocket."
    edited = "Maren walked on. No key."
    (tmp_path / "scenes" / "scene_01.md").write_text(edited, encoding="utf-8")
    (tmp_path / "scenes" / "scene_01_snapshot.md").write_text(original, encoding="utf-8")
    import hashlib
    h = hashlib.sha256(edited.encode()).hexdigest()
    (tmp_path / "scenes" / "scene_01_meta.json").write_text(
        json.dumps({"hash": "oldhash", "status": "accepted", "events": [
            {"event_id": 8, "summary": "Maren finds the key", "state_updates": {"c1": {"inventory_add": ["key"]}}}
        ]}), encoding="utf-8")
    (tmp_path / "scenes" / "scene_02.md").write_text("Scene 2 mentions the key.", encoding="utf-8")

    # Event log with event 8
    (tmp_path / "events" / "event_log.jsonl").write_text(
        json.dumps({"event_id": 8, "scene": 1, "type": "discovery", "actor": "c1",
                    "summary": "Maren finds the key", "target": None, "uncertain": False,
                    "state_updates": {"c1": {"inventory_add": ["key"]}}}) + "\n",
        encoding="utf-8")
    (tmp_path / "character_state.json").write_text(
        json.dumps({"c1": {"location": "x", "inventory": ["key"], "relationships": {}, "status": "alive"}}),
        encoding="utf-8")

    fake = json.dumps({
        "summary": "Author deleted the key paragraph",
        "passages_changed": ["Maren found the key"],
        "affected_events": [8],
        "proposals": [{"proposal_id": "p1", "op": "nullify", "target_event_id": 8,
                       "description": "Remove key from inventory", "confidence": 0.95,
                       "auto_safe": False, "downstream_entities": ["key"]}],
        "downstream_entities": ["key"],
    })
    monkeypatch.setattr(studio, "llm_call", lambda *a, **k: fake)

    # detect
    assert studio.detect_edit(1) is True
    assert 1 in studio.scan_for_edits()

    # reconcile
    r = studio.reconcile_scene(1)
    assert r is not None and len(r["proposals"]) == 1
    assert "scene_02.md" in r.get("downstream_scenes", [])

    # apply
    for p in r["proposals"]:
        p["accepted"] = True
    res = studio.apply_reconciliation(r["proposals"], scene=1, downstream_entities=r.get("downstream_entities", []))
    assert res["applied"] == 1
    assert res["rebuilt"] is True
    assert "scene_02.md" in res["flagged_scenes"]

    # verify retcon in log
    lines = (tmp_path / "events" / "event_log.jsonl").read_text().splitlines()
    retcons = [json.loads(l) for l in lines if json.loads(l).get("type") == "retcon"]
    assert len(retcons) == 1
    assert retcons[0]["nullifies_event_id"] == 8

    # verify state rebuilt (key removed)
    state = json.loads((tmp_path / "character_state.json").read_text())
    assert "key" not in state["c1"]["inventory"]

    # verify meta status
    meta = json.loads((tmp_path / "scenes" / "scene_01_meta.json").read_text())
    assert meta["status"] == "reconciled"


# ---------- Home page: extended create_project ----------

def test_create_project_with_premise(tmp_path, monkeypatch):
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "projects").mkdir()
    ok = studio.create_project("test_novel", "en", "Fantasy", "Grimdark",
                               premise="A dark fantasy about revenge",
                               characters=[{"name": "Kael", "role": "protagonist", "voice": "gruff"}],
                               lore="Magic is rare and feared.")
    assert ok is True
    pp = tmp_path / "projects" / "test_novel"
    assert (pp / "world_lore.md").exists()
    lore = (pp / "world_lore.md").read_text()
    assert "revenge" in lore
    assert "Magic is rare" in lore
    chars = json.loads((pp / "characters.json").read_text())
    assert len(chars) == 1
    assert chars[0]["name"] == "Kael"
    assert chars[0]["id"] == "c1"
    assert chars[0]["role"] == "protagonist"
    assert chars[0]["voice"] == "gruff"
    assert chars[0]["voice_contract"] == {}
    assert chars[0]["secrets"] == []
    assert chars[0]["goals"] == []
    assert chars[0]["speech_quirks"] == []
    cfg = json.loads((pp / "project_config.json").read_text())
    assert cfg["premise"] == "A dark fantasy about revenge"

def test_create_project_char_ids(tmp_path, monkeypatch):
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "projects").mkdir()
    ok = studio.create_project("t", "en", "", "", characters=[
        {"name": "A"}, {"name": "B"}, {"name": "C"},
    ])
    assert ok is True
    chars = json.loads((tmp_path / "projects" / "t" / "characters.json").read_text())
    assert [c["id"] for c in chars] == ["c1", "c2", "c3"]

def test_create_project_duplicate_name_rejected(tmp_path, monkeypatch):
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "projects").mkdir()
    assert studio.create_project("dup", "en", "", "") is True
    assert studio.create_project("dup", "en", "", "") is False
    assert studio.create_project("x", "en", "", "", characters=[{"name": "A"}, {"name": "A"}]) is False

def test_create_project_missing_fields(tmp_path, monkeypatch):
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "projects").mkdir()
    ok = studio.create_project("m", "en", "", "", premise=None, characters=None, lore=None)
    assert ok is True
    p = tmp_path / "projects" / "m"
    assert (p / "characters.json").read_text().strip() == "[]"
    assert "World Lore" in (p / "world_lore.md").read_text()
    ok2 = studio.create_project("m2", "en", "", "", characters=[{"name": "Z"}])
    assert ok2 is True
    chars = json.loads((tmp_path / "projects" / "m2" / "characters.json").read_text())
    assert chars[0]["name"] == "Z"
    assert chars[0]["role"] == ""
    assert chars[0]["voice_contract"] == {}

def test_create_project_no_lore_template(tmp_path, monkeypatch):
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "projects").mkdir()
    studio.create_project("n", "en", "", "", premise="Prem")
    lore = (tmp_path / "projects" / "n" / "world_lore.md").read_text()
    assert "Prem" in lore

def test_create_project_empty_characters_writes_empty(tmp_path, monkeypatch):
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "projects").mkdir()
    studio.create_project("e", "en", "", "", characters=[])
    assert json.loads((tmp_path / "projects" / "e" / "characters.json").read_text()) == []


# ---------- Home page: extended create_project ----------

def test_create_project_with_premise(tmp_path, monkeypatch):
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "projects").mkdir()
    ok = studio.create_project("test_novel", "en", "Fantasy", "Grimdark",
                               premise="A dark fantasy about revenge",
                               characters=[{"name": "Kael", "role": "protagonist", "voice": "gruff"}],
                               lore="Magic is rare and feared.")
    assert ok is True
    pp = tmp_path / "projects" / "test_novel"
    assert (pp / "world_lore.md").exists()
    lore = (pp / "world_lore.md").read_text()
    assert "revenge" in lore
    assert "Magic is rare" in lore
    chars = json.loads((pp / "characters.json").read_text())
    assert len(chars) == 1
    assert chars[0]["name"] == "Kael"
    assert chars[0]["id"] == "c1"
    assert chars[0]["role"] == "protagonist"
    assert chars[0]["voice"] == "gruff"
    assert chars[0]["voice_contract"] == {}
    assert chars[0]["secrets"] == []
    assert chars[0]["goals"] == []
    assert chars[0]["speech_quirks"] == []
    cfg = json.loads((pp / "project_config.json").read_text())
    assert cfg["premise"] == "A dark fantasy about revenge"

def test_create_project_char_ids(tmp_path, monkeypatch):
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "projects").mkdir()
    ok = studio.create_project("t", "en", "", "", characters=[
        {"name": "A"}, {"name": "B"}, {"name": "C"},
    ])
    assert ok is True
    chars = json.loads((tmp_path / "projects" / "t" / "characters.json").read_text())
    assert [c["id"] for c in chars] == ["c1", "c2", "c3"]

def test_create_project_duplicate_name_rejected(tmp_path, monkeypatch):
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "projects").mkdir()
    assert studio.create_project("dup", "en", "", "") is True
    assert studio.create_project("dup", "en", "", "") is False
    assert studio.create_project("x", "en", "", "", characters=[{"name": "A"}, {"name": "A"}]) is False

def test_create_project_missing_fields(tmp_path, monkeypatch):
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "projects").mkdir()
    ok = studio.create_project("m", "en", "", "", premise=None, characters=None, lore=None)
    assert ok is True
    p = tmp_path / "projects" / "m"
    assert (p / "characters.json").read_text().strip() == "[]"
    assert "World Lore" in (p / "world_lore.md").read_text()
    ok2 = studio.create_project("m2", "en", "", "", characters=[{"name": "Z"}])
    assert ok2 is True
    chars = json.loads((tmp_path / "projects" / "m2" / "characters.json").read_text())
    assert chars[0]["name"] == "Z"
    assert chars[0]["role"] == ""
    assert chars[0]["voice_contract"] == {}

def test_create_project_no_lore_template(tmp_path, monkeypatch):
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "projects").mkdir()
    studio.create_project("n", "en", "", "", premise="Prem")
    lore = (tmp_path / "projects" / "n" / "world_lore.md").read_text()
    assert "Prem" in lore

def test_create_project_empty_characters_writes_empty(tmp_path, monkeypatch):
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "projects").mkdir()
    studio.create_project("e", "en", "", "", characters=[])
    assert json.loads((tmp_path / "projects" / "e" / "characters.json").read_text()) == []
