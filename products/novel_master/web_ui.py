#!/usr/bin/env python3
"""Minimal local web UI for the Novel Studio (Phase 0)."""
import json
import os
import re
import sys
import threading
import datetime
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote

BASE = Path(__file__).parent
sys.path.insert(0, str(BASE))
import studio

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
    lore = (studio.project_base() / "world_lore.md").read_text(encoding="utf-8")
    chars = json.loads((studio.project_base() / "characters.json").read_text(encoding="utf-8"))
    chars = [{k: v for k, v in c.items() if k != "secrets"} for c in chars]
    state = studio.load_state()
    n = studio.next_scene_number()
    npc_registry = json.loads((studio.project_base() / "npc_registry.json").read_text(encoding="utf-8")) if (studio.project_base() / "npc_registry.json").exists() else {}
    plot_threads = json.loads((studio.project_base() / "plot_threads.json").read_text(encoding="utf-8")) if (studio.project_base() / "plot_threads.json").exists() else []
    timeline = json.loads((studio.project_base() / "timeline.json").read_text(encoding="utf-8")) if (studio.project_base() / "timeline.json").exists() else []

    history = studio.retrieve_relevant_scenes(direction, chars, 5)
    msgs = studio.showrunner_prompt(lore, chars, state, history, direction, brief, feedback,
                                    npc_registry, plot_threads, timeline)

    yield ("stage", {"message": "Calling Showrunner (writing the scene)...", "progress": 5})
    _check_timeout()
    raw = studio.llm_call(studio.CONFIG["showrunner_model"], msgs,
                          studio.CONFIG["max_tokens_showrunner"], studio.CONFIG["temperature"], scene_ref=n)
    scene, choices = studio.split_scene_and_choices(raw)

    yield ("stage", {"message": "Running State Auditor (extracting events)...", "progress": 60})
    _check_timeout()
    audit = None
    try:
        a_raw = studio.llm_call(studio.CONFIG["auditor_model"],
                                studio.auditor_prompt(scene, chars),
                                studio.CONFIG["max_tokens_auditor"], 0.2, scene_ref=n, json_mode=True)
        audit = studio.parse_json_robust(a_raw)
    except Exception:  # broad: auditor/parse failure -> skip state update
        audit = None

    yield ("stage", {"message": "Saving scene, events, and state...", "progress": 92})
    scene_path = studio.project_base() / "scenes" / f"scene_{n:02d}.md"
    studio.atomic_write(scene_path, scene)
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
    studio.atomic_write(studio.project_base() / "scenes" / f"scene_{n:02d}_meta.json", json.dumps(meta, indent=2))

    scene_level_updates = (audit or {}).get("state_updates", {}) or {}
    for ev in (audit or {}).get("events", []):
        ev_su = ev.get("state_updates")
        if ev_su is None:
            ev_su = scene_level_updates
        ev_record = {"event_id": studio.next_event_id(), "scene": n,
                     "ts": datetime.datetime.now(datetime.timezone.utc).isoformat(), **ev}
        ev_record["state_updates"] = ev_su if isinstance(ev_su, dict) else {}
        with (studio.project_base() / "events" / "event_log.jsonl").open("a", encoding="utf-8") as f:
            f.write(json.dumps(ev_record) + "\n")

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
            studio.atomic_write(studio.project_base() / "character_state.json", json.dumps(state, indent=2))
        studio.apply_audit_extras(audit)
    # Phase 3: voice + knowledge + NPC checks
    v_issues = studio.voice_check(scene, chars)
    k_path = studio.project_base() / "character_knowledge.json"
    knowledge = json.loads(k_path.read_text(encoding="utf-8")) if k_path.exists() else {}
    k_issues = studio.knowledge_check(scene, chars, knowledge)
    npc_path = studio.project_base() / "npc_registry.json"
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
    state = studio.load_state() if (studio.project_base() / "character_state.json").exists() else None
    chars = json.loads((studio.project_base() / "characters.json").read_text(encoding="utf-8"))
    chars = [{k: v for k, v in c.items() if k != "secrets"} for c in chars]
    scenes = sorted(p for p in (studio.project_base() / "scenes").glob("scene_*.md")
                    if re.match(r"scene_\d+\.md", p.name))
    scene_list = [p.name for p in scenes]
    last_scene = ""
    last_choices = []
    if scene_list:
        last_scene = (studio.project_base() / "scenes" / scene_list[-1]).read_text(encoding="utf-8")
        meta_path = studio.project_base() / "scenes" / (scene_list[-1].replace(".md", "_meta.json"))
        if meta_path.exists():
            try:
                last_choices = json.loads(meta_path.read_text(encoding="utf-8")).get("choices", [])
            except (json.JSONDecodeError, OSError):
                last_choices = []
    return {
        "scene_count": len(scene_list),
        "scenes": scene_list,
        "characters": chars,
        "state": state,
        "last_scene": last_scene,
        "last_choices": last_choices,
    }


