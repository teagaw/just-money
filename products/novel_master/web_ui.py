#!/usr/bin/env python3
"""Minimal local web UI for the Novel Studio (Phase 0)."""
import json
import re
import socket
import sys
import threading
import datetime
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote

BASE = Path(__file__).parent
sys.path.insert(0, str(BASE))
import studio
import import_pipeline

HOST = "127.0.0.1"
PORT = 8765
GEN_LOCK = threading.Lock()


def generate_one_stream(direction: str, brief: str = "", feedback: str = ""):
    """Yield (event_type, payload) tuples for SSE streaming."""
    import time as _time
    _start = _time.time()
    GEN_TIMEOUT = 300
    def _check_timeout():
        if _time.time() - _start > GEN_TIMEOUT:
            raise TimeoutError("Generation timed out after 5 minutes. Try a shorter direction or a different model.")
    _check_timeout()
    _lp = studio.kb_path("lore")
    lore = _lp.read_text(encoding="utf-8") if _lp.exists() else ""
    _cp = studio.kb_path("characters")
    chars = json.loads(_cp.read_text(encoding="utf-8")) if _cp.exists() else []
    chars = [{k: v for k, v in c.items() if k != "secrets"} for c in chars]
    state = studio.load_state()
    n = studio.next_scene_number()
    npc_registry = json.loads(studio.kb_path("npc_registry").read_text(encoding="utf-8")) if studio.kb_path("npc_registry").exists() else {}
    plot_threads = json.loads(studio.kb_path("plot_threads").read_text(encoding="utf-8")) if studio.kb_path("plot_threads").exists() else []
    timeline = json.loads(studio.kb_path("timeline").read_text(encoding="utf-8")) if studio.kb_path("timeline").exists() else []
    language = studio.project_language()
    genre = studio.project_genre()
    subgenre = studio.project_subgenre()
    skills = studio.skills_prompt_block(direction + " " + brief + " " + genre)
    feedback_constraints = studio.aggregated_feedback_constraints()

    history = studio.retrieve_relevant_scenes(direction, chars, 5)
    msgs = studio.showrunner_prompt(lore, chars, state, history, direction, brief, feedback,
                                    npc_registry, plot_threads, timeline, language, genre, subgenre, skills,
                                    feedback_constraints=feedback_constraints)

    yield ("stage", {"message": "Calling Showrunner (writing the scene)...", "progress": 5})
    _check_timeout()
    raw = studio.llm_call(studio.CONFIG["showrunner_model"], msgs,
                          studio.CONFIG["max_tokens_showrunner"], studio.CONFIG["temperature"], scene_ref=n)
    scene, choices = studio.split_scene_and_choices(raw)
    if not scene:
        yield ("error", {"error": "The model returned reasoning instead of prose. Regenerate with a shorter direction."})
        return

    yield ("stage", {"message": "Running State Auditor (extracting events)...", "progress": 60})
    _check_timeout()
    audit = None
    try:
        a_raw = studio.llm_call(studio.CONFIG["auditor_model"],
                                studio.auditor_prompt(scene, chars, language),
                                studio.CONFIG["max_tokens_auditor"], 0.2, scene_ref=n, json_mode=True)
        audit = studio.parse_json_robust(a_raw)
    except Exception as exc:
        audit = None
        yield ("stage", {"message": "Auditor unavailable, skipping state update: " + str(exc),
                         "progress": 65})

    yield ("stage", {"message": "Saving scene, events, and state...", "progress": 92})
    scene_path = studio.kb_path("scenes") / f"scene_{n:02d}.md"
    studio.atomic_write(scene_path, scene)
    # deterministic scene checks (cheap, no LLM)
    checks = studio.deterministic_scene_checks(scene, chars, genre)
    if checks:
        yield ("stage", {"message": "Scene checks: " + "; ".join(checks), "progress": 93})
    studio.save_snapshot(n, scene)
    meta = {
        "scene": n,
        "hash": studio.sha256_file(scene_path),
        "status": "accepted",
        "characters_present": (audit or {}).get("characters_present", []),
        "location": (audit or {}).get("location"),
        "events": (audit or {}).get("events", []),
        "choices": choices,
    }
    studio.atomic_write(studio.kb_path("scenes") / f"scene_{n:02d}_meta.json", json.dumps(meta, indent=2))

    scene_level_updates = (audit or {}).get("state_updates", {}) or {}
    for ev in (audit or {}).get("events", []):
        ev_su = ev.get("state_updates")
        if ev_su is None:
            ev_su = scene_level_updates
        ev_record = {"event_id": studio.next_event_id(), "scene": n,
                     "ts": datetime.datetime.now(datetime.timezone.utc).isoformat(), **ev}
        ev_record["state_updates"] = ev_su if isinstance(ev_su, dict) else {}
        studio.append_event(ev_record)

    if audit:
        applied_any = False
        for ev in (audit or {}).get("events", []):
            su = ev.get("state_updates")
            if su is None:
                su = (audit or {}).get("state_updates", {}) or {}
            if isinstance(su, dict) and su:
                studio.apply_state_updates(state, su)
                applied_any = True
        if not applied_any and (audit or {}).get("state_updates"):
            studio.apply_state_updates(state, audit["state_updates"])
            applied_any = True
        if applied_any:
            studio.atomic_write(studio.kb_path("state"), json.dumps(state, indent=2))
        studio.apply_audit_extras(audit)
    studio.git_commit_scene(n, f"scene {n:02d}: accepted")
    # Phase 3: voice + knowledge + NPC checks
    v_issues = studio.voice_check(scene, chars)
    k_path = studio.kb_path("character_knowledge")
    knowledge = json.loads(k_path.read_text(encoding="utf-8")) if k_path.exists() else {}
    k_issues = studio.knowledge_check(scene, chars, knowledge)
    npc_path = studio.kb_path("npc_registry")
    npc_reg = json.loads(npc_path.read_text(encoding="utf-8")) if npc_path.exists() else {}
    n_issues = studio.npc_check(scene, npc_reg)
    checks = v_issues + k_issues + n_issues

    yield ("done", {
        "scene_number": n,
        "scene": scene,
        "choices": choices,
        "state": state,
        "events": (audit or {}).get("events", []),
        "characters": chars,
        "checks": checks,
    })


