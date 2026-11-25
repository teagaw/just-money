"""Tests for fail-safe logging and narrowed exception handling."""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import studio


def test_log_failure_emits_context_and_error(capsys):
    studio.log_failure("genre_style_rules", ValueError("bad json"))
    output = capsys.readouterr().out
    assert "ERROR [" in output
    assert "genre_style_rules" in output
    assert "bad json" in output


def test_genre_style_rules_degrades_on_bad_json(tmp_path, monkeypatch, capsys):
    monkeypatch.setattr(studio, "BASE", tmp_path)
    (tmp_path / "genres.json").write_text("{not json", encoding="utf-8")
    assert studio.genre_style_rules("Fantasy") == ""
    assert "genre_style_rules" in capsys.readouterr().out
