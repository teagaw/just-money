import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import studio
import import_pipeline


def test_analysis_prompt_without_canon_is_self_contained():
    msgs = studio.analysis_prompt("نص عربي للاختبار", [], "developmental", "ar-eg", "", None, [], {})
    system = msgs[0]["content"]
    assert "self-contained" in system, "no-canon analysis must treat the text as self-contained"
    assert "Ground in provided lore" not in system


def test_analysis_prompt_forbids_mixed_languages():
    msgs = studio.analysis_prompt("نص عربي", [], "developmental", "ar-eg", "", None, [], {})
    system = msgs[0]["content"]
    assert "Do not mix languages" in system


def test_normalize_analysis_drops_schema_placeholders():
    data = {
        "overall_rating": 5, "dimensions": {},
        "strengths": ["specific strength citing exact text"],
        "weaknesses": [{"issue": "specific issue citing exact text", "severity": "major or minor"}],
        "improvement_plan": "numbered list of concrete changes",
    }
    out = studio.normalize_analysis(data, {})
    assert out["strengths"] == []
    assert all("specific issue" not in w["issue"] for w in out["weaknesses"])
    assert out["improvement_plan"] != "numbered list of concrete changes"


def test_analyze_novel_ignores_active_project_canon(monkeypatch):
    captured = []

    def fake_canon():
        return "DUSKPORT LORE ABOUT MAREN AND WARDENS", [{"name": "Maren"}], {}, [{"scene": 1}]

    def fake_llm(model, messages, max_tokens, temperature, **kwargs):
        captured.extend(messages)
        return json.dumps({"overall_rating": 5, "dimensions": {"prose_quality": 5},
                           "strengths": [], "weaknesses": [], "improvement_plan": "x"})

    monkeypatch.setattr(studio, "canon_context", fake_canon)
    monkeypatch.setattr(studio, "llm_call", fake_llm)
    import_pipeline.analyze_novel("مصعب استيقظ في الإسكندرية وعمره ستة عشر عاماً.")
    assert "DUSKPORT" not in json.dumps(captured, ensure_ascii=False)