def status_payload() -> dict:
    state = studio.load_state() if studio.kb_path("state").exists() else None
    _cp = studio.kb_path("characters")
    chars = json.loads(_cp.read_text(encoding="utf-8")) if _cp.exists() else []
    chars = [{k: v for k, v in c.items() if k != "secrets"} for c in chars]
    scenes = sorted(p for p in (studio.kb_path("scenes")).glob("scene_*.md")
                    if re.match(r"scene_\d+\.md", p.name))
    scene_list = [p.name for p in scenes]
    last_status = "accepted"
    current_scene = 0
    if scene_list:
        meta_path = studio.kb_path("scenes") / (scene_list[-1].replace(".md", "_meta.json"))
        if meta_path.exists():
            try:
                meta = json.loads(meta_path.read_text(encoding="utf-8"))
                last_status = meta.get("status", "accepted")
            except (json.JSONDecodeError, OSError):
                pass
        current_scene = int(scene_list[-1].replace("scene_", "").replace(".md", ""))
    return {
        "scene_count": len(scene_list),
        "current_scene": current_scene,
        "last_status": last_status,
        "scenes": scene_list,
        "characters": chars,
        "state": state,
        "project": studio.active_project_name(),
        "language": studio.project_language(),
        "genre": studio.project_genre(),
        "subgenre": studio.project_subgenre(),
    }


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def _send(self, code, content_type, body):
        data = body.encode("utf-8") if isinstance(body, str) else body
        self.send_response(code)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        path = unquote(self.path.split("?")[0])
        if path == "/" or path == "/index.html":
            index = BASE / "index.html"
            html = index.read_text(encoding="utf-8") if index.exists() else "<h1>missing index.html</h1>"
            self._send(200, "text/html; charset=utf-8", html)
            return
        if path == "/api/status":
            self._send(200, "application/json", json.dumps(status_payload()))
            return
        if path == "/api/lore":
            p = studio.kb_path("lore")
            content = p.read_text(encoding="utf-8") if p.exists() else ""
            self._send(200, "application/json", json.dumps({"content": content}))
            return
        if path == "/api/characters":
            p = studio.kb_path("characters")
            content = p.read_text(encoding="utf-8") if p.exists() else "[]"
            self._send(200, "application/json", json.dumps({"content": content}))
            return
        if path == "/api/projects":
            self._send(200, "application/json", json.dumps({
                "projects": studio.project_summaries(),
                "active": studio.active_project_name(),
            }))
            return
        if path == "/api/skills":
            self._send(200, "application/json", json.dumps({"skills": studio.list_skills()}))
            return
        if path == "/api/hints":
            self._send(200, "application/json", json.dumps({"hints": studio.list_hints()}))
            return
        if path == "/api/structure":
            self._send(200, "application/json", json.dumps({"structure": studio.get_structure()}))
            return
        if path == "/api/chat":
            from urllib.parse import parse_qs
            qs = parse_qs(self.path.split("?", 1)[1] if "?" in self.path else "")
            try:
                scene = int(qs.get("scene", ["0"])[0])
            except (TypeError, ValueError):
                scene = 0
            if scene < 1:
                self._send(400, "application/json", json.dumps({"error": "invalid scene number"}))
                return
            self._send(200, "application/json", json.dumps({"messages": studio.load_chat(scene)}))
            return
        if path == "/api/hint_audit":
            self._send(200, "application/json", json.dumps({"issues": studio.hint_audit()}))
            return
        m = re.match(r"^/api/analysis/(\d+)$", path)
        if m:
            n = int(m.group(1))
            result = studio.load_analysis(n)
            self._send(200, "application/json",
                       json.dumps(result if result is not None else {"ok": False}))
            return
        if path == "/api/genres":
            genres = json.loads((BASE / "genres.json").read_text(encoding="utf-8")) if (BASE / "genres.json").exists() else {}
            self._send(200, "application/json", json.dumps(genres))
            return
        if path == "/api/branches":
            self._send(200, "application/json", json.dumps({
                "branches": studio.list_branches(),
                "current": studio.current_branch(),
            }))
            return
        if path == "/api/detect_edits":
            dirty = studio.scan_for_edits()
            self._send(200, "application/json", json.dumps({"dirty": dirty}))
            return
        m = re.match(r"^/api/scene/(\d+)$", path)
        if m:
            num = int(m.group(1))
            name = f"scene_{num:02d}.md"
            p = studio.kb_path("scenes") / name
            if not p.exists():
                self._send(404, "application/json", json.dumps({"error": "not found"}))
                return
            scene = p.read_text(encoding="utf-8")
            choices = []
            meta_path = studio.kb_path("scenes") / f"scene_{num:02d}_meta.json"
            if meta_path.exists():
                try:
                    choices = json.loads(meta_path.read_text(encoding="utf-8")).get("choices", [])
                except (json.JSONDecodeError, OSError):
                    choices = []
            self._send(200, "application/json", json.dumps({"number": num, "scene": scene, "choices": choices}))
            return
        self._send(404, "text/plain", "not found")

    def do_POST(self):
        path = unquote(self.path.split("?")[0])
        length = int(self.headers.get("Content-Length", 0) or 0)
        if length < 0 or length > 2_000_000:
            self._send(413, "application/json", json.dumps({"error": "request body too large"}))
            return
        raw = self.rfile.read(length) if length else b"{}"
        try:
            body = json.loads(raw.decode("utf-8"))
        except (json.JSONDecodeError, UnicodeDecodeError):
            body = {}
        if not isinstance(body, dict):
            body = {}
        if path == "/api/save_skill":
            filename = body.get("filename", "")
            name = body.get("name", "")
            trigger = body.get("trigger", "")
            active = body.get("active", True)
            body_text = body.get("body", "")
            if not isinstance(filename, str) or not filename.strip():
                self._send(400, "application/json", json.dumps({"error": "filename required"}))
                return
            if not filename.endswith(".md"):
                filename += ".md"
            studio.save_skill(filename, name or filename.replace(".md", ""), trigger, bool(active), body_text if isinstance(body_text, str) else "")
            self._send(200, "application/json", json.dumps({"ok": True}))
            return
        if path == "/api/create_style":
            name = body.get("name", "")
            samples = body.get("samples", [])
            if not isinstance(name, str) or not name.strip():
                self._send(400, "application/json", json.dumps({"error": "name required"}))
                return
            if not isinstance(samples, list):
                samples = []
            samples = [s for s in samples if isinstance(s, str) and s.strip()]
            if not samples:
                self._send(400, "application/json", json.dumps({"error": "at least one sample required"}))
                return
            try:
                body_text = studio.create_style_from_samples(name.strip(), samples)
                if not body_text:
                    self._send(500, "application/json", json.dumps({"error": "style generation failed"}))
                    return
                self._send(200, "application/json", json.dumps({"ok": True, "body": body_text}))
            except Exception as e:
                self._send(500, "application/json", json.dumps({"error": str(e)}))
            return
        if path == "/api/delete_skill":
            filename = body.get("filename", "")
            try:
                if not isinstance(filename, str) or not studio.delete_skill(filename):
                    self._send(400, "application/json", json.dumps({"error": "skill not found"}))
                    return
            except Exception as e:
                self._send(500, "application/json", json.dumps({"error": str(e)}))
                return
            self._send(200, "application/json", json.dumps({"ok": True}))
            return
        if path == "/api/save_hint":
            hint_id = body.get("id", "")
            surface = body.get("surface", "")
            truth = body.get("truth", "")
            planted_in = body.get("planted_in", 0)
            if not isinstance(hint_id, str) or not hint_id.strip():
                self._send(400, "application/json", json.dumps({"error": "id required"}))
                return
            if not isinstance(planted_in, int):
                try:
                    planted_in = int(planted_in)
                except (TypeError, ValueError):
                    planted_in = 0
            try:
                h = studio.save_hint(hint_id.strip(), surface if isinstance(surface, str) else "",
                                     truth if isinstance(truth, str) else "", planted_in)
                self._send(200, "application/json", json.dumps({"ok": True, "hint": h}))
            except Exception as e:
                self._send(500, "application/json", json.dumps({"error": str(e)}))
            return
        if path == "/api/delete_hint":
            hint_id = body.get("id", "")
            if not isinstance(hint_id, str) or not studio.delete_hint(hint_id):
                self._send(400, "application/json", json.dumps({"error": "hint not found"}))
                return
            self._send(200, "application/json", json.dumps({"ok": True}))
            return
        if path == "/api/resolve_hint":
            hint_id = body.get("id", "")
            resolved_in = body.get("resolved_in", 0)
            if not isinstance(hint_id, str) or not isinstance(resolved_in, int):
                self._send(400, "application/json", json.dumps({"error": "invalid params"}))
                return
            if not studio.resolve_hint(hint_id, resolved_in):
                self._send(404, "application/json", json.dumps({"error": "hint not found"}))
                return
            self._send(200, "application/json", json.dumps({"ok": True}))
            return
        if path == "/api/delete_scene":
            n = body.get("scene")
            if not isinstance(n, int) or n < 1:
                self._send(400, "application/json", json.dumps({"error": "invalid scene number"}))
                return
            try:
                if not studio.delete_scene(n):
                    self._send(404, "application/json", json.dumps({"error": "scene not found"}))
                    return
            except Exception as e:
                self._send(500, "application/json", json.dumps({"error": str(e)}))
                return
            self._send(200, "application/json", json.dumps({"ok": True}))
            return
        if path == "/api/analyze_scene":
            n = body.get("scene")
            if not isinstance(n, int) or n < 1:
                self._send(400, "application/json", json.dumps({"error": "invalid scene number"}))
                return
            level = body.get("level", "developmental")
            if not isinstance(level, str):
                level = "developmental"
            try:
                result = studio.analyze_scene(n, level=level)
                if result is None:
                    self._send(404, "application/json", json.dumps({"error": "scene not found"}))
                    return
                self._send(200, "application/json", json.dumps(result))
            except Exception as e:
                self._send(500, "application/json", json.dumps({"error": str(e)}))
            return
        if path == "/api/chat":
            scene = body.get("scene")
            message = body.get("message", "")
            if not isinstance(scene, int) or scene < 1:
                self._send(400, "application/json", json.dumps({"error": "invalid scene number"}))
                return
            if not isinstance(message, str) or not message.strip():
                self._send(400, "application/json", json.dumps({"error": "message is required"}))
                return
            if len(message) > 4000:
                self._send(400, "application/json", json.dumps({"error": "message too long"}))
                return
            plan = body.get("plan", "")
            if not isinstance(plan, str):
                plan = ""
            if len(plan) > 4000:
                plan = plan[:4000]
            include_analysis = body.get("include_analysis", True)
            if not isinstance(include_analysis, bool):
                include_analysis = True
            try:
                ctx = studio.chat_context(scene, include_analysis, plan)
                history = studio.load_chat(scene)
                msgs = studio.chat_prompt(ctx, history, message)
                raw = studio.llm_call(studio.CONFIG["auditor_model"], msgs,
                                      studio.CONFIG.get("max_tokens_analysis", 1500), 0.7, json_mode=False)
                reply, actions = studio.split_chat_reply(raw)
                studio.append_chat(scene, [
                    {"ts": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                     "role": "user", "content": message, "analysis_run": ctx.get("analysis_run"),
                     "actions": []},
                    {"ts": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                     "role": "assistant", "content": reply, "actions": actions},
                ])
                self._send(200, "application/json", json.dumps({"reply": reply, "actions": actions, "scene": scene}))
            except Exception as e:
                self._send(500, "application/json", json.dumps({"error": str(e)}))
            return
        if path == "/api/chat/clear":
            scene = body.get("scene")
            if not isinstance(scene, int) or scene < 1:
                self._send(400, "application/json", json.dumps({"error": "invalid scene number"}))
                return
            studio.clear_chat(scene)
            self._send(200, "application/json", json.dumps({"ok": True}))
            return
        if path == "/api/save_plan":
            n = body.get("scene")
            plan = body.get("plan", "")
            if not isinstance(n, int) or n < 1:
                self._send(400, "application/json", json.dumps({"error": "invalid scene number"}))
                return
            if not isinstance(plan, str):
                self._send(400, "application/json", json.dumps({"error": "plan must be a string"}))
                return
            if studio.save_analysis_plan(n, plan):
                self._send(200, "application/json", json.dumps({"ok": True}))
            else:
                self._send(404, "application/json", json.dumps({"error": "scene not found"}))
            return
        if path == "/api/apply_plan":
            n = body.get("scene")
            plan = body.get("plan", "")
            level = body.get("level", "developmental")
            if not isinstance(n, int) or n < 1:
                self._send(400, "application/json", json.dumps({"error": "invalid scene number"}))
                return
            if not isinstance(plan, str) or not plan.strip():
                self._send(400, "application/json", json.dumps({"error": "plan required"}))
                return
            try:
                result = import_pipeline.improve_scene(n, [], plan, level=level if isinstance(level, str) else "developmental")
                self._send(200, "application/json", json.dumps(result))
            except Exception as e:
                self._send(500, "application/json", json.dumps({"error": str(e)}))
            return
        if path == "/api/create_part":
            name = body.get("name", "New Part")
            if not isinstance(name, str):
                name = str(name)
            try:
                pid = studio.create_part(name)
                self._send(200, "application/json", json.dumps({"ok": True, "id": pid}))
            except Exception as e:
                self._send(500, "application/json", json.dumps({"error": str(e)}))
            return
        if path == "/api/rename_part":
            pid = body.get("id", "")
            name = body.get("name", "")
            if not isinstance(pid, str) or not isinstance(name, str):
                self._send(400, "application/json", json.dumps({"error": "invalid params"}))
                return
            if studio.rename_part(pid, name):
                self._send(200, "application/json", json.dumps({"ok": True}))
            else:
                self._send(404, "application/json", json.dumps({"error": "part not found"}))
            return
        if path == "/api/delete_part":
            pid = body.get("id", "")
            delete_scenes = body.get("delete_scenes", False)
            if not isinstance(pid, str):
                self._send(400, "application/json", json.dumps({"error": "invalid id"}))
                return
            try:
                if studio.delete_part(pid, bool(delete_scenes)):
                    self._send(200, "application/json", json.dumps({"ok": True}))
                else:
                    self._send(400, "application/json", json.dumps({"error": "cannot delete (not found, has scenes, or last part)"}))
            except Exception as e:
                self._send(500, "application/json", json.dumps({"error": str(e)}))
            return
        if path == "/api/create_chapter":
            part_id = body.get("part_id", "")
            name = body.get("name", "New Chapter")
            if not isinstance(part_id, str) or not isinstance(name, str):
                self._send(400, "application/json", json.dumps({"error": "invalid params"}))
                return
            cid = studio.create_chapter(part_id, name)
            if cid:
                self._send(200, "application/json", json.dumps({"ok": True, "id": cid}))
            else:
                self._send(404, "application/json", json.dumps({"error": "part not found"}))
            return
        if path == "/api/rename_chapter":
            cid = body.get("id", "")
            name = body.get("name", "")
            if not isinstance(cid, str) or not isinstance(name, str):
                self._send(400, "application/json", json.dumps({"error": "invalid params"}))
                return
            if studio.rename_chapter(cid, name):
                self._send(200, "application/json", json.dumps({"ok": True}))
            else:
                self._send(404, "application/json", json.dumps({"error": "chapter not found"}))
            return
        if path == "/api/delete_chapter":
            cid = body.get("id", "")
            delete_scenes = body.get("delete_scenes", False)
            if not isinstance(cid, str):
                self._send(400, "application/json", json.dumps({"error": "invalid id"}))
                return
            try:
                if studio.delete_chapter(cid, bool(delete_scenes)):
                    self._send(200, "application/json", json.dumps({"ok": True}))
                else:
                    self._send(400, "application/json", json.dumps({"error": "cannot delete (not found, has scenes, or last chapter)"}))
            except Exception as e:
                self._send(500, "application/json", json.dumps({"error": str(e)}))
            return
        if path == "/api/set_active_chapter":
            cid = body.get("id", "")
            if not isinstance(cid, str):
                self._send(400, "application/json", json.dumps({"error": "invalid id"}))
                return
            studio.set_active_chapter(cid)
            self._send(200, "application/json", json.dumps({"ok": True}))
            return
        if path == "/api/generate_chapter_summary":
            cid = body.get("id", "")
            if not isinstance(cid, str):
                self._send(400, "application/json", json.dumps({"error": "invalid id"}))
                return
            try:
                summary = studio.generate_chapter_summary(cid)
                self._send(200, "application/json", json.dumps({"ok": True, "summary": summary}))
            except Exception as e:
                self._send(500, "application/json", json.dumps({"error": str(e)}))
            return


        if path == "/api/feedback":
            try:
                scene = int(body.get("scene"))
            except (TypeError, ValueError):
                self._send(400, "application/json", json.dumps({"error": "scene must be an integer"}))
                return
            rating = body.get("rating")
            try:
                rating = int(rating)
            except (TypeError, ValueError):
                rating = None
            if rating is not None and (rating < 1 or rating > 10):
                self._send(400, "application/json", json.dumps({"error": "rating must be 1-10"}))
                return
            text = body.get("text") or ""
            if not isinstance(text, str):
                text = ""
            text = text[:4000]
            studio.save_feedback(scene, rating if rating is not None else 0, text)
            self._send(200, "application/json", json.dumps({"ok": True}))
            return
        if path == "/api/save_lore":
            text = body.get("text")
            if not isinstance(text, str):
                self._send(400, "application/json", json.dumps({"error": "text must be a string"}))
                return
            studio.atomic_write(studio.kb_path("lore"), text)
            self._send(200, "application/json", json.dumps({"ok": True}))
            return
        if path == "/api/save_characters":
            text = body.get("text")
            if not isinstance(text, str):
                self._send(400, "application/json", json.dumps({"error": "text must be a string"}))
                return
            try:
                json.loads(text)  # validate JSON
            except json.JSONDecodeError as e:
                self._send(400, "application/json", json.dumps({"error": f"Invalid JSON: {e}"}))
                return
            studio.atomic_write(studio.kb_path("characters"), text)
            self._send(200, "application/json", json.dumps({"ok": True}))
            return
        if path == "/api/rebuild_state":
            new_state = studio.rebuild_state_from_events()
            studio.atomic_write(studio.kb_path("state"), json.dumps(new_state, indent=2))
            self._send(200, "application/json", json.dumps({"ok": True, "state": new_state}))
            return
        if path == "/api/save_scene":
            try:
                scene = int(body.get("scene"))
            except (TypeError, ValueError):
                self._send(400, "application/json", json.dumps({"error": "scene must be an integer"}))
                return
            text = body.get("text")
            if not isinstance(text, str):
                self._send(400, "application/json", json.dumps({"error": "text must be a string"}))
                return
            p = studio.kb_path("scenes") / f"scene_{scene:02d}.md"
            if not p.exists():
                self._send(404, "application/json", json.dumps({"error": "scene not found"}))
                return
            studio.atomic_write(p, text)
            dirty = studio.detect_edit(scene)
            self._send(200, "application/json", json.dumps({"ok": True, "dirty": dirty}))
            return
        if path == "/api/switch_project":
            name = body.get("name")
            if not isinstance(name, str) or not studio.switch_project(name):
                self._send(400, "application/json", json.dumps({"error": "unknown project"}))
                return
            self._send(200, "application/json", json.dumps({"ok": True, "active": name}))
            return
        if path == "/api/create_branch":
            name = body.get("name")
            from_scene = body.get("from_scene")
            if not isinstance(name, str):
                self._send(400, "application/json", json.dumps({"error": "name must be a string"}))
                return
            ok = studio.create_branch(name, from_scene)
            if not ok:
                self._send(400, "application/json", json.dumps({"error": "branch creation failed (exists or invalid name)"}))
                return
            self._send(200, "application/json", json.dumps({"ok": True, "branch": name}))
            return
        if path == "/api/switch_branch":
            name = body.get("name")
            if not isinstance(name, str) or not studio.switch_branch(name):
                self._send(400, "application/json", json.dumps({"error": "unknown branch"}))
                return
            self._send(200, "application/json", json.dumps({"ok": True, "branch": name}))
            return
        if path == "/api/new_project":
            name = body.get("name")
            language = body.get("language", "en")
            genre = body.get("genre", "")
            subgenre = body.get("subgenre", "")
            premise = body.get("premise", "")
            lore = body.get("lore", "")
            characters = body.get("characters", None)
            pov = body.get("pov", "")
            tense = body.get("tense", "")
            tone = body.get("tone", "")
            samples = body.get("samples", "")
            if not isinstance(premise, str):
                premise = "" if premise is None else str(premise)
            if not isinstance(lore, str):
                lore = "" if lore is None else str(lore)
            if not isinstance(characters, list):
                characters = None
            if not isinstance(pov, str):
                pov = ""
            if not isinstance(tense, str):
                tense = ""
            if not isinstance(tone, str):
                tone = ""
            if not isinstance(samples, str):
                samples = ""
            if not isinstance(name, str) or not studio.create_project(name, language if isinstance(language, str) else "en",
                                                                      genre if isinstance(genre, str) else "",
                                                                      subgenre if isinstance(subgenre, str) else "",
                                                                       premise=premise,
                                                                       characters=characters,
                                                                       lore=lore,
                                                                       pov=pov,
                                                                       tense=tense,
                                                                       tone=tone,
                                                                       samples=samples):
                self._send(400, "application/json", json.dumps({"error": "invalid or duplicate project name"}))
                return
            studio.switch_project(name.strip())
            self._send(200, "application/json", json.dumps({"ok": True, "active": name.strip()}))
            return
        if path == "/api/delete_project":
            name = body.get("name")
            if not isinstance(name, str):
                self._send(400, "application/json", json.dumps({"error": "name must be a string"}))
                return
            try:
                if not studio.delete_project(name):
                    self._send(400, "application/json", json.dumps({"error": "cannot delete (not found or last project)"}))
                    return
            except Exception as e:
                self._send(500, "application/json", json.dumps({"error": str(e)}))
                return
            self._send(200, "application/json", json.dumps({"ok": True, "active": studio.active_project_name()}))
            return
        if path == "/api/reconcile":
            try:
                scene = int(body.get("scene"))
            except (TypeError, ValueError):
                self._send(400, "application/json", json.dumps({"error": "scene must be an integer"}))
                return
            result = studio.reconcile_scene(scene)
            self._send(200, "application/json", json.dumps(result if result is not None else {"none": True}))
            return
        if path == "/api/apply_proposals":
            try:
                scene = int(body.get("scene"))
            except (TypeError, ValueError):
                self._send(400, "application/json", json.dumps({"error": "scene must be an integer"}))
                return
            proposals = body.get("proposals", [])
            if not isinstance(proposals, list):
                self._send(400, "application/json", json.dumps({"error": "proposals must be a list"}))
                return
            entities = body.get("downstream_entities", []) or []
            if not isinstance(entities, list):
                entities = []
            result = studio.apply_reconciliation(proposals, scene=scene, downstream_entities=entities)
            # refresh snapshot already done; clear dirty handled in apply
            self._send(200, "application/json", json.dumps(result))
            return
        if path == "/api/import_novel":
            text = body.get("text", "")
            name = body.get("name", "imported_novel")
            language = body.get("language", "en")
            genre = body.get("genre", "")
            subgenre = body.get("subgenre", "")
            if not isinstance(text, str) or not text.strip():
                self._send(400, "application/json", json.dumps({"error": "text is required"}))
                return
            if not isinstance(name, str):
                name = "imported_novel"
            result = import_pipeline.import_novel(text, name, language, genre, subgenre)
            self._send(200, "application/json", json.dumps(result))
            return
        if path == "/api/analyze_novel":
            text = body.get("text", "")
            if not isinstance(text, str) or not text.strip():
                self._send(400, "application/json", json.dumps({"error": "text is required"}))
                return
            result = import_pipeline.analyze_novel(text)
            self._send(200, "application/json", json.dumps(result))
            return
        if path == "/api/improve_scene":
            try:
                scene = int(body.get("scene"))
            except (TypeError, ValueError):
                self._send(400, "application/json", json.dumps({"error": "scene must be an integer"}))
                return
            options = body.get("options", [])
            if not isinstance(options, list):
                options = []
            direction = body.get("direction", "")
            if not isinstance(direction, str):
                direction = ""
            level = body.get("level", "developmental")
            if not isinstance(level, str):
                level = "developmental"
            result = import_pipeline.improve_scene(scene, options, direction, level=level)
            self._send(200, "application/json", json.dumps(result))
            return
        if path == "/api/add_scene":
            text = body.get("text", "")
            improve = body.get("improve", False)
            options = body.get("options", [])
            direction = body.get("direction", "")
            if not isinstance(text, str) or not text.strip():
                self._send(400, "application/json", json.dumps({"error": "text required"}))
                return
            if not isinstance(options, list):
                options = []
            if not isinstance(direction, str):
                direction = ""
            try:
                result = studio.add_scene(text, improve=bool(improve), options=options, direction=direction)
                self._send(200, "application/json", json.dumps(result))
            except Exception as e:
                self._send(500, "application/json", json.dumps({"error": str(e)}))
            return
        if path == "/api/generate":
            direction = (body.get("direction") or "").strip() or "Continue the story naturally."
            if not isinstance(direction, str):
                direction = "Continue the story naturally."
            direction = direction[:4000]
            brief = body.get("brief") or ""
            if not isinstance(brief, str):
                brief = ""
            brief = brief[:2000]
            feedback = body.get("feedback") or ""
            if not isinstance(feedback, str):
                feedback = ""
            feedback = feedback[:2000]
            self.send_response(200)
            self.send_header("Content-Type", "text/event-stream")
            self.send_header("Cache-Control", "no-cache")
            self.send_header("Connection", "close")
            self.end_headers()
            self.close_connection = True

            def emit(obj):
                self.wfile.write(f"data: {json.dumps(obj)}\n\n".encode("utf-8"))
                self.wfile.flush()

            with GEN_LOCK:
                try:
                    for etype, payload in generate_one_stream(direction, brief, feedback):
                        emit({"type": etype, **payload})
                except Exception as e:  # broad: stream error to client
                    emit({"type": "error", "error": str(e)})
            emit({"type": "end"})
            return
        self._send(404, "text/plain", "not found")


def main():
    with socket.socket() as probe:
        probe.settimeout(1)
        if probe.connect_ex((HOST, PORT)) == 0:
            print(f"Novel Studio is already running at http://{HOST}:{PORT}")
            return
    # the port probe above prevents a duplicate launch from rewriting state, so
    # rebuild before binding: readiness then implies consistent state
    new_state = studio.rebuild_state_from_events()
    studio.atomic_write(studio.kb_path("state"), json.dumps(new_state, indent=2))
    print("State rebuilt from event log on startup.")
    httpd = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"Novel Studio UI running at http://{HOST}:{PORT}")
    print("Open that URL in your browser. Ctrl+C to stop.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nStopped.")
