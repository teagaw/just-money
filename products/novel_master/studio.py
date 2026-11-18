#!/usr/bin/env python3
"""Phase 0 walking skeleton: AI novel co-writing studio (terminal only).

Loop: read lore + chars -> Showrunner generates scene -> State Auditor extracts
events -> update state -> print choices -> wait for input -> repeat.

Author authority: your edits to scene files win. (Reconciliation is Phase 1.)
"""
import hashlib
import json
import os
import re
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path

import httpx
from dotenv import load_dotenv

BASE = Path(__file__).parent


def _projects_dir() -> Path:
    return BASE / "projects"


def _active_project_file() -> Path:
    return BASE / "active_project.txt"


def project_base() -> Path:
    """Return the directory of the currently active novel project."""
    apf = _active_project_file()
    pd = _projects_dir()
    if apf.exists():
        name = apf.read_text(encoding="utf-8").strip()
        if name:
            p = pd / name
            if p.exists():
                return p
    # backward compat: if no projects dir, use BASE (single-novel mode)
    if not pd.exists():
        return BASE
    default = pd / "default"
    if default.exists():
        return default
    # fall back to first project
    projects = sorted(p for p in pd.iterdir() if p.is_dir())
    if projects:
        return projects[0]
    return BASE


def list_projects() -> list[str]:
    pd = _projects_dir()
    if not pd.exists():
        return []
    return sorted(p.name for p in pd.iterdir() if p.is_dir())


def active_project_name() -> str:
    apf = _active_project_file()
    pd = _projects_dir()
    if apf.exists():
        name = apf.read_text(encoding="utf-8").strip()
        if name and (pd / name).exists():
            return name
    projects = list_projects()
    return projects[0] if projects else "default"


def switch_project(name: str) -> bool:
    pd = _projects_dir()
    apf = _active_project_file()
    if not (pd / name).exists():
        return False
    apf.write_text(name, encoding="utf-8")
    return True


def create_project(name: str) -> bool:
    name = name.strip()
    if not name or "/" in name or "\\" in name or ".." in name:
        return False
    pd = _projects_dir()
    p = pd / name
    if p.exists():
        return False
    p.mkdir(parents=True)
    (p / "scenes").mkdir()
    (p / "events").mkdir()
    # template files
    (p / "world_lore.md").write_text("# World Lore\n\n(describe your world here)\n", encoding="utf-8")
    (p / "characters.json").write_text("[]", encoding="utf-8")
    (p / "character_state.json").write_text("{}", encoding="utf-8")
    (p / "npc_registry.json").write_text("{}", encoding="utf-8")
    (p / "plot_threads.json").write_text("[]", encoding="utf-8")
    (p / "timeline.json").write_text("[]", encoding="utf-8")
    return True


load_dotenv(BASE / ".env")
load_dotenv(BASE.parent.parent / ".env")  # repo root

# Concurrency guard for the append-only event log (Phase 1).
import threading
EVENT_LOG_LOCK = threading.Lock()

CONFIG = json.loads((BASE / "config.json").read_text(encoding="utf-8"))
API_KEY = os.getenv("OPENROUTER_API_KEY", "").strip()
BASE_URL = CONFIG["openrouter_base_url"]


def api_keys() -> list[str]:
    # Return the list of API keys to try, in order (rotation).
    keys = []
    multi = os.getenv("OPENROUTER_API_KEYS", "").strip()
    if multi:
        keys.extend(k.strip() for k in multi.split(",") if k.strip())
    if API_KEY and API_KEY not in keys:
        keys.insert(0, API_KEY)
    # config fallbacks: list of env var names
    for var in (CONFIG.get("key_fallbacks") or []):
        v = os.getenv(var, "").strip()
        if v and v not in keys:
            keys.append(v)
    return keys


