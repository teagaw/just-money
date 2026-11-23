"""Novel import and improvement pipeline (§24.9)."""
import json
import re
from pathlib import Path

import studio


def split_into_scenes(text: str, target_words: int = 700) -> list:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    raw_parts = re.split(r"\n\s*(?:---|\*\*\*|\* \* \*)\s*\n", text)
    scenes = []
    for part in raw_parts:
        paragraphs = [p.strip() for p in part.split("\n\n") if p.strip()]
        if not paragraphs:
            continue
        current = []
        current_wc = 0
        for para in paragraphs:
            wc = len(para.split())
            if current and current_wc + wc > target_words and current_wc >= target_words * 0.5:
                scenes.append("\n\n".join(current))
                current = [para]
                current_wc = wc
            else:
                current.append(para)
                current_wc += wc
        if current:
            scenes.append("\n\n".join(current))
    return [s for s in scenes if s.strip()]


def import_novel(text: str, name: str = "imported_novel", language: str = "en",
                 genre: str = "", subgenre: str = "") -> dict:
    text = text.strip()
    if not text:
        return {"ok": False, "error": "Empty text"}
    name = name.strip() or "imported_novel"
    name = re.sub(r"[^\w\-]", "_", name)
    if not studio.create_project(name, language, genre, subgenre):
        i = 2
        while not studio.create_project(f"{name}_{i}", language, genre, subgenre):
            i += 1
            if i > 100:
                return {"ok": False, "error": "Too many projects with similar name"}
        name = f"{name}_{i}"
    scenes = split_into_scenes(text)
    studio.switch_project(name)
    base = studio.project_base()
    for i, scene_text in enumerate(scenes, 1):
        sp = base / "scenes" / ("scene_%02d.md" % i)
        studio.atomic_write(sp, scene_text)
        meta = {
            "scene": i,
            "hash": studio.sha256_file(sp),
            "status": "accepted",
            "characters_present": [],
            "location": None,
            "events": [],
            "choices": [],
        }
        studio.atomic_write(base / "scenes" / ("scene_%02d_meta.json" % i), json.dumps(meta, indent=2))
        studio.save_snapshot(i, scene_text)
    premise = scenes[0][:500] if scenes else ""
    lore_path = base / "world_lore.md"
    if not lore_path.exists() or lore_path.read_text(encoding="utf-8").strip() == "# World Lore\n\n(describe your world here)":
        studio.atomic_write(lore_path, "# World Lore\n\nImported novel. Premise:\n" + premise + "\n")
    studio.git_commit_scene(len(scenes), "imported novel: %d scenes" % len(scenes))
    return {"ok": True, "name": name, "scene_count": len(scenes)}


def _local_analysis(text: str) -> dict:
    """Basic statistical analysis (no LLM). Fast, free, deterministic."""
    import re
    words = text.split()
    sentences = [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]
    paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
    dialogue_lines = [l for l in text.splitlines() if '"' in l or '\u201c' in l]
    chars = []
    try:
        chars = json.loads((studio.project_base() / "characters.json").read_text(encoding="utf-8"))
    except Exception:
        pass
    char_mentions = {}
    for c in chars:
        name = c.get("name", "")
        if name:
            char_mentions[name] = text.count(name)
    stop = {"the", "a", "an", "is", "was", "were", "are", "be", "been", "being",
            "have", "has", "had", "do", "does", "did", "will", "would", "could",
            "should", "may", "might", "can", "shall", "to", "of", "in", "for",
            "on", "with", "at", "by", "from", "as", "into", "through", "during",
            "before", "after", "above", "below", "between", "out", "off", "over",
            "under", "again", "further", "then", "once", "here", "there", "when",
            "where", "why", "how", "all", "each", "few", "more", "most", "other",
            "some", "such", "no", "nor", "not", "only", "own", "same", "so",
            "than", "too", "very", "just", "and", "but", "or", "if", "while",
            "because", "until", "although", "though", "she", "he", "it", "they",
            "her", "his", "its", "their", "this", "that", "these", "those", "i",
            "you", "we", "me", "him", "us", "my", "your", "our", "up", "down",
            "said", "looked", "went", "came", "got", "made", "took", "gave"}
    word_freq = {}
    for w in words:
        w = w.lower().strip(".,!?;:\"'()[]{}")
        if w and w not in stop and len(w) > 3:
            word_freq[w] = word_freq.get(w, 0) + 1
    top_words = sorted(word_freq.items(), key=lambda x: -x[1])[:10]
    avg_sent_len = round(len(words) / max(len(sentences), 1), 1)
    dialogue_ratio = round(len(dialogue_lines) / max(len(text.splitlines()), 1) * 100)
    return {
        "structure": "%d paragraphs, %d sentences" % (len(paragraphs), len(sentences)),
        "pacing": "fast" if avg_sent_len < 12 else ("slow" if avg_sent_len > 20 else "moderate"),
        "voices": "%d dialogue lines (%d%% of lines)" % (len(dialogue_lines), dialogue_ratio),
        "plot_threads": [],
        "weak_points": [],
        "strengths": [],
        "estimated_scenes": len(words) // 700 + 1,
        "word_count": len(words),
        "avg_sentence_length": avg_sent_len,
        "dialogue_ratio_pct": dialogue_ratio,
        "top_words": [w for w, _ in top_words],
        "character_mentions": char_mentions,
        "note": "Basic statistical analysis. LLM deep analysis may be added later.",
    }


