"""Adversarial test novels for the Novel Studio.

Each test targets a specific failure mode:
1. Knowledge isolation — character acts on a secret they never learned.
2. Timeline — character appears in two places at once.
3. Deleted events — edited scene removes a fact; later scenes must not reference it.
4. Voice differentiation — characters must sound distinct.

These are the "adversarial test novels" from §17.2 / §22.4.
Run with: pytest test_adversarial.py -v
"""
import json
import sys
from pathlib import Path

import pytest

BASE = Path(__file__).parent
sys.path.insert(0, str(BASE))
import studio


# ---------- Adversarial Novel 1: Knowledge isolation ----------

def test_knowledge_isolation_secret_leak(tmp_path, monkeypatch):
    """A character must not act on another character's secret.

    Setup: Maren (protagonist) has a secret (marked caster). Tovin does NOT know.
    The Showrunner prompt must NOT include Maren's secret in Tovin's context.
    """
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "scenes").mkdir()
    (tmp_path / "events").mkdir()
    chars = [
        {"id": "c1", "name": "Maren", "role": "protagonist", "voice": "terse",
         "secrets": ["is secretly marked (unlicensed caster)"], "voice_contract": {"forbidden_words": ["I feel"]}},
        {"id": "c2", "name": "Tovin", "role": "ally", "voice": "warm",
         "secrets": ["owes debt to Merchant Council"], "voice_contract": {"forbidden_words": ["shut up"]}},
    ]
    (tmp_path / "characters.json").write_text(json.dumps(chars), encoding="utf-8")
    knowledge = {
        "c1": {"known": ["marked (self)"], "suspected": [], "misconceptions": []},
        "c2": {"known": ["Maren is marked"], "suspected": [], "misconceptions": []},
    }
    # Tovin should NOT know Maren is marked — but knowledge says he does. Fix it.
    knowledge["c2"]["known"] = []  # Tovin doesn't know
    (tmp_path / "character_knowledge.json").write_text(json.dumps(knowledge), encoding="utf-8")

    # Build prompt for a scene with both characters
    state = {"c1": {"location": "Salt Market", "inventory": [], "relationships": {}, "status": "alive"},
             "c2": {"location": "Salt Market", "inventory": [], "relationships": {}, "status": "alive"}}
    msgs = studio.showrunner_prompt("# Lore", chars, state, "", "Maren and Tovin talk.", "", "",
                                    {}, [], [])
    system_prompt = msgs[0]["content"]
    # Maren's secret should NOT appear in the prompt (stripped by showrunner_prompt)
    assert "secretly marked" not in system_prompt, "Maren's secret leaked into Showrunner prompt"
    # Tovin's secret should NOT appear either
    assert "owes debt" not in system_prompt, "Tovin's secret leaked into Showrunner prompt"


def test_knowledge_check_catches_leak(tmp_path, monkeypatch):
    """Knowledge check flags when a character references another's secret."""
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "characters.json").write_text(json.dumps([
        {"id": "c1", "name": "Maren", "role": "protagonist", "voice": "terse",
         "secrets": ["is secretly marked"], "voice_contract": {}},
        {"id": "c2", "name": "Tovin", "role": "ally", "voice": "warm",
         "secrets": ["owes debt to council"], "voice_contract": {}},
    ]), encoding="utf-8")
    knowledge = {
        "c1": {"known": [], "suspected": [], "misconceptions": []},
        "c2": {"known": [], "suspected": [], "misconceptions": []},
    }
    (tmp_path / "character_knowledge.json").write_text(json.dumps(knowledge), encoding="utf-8")
    chars = json.loads((tmp_path / "characters.json").read_text())
    # Scene where Maren reveals she knows Tovin's secret (she shouldn't)
    scene = 'Maren said "Tovin, I know you owe a debt to the council."'
    issues = studio.knowledge_check(scene, chars, knowledge)
    assert len(issues) >= 1, "Knowledge check should flag Maren referencing Tovin's secret"
    assert any("debt" in iss["issue"] or "council" in iss["issue"] for iss in issues)


# ---------- Adversarial Novel 2: Timeline ----------

def test_timeline_character_presence(tmp_path, monkeypatch):
    """Timeline entry tracks which characters are present in each scene."""
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "scenes").mkdir()
    (tmp_path / "events").mkdir()
    (tmp_path / "characters.json").write_text(json.dumps([{"id": "c1", "name": "Maren"}]), encoding="utf-8")
    (tmp_path / "timeline.json").write_text("[]", encoding="utf-8")
    (tmp_path / "npc_registry.json").write_text("{}", encoding="utf-8")
    (tmp_path / "plot_threads.json").write_text("[]", encoding="utf-8")

    audit = {
        "events": [{"type": "action", "actor": "c1", "summary": "Maren walks", "target": None, "uncertain": False,
                    "state_updates": {"c1": {"location": "harbor"}}}],
        "characters_present": ["c1"],
        "location": "harbor",
        "plot_threads": [],
        "timeline_entry": {"scene": 1, "date": "day 1", "duration": "1 hour", "location": "harbor",
                           "characters_present": ["c1"]},
        "npc_updates": [],
        "knowledge_updates": {},
    }
    studio.apply_audit_extras(audit)
    timeline = json.loads((tmp_path / "timeline.json").read_text())
    assert len(timeline) == 1
    assert timeline[0]["location"] == "harbor"
    assert "c1" in timeline[0]["characters_present"]


