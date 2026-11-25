"""Tests for the chat-with-AI feature."""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import studio


def test_chat_path_resolves_to_scene_file():
    p = studio.chat_path(5)
    assert p.name == "scene_05_chat.jsonl"
    assert "scenes" in str(p)


def test_load_chat_empty_when_missing(tmp_path, monkeypatch):
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "scenes").mkdir()
    assert studio.load_chat(1) == []


def test_append_and_load_chat_round_trip(tmp_path, monkeypatch):
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "scenes").mkdir()
    msgs = [{"ts": "2026-01-01T00:00:00Z", "role": "user", "content": "hello", "analysis_run": 1, "actions": []}]
    studio.append_chat(1, msgs)
    loaded = studio.load_chat(1)
    assert len(loaded) == 1
    assert loaded[0]["content"] == "hello"


def test_clear_chat_removes_file(tmp_path, monkeypatch):
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "scenes").mkdir()
    studio.append_chat(2, [{"role": "user", "content": "x", "actions": []}])
    assert studio.clear_chat(2) is True
    assert studio.load_chat(2) == []
    assert studio.clear_chat(2) is False


def test_split_chat_reply_extracts_actions():
    raw = 'Here is my analysis.\n\n```json\n{"actions":[{"type":"rewrite_plan","args":{"text":"new plan"}}]}\n```'
    text, actions = studio.split_chat_reply(raw)
    assert "Here is my analysis" in text
    assert len(actions) == 1
    assert actions[0]["type"] == "rewrite_plan"
    assert actions[0]["args"]["text"] == "new plan"


def test_split_chat_reply_rejects_reasoning():
    raw = "Here's a thinking process:\n\n1. Analyze the request"
    text, actions = studio.split_chat_reply(raw)
    assert "reasoning" in text.lower() or "try again" in text.lower()
    assert actions == []


def test_split_chat_reply_strips_json_from_display():
    raw = 'My reply.\n\n```json\n{"actions":[{"type":"rewrite_plan","args":{"text":"p"}}]}\n```'
    text, actions = studio.split_chat_reply(raw)
    assert "```" not in text
    assert "actions" not in text


def test_split_chat_reply_handles_malformed_json():
    raw = "My reply.\n\n```json\n{not valid json}\n```"
    text, actions = studio.split_chat_reply(raw)
    assert "My reply" in text
    assert actions == []


def test_split_chat_reply_multiple_fences_uses_last():
    raw = 'First.\n```json\n{"actions":[{"type":"rewrite_plan","args":{"text":"old"}}]}\n```\nSecond.\n```json\n{"actions":[{"type":"rewrite_plan","args":{"text":"new"}}]}\n```'
    text, actions = studio.split_chat_reply(raw)
    assert len(actions) == 1
    assert actions[0]["args"]["text"] == "new"


def test_split_chat_reply_no_json_fence():
    raw = "Just a plain reply with no actions."
    text, actions = studio.split_chat_reply(raw)
    assert text == "Just a plain reply with no actions."
    assert actions == []


def test_split_chat_reply_validates_action_schema():
    raw = 'Reply.\n```json\n{"actions":[{"type":"rewrite_plan","args":{"text":""}}]}\n```'
    text, actions = studio.split_chat_reply(raw)
    assert actions == []  # empty text rejected


def test_chat_context_assembles_expected_keys(tmp_path, monkeypatch):
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "scenes").mkdir()
    (tmp_path / "characters.json").write_text("[]", encoding="utf-8")
    (tmp_path / "world_lore.md").write_text("lore text", encoding="utf-8")
    ctx = studio.chat_context(1, include_analysis=False, plan="my plan")
    for key in ("scene", "scene_text", "lore", "chars", "state", "analysis", "plan", "skills", "language", "scene_hash", "analysis_run", "markers"):
        assert key in ctx, f"missing key: {key}"
    assert ctx["lore"] == "lore text"
    assert ctx["plan"] == "my plan"
    assert ctx["analysis"] is None


def test_chat_context_truncates_scene_text(tmp_path, monkeypatch):
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "scenes").mkdir()
    long_text = "a " * 3000
    (tmp_path / "scenes" / "scene_01.md").write_text(long_text, encoding="utf-8")
    ctx = studio.chat_context(1, include_analysis=False)
    assert len(ctx["scene_text"]) == 4000


def test_chat_context_includes_analysis_when_cached(tmp_path, monkeypatch):
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "scenes").mkdir()
    (tmp_path / "scenes" / "scene_01.md").write_text("hello", encoding="utf-8")
    meta = {"analysis": {"overall_rating": 7, "dimensions": {"prose_quality": 8}, "improvement_plan": "fix it", "scene_hash": "abc"}, "chat_run_counter": 2}
    (tmp_path / "scenes" / "scene_01_meta.json").write_text(__import__("json").dumps(meta), encoding="utf-8")
    ctx = studio.chat_context(1, include_analysis=True)
    assert ctx["analysis"] is not None
    assert ctx["analysis"]["overall_rating"] == 7
    assert ctx["analysis_run"] == 2
    assert ctx["plan"] == "fix it"


def test_chat_context_excludes_analysis_when_toggled_off(tmp_path, monkeypatch):
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "scenes").mkdir()
    (tmp_path / "scenes" / "scene_01.md").write_text("hello", encoding="utf-8")
    meta = {"analysis": {"overall_rating": 7, "improvement_plan": "fix it"}, "chat_run_counter": 1}
    (tmp_path / "scenes" / "scene_01_meta.json").write_text(__import__("json").dumps(meta), encoding="utf-8")
    ctx = studio.chat_context(1, include_analysis=False)
    assert ctx["analysis"] is None


def test_clear_chat_removes_file(tmp_path, monkeypatch):
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "scenes").mkdir()
    studio.append_chat(3, [{"role": "user", "content": "x", "actions": []}])
    assert studio.clear_chat(3) is True
    assert studio.load_chat(3) == []
    assert studio.clear_chat(3) is False