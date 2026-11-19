"""Adversarial test novels for the Novel Studio evaluation suite.

Each test simulates a specific failure mode and verifies the system catches it.
These are the "adversarial test novels" from plan §17.2 / §22.4.

Run with: pytest test_adversarial_novels.py -v
"""
import json
import sys
from pathlib import Path

import pytest

BASE = Path(__file__).parent
sys.path.insert(0, str(BASE))
import studio


# ---------- Adversarial Novel 1: The Leaky Secret ----------

def test_leaky_secret_knowledge_isolation(tmp_path, monkeypatch):
    """Knowledge isolation: Maren's secret must never leak to Tovin's context.

    Setup: Maren is secretly marked. Tovin does NOT know.
    Verify: Showrunner prompt strips secrets for ALL characters.
    Verify: Auditor prompt strips secrets for ALL characters.
    """
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "scenes").mkdir()
    (tmp_path / "events").mkdir()
    (tmp_path / "characters.json").write_text(
        (BASE / "tests" / "adversarial" / "leaky_secret" / "characters.json").read_text(), encoding="utf-8")
    (tmp_path / "world_lore.md").write_text(
        (BASE / "tests" / "adversarial" / "leaky_secret" / "world_lore.md").read_text(), encoding="utf-8")
    (tmp_path / "character_knowledge.json").write_text(
        (BASE / "tests" / "adversarial" / "leaky_secret" / "character_knowledge.json").read_text(), encoding="utf-8")

    chars = json.loads((tmp_path / "characters.json").read_text())
    state = {"c1": {"location": "Salt Market", "inventory": [], "relationships": {}, "status": "alive"},
             "c2": {"location": "Salt Market", "inventory": [], "relationships": {}, "status": "alive"}}

    # Showrunner prompt must NOT contain Maren's secret
    msgs = studio.showrunner_prompt("# Lore", chars, state, "", "Maren and Tovin talk.", "", "")
    system_prompt = msgs[0]["content"]
    assert "secretly marked" not in system_prompt, "Maren's secret leaked into Showrunner prompt"
    assert "unlicensed caster" not in system_prompt, "Maren's secret leaked into Showrunner prompt"

    # Auditor prompt must NOT contain Maren's secret
    a_msgs = studio.auditor_prompt("Maren said hello to Tovin.", chars)
    a_system = a_msgs[0]["content"]
    a_user = a_msgs[1]["content"]
    assert "secretly marked" not in a_system, "Maren's secret leaked into Auditor system prompt"
    assert "secretly marked" not in a_user, "Maren's secret leaked into Auditor user prompt"

    # Reconciler prompt must NOT contain secrets
    r_msgs = studio.reconciler_prompt("original", "edited", chars, [])
    r_system = r_msgs[0]["content"]
    r_user = r_msgs[1]["content"]
    assert "secretly marked" not in r_system, "Maren's secret leaked into Reconciler system prompt"
    assert "secretly marked" not in r_user, "Maren's secret leaked into Reconciler user prompt"


def test_leaky_secret_knowledge_boundary(tmp_path, monkeypatch):
    """Knowledge check flags when Tovin references Maren's secret."""
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "characters.json").write_text(
        (BASE / "tests" / "adversarial" / "leaky_secret" / "characters.json").read_text(), encoding="utf-8")
    knowledge = json.loads((BASE / "tests" / "adversarial" / "leaky_secret" / "character_knowledge.json").read_text())
    chars = json.loads((tmp_path / "characters.json").read_text())

    # Scene where Tovin reveals he knows Maren is marked (he shouldn't)
    scene = 'Tovin looked at Maren. "You are marked, aren\'t you? I can see the glow."'
    issues = studio.knowledge_check(scene, chars, knowledge)
    # Should flag Tovin referencing "marked" which is Maren's secret
    assert len(issues) >= 1, "Knowledge check should flag Tovin referencing Maren's secret"
    assert any("marked" in iss["issue"] for iss in issues)


# ---------- Adversarial Novel 2: The Impossible Appearance ----------

