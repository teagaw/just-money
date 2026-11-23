#!/usr/bin/env python3
"""Phase 0 walking skeleton: AI novel co-writing studio (terminal only).

Loop: read lore + chars -> Showrunner generates scene -> State Auditor extracts
events -> update state -> print choices -> wait for input -> repeat.

Author authority: your edits to scene files win. (Reconciliation is Phase 1.)
"""
import hashlib
import json
import os
import shutil
import stat
import re
import threading
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


def kb_path(key: str) -> Path:
    """Resolve a knowledge-base path, preferring kb/ layout, falling back to flat."""
    base = project_base()
    kb = base / "kb"
    mapping = {
        "lore": ("world/lore.md", "world_lore.md"),
        "characters": ("characters/profiles.json", "characters.json"),
        "state": ("characters/state.json", "character_state.json"),
        "npc_registry": ("characters/npc_registry.json", "npc_registry.json"),
        "plot_threads": ("world/plot_threads.json", "plot_threads.json"),
        "timeline": ("timeline/chronology.json", "timeline.json"),
        "skills": ("styles", "skills"),
        "events": ("events", "events"),
        "scenes": ("scenes", "scenes"),
        "usage_log": ("usage_log.jsonl", "usage_log.jsonl"),
        "character_knowledge": ("characters/knowledge.json", "character_knowledge.json"),
        "last_choice": (".last_choice.txt", ".last_choice.txt"),
    }
    if key in mapping:
        new_rel, old_rel = mapping[key]
        new_p = kb / new_rel
        old_p = base / old_rel
        if new_p.exists():
            return new_p
        if old_p.exists():
            return old_p
        return new_p
    return base / key


STRUCTURE_LOCK = threading.Lock()


def list_projects() -> list[str]:
    pd = _projects_dir()
    if not pd.exists():
        return []
    return sorted(p.name for p in pd.iterdir() if p.is_dir())


_SCENE_FILE_RE = re.compile(r"^scene_(\d+)\.md$")


def project_summaries() -> list[dict]:
    """Return per-project summary dicts for the home page launcher."""
    pd = _projects_dir()
    if not pd.exists():
        return []
    out = []
    for p in pd.iterdir():
        if not p.is_dir():
            continue
        # read project config (graceful defaults)
        genre = ""
        subgenre = ""
        language = "en"
        cfg_path = p / "project_config.json"
        if cfg_path.exists():
            try:
                cfg = json.loads(cfg_path.read_text(encoding="utf-8"))
                if isinstance(cfg, dict):
                    g = cfg.get("genre", "")
                    genre = g if isinstance(g, str) else ("" if g is None else str(g))
                    sg = cfg.get("subgenre", "")
                    subgenre = sg if isinstance(sg, str) else ("" if sg is None else str(sg))
                    lang = cfg.get("language", "en")
                    language = lang if isinstance(lang, str) and lang else "en"
            except (json.JSONDecodeError, OSError, ValueError):
                pass
        # collect scene files matching ^scene_<n>.md$
        scene_entries = []
        scenes_dir = p / "scenes"
        if scenes_dir.exists() and scenes_dir.is_dir():
            for f in scenes_dir.iterdir():
                m = _SCENE_FILE_RE.match(f.name)
                if m and f.is_file():
                    try:
                        mt = f.stat().st_mtime
                    except OSError:
                        mt = 0.0
                    scene_entries.append((int(m.group(1)), f, mt))
        scene_count = len(scene_entries)
        if scene_entries:
            newest = max(scene_entries, key=lambda e: e[2])
            try:
                last_modified = datetime.fromtimestamp(
                    newest[2], tz=timezone.utc).isoformat()
            except (OSError, ValueError, OverflowError):
                last_modified = datetime.now(timezone.utc).isoformat()
            highest = max(scene_entries, key=lambda e: e[0])
            try:
                text = highest[1].read_text(encoding="utf-8")
            except (OSError, UnicodeDecodeError):
                text = ""
            last_scene_preview = text[:80]
        else:
            try:
                last_modified = datetime.fromtimestamp(p.stat().st_mtime, tz=timezone.utc).isoformat()
            except (OSError, ValueError, OverflowError):
                last_modified = datetime.now(timezone.utc).isoformat()
            last_scene_preview = ""
        out.append({
            "name": p.name,
            "genre": genre,
            "subgenre": subgenre,
            "language": language,
            "scene_count": scene_count,
            "last_modified": last_modified,
            "last_scene_preview": last_scene_preview,
        })
    # sort by last_modified desc, then name asc for deterministic ties
    out.sort(key=lambda d: d["name"])
    out.sort(key=lambda d: d["last_modified"], reverse=True)
    return out