INDEX_HTML = (BASE / "index.html").read_text(encoding="utf-8") if (BASE / "index.html").exists() else "<h1>missing index.html</h1>"


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def _send(self, code, content_type, body):
        data = body.encode("utf-8") if isinstance(body, str) else body
        self.send_response(code)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        path = unquote(self.path.split("?")[0])
        if path == "/" or path == "/index.html":
            self._send(200, "text/html; charset=utf-8", INDEX_HTML)
            return
        if path == "/api/status":
            self._send(200, "application/json", json.dumps(status_payload()))
            return
        if path == "/api/projects":
            self._send(200, "application/json", json.dumps({
                "projects": studio.list_projects(),
                "active": studio.active_project_name(),
            }))
            return
        if path == "/api/rebuild_state":
            new_state = studio.rebuild_state_from_events()
            studio.atomic_write(studio.project_base() / "character_state.json", json.dumps(new_state, indent=2))
            self._send(200, "application/json", json.dumps({"ok": True, "state": new_state}))
            return
        if path == "/api/detect_edits":
            dirty = studio.scan_for_edits()
            self._send(200, "application/json", json.dumps({"dirty": dirty}))
            return
        m = re.match(r"^/api/scene/(\d+)$", path)
        if m:
            num = int(m.group(1))
            name = f"scene_{num:02d}.md"
            p = studio.project_base() / "scenes" / name
            if not p.exists():
                self._send(404, "application/json", json.dumps({"error": "not found"}))
                return
            scene = p.read_text(encoding="utf-8")
            choices = []
            meta_path = studio.project_base() / "scenes" / f"scene_{num:02d}_meta.json"
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
            p = studio.project_base() / "scenes" / f"scene_{scene:02d}.md"
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
        if path == "/api/new_project":
            name = body.get("name")
            if not isinstance(name, str) or not studio.create_project(name):
                self._send(400, "application/json", json.dumps({"error": "invalid or duplicate project name"}))
                return
            studio.switch_project(name.strip())
            self._send(200, "application/json", json.dumps({"ok": True, "active": name.strip()}))
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
            self.send_header("Connection", "keep-alive")
            self.end_headers()

            def emit(obj):
                self.wfile.write(f"data: {json.dumps(obj)}\n\n".encode("utf-8"))
                self.wfile.flush()

            with GEN_LOCK:
                try:
                    for etype, payload in generate_one_stream(direction, brief, feedback):
                        emit({"type": etype, **payload})
                except Exception as e:  # broad: stream error to client
                    emit({"type": "error", "error": str(e)})
            return
        self._send(404, "text/plain", "not found")


def main():
    # rebuild state on startup if missing (prevents drift)
    if not (studio.project_base() / "character_state.json").exists():
        new_state = studio.rebuild_state_from_events()
        studio.atomic_write(studio.project_base() / "character_state.json", json.dumps(new_state, indent=2))
        print("State rebuilt from event log (was missing).")
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