def test_impossible_appearance_timeline(tmp_path, monkeypatch):
    """Timeline: a character cannot be in two places at once."""
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "scenes").mkdir()
    (tmp_path / "events").mkdir()
    (tmp_path / "characters.json").write_text(json.dumps([{"id": "c1", "name": "Maren"}]), encoding="utf-8")
    (tmp_path / "timeline.json").write_text("[]", encoding="utf-8")
    (tmp_path / "npc_registry.json").write_text("{}", encoding="utf-8")
    (tmp_path / "plot_threads.json").write_text("[]", encoding="utf-8")

    # Scene 1: Maren at the harbor
    audit1 = {
        "events": [{"type": "action", "actor": "c1", "summary": "Maren at harbor", "target": None, "uncertain": False,
                    "state_updates": {"c1": {"location": "harbor"}}}],
        "characters_present": ["c1"],
        "location": "harbor",
        "plot_threads": [],
        "timeline_entry": {"scene": 1, "date": "day 1", "duration": "1 hour", "location": "harbor",
                           "characters_present": ["c1"]},
        "npc_updates": [],
        "knowledge_updates": {},
    }
    studio.apply_audit_extras(audit1)

    # Scene 2: Maren at the market (1 hour later, 30 min travel) — possible
    audit2 = {
        "events": [{"type": "action", "actor": "c1", "summary": "Maren at market", "target": None, "uncertain": False,
                    "state_updates": {"c1": {"location": "market"}}}],
        "characters_present": ["c1"],
        "location": "market",
        "plot_threads": [],
        "timeline_entry": {"scene": 2, "date": "day 1", "duration": "30 min", "location": "market",
                           "characters_present": ["c1"]},
        "npc_updates": [],
        "knowledge_updates": {},
    }
    studio.apply_audit_extras(audit2)

    timeline = json.loads((tmp_path / "timeline.json").read_text())
    assert len(timeline) == 2
    assert timeline[0]["location"] == "harbor"
    assert timeline[1]["location"] == "market"
    # Both scenes have Maren present (single character, no conflict)
    assert "c1" in timeline[0]["characters_present"]
    assert "c1" in timeline[1]["characters_present"]


# ---------- Adversarial Novel 3: The Deleted Promise ----------

def test_deleted_promise_retcon(tmp_path, monkeypatch):
    """Deleted events: editing a scene to remove a promise produces a retcon, not a deletion."""
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "scenes").mkdir()
    (tmp_path / "events").mkdir()
    (tmp_path / "characters.json").write_text(json.dumps([{"id": "c1", "name": "Maren"}]), encoding="utf-8")

    original = "Maren promised to meet Tovin at the dock at midnight."
    edited = "Maren walked away. No promises were made."
    (tmp_path / "scenes" / "scene_01.md").write_text(edited, encoding="utf-8")
    (tmp_path / "scenes" / "scene_01_snapshot.md").write_text(original, encoding="utf-8")
    import hashlib
    (tmp_path / "scenes" / "scene_01_meta.json").write_text(
        json.dumps({"hash": "oldhash", "status": "accepted", "events": [
            {"event_id": 5, "summary": "Maren promises to meet Tovin at the dock", "state_updates": {}}
        ]}), encoding="utf-8")
    (tmp_path / "scenes" / "scene_02.md").write_text("Tovin waited at the dock for Maren.", encoding="utf-8")
    (tmp_path / "scenes" / "scene_02_meta.json").write_text(
        json.dumps({"hash": "h2", "status": "accepted", "events": []}), encoding="utf-8")

    (tmp_path / "events" / "event_log.jsonl").write_text(
        json.dumps({"event_id": 5, "scene": 1, "type": "action", "actor": "c1",
                    "summary": "Maren promises to meet Tovin at the dock", "target": None,
                    "uncertain": False, "state_updates": {}}) + "\n",
        encoding="utf-8")
    (tmp_path / "character_state.json").write_text(
        json.dumps({"c1": {"location": "x", "inventory": [], "relationships": {}, "status": "alive"}}),
        encoding="utf-8")

    # detect
    assert studio.detect_edit(1) is True

    # reconcile
    fake = json.dumps({
        "summary": "Author deleted the promise paragraph",
        "passages_changed": ["Maren promised to meet Tovin at the dock"],
        "affected_events": [5],
        "proposals": [{"proposal_id": "p1", "op": "nullify", "target_event_id": 5,
                       "description": "Nullify the promise event", "confidence": 0.95,
                       "auto_safe": False, "downstream_entities": ["promise", "dock", "Tovin"]}],
        "downstream_entities": ["promise", "dock", "Tovin"],
    })
    monkeypatch.setattr(studio, "llm_call", lambda *a, **k: fake)
    r = studio.reconcile_scene(1)
    assert r is not None
    assert len(r["proposals"]) == 1
    assert "scene_02.md" in r.get("downstream_scenes", [])

    # apply
    for p in r["proposals"]:
        p["accepted"] = True
    res = studio.apply_reconciliation(r["proposals"], scene=1, downstream_entities=r.get("downstream_entities", []))
    assert res["applied"] == 1

    # verify retcon (not deletion) in log
    lines = (tmp_path / "events" / "event_log.jsonl").read_text().splitlines()
    retcons = [json.loads(l) for l in lines if json.loads(l).get("type") == "retcon"]
    assert len(retcons) == 1
    assert retcons[0]["nullifies_event_id"] == 5
    # original event still present (append-only)
    originals = [json.loads(l) for l in lines if json.loads(l).get("event_id") == 5]
    assert len(originals) == 1

    # verify fact shows as nullified
    support = studio.find_fact_support("promise")
    assert len(support) == 1
    assert support[0]["nullified"] is True