def atomic_write(path: Path, content: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=path.parent, suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            f.write(content)
            f.flush()
            os.fsync(f.fileno())
        os.replace(tmp, path)
    except (OSError, ValueError):
        try:
            os.remove(tmp)
        except OSError:
            pass
        raise


def sha256_file(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def llm_call(model: str, messages: list, max_tokens: int, temperature: float, scene_ref=None,
             json_mode: bool = False) -> str:
    keys = api_keys()
    if not keys:
        raise RuntimeError("No API keys found. Set OPENROUTER_API_KEY or OPENROUTER_API_KEYS in .env.")
    last_err = None
    for key in keys:
        for _ in range(2):
            headers = {
                "Authorization": f"Bearer {key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://local.novel-studio",
                "X-Title": "Novel Studio Phase0",
            }
            payload = {
                "model": model,
                "messages": messages,
                "max_tokens": max_tokens,
                "temperature": temperature,
            }
            if json_mode:
                payload["response_format"] = {"type": "json_object"}
            try:
                timeout = httpx.Timeout(120.0, connect=15.0, read=60.0, write=15.0)
                with httpx.Client(timeout=timeout) as c:
                    r = c.post(f"{BASE_URL}/chat/completions", headers=headers, json=payload)
                    r.raise_for_status()
                    data = r.json()
                if "choices" not in data or not data["choices"]:
                    last_err = RuntimeError(data.get("error", {}).get("message", "no choices"))
                    continue
                usage = data.get("usage", {})
                log_usage(model, usage, scene_ref=scene_ref)
                msg = data["choices"][0]["message"]
                content = msg.get("content")
                if not content:
                    content = msg.get("reasoning") or ""
                if content and content.strip():
                    return content
                last_err = RuntimeError("empty content")
            except Exception as e:  # broad: retry on any provider/parse failure
                last_err = e
                # retryable? rotate key on 429/402/timeout
                status = getattr(getattr(e, "response", None), "status_code", None)
                if status in (429, 402, 408, 500, 502, 503):
                    break  # try next key
            import time
            time.sleep(1)
    raise last_err if last_err else RuntimeError("llm_call failed")


def log_usage(model: str, usage: dict, scene_ref=None):
    pricing = CONFIG.get("pricing_per_1m_tokens", {}).get(model, {"input": 0.0, "output": 0.0})
    pt = usage.get("prompt_tokens") or 0
    ct = usage.get("completion_tokens") or 0
    cost = (pt * pricing.get("input", 0.0) + ct * pricing.get("output", 0.0)) / 1_000_000
    entry = {
        "ts": datetime.now(timezone.utc).isoformat(),
        "model": model,
        "scene_ref": scene_ref,
        "prompt_tokens": pt,
        "completion_tokens": ct,
        "total_tokens": usage.get("total_tokens"),
        "cost_usd": round(cost, 6),
    }
    with (project_base() / "usage_log.jsonl").open("a", encoding="utf-8") as f:
        f.write(json.dumps(entry) + "\n")


def next_scene_number() -> int:
    nums = []
    for p in (project_base() / "scenes").glob("scene_*.md"):
        m = re.match(r"scene_(\d+)\.md", p.name)
        if m and not p.name.endswith("_meta.json"):
            nums.append(int(m.group(1)))
    return (max(nums) + 1) if nums else 1


def snapshot_path(n: int) -> Path:
    return project_base() / "scenes" / f"scene_{n:02d}_snapshot.md"


def save_snapshot(n: int, scene_text: str):
    atomic_write(snapshot_path(n), scene_text)


def feedback_path(n: int) -> Path:
    return project_base() / "scenes" / f"scene_{n:02d}_feedback.json"


def save_feedback(n: int, rating: int, text: str):
    atomic_write(feedback_path(n), json.dumps({"scene": n, "rating": rating, "feedback": text,
                                             "ts": datetime.now(timezone.utc).isoformat()}, indent=2))


def recent_feedback(n: int = 5) -> str:
    out = []
    for p in sorted((project_base() / "scenes").glob("scene_*_feedback.json")):
        try:
            d = json.loads(p.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            continue
        out.append(f"Scene {d.get('scene')}: rating {d.get('rating')}/10 - {d.get('feedback','')}")
    return "\n".join(out[-n:])


def detect_edit(n: int) -> bool:
    """Compare current scene file hash to stored hash. Returns True if edited (dirty)."""
    scene_path = project_base() / "scenes" / f"scene_{n:02d}.md"
    meta_path = project_base() / "scenes" / f"scene_{n:02d}_meta.json"
    if not scene_path.exists() or not meta_path.exists():
        return False
    try:
        meta = json.loads(meta_path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return False
    current_hash = sha256_file(scene_path)
    if meta.get("hash") == current_hash:
        return False
    # mark dirty
    meta["status"] = "dirty"
    atomic_write(meta_path, json.dumps(meta, indent=2))
    return True



def load_state() -> dict:
    p = project_base() / "character_state.json"
    if p.exists():
        return json.loads(p.read_text(encoding="utf-8"))
    # seed from characters.json
    chars = json.loads((project_base() / "characters.json").read_text(encoding="utf-8"))
    state = {c["id"]: {"location": "unknown", "inventory": [], "relationships": {}, "status": "alive"} for c in chars}
    return state


def voice_check(scene: str, chars: list) -> list[dict]:
    """Rule-based voice check: verify each character's dialogue matches their voice contract.

    Returns a list of issues: [{"character": name, "issue": str, "severity": "warn|error"}].
    """
    issues = []
    lines = scene.splitlines()
    char_names = {c["name"]: c for c in chars}
    for line in lines:
        for name, c in char_names.items():
            contract = c.get("voice_contract", {})
            forbidden = contract.get("forbidden_words", [])
            # only check lines where this character speaks (name appears before a quote)
            idx = line.lower().find(name.lower())
            if idx < 0:
                continue
            # find the first quote after the character name
            quote_start = line.find('"', idx)
            if quote_start < 0:
                continue
            # extract the quoted speech
            quote_end = line.find('"', quote_start + 1)
            if quote_end < 0:
                quote_end = len(line)
            speech = line[quote_start + 1:quote_end]
            if not speech.strip():
                continue
            # check forbidden words in the quoted speech only
            speech_lower = speech.lower()
            for fw in forbidden:
                if fw.lower() in speech_lower:
                    issues.append({"character": name, "issue": f"forbidden word '{fw}' in dialogue", "severity": "warn"})
            # check sentence length of the quoted speech
            wc = len(speech.split())
            sl = contract.get("sentence_length", "")
            if "short" in sl and wc > 25:
                issues.append({"character": name, "issue": f"sentence too long ({wc} words, contract says short)", "severity": "warn"})
            if "long" in sl and wc < 5:
                issues.append({"character": name, "issue": f"sentence too short ({wc} words, contract says long)", "severity": "warn"})
    # deduplicate
    seen = set()
    unique = []
    for iss in issues:
        key = (iss["character"], iss["issue"])
        if key not in seen:
            seen.add(key)
            unique.append(iss)
    return unique
    # deduplicate
    seen = set()
    unique = []
    for iss in issues:
        key = (iss["character"], iss["issue"])
        if key not in seen:
            seen.add(key)
            unique.append(iss)
    return unique


def npc_check(scene: str, npc_registry: dict) -> list[dict]:
    """Rule-based NPC consistency check: verify NPC dialogue matches registry voice tags/faction.

    For each NPC in the registry, checks if their name appears in the scene and
    whether their dialogue contains words inconsistent with their voice tags or faction.
    """
    issues = []
    scene_lower = scene.lower()
    for name, info in (npc_registry or {}).items():
        if name.lower() not in scene_lower:
            continue
        voice_tags = info.get("voice_tags", [])
        faction = info.get("faction", "")
        # check voice tags: if an NPC has a "formal" tag, flag informal words
        informal_markers = {"gonna", "yeah", "stuff", "kinda", "like", "dude", "bro"}
        formal_markers = {"therefore", "furthermore", "moreover", "indeed", "perhaps"}
        for tag in voice_tags:
            tag_lower = tag.lower()
            if tag_lower in ("formal", "noble", "educated"):
                for marker in informal_markers:
                    if marker in scene_lower and name.lower() in scene_lower:
                        idx = scene_lower.find(name.lower())
                        window = scene_lower[max(0, idx - 100):idx + 200]
                        if marker in window:
                            issues.append({"character": name, "issue": f"informal word '{marker}' used by formal NPC", "severity": "warn"})
            if tag_lower in ("rough", "street", "working-class", "crude"):
                for marker in formal_markers:
                    if marker in scene_lower and name.lower() in scene_lower:
                        idx = scene_lower.find(name.lower())
                        window = scene_lower[max(0, idx - 100):idx + 200]
                        if marker in window:
                            issues.append({"character": name, "issue": f"formal word '{marker}' used by rough NPC", "severity": "warn"})
        # check faction consistency: if NPC is in a faction, flag mentions of opposing faction loyalty
        if faction:
            opposing = {"Merchant Council": ["unmarked", "rebel"], "Wardens": ["unmarked", "smuggler"],
                        "Unmarked": ["warden", "council"]}
            for opp_word in opposing.get(faction, []):
                if opp_word in scene_lower and name.lower() in scene_lower:
                    idx = scene_lower.find(name.lower())
                    window = scene_lower[max(0, idx - 150):idx + 150]
                    if opp_word in window:
                        issues.append({"character": name, "issue": f"NPC of faction '{faction}' references opposing concept '{opp_word}'", "severity": "info"})
    # deduplicate
    seen = set()
    unique = []
    for iss in issues:
        key = (iss["character"], iss["issue"])
        if key not in seen:
            seen.add(key)
            unique.append(iss)
    return unique


def knowledge_check(scene: str, chars: list, knowledge: dict) -> list[dict]:
    """Rule-based knowledge-boundary check: flag characters referencing facts they shouldn't know."""
    issues = []
    scene_lower = scene.lower()
    for c in chars:
        cid = c["id"]
        cname = c["name"].lower()
        k = knowledge.get(cid, {})
        allowed = set(w.lower() for f in (k.get("known", []) + k.get("suspected", [])) for w in f.split() if len(w) > 4)
        for other in chars:
            if other["id"] == cid:
                continue
            for secret in other.get("secrets", []):
                for sw in [w for w in secret.lower().split() if len(w) > 4]:
                    if sw in scene_lower and cname in scene_lower and sw not in allowed:
                        idx = scene_lower.find(cname)
                        if idx >= 0:
                            window = scene_lower[max(0, idx - 200):idx + 200]
                            if sw in window:
                                issues.append({"character": c["name"], "issue": "may reference '" + sw + "' from " + other["name"] + "'s secrets (not in known/suspected)", "severity": "warn"})
    seen = set()
    unique = []
    for iss in issues:
        key = (iss["character"], iss["issue"])
        if key not in seen:
            seen.add(key)
            unique.append(iss)
    return unique



def apply_audit_extras(audit: dict):
    # Apply plot_threads, timeline, npc_updates from an auditor result to their JSON files.
    if not audit:
        return
    new_threads = audit.get("plot_threads") or []
    if new_threads:
        p = project_base() / "plot_threads.json"
        existing = json.loads(p.read_text(encoding="utf-8")) if p.exists() else []
        by_id = {t.get("id"): t for t in existing if t.get("id")}
        for t in new_threads:
            if t.get("id"):
                by_id[t["id"]] = t
        merged = list(by_id.values()) + [t for t in new_threads if not t.get("id")]
        atomic_write(p, json.dumps(merged, indent=2))
    te = audit.get("timeline_entry")
    if te:
        p = project_base() / "timeline.json"
        existing = json.loads(p.read_text(encoding="utf-8")) if p.exists() else []
        existing = [e for e in existing if e.get("scene") != te.get("scene")]
        existing.append(te)
        atomic_write(p, json.dumps(existing, indent=2))

    # character knowledge
    ku = audit.get("knowledge_updates") or {}
    if ku:
        p = project_base() / "character_knowledge.json"
        existing = json.loads(p.read_text(encoding="utf-8")) if p.exists() else {}
        for cid, upd in ku.items():
            if cid not in existing:
                existing[cid] = {"known": [], "suspected": [], "misconceptions": []}
            for fact in (upd.get("learned") or []):
                if fact not in existing[cid].setdefault("known", []):
                    existing[cid]["known"].append(fact)
            for fact in (upd.get("suspected") or []):
                if fact not in existing[cid].setdefault("suspected", []):
                    existing[cid]["suspected"].append(fact)
        atomic_write(p, json.dumps(existing, indent=2))

    npc_updates = audit.get("npc_updates") or []
    if npc_updates:
        p = project_base() / "npc_registry.json"
        existing = json.loads(p.read_text(encoding="utf-8")) if p.exists() else {}
        for npc in npc_updates:
            name = npc.get("name")
            if name:
                existing[name] = npc
        atomic_write(p, json.dumps(existing, indent=2))


def showrunner_prompt(lore: str, chars: list, state: dict, history: str, direction: str, brief: str = "",
                      feedback: str = "", npc_registry: dict = None, plot_threads: list = None,
                      timeline: list = None) -> list:
    # Strip private fields (secrets) so character knowledge stays isolated (§7.1/§10).
    safe_chars = [{k: v for k, v in c.items() if k not in ("secrets",)} for c in chars]
    char_block = json.dumps(safe_chars, indent=2)
    state_block = json.dumps(state, indent=2)
    npc_block = json.dumps(npc_registry or {}, indent=2) if npc_registry else "(none)"
    threads_block = json.dumps(plot_threads or [], indent=2) if plot_threads else "(none)"
    timeline_block = json.dumps((timeline or [])[-5:], indent=2) if timeline else "(none)"
    system = f"""You are the Showrunner of a novel. You write ONE scene at a time.

WORLD LORE:
{lore}

CHARACTERS (voice contracts - obey them strictly):
{char_block}

CURRENT CHARACTER STATE:
{state_block}

NPC REGISTRY (minor characters, factions, grudges):
{npc_block}

ACTIVE PLOT THREADS (mysteries, promises, foreshadowing, conflicts):
{threads_block}

RECENT TIMELINE (last 5 entries):
{timeline_block}

RULES:
- Write 600-800 words (soft target; dramatic purpose decides).
- Obey world lore and character voices. No purple prose. Short sentences.
- Characters know ONLY what their knowledge ledger says they know. Do not leak secrets.
- Violence has consequences. Magic drains stamina.
- End the scene at a decision point.
- Output format (strict):
  SCENE:
  <prose>

  CHOICES:
  1. <choice>
  2. <choice>
  3. <choice>
  (generate 3 to 5 choices that arise naturally from the scene's tension; always allow custom input)
"""
    brief_block = f"\nSCENE BRIEF (author constraints - obey strictly):\n{brief}\n" if brief.strip() else ""
    feedback_block = f"\nAUTHOR FEEDBACK ON RECENT SCENES (apply these lessons):\n{feedback}\n" if feedback.strip() else ""
    user = f"""RECENT STORY SO FAR (last scenes):
{history if history else "(none yet - this is scene 1)"}

DIRECTOR DIRECTION FOR THIS SCENE:
{direction}
{brief_block}
{feedback_block}
Write the scene now."""
    return [{"role": "system", "content": system}, {"role": "user", "content": user}]


def auditor_prompt(scene_text: str, chars: list) -> list:
    safe_chars = [{k: v for k, v in c.items() if k not in ("secrets",)} for c in chars]
    system = """You are a data extraction engine. Read the scene. Extract ONLY hard factual state changes.
If a change is ambiguous, flag it as UNCERTAIN. Do not infer. Do not interpret metaphor.
Output strict JSON only, no markdown fences, matching this schema:
{
  "events": [{"type": "action|dialogue|discovery|injury|item_gain|item_loss|relationship_change|location_change", "actor": "char_id or null", "summary": "short factual", "target": "char_id or null", "uncertain": false, "state_updates": {"char_id": {"location": "str or null", "inventory_add": [], "inventory_remove": [], "status": "str or null", "relationships": {"other_char_id": "str"}}}}],
  "characters_present": ["char_id"],
  "location": "str",
  "plot_threads": [{"id": "thread_id", "type": "mystery|promise|foreshadowing|conflict|object", "description": "short", "status": "open|resolved", "characters": ["char_id"], "introduced_scene": 1}],
  "timeline_entry": {"scene": 1, "date": "day 3", "duration": "1 hour", "location": "Salt Market", "characters_present": ["c1"]},
  "npc_updates": [{"name": "NPC Name", "voice_tags": ["gruff", "merchant"], "faction": "Merchant Council", "grudge": "none", "last_interaction_scene": 1}],
  "knowledge_updates": {"char_id": {"learned": ["fact the character now knows"], "suspected": ["fact they now suspect"]}}
}

Put state_updates INSIDE each event (per-event deltas). If an event has no state change, set "state_updates": {}. Do NOT use a top-level state_updates field."""
    user = f"CHARACTERS: {json.dumps(safe_chars)}\n\nSCENE:\n{scene_text}\n\nExtract now."
    return [{"role": "system", "content": system}, {"role": "user", "content": user}]


def parse_json_robust(text: str) -> dict:
    text = text.strip()
    # strip markdown fences
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    # brace-balancing search for the first valid JSON object containing expected keys
    best = None
    for start in (i for i, ch in enumerate(text) if ch == "{"):
        depth = 0
        for i in range(start, len(text)):
            if text[i] == "{":
                depth += 1
            elif text[i] == "}":
                depth -= 1
                if depth == 0:
                    candidate = text[start:i + 1]
                    try:
                        obj = json.loads(candidate)
                        if isinstance(obj, dict):
                            # prefer objects with known keys
                            if best is None or any(k in obj for k in ("proposals", "events", "scene", "error")):
                                best = obj
                                if any(k in obj for k in ("proposals", "events")):
                                    return best
                        break
                    except json.JSONDecodeError:
                        break
                    break
    if best is not None:
        return best
    raise json.JSONDecodeError("No valid JSON object found", text, 0)


def split_scene_and_choices(raw: str):
    # Split on CHOICES: marker
    m = re.search(r"SCENE:\s*(.*?)\n\s*CHOICES:\s*(.*)", raw, re.DOTALL | re.IGNORECASE)
    if m:
        scene = m.group(1).strip()
        choices_raw = m.group(2).strip()
    else:
        lines = raw.splitlines()
        cut = len(lines)
        for i in range(len(lines) - 1, -1, -1):
            if re.match(r"\s*\d+\.\s", lines[i]):
                cut = i
            else:
                if cut != len(lines):
                    break
        scene = "\n".join(lines[:cut]).strip()
        choices_raw = "\n".join(lines[cut:]).strip()
    choices = []
    for line in choices_raw.splitlines():
        line = line.strip()
        mm = re.match(r"(\d+)\.\s*(.+)", line)
        if mm:
            choices.append(mm.group(2).strip())
    scene = re.sub(r"^SCENE:\s*", "", scene, flags=re.IGNORECASE).strip()
    return scene, choices



def retrieve_relevant_scenes(direction: str, chars: list, n: int = 5) -> str:
    # Retrieve relevant past scenes: always include last 2 (recency) + top entity-matched older scenes.
    scenes = sorted(p for p in (project_base() / "scenes").glob("scene_*.md")
                    if re.match(r"scene_\d+\.md", p.name))
    if not scenes:
        return ""

    # extract keywords from direction + character names
    keywords = set()
    for word in re.findall(r"[a-zA-Z]{4,}", direction.lower()):
        keywords.add(word)
    for c in chars:
        keywords.add(c["name"].lower())
        for part in c["name"].split():
            if len(part) > 3:
                keywords.add(part.lower())

    # score each scene
    scored = []
    for p in scenes:
        text = p.read_text(encoding="utf-8").lower()
        score = sum(1 for kw in keywords if kw in text)
        num = int(re.match(r"scene_(\d+)\.md", p.name).group(1))
        score += num * 0.1  # small recency bias
        scored.append((score, num, p))

    # always include last 2 scenes (recency)
    recent = scenes[-2:] if len(scenes) >= 2 else list(scenes)
    selected = list(recent)
    selected_paths = {p.name for p in selected}

    # pick top entity-matched older scenes up to n total
    scored.sort(key=lambda x: -x[0])
    for score, num, p in scored:
        if len(selected) >= n:
            break
        if p.name not in selected_paths:
            selected.append(p)
            selected_paths.add(p.name)

    # sort by scene number for chronological order
    selected.sort(key=lambda p: int(re.match(r"scene_(\d+)\.md", p.name).group(1)))

    parts = []
    for p in selected:
        num = int(re.match(r"scene_(\d+)\.md", p.name).group(1))
        parts.append(f"--- Scene {num:02d} ---\n{p.read_text(encoding='utf-8')[:1200]}")
    return "\n\n".join(parts)


def apply_state_updates(state: dict, updates: dict):
    for cid, u in (updates or {}).items():
        if cid not in state:
            state[cid] = {"location": "unknown", "inventory": [], "relationships": {}, "status": "alive"}
        if u.get("location"):
            state[cid]["location"] = u["location"]
        if u.get("status"):
            state[cid]["status"] = u["status"]
        inv = state[cid].setdefault("inventory", [])
        for item in (u.get("inventory_add") or []):
            if item not in inv:
                inv.append(item)
        for item in (u.get("inventory_remove") or []):
            if item in inv:
                inv.remove(item)
        rels = state[cid].setdefault("relationships", {})
        for other, val in (u.get("relationships") or {}).items():
            rels[other] = val


def next_event_id() -> int:
    with EVENT_LOG_LOCK:
        ids = []
        p = project_base() / "events" / "event_log.jsonl"
        if p.exists():
            for line in p.read_text(encoding="utf-8").splitlines():
                line = line.strip()
                if not line:
                    continue
                try:
                    ids.append(int(json.loads(line).get("event_id", 0)))
                except (json.JSONDecodeError, ValueError, OSError):
                    pass
        return (max(ids) + 1) if ids else 1


def append_event(record: dict):
    """Append one record to event_log.jsonl under lock with fsync."""
    with EVENT_LOG_LOCK:
        p = project_base() / "events" / "event_log.jsonl"
        p.parent.mkdir(parents=True, exist_ok=True)
        line = json.dumps(record) + "\n"
        with p.open("a", encoding="utf-8") as f:
            f.write(line)
            f.flush()
            os.fsync(f.fileno())


def rebuild_state_from_events() -> dict:
    """Rebuild character_state.json from the append-only event log (§6.1/§9.3).

    Seeds state from characters.json, then applies events in event_id order,
    skipping any event whose event_id is in the nullified set (retcons).
    """
    chars = json.loads((project_base() / "characters.json").read_text(encoding="utf-8"))
    state = {c["id"]: {"location": "unknown", "inventory": [], "relationships": {}, "status": "alive"} for c in chars}

    p = project_base() / "events" / "event_log.jsonl"
    if not p.exists():
        return state

    events = []
    for line in p.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            events.append(json.loads(line))
        except json.JSONDecodeError:
            continue

    nullified = {e.get("nullifies_event_id") for e in events
                 if e.get("type") == "retcon" and e.get("nullifies_event_id") is not None}

    for ev in sorted(events, key=lambda e: e.get("event_id", 0)):
        if ev.get("event_id") in nullified:
            continue
        if ev.get("type") == "retcon":
            continue
        # Minimal projection: apply location/status/inventory/relationship hints from summary is not
        # automatic; the State Auditor's state_updates are the source. For rebuild we re-apply
        # stored state_updates if present on the event record.
        for cid, u in (ev.get("state_updates") or {}).items():
            if cid not in state:
                state[cid] = {"location": "unknown", "inventory": [], "relationships": {}, "status": "alive"}
            if u.get("location"):
                state[cid]["location"] = u["location"]
            if u.get("status"):
                state[cid]["status"] = u["status"]
            inv = state[cid].setdefault("inventory", [])
            for item in (u.get("inventory_add") or []):
                if item not in inv:
                    inv.append(item)
            for item in (u.get("inventory_remove") or []):
                if item in inv:
                    inv.remove(item)
            rels = state[cid].setdefault("relationships", {})
            for other, val in (u.get("relationships") or {}).items():
                rels[other] = val
    return state


def main():
    lore = (project_base() / "world_lore.md").read_text(encoding="utf-8")
    chars = json.loads((project_base() / "characters.json").read_text(encoding="utf-8"))
    state = load_state()

    print("=" * 60)
    print("NOVEL STUDIO - Phase 0 (terminal)")
    print("=" * 60)
    print(f"Model: {CONFIG['showrunner_model']}")
    print(f"API key: {'set' if API_KEY else 'MISSING - set OPENROUTER_API_KEY'}")
    print()

    while True:
        n = next_scene_number()
        print(f"\n--- Generating Scene {n:02d} ---")
        suggested = ""
        lc = project_base() / ".last_choice.txt"
        if lc.exists():
            suggested = lc.read_text(encoding="utf-8").strip()
        prompt = "Director direction"
        if suggested:
            prompt += f" [Enter = '{suggested[:60]}']"
        prompt += ": "
        direction = input(prompt).strip()
        if not direction:
            direction = suggested if suggested else "Continue the story naturally from where it left off."
        brief = input("Scene brief (optional constraints, or Enter to skip): ").strip()

        npc_registry = json.loads((project_base() / "npc_registry.json").read_text(encoding="utf-8")) if (project_base() / "npc_registry.json").exists() else {}
        plot_threads = json.loads((project_base() / "plot_threads.json").read_text(encoding="utf-8")) if (project_base() / "plot_threads.json").exists() else []
        timeline = json.loads((project_base() / "timeline.json").read_text(encoding="utf-8")) if (project_base() / "timeline.json").exists() else []

        history = retrieve_relevant_scenes(direction, chars, 5)
        msgs = showrunner_prompt(lore, chars, state, history, direction, brief, recent_feedback(5),
                                 npc_registry, plot_threads, timeline)
        print("Calling Showrunner...")
        try:
            raw = llm_call(CONFIG["showrunner_model"], msgs, CONFIG["max_tokens_showrunner"], CONFIG["temperature"], scene_ref=n)
        except Exception as e:  # broad: provider/parse failure -> log and skip scene
            print(f"ERROR: {e}")
            continue

        scene, choices = split_scene_and_choices(raw)
        print("\n" + "=" * 60)
        print(scene)
        print("=" * 60)

        # State Auditor
        print("\nRunning State Auditor...")
        audit = None
        try:
            a_raw = llm_call(CONFIG["auditor_model"], auditor_prompt(scene, chars), CONFIG["max_tokens_auditor"], 0.2, scene_ref=n, json_mode=True)
            audit = parse_json_robust(a_raw)
        except Exception as e:  # broad: auditor/parse failure -> skip state update
            print(f"Auditor failed: {e}. State not updated this scene.")

        # Save scene
        scene_path = project_base() / "scenes" / f"scene_{n:02d}.md"
        atomic_write(scene_path, scene)
        save_snapshot(n, scene)
        meta = {
            "scene": n,
            "hash": sha256_file(scene_path),
            "status": "accepted",
            "characters_present": (audit or {}).get("characters_present", []),
            "location": (audit or {}).get("location"),
            "events": (audit or {}).get("events", []),
            "choices": choices,
        }
        atomic_write(project_base() / "scenes" / f"scene_{n:02d}_meta.json", json.dumps(meta, indent=2))

        # Append events (with monotonic event_id; store per-event state_updates for rebuildability)
        scene_level_updates = (audit or {}).get("state_updates", {}) or {}
        for ev in (audit or {}).get("events", []):
            ev_su = ev.get("state_updates")
            if ev_su is None:
                ev_su = scene_level_updates
            ev_record = {"event_id": next_event_id(), "scene": n, "ts": datetime.now(timezone.utc).isoformat(), **ev}
            ev_record["state_updates"] = ev_su if isinstance(ev_su, dict) else {}
            append_event(ev_record)

        # Apply state updates (per-event, with scene-level fallback for old auditor output)
        if audit:
            applied_any = False
            for ev in (audit or {}).get("events", []):
                su = ev.get("state_updates")
                if su is None:
                    su = (audit or {}).get("state_updates", {}) or {}
                if isinstance(su, dict) and su:
                    apply_state_updates(state, su)
                    applied_any = True
            if not applied_any and (audit or {}).get("state_updates"):
                apply_state_updates(state, audit["state_updates"])
                applied_any = True
            if applied_any:
                atomic_write(project_base() / "character_state.json", json.dumps(state, indent=2))
            apply_audit_extras(audit)
            # Phase 3: voice + knowledge + NPC checks (rule-based, no LLM)
            v_issues = voice_check(scene, chars)
            k_path = project_base() / "character_knowledge.json"
            knowledge = json.loads(k_path.read_text(encoding="utf-8")) if k_path.exists() else {}
            k_issues = knowledge_check(scene, chars, knowledge)
            npc_path = project_base() / "npc_registry.json"
            npc_reg = json.loads(npc_path.read_text(encoding="utf-8")) if npc_path.exists() else {}
            n_issues = npc_check(scene, npc_reg)
            all_issues = v_issues + k_issues + n_issues
            if all_issues:
                print("  Checks:")
                for iss in all_issues:
                    print(f"    [{iss['severity']}] {iss['character']}: {iss['issue']}")

        # Print choices
        print("\nCHOICES:")
        for i, c in enumerate(choices, 1):
            print(f"  {i}. {c}")
        print("  (or type your own direction)")

        # Wait for input for NEXT scene
        ans = input("\nYour choice for next scene (number or text, 'q' to quit): ").strip()
        if ans.lower() in ("q", "quit", "exit"):
            print("Saved. Goodbye.")
            break
        # store chosen direction by writing a tiny pending file? Just keep in loop variable via re-prompt next iteration.
        # We'll pass direction via env-ish: write to a pending file.
        if ans.isdigit() and 1 <= int(ans) <= len(choices):
            chosen = choices[int(ans) - 1]
        else:
            chosen = ans if ans else "Continue the story naturally."
        # Save chosen direction as next default by appending to a scratch file (optional)
        (project_base() / ".last_choice.txt").write_text(chosen, encoding="utf-8")


def reconciler_prompt(original: str, edited: str, chars: list, events: list) -> list:
    safe_chars = [{k: v for k, v in c.items() if k not in ("secrets",)} for c in chars]
    orig_short = original[:1200]
    edited_short = edited[:1200]
    events_short = json.dumps(events[:10])[:800]
    system = "You are a JSON-only API. Compare two versions of a scene. Output ONLY a valid JSON object. No analysis, no explanation, no markdown. Just JSON."
    system += "\nSchema: {\"summary\":\"...\",\"passages_changed\":[\"...\"],\"affected_events\":[104],\"proposals\":[{\"proposal_id\":\"p1\",\"op\":\"nullify\",\"target_event_id\":104,\"description\":\"...\",\"confidence\":0.9,\"auto_safe\":false,\"downstream_entities\":[\"key\"]}],\"downstream_entities\":[\"key\"]}"
    system += "\nops: add|modify|remove|nullify. auto_safe=true only for spelling/grammar rewording. Be conservative."
    user = "CHARACTERS: " + json.dumps(safe_chars) + "\n\nORIGINAL:\n" + orig_short + "\n\nEDITED:\n" + edited_short + "\n\nEVENTS: " + events_short + "\n\nOutput JSON now."
    return [{"role": "system", "content": system}, {"role": "user", "content": user}]


def find_fact_support(entity: str) -> list[dict]:
    """Return event-log entries + source scenes that support a given fact/entity."""
    results = []
    p = project_base() / "events" / "event_log.jsonl"
    if not p.exists():
        return results
    for line in p.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            ev = json.loads(line)
        except json.JSONDecodeError:
            continue
        if ev.get("type") == "retcon":
            continue
        summary = (ev.get("summary") or "").lower()
        if entity.lower() in summary:
            results.append({
                "event_id": ev.get("event_id"),
                "scene": ev.get("scene"),
                "type": ev.get("type"),
                "summary": ev.get("summary"),
                "source_scene_file": f"scene_{ev.get('scene', 0):02d}.md" if ev.get("scene") else None,
                "nullified": ev.get("event_id") in _nullified_ids(),
            })
    return results


def _nullified_ids() -> set:
    ids = set()
    p = project_base() / "events" / "event_log.jsonl"
    if not p.exists():
        return ids
    for line in p.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            ev = json.loads(line)
        except json.JSONDecodeError:
            continue
        if ev.get("type") == "retcon" and ev.get("nullifies_event_id") is not None:
            ids.add(ev["nullifies_event_id"])
    return ids


def flag_downstream(entities: list[str], after_scene: int | None = None) -> list[str]:
    result = []
    scenes = sorted(p for p in (project_base() / "scenes").glob("scene_*.md")
                    if re.match(r"scene_\d+\.md", p.name))
    for p in scenes:
        m = re.match(r"scene_(\d+)\.md", p.name)
        if not m:
            continue
        num = int(m.group(1))
        if after_scene is not None and num <= after_scene:
            continue
        text = p.read_text(encoding="utf-8").lower()
        # also check event summaries for that scene
        meta_path = project_base() / "scenes" / f"scene_{num:02d}_meta.json"
        extra = ""
        if meta_path.exists():
            try:
                meta = json.loads(meta_path.read_text(encoding="utf-8"))
                for ev in (meta.get("events") or []):
                    extra += " " + (ev.get("summary") or "")
            except (json.JSONDecodeError, OSError):
                pass
        haystack = (text + " " + extra).lower()
        if any(e.lower() in haystack for e in entities if e):
            result.append(p.name)
    return result


def scan_for_edits() -> list[int]:
    dirty = []
    for p in sorted((project_base() / "scenes").glob("scene_*_meta.json")):
        m = re.match(r"scene_(\d+)_meta\.json", p.name)
        if not m:
            continue
        n = int(m.group(1))
        if detect_edit(n):
            dirty.append(n)
    return dirty


def reconcile_scene(n: int) -> dict | None:
    """Generate reconciliation proposals for an edited (dirty) scene.

    Returns a dict with summary, passages_changed, affected_events, proposals,
    downstream_entities, downstream_scenes. Returns None if no snapshot/original.
    """
    scene_path = project_base() / "scenes" / f"scene_{n:02d}.md"
    snap = snapshot_path(n)
    meta_path = project_base() / "scenes" / f"scene_{n:02d}_meta.json"
    if not scene_path.exists() or not snap.exists() or not meta_path.exists():
        return None
    original = snap.read_text(encoding="utf-8")
    edited = scene_path.read_text(encoding="utf-8")
    if original.strip() == edited.strip():
        # no actual change; clear dirty
        try:
            meta = json.loads(meta_path.read_text(encoding="utf-8"))
            meta["status"] = "accepted"
            meta["hash"] = sha256_file(scene_path)
            atomic_write(meta_path, json.dumps(meta, indent=2))
            save_snapshot(n, edited)
        except (json.JSONDecodeError, OSError):
            pass
        return None
    meta = json.loads(meta_path.read_text(encoding="utf-8"))
    chars = json.loads((project_base() / "characters.json").read_text(encoding="utf-8"))
    # Prefer events from the event log (which have event_ids) over meta.events (legacy)
    events = []
    log_path = project_base() / "events" / "event_log.jsonl"
    if log_path.exists():
        for line in log_path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line:
                continue
            try:
                ev = json.loads(line)
                if ev.get("scene") == n:
                    events.append(ev)
            except json.JSONDecodeError:
                continue
    if not events:
        events = meta.get("events", []) or []
    try:
        raw = llm_call(CONFIG["auditor_model"], reconciler_prompt(original, edited, chars, events),
                       CONFIG["max_tokens_auditor"], 0.2, json_mode=True)
        data = parse_json_robust(raw)
    except Exception as e:  # broad: reconciler/auditor failure -> report, don't crash
        return {"error": str(e)}
    entities = data.get("downstream_entities", []) or []
    downstream = flag_downstream(entities, after_scene=n)
    data["downstream_scenes"] = downstream
    data["scene"] = n
    return data


def apply_proposals(proposals: list[dict]) -> int:
    """Apply accepted proposals: append retcons/new events. Returns count applied."""
    applied = 0
    valid_ids = set()
    pp = project_base() / "events" / "event_log.jsonl"
    if pp.exists():
        for line in pp.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line:
                continue
            try:
                valid_ids.add(int(json.loads(line).get("event_id", 0)))
            except (json.JSONDecodeError, ValueError, OSError):
                pass
    for prop in proposals:
        op = prop.get("op")
        tid = prop.get("target_event_id")
        if op in ("nullify", "modify", "remove") and tid is not None:
            if tid not in valid_ids:
                continue
            rec = {
                "event_id": next_event_id(),
                "scene": prop.get("scene"),
                "ts": datetime.now(timezone.utc).isoformat(),
                "type": "retcon",
                "actor": None,
                "target": None,
                "summary": prop.get("description", "retcon"),
                "uncertain": False,
                "nullifies_event_id": tid,
                "reason": prop.get("reason", "author_edit"),
            }
            append_event(rec)
            applied += 1
        elif op == "add":
            rec = {
                "event_id": next_event_id(),
                "scene": prop.get("scene"),
                "ts": datetime.now(timezone.utc).isoformat(),
                "type": "action",
                "actor": None,
                "target": None,
                "summary": prop.get("description", "added by author edit"),
                "uncertain": False,
                "nullifies_event_id": None,
                "reason": prop.get("reason", "author_edit"),
            }
            append_event(rec)
            applied += 1
    return applied


def apply_reconciliation(proposals: list[dict], scene: int | None = None,
                        downstream_entities: list[str] | None = None) -> dict:
    """Apply accepted proposals: append retcons, rebuild state, refresh snapshot/hash.

    Returns {applied, rebuilt, flagged_scenes}.
    """
    accepted = [p for p in proposals if p.get("accepted", True)]
    applied = apply_proposals([{**p, "scene": scene} for p in accepted])
    new_state = rebuild_state_from_events()
    atomic_write(project_base() / "character_state.json", json.dumps(new_state, indent=2))
    # clear dirty + update hash/snapshot for the reconciled scene
    if scene is not None:
        sp = project_base() / "scenes" / ("scene_%02d.md" % scene)
        mp = project_base() / "scenes" / ("scene_%02d_meta.json" % scene)
        if sp.exists() and mp.exists():
            try:
                meta = json.loads(mp.read_text(encoding="utf-8"))
                meta["status"] = "reconciled"
                meta["hash"] = sha256_file(sp)
                atomic_write(mp, json.dumps(meta, indent=2))
                save_snapshot(scene, sp.read_text(encoding="utf-8"))
            except (json.JSONDecodeError, OSError, ValueError):
                pass
    entities = downstream_entities or []
    for p in accepted:
        entities = entities + (p.get("downstream_entities") or [])
    flagged = flag_downstream(entities, after_scene=scene) if entities else []
    return {"applied": applied, "rebuilt": True, "flagged_scenes": flagged}


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\\nInterrupted. State saved up to last accepted scene.")
        sys.exit(0)