def project_language() -> str:
    # Return the language code for the active project (default en).
    base = project_base()
    cfg_path = base / "project_config.json"
    if cfg_path.exists():
        try:
            cfg = json.loads(cfg_path.read_text(encoding="utf-8"))
            return cfg.get("language", "en")
        except Exception:
            pass
    return "en"


def project_genre() -> str:
    base = project_base()
    cfg_path = base / "project_config.json"
    if cfg_path.exists():
        try:
            cfg = json.loads(cfg_path.read_text(encoding="utf-8"))
            return cfg.get("genre", "")
        except Exception:
            pass
    return ""


def project_subgenre() -> str:
    base = project_base()
    cfg_path = base / "project_config.json"
    if cfg_path.exists():
        try:
            cfg = json.loads(cfg_path.read_text(encoding="utf-8"))
            return cfg.get("subgenre", "")
        except Exception:
            pass
    return ""


def genre_style_rules(genre: str, subgenre: str = "") -> str:
    genres_path = BASE / "genres.json"
    if not genres_path.exists():
        return ""
    try:
        genres = json.loads(genres_path.read_text(encoding="utf-8"))
    except Exception:
        return ""
    g = genres.get(genre)
    if not g:
        return ""
    rules = g.get("style_rules", "")
    if subgenre:
        rules = rules + " (Subgenre: " + subgenre + ")"
    return rules


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


def create_project(name: str, language: str = "en", genre: str = "", subgenre: str = "",
                   premise: str = "", characters=None, lore: str = "",
                   pov: str = "", tense: str = "", tone: str = "", samples: str = "") -> bool:
    name = name.strip() if isinstance(name, str) else ""
    if not name or "/" in name or "\\" in name or ".." in name:
        return False
    # normalize optional inputs
    if premise is None:
        premise = ""
    elif not isinstance(premise, str):
        premise = str(premise)
    if lore is None:
        lore = ""
    elif not isinstance(lore, str):
        lore = str(lore)
    if characters is None:
        characters = []
    if not isinstance(characters, list):
        characters = []
    # reject duplicate (non-empty) character names
    seen_names = set()
    for c in characters:
        cname = c.get("name") if isinstance(c, dict) else ""
        if not isinstance(cname, str):
            cname = "" if cname is None else str(cname)
        if cname and cname in seen_names:
            return False
        if cname:
            seen_names.add(cname)
    pd = _projects_dir()
    p = pd / name
    if p.exists():
        return False
    p.mkdir(parents=True)
    (p / "scenes").mkdir()
    (p / "events").mkdir()
    (p / "kb" / "styles").mkdir(parents=True, exist_ok=True)
    (p / "kb" / "characters").mkdir(parents=True, exist_ok=True)
    (p / "kb" / "world").mkdir(parents=True, exist_ok=True)
    (p / "kb" / "timeline").mkdir(parents=True, exist_ok=True)
    # create default structure.json
    import json as _json
    default_struct = {"active_part_id": "part_1", "active_chapter_id": "ch_1",
                      "parts": [{"id": "part_1", "name": "Part 1", "chapters": [
                          {"id": "ch_1", "name": "Chapter 1", "scenes": [], "summary": ""}]}]}
    (p / "structure.json").write_text(_json.dumps(default_struct, indent=2), encoding="utf-8")
    # world_lore.md: premise (if any) + lore (if any); else template
    body_parts = []
    if premise.strip():
        body_parts.append(premise.strip())
    if lore.strip():
        body_parts.append(lore.strip())
    if body_parts:
        lore_text = "# World Lore\n\n" + "\n\n".join(body_parts) + "\n"
    else:
        lore_text = "# World Lore\n\n(describe your world here)\n"
    (p / "world_lore.md").write_text(lore_text, encoding="utf-8")
    # characters.json with generated ids (c1, c2, ...)
    built_chars = []
    for i, c in enumerate(characters, start=1):
        src = c if isinstance(c, dict) else {}
        def _s(key):
            v = src.get(key, "")
            if v is None:
                return ""
            return v if isinstance(v, str) else str(v)
        def _l(key):
            v = src.get(key, [])
            return v if isinstance(v, list) else []
        def _d(key):
            v = src.get(key, {})
            return v if isinstance(v, dict) else {}
        built_chars.append({
            "id": "c%d" % i,
            "name": _s("name"),
            "role": _s("role"),
            "voice": _s("voice"),
            "voice_contract": _d("voice_contract"),
            "secrets": _l("secrets"),
            "goals": _l("goals"),
            "speech_quirks": _l("speech_quirks"),
        })
    (p / "characters.json").write_text(json.dumps(built_chars, indent=2), encoding="utf-8")
    (p / "character_state.json").write_text("{}", encoding="utf-8")
    (p / "npc_registry.json").write_text("{}", encoding="utf-8")
    (p / "plot_threads.json").write_text("[]", encoding="utf-8")
    (p / "timeline.json").write_text("[]", encoding="utf-8")
    (p / "project_config.json").write_text(json.dumps({"language": language, "genre": genre, "subgenre": subgenre, "premise": premise, "pov": pov, "tense": tense, "tone": tone}, indent=2), encoding="utf-8")
    # generate AGENTS.md
    agents_md = f"# {name}\n\nLanguage: {language}\n"
    if genre:
        agents_md += f"Genre: {genre}" + (f" / {subgenre}" if subgenre else "") + "\n"
    if pov: agents_md += f"POV: {pov}\n"
    if tense: agents_md += f"Tense: {tense}\n"
    if tone: agents_md += f"Tone: {tone}\n"
    if premise: agents_md += f"\nPremise: {premise}\n"
    (p / "AGENTS.md").write_text(agents_md, encoding="utf-8")
    if samples and samples.strip():
        create_style_from_samples(f"{name} voice", [samples])
    return True