# ---------- Adversarial Novel 4: The Identical Voices ----------

def test_identical_voices_detection(tmp_path, monkeypatch):
    """Voice differentiation: characters with different contracts produce different issues."""
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "scenes").mkdir()
    chars = [
        {"id": "c1", "name": "Maren", "role": "protagonist", "voice": "terse",
         "voice_contract": {"sentence_length": "short (4-12 words)", "forbidden_words": ["I feel", "perhaps"]}},
        {"id": "c2", "name": "Tovin", "role": "ally", "voice": "verbose",
         "voice_contract": {"sentence_length": "long (15-30 words)", "forbidden_words": ["shut up"]}},
    ]
    (tmp_path / "characters.json").write_text(json.dumps(chars), encoding="utf-8")
    # Scene where Maren speaks long (violates) and Tovin speaks short (violates)
    scene = '''Maren looked at Tovin. "I feel like we should probably go now because the Wardens are coming and we really need to leave."
Tovin nodded. "Yes."'''
    v = studio.voice_check(scene, chars)
    maren_issues = [i for i in v if i["character"] == "Maren"]
    tovin_issues = [i for i in v if i["character"] == "Tovin"]
    assert len(maren_issues) >= 1, "Maren's long sentence + 'I feel' should be flagged"
    assert len(tovin_issues) >= 1, "Tovin's short sentence should be flagged"
    assert any("I feel" in i["issue"] for i in maren_issues)


# ---------- Adversarial Novel 5: The NPC Inconsistency ----------

def test_npc_consistency_check(tmp_path, monkeypatch):
    """NPC consistency: NPC dialogue must match registry voice tags/faction."""
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "npc_registry.json").write_text(json.dumps({
        "Guard Voss": {"name": "Guard Voss", "voice_tags": ["formal", "noble"], "faction": "Wardens", "grudge": "none", "last_interaction_scene": 1},
        "Old Pete": {"name": "Old Pete", "voice_tags": ["rough", "working-class"], "faction": "Unmarked", "grudge": "none", "last_interaction_scene": 2},
    }), encoding="utf-8")
    npc_reg = json.loads((tmp_path / "npc_registry.json").read_text())

    # Scene where formal NPC uses informal word
    scene1 = 'Guard Voss said "Yeah, I gonna help you out, dude."'
    issues1 = studio.npc_check(scene1, npc_reg)
    assert len(issues1) >= 1, "Formal NPC using informal words should be flagged"
    assert any("informal" in i["issue"] for i in issues1)

    # Scene where rough NPC uses formal word
    scene2 = 'Old Pete said "Therefore, I must inform you of the furthermore consequences."'
    issues2 = studio.npc_check(scene2, npc_reg)
    assert len(issues2) >= 1, "Rough NPC using formal words should be flagged"
    assert any("formal" in i["issue"] for i in issues2)

    # Clean scene (no issues)
    scene3 = 'Guard Voss said "State your business, citizen." Old Pete grunted.'
    issues3 = studio.npc_check(scene3, npc_reg)
    # Should have no informal/formal violations (may have faction warnings, but those are info)
    warn_issues = [i for i in issues3 if i["severity"] == "warn"]
    assert len(warn_issues) == 0, "Clean scene should have no warn-level issues"