# ---------- Adversarial Novel 3: Deleted events ----------

def test_deleted_event_retcon(tmp_path, monkeypatch):
    """Editing a scene to remove a fact produces a retcon, not a deletion."""
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "scenes").mkdir()
    (tmp_path / "events").mkdir()
    (tmp_path / "characters.json").write_text(json.dumps([{"id": "c1", "name": "Maren"}]), encoding="utf-8")

    # scene 1: original has key discovery
    original = "Maren found the key. She put it in her pocket."
    edited = "Maren walked on. No key."
    (tmp_path / "scenes" / "scene_01.md").write_text(edited, encoding="utf-8")
    (tmp_path / "scenes" / "scene_01_snapshot.md").write_text(original, encoding="utf-8")
    import hashlib
    (tmp_path / "scenes" / "scene_01_meta.json").write_text(
        json.dumps({"hash": "oldhash", "status": "accepted", "events": [
            {"event_id": 8, "summary": "Maren finds the key", "state_updates": {"c1": {"inventory_add": ["key"]}}}
        ]}), encoding="utf-8")
    (tmp_path / "scenes" / "scene_02.md").write_text("Scene 2 mentions the key.", encoding="utf-8")
    (tmp_path / "scenes" / "scene_02_meta.json").write_text(
        json.dumps({"hash": "h2", "status": "accepted", "events": []}), encoding="utf-8")

    (tmp_path / "events" / "event_log.jsonl").write_text(
        json.dumps({"event_id": 8, "scene": 1, "type": "discovery", "actor": "c1",
                    "summary": "Maren finds the key", "target": None, "uncertain": False,
                    "state_updates": {"c1": {"inventory_add": ["key"]}}}) + "\n",
        encoding="utf-8")
    (tmp_path / "character_state.json").write_text(
        json.dumps({"c1": {"location": "x", "inventory": ["key"], "relationships": {}, "status": "alive"}}),
        encoding="utf-8")

    # verify detection
    assert studio.detect_edit(1) is True

    # verify retcon (mocked LLM)
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
    assert r is not None and len(r["proposals"]) == 1
    assert "scene_02.md" in r.get("downstream_scenes", [])

    # apply
    for p in r["proposals"]:
        p["accepted"] = True
    res = studio.apply_reconciliation(r["proposals"], scene=1, downstream_entities=r.get("downstream_entities", []))
    assert res["applied"] == 1

    # verify retcon in log (not deletion)
    lines = (tmp_path / "events" / "event_log.jsonl").read_text().splitlines()
    retcons = [json.loads(l) for l in lines if json.loads(l).get("type") == "retcon"]
    assert len(retcons) == 1
    assert retcons[0]["nullifies_event_id"] == 8
    # original event still in log (append-only)
    originals = [json.loads(l) for l in lines if json.loads(l).get("event_id") == 8]
    assert len(originals) == 1

    # verify state rebuilt (key removed)
    state = json.loads((tmp_path / "character_state.json").read_text())
    assert "key" not in state["c1"]["inventory"]

    # verify fact shows as nullified
    support = studio.find_fact_support("key")
    assert len(support) == 1
    assert support[0]["nullified"] is True


# ---------- Adversarial Novel 4: Voice differentiation ----------

def test_voice_differentiation(tmp_path, monkeypatch):
    """Characters with different voice contracts should produce different issues."""
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "scenes").mkdir()
    chars = [
        {"id": "c1", "name": "Maren", "role": "protagonist", "voice": "terse",
         "voice_contract": {"sentence_length": "short (4-12 words)", "forbidden_words": ["I feel", "perhaps"]}},
        {"id": "c2", "name": "Tovin", "role": "ally", "voice": "verbose",
         "voice_contract": {"sentence_length": "long (15-30 words)", "forbidden_words": ["shut up"]}},
    ]
    (tmp_path / "characters.json").write_text(json.dumps(chars), encoding="utf-8")
    # Scene where Maren speaks long (violates contract) and Tovin speaks short (violates contract)
    scene = '''Maren looked at Tovin. "I feel like we should probably go now because the Wardens are coming and we really need to leave this place immediately before they catch us."
Tovin nodded. "Yes."'''
    v = studio.voice_check(scene, chars)
    # Maren should have sentence-too-long issue
    maren_issues = [i for i in v if i["character"] == "Maren"]
    assert len(maren_issues) >= 1, "Maren's long sentence should be flagged"
    # Tovin should have sentence-too-short issue
    tovin_issues = [i for i in v if i["character"] == "Tovin"]
    assert len(tovin_issues) >= 1, "Tovin's short sentence should be flagged"
    # Maren should have forbidden word 'I feel'
    assert any("I feel" in i["issue"] for i in maren_issues), "Maren's 'I feel' should be flagged"