def delete_project(name: str) -> bool:
    """Delete a novel project (cannot delete the last/active one without switching first)."""
    name = name.strip()
    if not name or "/" in name or "\\" in name or ".." in name:
        return False
    pd = _projects_dir()
    p = pd / name
    if not p.exists() or not p.is_dir():
        return False
    # don't delete if it's the only project
    projects = [d for d in pd.iterdir() if d.is_dir()]
    if len(projects) <= 1:
        return False
    import shutil
    shutil.rmtree(p)
    # if deleted the active project, switch to first remaining
    if active_project_name() == name:
        remaining = sorted(d.name for d in pd.iterdir() if d.is_dir())
        if remaining:
            switch_project(remaining[0])
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
    with (kb_path("usage_log")).open("a", encoding="utf-8") as f:
        f.write(json.dumps(entry) + "\n")


def next_scene_number() -> int:
    nums = []
    for p in (kb_path("scenes")).glob("scene_*.md"):
        m = re.match(r"scene_(\d+)\.md", p.name)
        if m and not p.name.endswith("_meta.json"):
            nums.append(int(m.group(1)))
    return (max(nums) + 1) if nums else 1


def snapshot_path(n: int) -> Path:
    return kb_path("scenes") / f"scene_{n:02d}_snapshot.md"


def save_snapshot(n: int, scene_text: str):
    atomic_write(snapshot_path(n), scene_text)



def git_commit_scene(n: int, message: str = None):
    import subprocess
    base = project_base()
    if not (base / ".git").exists():
        return
    if message is None:
        message = "scene %02d: accepted" % n
    try:
        subprocess.run(["git", "-C", str(base), "add", "-A"], capture_output=True, timeout=30)
        subprocess.run(["git", "-C", str(base), "commit", "-m", message], capture_output=True, timeout=30)
    except Exception:
        pass



def feedback_path(n: int) -> Path:
    return kb_path("scenes") / f"scene_{n:02d}_feedback.json"


def save_feedback(n: int, rating: int, text: str):
    atomic_write(feedback_path(n), json.dumps({"scene": n, "rating": rating, "feedback": text,
                                             "ts": datetime.now(timezone.utc).isoformat()}, indent=2))


