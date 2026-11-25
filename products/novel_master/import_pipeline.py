"""Novel import and improvement pipeline (§24.9)."""
import json
import re
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
        sp = studio.kb_path("scenes") / ("scene_%02d.md" % i)
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
        studio.atomic_write(studio.kb_path("scenes") / ("scene_%02d_meta.json" % i), json.dumps(meta, indent=2))
        studio.save_snapshot(i, scene_text)
    premise = scenes[0][:500] if scenes else ""
    lore_path = studio.kb_path("lore")
    if not lore_path.exists() or lore_path.read_text(encoding="utf-8").strip() == "# World Lore\n\n(describe your world here)":
        studio.atomic_write(lore_path, "# World Lore\n\nImported novel. Premise:\n" + premise + "\n")
    studio.git_commit_scene(len(scenes), "imported novel: %d scenes" % len(scenes))
    return {"ok": True, "name": name, "scene_count": len(scenes)}


def analyze_novel(text: str) -> dict:
    text = text.strip()
    if not text:
        return {"error": "Empty text"}
    # A rough draft has no project canon yet: judge it against its own text only.
    lore, chars, state, events = "", [], None, []
    language = "ar-eg" if any('\u0600' <= c <= '\u06ff' for c in text) else studio.project_language()
    metrics = studio.deterministic_analysis_metrics(text, chars)
    msgs = studio.analysis_prompt(text, chars, "developmental", language, lore, state, events, metrics)
    data = {}
    error = ""
    try:
        raw = studio.llm_call(studio.CONFIG["auditor_model"], msgs,
                              studio.CONFIG.get("max_tokens_analysis", 4000), 0.2, json_mode=True)
        parsed = studio.parse_json_robust(raw)
        if isinstance(parsed, dict) and not parsed.get("error"):
            data = parsed
    except Exception as exc:
        error = str(exc)
    result = studio.normalize_analysis(data, metrics)
    result["level"] = "developmental"
    result["estimated_scenes"] = len(text.split()) // 700 + 1
    if data:
        result["llm_enhanced"] = True
    if error:
        result["llm_error"] = error
        result["improvement_plan"] = "Deep analysis unavailable. Re-run analysis when the model is reachable."
    return result


def improve_scene(n: int, options: list, direction: str = "", level: str = "developmental") -> dict:
    base = studio.project_base()
    scene_path = studio.kb_path("scenes") / ("scene_%02d.md" % n)
    if not scene_path.exists():
        return {"ok": False, "error": "Scene not found"}
    original = scene_path.read_text(encoding="utf-8")
    meta_path = studio.kb_path("scenes") / ("scene_%02d_meta.json" % n)
    meta = json.loads(meta_path.read_text(encoding="utf-8")) if meta_path.exists() else {}
    chars_path = studio.kb_path("characters")
    chars = json.loads(chars_path.read_text(encoding="utf-8")) if chars_path.exists() else []
    state = studio.load_state()
    lore_path = studio.kb_path("lore")
    lore = lore_path.read_text(encoding="utf-8") if lore_path.exists() else ""
    npc_path = studio.kb_path("npc_registry")
    npc_registry = json.loads(npc_path.read_text(encoding="utf-8")) if npc_path.exists() else {}
    threads_path = studio.kb_path("plot_threads")
    plot_threads = json.loads(threads_path.read_text(encoding="utf-8")) if threads_path.exists() else []
    timeline_path = studio.kb_path("timeline")
    timeline = json.loads(timeline_path.read_text(encoding="utf-8")) if timeline_path.exists() else []
    language = studio.project_language()
    genre = studio.project_genre()
    subgenre = studio.project_subgenre()

    instructions = [studio.IMPROVE_OPTIONS.get(o, o) for o in options if o in studio.IMPROVE_OPTIONS]
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

    snap = studio.kb_path("scenes") / ("scene_%02d_snapshot.md" % n)
    if not snap.exists():
        studio.save_snapshot(n, original)

    history = studio.retrieve_relevant_scenes(improve_dir, chars, 3)
    msgs = studio.showrunner_prompt(lore, chars, state, history, improve_dir, "", studio.recent_feedback(3),
                                     npc_registry, plot_threads, timeline, language, genre, subgenre)
    raw = studio.llm_call(studio.CONFIG["showrunner_model"], msgs, studio.CONFIG["max_tokens_showrunner"], studio.CONFIG["temperature"])
    improved, choices = studio.split_scene_and_choices(raw)
    if not improved:
        return {"ok": False, "error": "The model returned reasoning instead of prose. Try again."}

    audit = None
    try:
        a_raw = studio.llm_call(studio.CONFIG["auditor_model"], studio.auditor_prompt(improved, chars, language),
                                 studio.CONFIG["max_tokens_auditor"], 0.2, json_mode=True)
        audit = studio.parse_json_robust(a_raw)
    except Exception as exc:
        studio.log_failure("improve_scene auditor", exc)
        audit = None

    return {
        "ok": True,
        "scene": n,
        "original": original,
        "improved": improved,
        "choices": choices,
        "audit": audit,
    }