def analyze_novel(text: str) -> dict:
    text = text.strip()
    if not text:
        return {"error": "Empty text"}
    result = _local_analysis(text)
    excerpt = text[:1500]
    msgs = [
        {"role": "system", "content": "You are a literary analyst. Output ONLY a JSON object. No markdown. Just JSON."},
        {"role": "user", "content": "Analyze this novel excerpt:\n\n" + excerpt + "\n\nJSON keys: structure, pacing, voices, plot_threads, weak_points, strengths."},
    ]
    try:
        raw = studio.llm_call(studio.CONFIG["showrunner_model"], msgs, 1000, 0.3, json_mode=True)
        if raw and raw.strip():
            llm_result = studio.parse_json_robust(raw)
            if isinstance(llm_result, dict) and not llm_result.get("error"):
                for key in ("structure", "pacing", "voices", "plot_threads", "weak_points", "strengths"):
                    if key in llm_result and llm_result[key]:
                        result[key] = llm_result[key]
                result["llm_enhanced"] = True
    except Exception:
        pass
    return result


def improve_scene(n: int, options: list, direction: str = "", level: str = "developmental") -> dict:
    base = studio.project_base()
    scene_path = base / "scenes" / ("scene_%02d.md" % n)
    if not scene_path.exists():
        return {"ok": False, "error": "Scene not found"}
    original = scene_path.read_text(encoding="utf-8")
    meta_path = base / "scenes" / ("scene_%02d_meta.json" % n)
    meta = json.loads(meta_path.read_text(encoding="utf-8")) if meta_path.exists() else {}
    chars = json.loads((base / "characters.json").read_text(encoding="utf-8")) if (base / "characters.json").exists() else []
    state = studio.load_state()
    lore = (base / "world_lore.md").read_text(encoding="utf-8") if (base / "world_lore.md").exists() else ""
    npc_registry = json.loads((base / "npc_registry.json").read_text(encoding="utf-8")) if (base / "npc_registry.json").exists() else {}
    plot_threads = json.loads((base / "plot_threads.json").read_text(encoding="utf-8")) if (base / "plot_threads.json").exists() else []
    timeline = json.loads((base / "timeline.json").read_text(encoding="utf-8")) if (base / "timeline.json").exists() else []
    language = studio.project_language()
    genre = studio.project_genre()
    subgenre = studio.project_subgenre()

    option_map = {
        "add_details": "Add more sensory details, description, and atmosphere. Expand thin passages.",
        "add_characters": "Introduce or develop minor characters. Add NPC interactions.",
        "fix_continuity": "Fix any continuity errors, contradictions, or timeline issues.",
        "expand": "Expand the scene. Add more content, dialogue, and action. Target 800-1000 words.",
        "rewrite_dialogue": "Rewrite all dialogue to be sharper, more natural, and more distinct per character voice.",
        "change_tone": "Adjust the tone to be more dramatic and intense.",
        "tighten_pacing": "Tighten the pacing. Cut filler, make every sentence earn its place. Target 400-600 words.",
    }
    instructions = [option_map.get(o, o) for o in options if o in option_map]
    if direction:
        instructions.append(direction)
    level_focus = {
        "developmental": "Focus on structure, pacing, and character development.",
        "line": "Focus on prose quality, voice, and rhythm. Polish the writing.",
        "copyedit": "Fix grammar, consistency, and formatting. Keep changes minimal.",
        "proofread": "Fix typos, punctuation, and surface errors only. Minimal changes.",
    }.get(level, "")
    improve_dir = "Improve this scene. " + " ".join(instructions) if instructions else "Improve this scene's prose quality."
    if level_focus:
        improve_dir += " " + level_focus

    snap = base / "scenes" / ("scene_%02d_snapshot.md" % n)
    if not snap.exists():
        studio.save_snapshot(n, original)

    history = studio.retrieve_relevant_scenes(improve_dir, chars, 3)
    msgs = studio.showrunner_prompt(lore, chars, state, history, improve_dir, "", studio.recent_feedback(3),
                                     npc_registry, plot_threads, timeline, language, genre, subgenre)
    raw = studio.llm_call(studio.CONFIG["showrunner_model"], msgs, studio.CONFIG["max_tokens_showrunner"], studio.CONFIG["temperature"])
    improved, choices = studio.split_scene_and_choices(raw)

    audit = None
    try:
        a_raw = studio.llm_call(studio.CONFIG["auditor_model"], studio.auditor_prompt(improved, chars, language),
                                 studio.CONFIG["max_tokens_auditor"], 0.2, json_mode=True)
        audit = studio.parse_json_robust(a_raw)
    except Exception:
        audit = None

    return {
        "ok": True,
        "scene": n,
        "original": original,
        "improved": improved,
        "choices": choices,
        "audit": audit,
    }