def recent_feedback(n: int = 5) -> str:
    out = []
    for p in sorted((kb_path("scenes")).glob("scene_*_feedback.json")):
        try:
            d = json.loads(p.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            continue
        out.append(f"Scene {d.get('scene')}: rating {d.get('rating')}/10 - {d.get('feedback','')}")
    return "\n".join(out[-n:])


def detect_edit(n: int) -> bool:
    """Compare current scene file hash to stored hash. Returns True if edited (dirty)."""
    scene_path = kb_path("scenes") / f"scene_{n:02d}.md"
    meta_path = kb_path("scenes") / f"scene_{n:02d}_meta.json"
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
    p = kb_path("state")
    if p.exists():
        return json.loads(p.read_text(encoding="utf-8"))
    # seed from characters.json
    cp = kb_path("characters")
    chars = json.loads(cp.read_text(encoding="utf-8")) if cp.exists() else []
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
        p = kb_path("plot_threads")
        existing = json.loads(p.read_text(encoding="utf-8")) if p.exists() else []
        by_id = {t.get("id"): t for t in existing if t.get("id")}
        for t in new_threads:
            if t.get("id"):
                by_id[t["id"]] = t
        merged = list(by_id.values()) + [t for t in new_threads if not t.get("id")]
        atomic_write(p, json.dumps(merged, indent=2))
    te = audit.get("timeline_entry")
    if te:
        p = kb_path("timeline")
        existing = json.loads(p.read_text(encoding="utf-8")) if p.exists() else []
        existing = [e for e in existing if e.get("scene") != te.get("scene")]
        existing.append(te)
        atomic_write(p, json.dumps(existing, indent=2))

    # character knowledge
    ku = audit.get("knowledge_updates") or {}
    if ku:
        p = kb_path("character_knowledge")
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
        p = kb_path("npc_registry")
        existing = json.loads(p.read_text(encoding="utf-8")) if p.exists() else {}
        for npc in npc_updates:
            name = npc.get("name")
            if name:
                existing[name] = npc
        atomic_write(p, json.dumps(existing, indent=2))


def showrunner_prompt(lore: str, chars: list, state: dict, history: str, direction: str, brief: str = "",
                      feedback: str = "", npc_registry: dict = None, plot_threads: list = None,
                      timeline: list = None, language: str = "en", genre: str = "",
                      subgenre: str = "", skills_block: str = "", feedback_constraints: str = "") -> list:
    # Strip private fields (secrets) so character knowledge stays isolated (§7.1/§10).
    safe_chars = [{k: v for k, v in c.items() if k not in ("secrets",)} for c in chars]
    char_block = json.dumps(safe_chars, indent=2)
    state_block = json.dumps(state, indent=2)
    npc_block = json.dumps(npc_registry or {}, indent=2) if npc_registry else "(none)"
    threads_block = json.dumps(plot_threads or [], indent=2) if plot_threads else "(none)"
    timeline_block = json.dumps((timeline or [])[-5:], indent=2) if timeline else "(none)"
    if language == "ar-eg":
        lang_directive = ("LANGUAGE: Write ALL prose, dialogue, choices, and summaries in Egyptian Arabic (عامية مصرية). "
                          "Use colloquial Egyptian dialect, NOT formal Arabic (فصحى). "
                          "Characters speak naturally in Egyptian vernacular. "
                          "Narration can be slightly more formal but still accessible. "
                          "Do NOT use Gulf, Levantine, or Maghrebi dialect. Egyptian only.")
    else:
        lang_directive = "LANGUAGE: Write in English."
    style_rules = genre_style_rules(genre, subgenre)
    style_block = f"GENRE STYLE RULES ({genre}" + (f" / {subgenre}" if subgenre else "") + "):\n" + style_rules if style_rules else ""
    skills_block_full = skills_block if skills_block else ""
    feedback_block = f"FEEDBACK CONSTRAINTS (from reader ratings — address these):\n{feedback_constraints}" if feedback_constraints else ""
    system = f"""You are the Showrunner of a novel. You write ONE scene at a time.

{lang_directive}

{style_block}

{skills_block_full}

{feedback_block}

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


def auditor_prompt(scene_text: str, chars: list, language: str = "en") -> list:
    safe_chars = [{k: v for k, v in c.items() if k not in ("secrets",)} for c in chars]
    if language == "ar-eg":
        lang_note = "The scene is in Egyptian Arabic. Extract facts in Egyptian Arabic where applicable."
    else:
        lang_note = "The scene is in English."
    system = ("You are a data extraction engine. " + lang_note + " Read the scene. Extract ONLY hard factual state changes.\n" +
              'If a change is ambiguous, flag it as UNCERTAIN. Do not infer. Do not interpret metaphor.\n' +
              'Output strict JSON only, no markdown fences, matching this schema:\n' +
              '{\n' +
              '  "events": [{"type": "action|dialogue|discovery|injury|item_gain|item_loss|relationship_change|location_change", "actor": "char_id or null", "summary": "short factual", "target": "char_id or null", "uncertain": false, "state_updates": {"char_id": {"location": "str or null", "inventory_add": [], "inventory_remove": [], "status": "str or null", "relationships": {"other_char_id": "str"}}}}],\n' +
              '  "characters_present": ["char_id"],\n' +
              '  "location": "str",\n' +
              '  "plot_threads": [{"id": "thread_id", "type": "mystery|promise|foreshadowing|conflict|object", "description": "short", "status": "open|resolved", "characters": ["char_id"], "introduced_scene": 1}],\n' +
              '  "timeline_entry": {"scene": 1, "date": "day 3", "duration": "1 hour", "location": "Salt Market", "characters_present": ["c1"]},\n' +
              '  "npc_updates": [{"name": "NPC Name", "voice_tags": ["gruff", "merchant"], "faction": "Merchant Council", "grudge": "none", "last_interaction_scene": 1}],\n' +
              '  "knowledge_updates": {"char_id": {"learned": ["fact the character now knows"], "suspected": ["fact they now suspect"]}}\n' +
              '}\n\n' +
              'Put state_updates INSIDE each event (per-event deltas). If an event has no state change, set "state_updates": {}. Do NOT use a top-level state_updates field.')
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
    scenes = sorted(p for p in (kb_path("scenes")).glob("scene_*.md")
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
        p = kb_path("events") / "event_log.jsonl"
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
        p = kb_path("events") / "event_log.jsonl"
        p.parent.mkdir(parents=True, exist_ok=True)
        line = json.dumps(record) + "\n"
        with p.open("a", encoding="utf-8") as f:
            f.write(line)
            f.flush()
            os.fsync(f.fileno())


def rebuild_state_from_events() -> dict:
    """Rebuild character_state.json from the append-only event log (sec 6.1/9.3).

    Seeds state from characters.json, then applies events in event_id order,
    skipping any event whose event_id is in the nullified set (retcons).
    """
    _cp = kb_path("characters")
    chars = json.loads(_cp.read_text(encoding="utf-8")) if _cp.exists() else []
    state = {c["id"]: {"location": "unknown", "inventory": [], "relationships": {}, "status": "alive"} for c in chars}

    p = kb_path("events") / "event_log.jsonl"
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
    _lp = kb_path("lore")
    lore = _lp.read_text(encoding="utf-8") if _lp.exists() else ""
    _cp = kb_path("characters")
    chars = json.loads(_cp.read_text(encoding="utf-8")) if _cp.exists() else []
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
        lc = kb_path("last_choice")
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

        npc_registry = json.loads((kb_path("npc_registry")).read_text(encoding="utf-8")) if (kb_path("npc_registry")).exists() else {}
        plot_threads = json.loads((kb_path("plot_threads")).read_text(encoding="utf-8")) if (kb_path("plot_threads")).exists() else []
        timeline = json.loads((kb_path("timeline")).read_text(encoding="utf-8")) if (kb_path("timeline")).exists() else []
        language = project_language()
        genre = project_genre()
        subgenre = project_subgenre()

        history = retrieve_relevant_scenes(direction, chars, 5)
        msgs = showrunner_prompt(lore, chars, state, history, direction, brief, recent_feedback(5),
                                 npc_registry, plot_threads, timeline, language, genre, subgenre)
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
            a_raw = llm_call(CONFIG["auditor_model"], auditor_prompt(scene, chars, language), CONFIG["max_tokens_auditor"], 0.2, scene_ref=n, json_mode=True)
            audit = parse_json_robust(a_raw)
        except Exception as e:  # broad: auditor/parse failure -> skip state update
            print(f"Auditor failed: {e}. State not updated this scene.")

        # Save scene
        scene_path = kb_path("scenes") / f"scene_{n:02d}.md"
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
        atomic_write(kb_path("scenes") / f"scene_{n:02d}_meta.json", json.dumps(meta, indent=2))

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
                atomic_write(kb_path("state"), json.dumps(state, indent=2))
            apply_audit_extras(audit)
            # Phase 3: voice + knowledge + NPC checks (rule-based, no LLM)
            v_issues = voice_check(scene, chars)
            k_path = kb_path("character_knowledge")
            knowledge = json.loads(k_path.read_text(encoding="utf-8")) if k_path.exists() else {}
            k_issues = knowledge_check(scene, chars, knowledge)
            npc_path = kb_path("npc_registry")
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
        (kb_path("last_choice")).write_text(chosen, encoding="utf-8")


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
    p = kb_path("events") / "event_log.jsonl"
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
    p = kb_path("events") / "event_log.jsonl"
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
    scenes = sorted(p for p in (kb_path("scenes")).glob("scene_*.md")
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
        meta_path = kb_path("scenes") / f"scene_{num:02d}_meta.json"
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
    for p in sorted((kb_path("scenes")).glob("scene_*_meta.json")):
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
    scene_path = kb_path("scenes") / f"scene_{n:02d}.md"
    snap = snapshot_path(n)
    meta_path = kb_path("scenes") / f"scene_{n:02d}_meta.json"
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
    _cp = kb_path("characters")
    chars = json.loads(_cp.read_text(encoding="utf-8")) if _cp.exists() else []
    # Prefer events from the event log (which have event_ids) over meta.events (legacy)
    events = []
    log_path = kb_path("events") / "event_log.jsonl"
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
    pp = kb_path("events") / "event_log.jsonl"
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
    atomic_write(kb_path("state"), json.dumps(new_state, indent=2))
    # clear dirty + update hash/snapshot for the reconciled scene
    if scene is not None:
        sp = kb_path("scenes") / ("scene_%02d.md" % scene)
        mp = kb_path("scenes") / ("scene_%02d_meta.json" % scene)
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


def list_branches() -> list[str]:
    """List git branches in the current project."""
    import subprocess
    base = project_base()
    if not (base / ".git").exists():
        return ["main"]
    try:
        r = subprocess.run(["git", "-C", str(base), "branch", "--format=%(refname:short)"],
                           capture_output=True, text=True, timeout=10)
        branches = [b.strip() for b in r.stdout.splitlines() if b.strip()]
        return branches if branches else ["main"]
    except Exception:
        return ["main"]


def current_branch() -> str:
    import subprocess
    base = project_base()
    if not (base / ".git").exists():
        return "main"
    try:
        r = subprocess.run(["git", "-C", str(base), "branch", "--show-current"],
                           capture_output=True, text=True, timeout=10)
        return r.stdout.strip() or "main"
    except Exception:
        return "main"


def create_branch(name: str, from_scene: int = None) -> bool:
    """Create a new branch from the current state (or a specific scene)."""
    import subprocess
    base = project_base()
    if not (base / ".git").exists():
        return False
    name = name.strip()
    if not name or "/" in name or "\\" in name or ".." in name or " " in name:
        return False
    # check if branch already exists
    if name in list_branches():
        return False
    try:
        # create branch from current HEAD
        r = subprocess.run(["git", "-C", str(base), "checkout", "-b", name],
                           capture_output=True, text=True, timeout=10)
        if r.returncode != 0:
            return False
        # write branch metadata
        meta = {"name": name, "parent": None, "divergence_scene": from_scene,
                "created": __import__("datetime").datetime.now(__import__("datetime").timezone.utc).isoformat()}
        # try to get parent branch
        # (we just created from current, so parent is previous branch)
        atomic_write(base / "branch_meta.json", json.dumps(meta, indent=2))
        return True
    except Exception:
        return False


def switch_branch(name: str) -> bool:
    """Switch to an existing branch. Reloads project state from disk."""
    import subprocess
    base = project_base()
    if not (base / ".git").exists():
        return False
    if name not in list_branches():
        return False
    try:
        r = subprocess.run(["git", "-C", str(base), "checkout", name],
                           capture_output=True, text=True, timeout=10)
        return r.returncode == 0
    except Exception:
        return False


def delete_branch(name: str) -> bool:
    """Delete a branch (cannot delete current branch)."""
    import subprocess
    base = project_base()
    if not (base / ".git").exists():
        return False
    if name == current_branch():
        return False
    if name in ("main", "master"):
        return False
    try:
        r = subprocess.run(["git", "-C", str(base), "branch", "-D", name],
                           capture_output=True, text=True, timeout=10)
        return r.returncode == 0
    except Exception:
        return False


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\\nInterrupted. State saved up to last accepted scene.")
        sys.exit(0)
# Skills system



def skills_dir() -> "Path":

    return project_base() / "skills"





def list_skills() -> list:

    sd = skills_dir()

    if not sd.exists():

        return []

    out = []

    for p in sorted(sd.glob("*.md")):

        text = p.read_text(encoding="utf-8")

        meta = {"name": p.stem, "trigger": "", "active": True, "body": text}

        if text.startswith("---"):

            parts = text.split("---", 2)

            if len(parts) >= 3:

                for line in parts[1].strip().splitlines():

                    if ":" in line:

                        k, v = line.split(":", 1)

                        k = k.strip().lower()

                        v = v.strip()

                        if k == "name":

                            meta["name"] = v

                        elif k == "trigger":

                            meta["trigger"] = v

                        elif k == "active":

                            meta["active"] = v.lower() in ("true", "1", "yes")

                meta["body"] = parts[2].strip()

        out.append({"file": p.name, "name": meta["name"], "trigger": meta["trigger"],

                    "active": meta["active"], "body": meta["body"]})

    return out





def load_active_skills(context: str = "") -> list:

    skills = list_skills()

    active = []

    for s in skills:

        if not s["active"]:

            continue

        trigger = s["trigger"].lower()

        if not trigger or trigger == "always":

            active.append(s)

        elif context and trigger in context.lower():

            active.append(s)

    return active





def skills_prompt_block(context: str = "") -> str:

    skills = load_active_skills(context)

    if not skills:

        return ""

    parts = ["APPLICABLE WRITING/BRIEFING SKILLS (follow these):"]

    for s in skills:

        parts.append("\n--- Skill: " + s["name"] + " ---\n" + s["body"])

    return "\n".join(parts)





def save_skill(filename: str, name: str, trigger: str, active: bool, body: str):

    sd = skills_dir()

    sd.mkdir(parents=True, exist_ok=True)

    path = sd / filename

    content = "---\nname: " + name + "\ntrigger: " + trigger + "\nactive: " + str(active).lower() + "\n---\n\n" + body + "\n"

    atomic_write(path, content)





def delete_skill(filename: str) -> bool:

    p = skills_dir() / filename

    if p.exists():

        p.unlink()

        return True

    return False


# Skills system

def skills_dir() -> "Path":
    return project_base() / "skills"


def list_skills() -> list:
    sd = skills_dir()
    if not sd.exists():
        return []
    out = []
    for p in sorted(sd.glob("*.md")):
        text = p.read_text(encoding="utf-8")
        meta = {"name": p.stem, "trigger": "", "active": True, "body": text}
        if text.startswith("---"):
            parts = text.split("---", 2)
            if len(parts) >= 3:
                for line in parts[1].strip().splitlines():
                    if ":" in line:
                        k, v = line.split(":", 1)
                        k = k.strip().lower()
                        v = v.strip()
                        if k == "name":
                            meta["name"] = v
                        elif k == "trigger":
                            meta["trigger"] = v
                        elif k == "active":
                            meta["active"] = v.lower() in ("true", "1", "yes")
                meta["body"] = parts[2].strip()
        out.append({"file": p.name, "name": meta["name"], "trigger": meta["trigger"],
                    "active": meta["active"], "body": meta["body"]})
    return out


def load_active_skills(context: str = "") -> list:
    skills = list_skills()
    active = []
    for s in skills:
        if not s["active"]:
            continue
        trigger = s["trigger"].lower()
        if not trigger or trigger == "always":
            active.append(s)
        elif context and trigger in context.lower():
            active.append(s)
    return active


def skills_prompt_block(context: str = "") -> str:
    skills = load_active_skills(context)
    if not skills:
        return ""
    parts = ["APPLICABLE WRITING/BRIEFING SKILLS (follow these):"]
    for s in skills:
        parts.append("\n--- Skill: " + s["name"] + " ---\n" + s["body"])
    return "\n".join(parts)


def save_skill(filename: str, name: str, trigger: str, active: bool, body: str):
    sd = skills_dir()
    sd.mkdir(parents=True, exist_ok=True)
    path = sd / filename
    content = "---\nname: " + name + "\ntrigger: " + trigger + "\nactive: " + str(active).lower() + "\n---\n\n" + body + "\n"
    atomic_write(path, content)


def delete_skill(filename: str) -> bool:
    p = skills_dir() / filename
    if p.exists():
        p.unlink()
        return True
    return False

# kb_path function
def kb_path(key: str) -> "Path":
    base = project_base()
    kb = base / "kb"
    mapping = {
        "lore": ("world/lore.md", "world_lore.md"),
        "characters": ("characters/profiles.json", "characters.json"),
        "state": ("characters/state.json", "character_state.json"),
        "npc_registry": ("characters/npc_registry.json", "npc_registry.json"),
        "plot_threads": ("world/plot_threads.json", "plot_threads.json"),
        "timeline": ("timeline/chronology.json", "timeline.json"),
        "skills": ("styles", "skills"),
        "events": ("events", "events"),
        "scenes": ("scenes", "scenes"),
        "usage_log": ("usage_log.jsonl", "usage_log.jsonl"),
        "character_knowledge": ("characters/knowledge.json", "character_knowledge.json"),
        "last_choice": (".last_choice.txt", ".last_choice.txt"),
    }
    if key in mapping:
        new_rel, old_rel = mapping[key]
        new_p = kb / new_rel
        old_p = base / old_rel
        if new_p.exists():
            return new_p
        if old_p.exists():
            return old_p
        return new_p
    return base / key


# delete_scene
def delete_scene(n: int) -> bool:
    base = (project_base() / "scenes") if not (project_base() / "kb" / "scenes").exists() else (project_base() / "kb" / "scenes")
    # use kb_path
    base = kb_path("scenes")
    removed = False
    for fn in ("scene_%02d.md" % n, "scene_%02d_meta.json" % n, "scene_%02d_snapshot.md" % n):
        p = base / fn
        if p.exists():
            p.unlink()
            removed = True
    return removed


# create_project with kb structure
# (already in original, but need to ensure skills dir exists)
def _ensure_kb_structure(p):
    (p / "kb" / "styles").mkdir(parents=True, exist_ok=True)
    (p / "kb" / "characters").mkdir(parents=True, exist_ok=True)
    (p / "kb" / "world").mkdir(parents=True, exist_ok=True)
    (p / "kb" / "timeline").mkdir(parents=True, exist_ok=True)

# Add add_scene function to studio.py
def add_scene(text: str, improve: bool = False, options: list = None, direction: str = "") -> dict:
    """Add a new scene to the current project from draft text. Optionally improve it."""
    if options is None:
        options = []
    text = text.strip()
    if not text:
        return {"ok": False, "error": "Empty text"}
    n = next_scene_number()
    base = project_base()
    # If improve, run through showrunner
    if improve:
        chars = json.loads((base / "characters.json").read_text(encoding="utf-8")) if (base / "characters.json").exists() else []
        chars = [{k: v for k, v in c.items() if k != "secrets"} for c in chars]
        state = load_state()
        lore = (base / "world_lore.md").read_text(encoding="utf-8") if (base / "world_lore.md").exists() else ""
        npc_registry = json.loads((base / "npc_registry.json").read_text(encoding="utf-8")) if (base / "npc_registry.json").exists() else {}
        plot_threads = json.loads((base / "plot_threads.json").read_text(encoding="utf-8")) if (base / "plot_threads.json").exists() else []
        timeline = json.loads((base / "timeline.json").read_text(encoding="utf-8")) if (base / "timeline.json").exists() else []
        language = project_language()
        genre = project_genre()
        subgenre = project_subgenre()
        option_map = {
            "add_details": "Add more sensory details, description, and atmosphere.",
            "rewrite_dialogue": "Rewrite all dialogue to be sharper and more natural.",
            "fix_continuity": "Fix continuity errors and contradictions.",
            "expand": "Expand the scene. Target 800-1000 words.",
            "tighten_pacing": "Tighten pacing. Cut filler. Target 400-600 words.",
            "change_tone": "Adjust tone to be more dramatic and intense.",
        }
        instructions = [option_map.get(o, o) for o in options if o in option_map]
        if direction:
            instructions.append(direction)
        improve_dir = "Improve this scene. " + " ".join(instructions) if instructions else "Improve this scene's prose quality."
        history = retrieve_relevant_scenes(improve_dir, chars, 3)
        msgs = showrunner_prompt(lore, chars, state, history, improve_dir, "", recent_feedback(3),
                                 npc_registry, plot_threads, timeline, language, genre, subgenre)
        raw = llm_call(CONFIG["showrunner_model"], msgs, CONFIG["max_tokens_showrunner"], CONFIG["temperature"])
        text, choices = split_scene_and_choices(raw)
    else:
        text = text
        choices = []
    # Save as new scene
    sp = base / "scenes" / ("scene_%02d.md" % n)
    atomic_write(sp, text)
    save_snapshot(n, text)
    meta = {"scene": n, "hash": sha256_file(sp), "status": "accepted",
            "characters_present": [], "location": None, "events": [], "choices": choices}
    atomic_write(base / "scenes" / ("scene_%02d_meta.json" % n), json.dumps(meta, indent=2))
    # Assign to active chapter
    cid = active_chapter_id()
    if cid:
        assign_scene_to_chapter(n, cid)
    git_commit_scene(n, "added scene %d" % n)
    return {"ok": True, "scene": n, "text": text, "choices": choices}
