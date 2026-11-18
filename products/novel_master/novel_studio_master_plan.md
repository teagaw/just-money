# Custom AI Novel Co-Writing Studio: Master Plan

All ideas from the original blueprint and the three reviews, merged into one document. Repeats are removed, nothing else is dropped.

**Source tags** (so you know who said what):
- **[You]** = your original blueprint
- **[GPT]** = ChatGPT's review
- **[Grok]** = Grok's review
- **[Qwen]** = Qwen's review

Where reviewers disagree, it is marked with ⚠.

**How to read this document:** This is a merged reference (original blueprint + three reviews), not a decision record. Sections tagged "(superseded …)" are historical alternatives; the untagged or "revised" sections are current. §0.1 is the source of truth for current build status. §24 contains future features (post-Phase 4 unless noted).

---

## 0. The 60-second version

1. **The product:** a local-first studio where an AI co-writes your novel one scene at a time. You steer with choices, and your hand-edited Markdown files are always the real canon.
2. **What's genuinely good:** scene-by-scene control, plain Markdown files, one final prose writer (the Showrunner), and treating your edits as absolute truth.
3. **The hardest problem** (all four agree): not writing prose, but keeping the story consistent when you edit earlier scenes. The system must understand what an edit *means*, not just detect that a file changed.
4. **What everyone says to cut or delay:** the 3-agent NPC Council, one agent per main character, parallel agent calls, rigid choice categories, and the fixed scene length.
5. **What everyone says to add:** event log, rebuildable state, character knowledge tracking, timeline, plot threads, safe saving, cost logging, and adversarial tests.
6. **Agreed build order:** start with one Showrunner and no fancy agents. Prove it survives edits. Only then add specialists.
7. **Qwen's closing advice:** stop reviewing, build the terminal prototype, generate a scene, delete a fact, and see if the system catches it.

---

## 0.1 Current status (Phase 0 — COMPLETE, Phase 1 — COMPLETE)

Phase 0 and Phase 1 are built and tested. This section is the source of truth for where the project actually is today (for humans and other AIs).

**Phase 0 — Walking skeleton (COMPLETE ✅):**
- `studio.py` — terminal walking skeleton. Loop: read lore/chars → Showrunner → State Auditor → save → choices → input.
- `web_ui.py` + `index.html` — local web UI (stdlib HTTP server, no new deps) at http://127.0.0.1:8765. Two-pane layout (scene/choices left, characters/state/events/scenes right). Server-Sent Events (SSE) stream generation progress with stage messages, elapsed timer, and progress bar. Scene navigation (Prev/Next/dropdown) across saved scenes. Reconciliation panel (red-bordered, per-change Accept/Reject). Feedback row (rating 1–10 + text). Scene brief textarea. Project selector + new project.
- `world_lore.md`, `characters.json` — Duskport setting, 3 characters with voice contracts.
- Atomic writes (fsync + os.replace), SHA-256 scene hashes, `character_state.json`, `events/event_log.jsonl` (append-only, retcons), `usage_log.jsonl` (cost + tokens + scene_ref), per-scene `_meta.json` (hash, status, events, choices), `scene_NN_snapshot.md` (accepted prose backup).
- `npc_registry.json`, `plot_threads.json`, `timeline.json` — Phase 2 continuity data (populated by auditor).
- `schemas.md` — Phase 1 data contracts (Event, ReconciliationProposal, state, meta, edit detection, safe-auto-accept, retcon cascading).
- Desktop launcher (`.bat` + `.lnk` with custom icon). Icon: crowned quill emblem.

**Phase 1 — Edit reconciliation (COMPLETE ✅):**
- Edit detection: `detect_edit()` compares hash → flags `dirty`. `scan_for_edits()` scans all scenes.
- Reconciler: LLM compares original (snapshot) vs edited → proposes retcons (nullify/modify/remove/add). `reconciler_prompt()`.
- Apply: `apply_proposals()` appends retcons/new events to event log. `apply_reconciliation()` rebuilds state, clears dirty, updates hash/snapshot, returns flagged scenes.
- Downstream flagging: `flag_downstream(entities, after_scene=n)` searches later scenes + event summaries.
- State rebuild: `rebuild_state_from_events()` replays event log, skips nullified events, applies per-event state_updates.
- Per-event state_updates: auditor emits state_updates inside each event; code uses per-event with scene-level fallback.
- Event identity: monotonic `event_id` on all new events. `next_event_id()`, `append_event()` (locked + fsynced).
- Backfill migration: `backfill_events.py` assigned IDs to 33 legacy records (45 total, all unique).
- Validation: `apply_proposals` validates `target_event_id` exists in log; skips unresolvable. Input validation on all HTTP endpoints (int parsing, body cap 2MB, type checks).
- Security: secrets stripped from Showrunner/auditor/reconciler prompts and `/api/status`. XSS escaping in UI (`esc()` helper). `BASE_URL` host consideration. Broad catches narrowed + documented.
- Key rotation: `api_keys()` returns list from env + config fallbacks. `llm_call` rotates on 429/402/408/500/502/503.
- Concurrency: `EVENT_LOG_LOCK` (threading.Lock) guards all event log appends.
- `/api/rebuild_state` endpoint for on-demand state rebuild.

**Phase 1 exit test — PASSED ✅:**
- Deleted key paragraph from Scene 1 → detected dirty → 1 retcon proposed (nullify event #8) → applied → retcon in log → state rebuilt → 3 downstream scenes flagged. Nothing silently corrupted.

**Phase 2 — Continuity machinery (COMPLETE):**
- `npc_registry.json`, `plot_threads.json`, `timeline.json` created (populated by auditor).
- Showrunner prompt includes NPC registry, active plot threads, recent timeline.
- State Auditor prompt extracts `plot_threads`, `timeline_entry`, `npc_updates`.
- `apply_audit_extras()` merges plot threads, appends timeline, updates NPC registry after each scene.
- Multi-novel support: `projects/` directory, `active_project.txt`, `project_base()`, `list_projects()`, `switch_project()`, `create_project()`. UI project selector + new project button. API endpoints.
- Better retrieval (`retrieve_relevant_scenes`: entity-match + recency). Done.
- `find_fact_support()` — point to records supporting any fact. Done.
- Phase 2 exit test: PASSED.

**Scene Brief + Key Rotation + Scene Feedback (COMPLETE ✅):**
- Scene Brief textarea: constraints injected into Showrunner prompt.
- Key rotation: `api_keys()` + fallback loop in `llm_call`.
- Scene feedback: rating (1–10) + text after each scene, stored in `scene_NN_feedback.json`, last 5 injected into Showrunner prompt. `POST /api/feedback` endpoint.

**Tests (`test_studio.py`, pytest):**
- 26 fast unit/integration tests — all PASSING (2.47s).
- 1 slow integration test — PASSING in 80.58s (generate_one_stream end-to-end).
- pytest.ini registers `slow` marker.
- Phase 1 tests: detect_edit, scan_for_edits, rebuild (retcon respected), flag_downstream, apply_proposals (validation), reconcile_scene (mocked LLM), phase1_exit_flow (full integration).

**Models (free tier):** Showrunner = `baidu/ernie-5.5-flash-preview:free`; Auditor = `inclusionai/ling-3.2-flash:free`. High max_tokens (8000/4000). Slugs rotate — swap in `config.json` or use `OPENROUTER_API_KEYS`.

**Generated so far:** 4 scenes (scene_01–04) with choices, state, events, snapshots. Scene 01 reconciled (retcon applied).

**Known limitations / will change:**
- UI is functional but minimal; will be redesigned (see `ui_plan.md` + `ux_plan.md`). EGM review found 10 blockers + 36 majors to resolve before full redesign.
- No vector DB, Git branching, or TTS yet.
- Free models flaky; generation takes 1–2 minutes.
- Legacy events lack per-event state_updates (fallback works).
- No concurrency file lock (threading lock covers single-process web server).
- `rebuild_state_from_events()` on load not automatic (endpoint exists).

**Next step:** Phase 3+ (specialists only if justified). Future: Scene Brief UI polish, skills system (§24.8), TTS (§24.3), multi-language (§24.1), feedback learning (§24.4), publishing export, UI redesign (ui_plan.md + ux_plan.md).

## 1. Core vision [You]

- A local-first, interactive novel engine using OpenRouter APIs.
- It fixes two problems of one-shot AI writing: memory decay and every character sounding the same.
- It works as a **Narrative Director's Studio**:
  - **Scene-by-scene pacing:** chapters are built from focused scenes of about 600–800 words.
  - **Interactive decision gates:** after each scene you get categorized choices plus a free-text override.
  - **Total editability and canon sync:** every scene is a plain Markdown file. You can edit, delete, rewrite or insert scenes, and the engine treats your edits as absolute canon.
  - **Character isolation:** main characters keep distinct voices and hidden motives. Background NPCs are governed separately.

---

## 2. Setting up a project (the "Genesis Phase") [You]

Done once, before Scene 1:

1. **Rough pitch/premise:** core idea, central conflict, desired ending or arc.
2. **Genre and subgenre matrix:**
   - Primary genres (Dark Fantasy, Sci-Fi, Mystery, Historical, Romance).
   - Subgenres and tropes (Progression Fantasy, Political Intrigue, Cyberpunk, Slow-Burn, Grimdark).
   - Compiled style rules: genres are automatically converted into strict prose constraints (pacing rules, forbidden tropes, formatting rules).
3. **World Constitution (`world_lore.md`):** static rules for magic, technology limits, geography and laws.
4. **Initial cast:** protagonist and core main characters, each with a private character sheet.
5. **Writing style (optional):** pick a generated style (from §24.7) or define tone rules manually. Applied to every scene unless overridden per scene.

---

## 3. Design principles (merged from all four)

1. **The author-approved manuscript is the highest authority.** Summaries and derived state never silently overrule it. [GPT, Grok]
2. **Detecting an edit is not understanding an edit** (hashes only locate changes). **Understanding an edit is not propagating its consequences** either. [GPT, Grok, Qwen]
3. **Model calls must earn their place.** Prefer retrieval, stored data and ordinary code to LLM calls. [GPT, Grok]
4. **Character knowledge is not world knowledge.** Track what each character has actually learned. [GPT, Grok]
5. **Automation that changes canon must be visible and correctable by you.** [GPT, Grok, Qwen]
6. **Preserve old versions.** Edits, branches, retries and failures must never destroy accepted work. [GPT, Grok]
7. **Continuity is a product feature, so test it.** Fluent prose is not proof the system works. [GPT, Grok]
8. **Build the smallest reliable version first.** Add agents only after the core is proven. [GPT, Grok, Qwen]
9. **Be conservative.** The system should almost never auto-accept a consequential change. [Grok]

---

## 4. What to keep from the original

| Keep | Notes |
|---|---|
| Scene-by-scene generation | Gives you frequent control and stops errors compounding across chapters. [GPT, Grok] |
| 600–800 words | Keep as a *default target*, not a rule. The scene's dramatic purpose decides length. [GPT, Grok] |
| Plain Markdown files as the manuscript | One of the strongest decisions. Indexes and caches are fine, but they must stay secondary to the files. [GPT, Grok] |
| Showrunner as the only final prose writer | Gives one place responsible for pacing and voice. Risk: it can flatten character voices, so voice information must be preserved and checked. [GPT, Grok] |
| Author authority and hash-based edit detection | Right instinct, but the hash is only the detector. [GPT, Grok] |
| Choices plus custom input | Keep the pattern, but make the categories flexible (see §8). [GPT] |
| Activating specialists only when relevant | Better than consulting everyone every turn. [GPT, Grok] |

---

## 5. What to cut or delay

| Cut or delay | Why | Replace with |
|---|---|---|
| **3-agent NPC Council** | Three LLM calls, three failure points, three latency hits. GPT: over-engineered. Qwen: a distraction. Grok: premature. | A single `npc_registry.json` entry per NPC (voice tags, faction, last-interaction scene). The Showrunner reads it directly. Voice profiles are generated once when the NPC is created and reused. The three responsibilities (voice, faction/lore, continuity) can start as deterministic modules, separate sections of one prompt, or checks done by one lightweight process. Split into separate agents later only if testing shows one process can't do it reliably. Faction and currency rules come from structured world data. Continuity checks query the registry and event history. [GPT, Qwen] |
| **One permanent agent per main character** | Wasteful for brief appearances. | An activation policy (see §7.3). [GPT] |
| **Parallel consultation on every generation** | Parallel doesn't reduce cost, only waiting time. Latency is set by the slowest call. | The Showrunner handles voices via prompts and injected profiles. Add character agents in Phase 3 only if testing shows measurable voice failures. [GPT, Qwen] |
| **Fixed 600–800 word length** | Forces filler or cuts off scenes that need room. | Soft target. [GPT, Grok] |
| **Rigid 5 categories every scene** | Produces absurd options (a "high-risk wildcard" in a quiet tea scene). | Dynamic choices (see §8). [GPT, Qwen] |
| **The word "lightweight" for the reconciler** | It's the hardest problem in the system. | Budget serious engineering time. [Qwen] |
| **Trusting JSON output to mean correct output** | Valid JSON can still contain contradictions, unsupported changes and missing fields. | Schema validation, semantic checks, and a recovery path (see §15). [GPT] |
| **Showrunner doing prose and state JSON in one call** | Creative models invent state changes and break JSON. | Separate State Auditor (see §13). [Qwen] |

⚠ **Where reviewers disagree on how high to set the bar for specialist agents:** Grok says don't add them until adversarial test cases prove a specific failure that a single well-prompted model plus good retrieval can't fix. GPT is softer (add them when "measurable improvement" justifies it).

---

## 6. Architecture

### 6.1 The three-layer authority model [GPT]

| Layer | What it is | Authority |
|---|---|---|
| **Scene files** | The approved prose | Primary canon |
| **Event log** | Structured, traceable records of what happened | The system's interpretation of canon |
| **Current state** | Latest characters, relationships, inventory, location, factions | Derived, rebuildable from approved events |

- The rolling summary is a **retrieval aid, not the source of truth**. If it conflicts with the scenes, the scenes win. [GPT]
- Separate **stable identity** (speech habits, core values, in the character profile) from **changing state** (location, injuries, possessions, relationships, goals, in dynamic state records). [GPT]
- Derived state should be **rebuildable from events + manuscript**. [Grok]
- If a scene is inserted, deleted or moved earlier, the system may need to replay events from that point onward. Updating only the latest state object would leave the novel inconsistent. [GPT]

### 6.2 Components [GPT]

| Component | Job |
|---|---|
| Project Manager | Creates projects, loads config, manages chapters and branches |
| Manuscript Store | Author-editable Markdown scenes and accepted revisions |
| Canon/Event Manager | Tracks approved events linked to source scenes |
| State Projector | Builds current character, relationship, inventory, location and faction state from events |
| Knowledge Manager | Tracks facts known, suspected or misunderstood by each character |
| Context Retriever | Picks the relevant scenes, lore, characters and threads for each generation |
| Agent Router | Decides if character/NPC specialists are needed |
| Showrunner | Writes the scene, proposes events and state changes, offers choices |
| Validator | Checks output shape and important continuity constraints |
| Version/Branch Manager | Snapshots, revisions, alternate paths |

The Event Manager, State Projector, Context Retriever and Validator should use ordinary code and structured data wherever possible. Use language models only where interpretation or creative judgment is actually required. [GPT]

---

## 7. The Showrunner [You]
- The single prose writer and structural orchestrator.
- **Inputs:** genre/tone rules, rolling summary, world lore, character sheets, NPC registry, plot threads, timeline, retrieved past scenes.
- **Outputs:** (1) polished scene prose saved as `.md`, (2) the next set of choices, (3) structured state updates (inventory, relationships, new plot threads).
- ⚠ Qwen disagrees with item (3) being in the same call as the prose (see §13).
- Voice information and checks must be kept explicit so the Showrunner doesn't flatten character voices. Use voice contracts plus post-generation checks of the finished dialogue against them. Character agents should *inform* the Showrunner, not become an excuse to assume voice consistency is solved. [GPT, Grok]
- Original plan: the Showrunner uses Structured JSON Outputs to return prose, state updates and choices in one response. (§5 and §15.2 cover why valid JSON alone is not enough.) [You, GPT]

---

## 8. The choice engine

### 8.1 Original design [You] *(superseded — see §8.2; keep categories as a diversity checklist only)*
After each scene the Showrunner outputs a structured JSON payload with 5 categorized choices plus a free-text one:

| Slot | Type | Purpose |
|---|---|---|
| 1 | Aggressive / Direct | Escalates conflict, confronts obstacles head-on |
| 2 | Tactical / Deceptive | Stealth, intellect, manipulation, negotiation |
| 3 | Investigative / Lore | Uncovers world-building, inspects clues, asks questions |
| 4 | Relational / Character | Ally loyalty, emotional stakes, interpersonal tension |
| 5 | Wildcard / High-Risk | Unexpected complication, gamble, unconventional angle |
| 6 | Custom Director Input | You write the exact action, dialogue or twist |

### 8.2 Revised approach [GPT, Qwen, Grok]
- Keep the categories as a **diversity checklist**, not mandatory slots.
- Prompt suggestion [Qwen]: *"Generate 3 to 5 dynamic choices that arise naturally from the current scene's tension level and dramatic context, plus the Custom Director Input."*
- Five good choices beat five mechanically categorized, unnatural ones. [GPT]
- Always keep the custom input.

---

## 9. Canon reconciliation (the hardest problem)

### 9.1 The original idea [You] *(superseded — see §9.3 workflow + schemas.md; hash is only the detector)*
Each scene's hash is stored in `chapter_meta.json`. When you edit a scene and click **Generate Next Scene**, the backend detects the mismatch and runs a "State Reconciler" that updates relationships, inventory and summaries to match your edited text, so the AI never hallucinates deleted events.

### 9.2 Why it isn't enough [GPT, Grok]
Example: you delete a paragraph containing a promise. The system can't tell if:
- The promise never happened in the revised canon.
- It happened elsewhere and the paragraph was redundant.
- You only changed wording.
- A later scene still depends on it.
- A relationship should change as a result.

Language models are unreliable at precise semantic interpretation of free-form edits, especially when implications span multiple scenes. Expect frequent uncertain or wrong proposals. If reconciliation is unreliable, the whole continuity promise collapses.

### 9.3 Recommended workflow [GPT, Grok]
1. **Detect:** compare current hash with the last accepted hash.
2. **Diff:** identify added, removed and changed passages.
3. **Interpret:** decide whether the edit affects events, character knowledge, relationships, inventory, timeline, plot threads, or only prose style.
4. **Propose:** list proposed event additions, modifications and removals, referencing the passages.
5. **Review:** auto-accept only safe, clearly non-semantic changes (if you enable that). Show everything consequential for your approval.
6. **Rebuild:** update the event log and regenerate affected state and summaries.
7. **Flag downstream:** list later scenes that may rely on the old version. Never silently rewrite them.

### 9.4 Append-only event log with retcons [Qwen]
- Never modify or delete events. Deleting and then having later scenes reference the event leaves orphaned references.
- Treat `event_log.jsonl` like a temporal database. Events are only appended.
- If you edit Scene 5 to remove a promise, the system appends a retcon event instead of deleting Event 104:

```json
{"event_id": "207", "type": "retcon", "nullifies_event_id": "104", "scene_ref": "scene_05", "reason": "author_edit", "timestamp": "2026-11-14T..."}
```

- The State Projector reads the log in order. A retcon nullifies the original event in derived state. The raw log stays intact for audit and rollback.

### 9.5 Review UI: "Git-style Lore Commit" [Qwen]
When the reconciler proposes changes, use a side panel that looks like a GitHub pull-request diff, not a blocking popup and not auto-apply:

```text
⚠ Edit detected in scene_05.md
Proposed Lore Changes:
  [-] Remove "Iron Sword" from Protagonist Inventory
  [-] Nullify Event #104 (Promise to meet at the dock)
  [~] Update Relationship: Protagonist → Guard Captain: "allied" → "neutral"

[Commit All]  [Review Individually]  [Discard All]
```

"Review Individually" gives each change its own Accept/Reject toggle. This avoids the "black box ate my lore" problem.

---

## 10. Character knowledge [GPT, Grok]

Track three separate things:
1. **World truth:** what has actually happened.
2. **Character knowledge:** what each character witnessed, was told, inferred, or falsely believes.
3. **Author/system knowledge:** what you or the planner know that characters must not automatically know.

- Without this, an agent can make a character act on a secret they never learned, or be denied something they reasonably know from chapters ago.
- Use a **knowledge ledger** for secrets, discoveries, witnesses, conversations and misinformation. Prioritize facts that matter to decisions, mysteries, betrayals and plot turns, not every trivial sentence.
- Character agents should receive only: their own profile and state, their known information (including misconceptions), the immediate scene and what they can perceive, and only the shared context needed. They should not get another character's private information just because it exists in the files.
- Difficulty [Grok]: needs either careful filtering on every call or a structured knowledge store that stays consistent when you edit earlier material. Most real attempts either leak information or make characters artificially ignorant.

---

## 11. Timeline, plot threads, relationships

### 11.1 Timeline and location [GPT, Grok]
- Track scene order, dates, durations, and where characters are, so there are no impossible appearances, broken ages, or arriving before travel time allows.
- Not a minute-by-minute simulation: only what matters for continuity.
- Grok: a minimal ordered timeline with locations and approximate durations matters more than additional agents.

### 11.2 Plot-thread registry [GPT]
A rolling summary is not a substitute. Track:
- Mysteries and unanswered questions.
- Promises, debts, obligations.
- Foreshadowing and planned payoffs.
- Unresolved conflicts and goals.
- Important objects or information with planned later significance.

Each thread has a status, relevant characters, introduction scene, and resolution/update history.

### 11.3 Relationship history [GPT]
A single current value hides how it got there. For important relationships, record significant changes and their causes. This helps with believable development and with reconciling edits without arbitrarily changing a score.

---

## 12. Context and retrieval

### 12.1 What to retrieve per generation [GPT]
- Relevant world rules and locations.
- Characters present and their current state.
- Recent scenes and relevant older scenes.
- Active plot threads.
- Character-specific knowledge.
- Prior interactions between the characters in the scene.

Don't send the whole novel. Don't rely only on a short summary when an exact earlier scene matters. Summaries should point to source scenes and event records.

### 12.2 Local vector database [Qwen]
- By Scene 40 you'll have 30,000+ words, too much for one prompt.
- Options: **ChromaDB** (easiest), **SQLite-VSS**, **LanceDB**.
- How it works: when a scene is accepted, chunk it (by paragraph or 512-token windows), embed chunks with a local model (e.g., `all-MiniLM-L6-v2` via `sentence-transformers`), and store them with metadata (scene, chapter, characters present, location). The Retriever queries it for relevant chunks (e.g., "the scene where the protagonist lied to the guard about the key") and injects the top 3 chunks.
- Chunk size, overlap and embedding model all affect quality and need experimentation.

### 12.3 Hardcoded context budget [Qwen]
A 100-scene novel at 700 words/scene is about 70,000 words, roughly 93,000 tokens. It can't all be injected with everything else, so set hard limits (example for a 128k-context model):

| Slot | Content | Max tokens |
|---|---|---|
| System prompt + genre rules | Style, tone, formatting | 1,500 |
| World lore (relevant subset) | Only lore for the current location/faction | 2,000 |
| Active plot threads | Unresolved mysteries, promises, debts | 1,000 |
| Current cast state | Profiles + knowledge of characters in the scene | 2,000 |
| Retrieved past scenes | Top 3–5 relevant chunks | 4,000 |
| Rolling summary | Last 5 scenes compressed | 1,500 |
| **Total injected** | | **~12,000** |

Without limits, the context overflows by about Chapter 10 and the API throws a 400 error, losing the generation.

⚠ Whether a vector DB is needed in the very first prototype is debatable. Grok and GPT mention retrieval but not a specific tool. Qwen includes it in the first build.

---

## 13. State Auditor (separate extraction step) [Qwen]

- After the Showrunner writes the prose, a separate cheap, pedantic model call reads the finished prose and extracts the event-log updates.
- Reason: creative models hallucinate JSON, invent state changes, forget brackets, and mistake metaphor for literal inventory changes.
- System prompt idea: *"You are a data extraction engine. Read the following scene. Extract ONLY hard factual state changes. If a change is ambiguous, flag it as UNCERTAIN. Do not infer. Do not interpret metaphor. Output strict JSON."*
- Use a cheap model (e.g., `google/gemma-3-4b-it`) or a local Ollama model. Don't spend the flagship model on JSON extraction.

---

## 14. Editing features and branching

### 14.1 Editing features [You]
1. **Direct inline editing** of any `scene_XX.md`.
2. **Hash-based auto-reconciliation** (see §9).
3. **Partial highlight-rewrite:** select a paragraph and give a micro-instruction ("Make the dialogue sharper", "Cut the exposition"), keeping surrounding text.
4. **Scene rollback and branching:** delete later scenes and revert to a `scene_XX_snapshot.json` to branch with exact historical character stats.
5. **Manual scene insertion:** write a full scene yourself. The engine ingests it, updates the codex, and generates the next choices.

### 14.2 Branching model [GPT, Grok]
- A branch records its starting point and the scene or state revision it diverged from. It never overwrites the original path.
- Metadata per branch: parent branch, divergence point.

### 14.3 Use Git for the prose [Qwen, GPT]
- Initialize a Git repo in `/novel_project` and commit after every accepted scene.
- Gives free rollback, branching (`git checkout -b alternate_ending`), diffing for the reconciler, and backup via a private remote.
- Don't build a custom version-control system. Use Git for prose and the event log for structured state.
- (GPT also noted Git may help, but the app still needs its own branch metadata and structured-state tracking.)

### 14.4 Scene status state machine [Qwen]
Each scene should have an explicit status, for example:
`draft → generated → author_reviewed → accepted → edited_dirty → reconciled → accepted`

Without this the system can't know whether a scene is safe to build on.

---

## 15. Reliability and persistence

### 15.1 Failures to handle [GPT, Grok]
- API timeout or provider outage.
- Rate limit or insufficient balance.
- Malformed or incomplete model response.
- Failure after generation but before files are saved.
- Duplicate retry saving the same scene twice.
- Interrupted edit or half-written file.

Generation must be safe to retry and must never corrupt the last accepted manuscript.

### 15.2 Validation [GPT]
Check schema, references to valid entities, timeline constraints and critical world rules. Flag uncertain or contradictory updates. Have a recovery path for malformed output.

### 15.3 Atomic writes [Qwen, GPT, Grok]
Never write directly to `scene_01.md` or `event_log.jsonl`. Write to a temp file, then atomically replace:

```python
import os, tempfile

def atomic_write(filepath: str, content: str):
    dir_name = os.path.dirname(filepath)
    with tempfile.NamedTemporaryFile('w', dir=dir_name, delete=False, suffix='.tmp') as tmp:
        tmp.write(content)
        tmp_path = tmp.name
    os.replace(tmp_path, filepath)  # Atomic on POSIX and Windows
```

On commit, save the scene, events, state snapshot, metadata and hash as **one recoverable operation**. [GPT]

---

## 16. Models, cost, privacy

### 16.1 Cost logging from day one [GPT, Grok, Qwen]
Log every API call to `usage_log.jsonl`: model name, input tokens, output tokens, cost (from OpenRouter's pricing table), timestamp, scene reference. Track per generation, chapter and project.

### 16.2 Model routing and fallback [GPT, Grok, You]
- Allow model selection and fallback. Don't assume any free-tier model will always be available.
- Original plan: cheap/fast models for consultation (e.g., `google/gemma-4-26b-a4b-it:free`, `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free`), and a flagship prose model for the Showrunner (e.g., Claude 3.5 Sonnet, DeepSeek, Gemini Pro via OpenRouter).

### 16.3 Local fallback model [Qwen]
Run a small local model with Ollama (e.g., `qwen2.5:7b`, `llama3.1:8b`) for deterministic, non-creative tasks:
- Formatting JSON from unstructured text.
- Checking character name spelling consistency.
- Extracting tags (location, characters present).
- Running the State Auditor if the API is down.

Keep creative prose on OpenRouter and "plumbing" local, so the workflow never fully halts.

### 16.4 Privacy [GPT]
Local storage doesn't mean local inference. The interface should clearly state what leaves the device, which provider receives it, and what project data is included.

---

## 17. Testing and evaluation

### 17.1 What to test [GPT, Grok]
- Character voice differentiation.
- Characters knowing only what they should know.
- Timeline and location consistency.
- World-rule compliance.
- Edited or deleted events removed from derived state.
- Old scenes retrieved when relevant.
- Choices that are distinct and plausible.
- Failed generations preserving the previous accepted state.
- Forgotten promises, secrets and relationships.

### 17.2 Adversarial test novels [Grok, Qwen]
Write 3–5 short test novels (10–15 scenes each) that deliberately try to break knowledge isolation, timeline, deleted events and voice. Write them before Phase 2.

### 17.3 The Phase 1 exit test [Qwen]
1. Generate 10 scenes.
2. Go back to Scene 3 and delete the paragraph where the protagonist picks up a key.
3. Run the hash detector.
4. Verify: the system detects the change, the State Auditor proposes removing the key from inventory, Scene 4 onward doesn't reference the key, and the event log contains a **retcon entry**, not a deletion.

If this fails, nothing else matters: not the NPC Council, not branching UI, not the choice cards.

### 17.4 Longer-term target [Grok, GPT]
Keep a 100-scene novel internally consistent while you freely rewrite earlier material. Grok's concrete bar: prove a single Showrunner can hold continuity across 50–100 scenes with deliberate author rewrites, before adding any specialist agents. A reliable single-agent studio that never quietly corrupts canon beats a complex multi-agent one that loses a promise, secret or relationship halfway through.

---

## 18. Execution pipelines

### 18.1 Original pipeline [You] *(superseded — see §18.2 revised pipeline)*
1. **Cast and dirty-file check:** if the previous scene was manually edited, re-sync `characters.json` and `rolling_summary.json`. Identify main characters and NPCs in the upcoming scene.
2. **Parallel character consultation** using cheap models: active character agents plus the NPC Council gather raw dialogue, intents and continuity checks.
3. **Showrunner synthesis** with the flagship model using structured JSON output: final prose, state updates, next choices.

### 18.2 Revised pipeline [GPT, with Qwen additions]
1. Load project state (config, branch, latest accepted scene, metadata).
2. Check for edits via hashes. If changed, run reconciliation first.
3. Retrieve context (lore, profiles, character knowledge, recent and older relevant scenes, timeline, plot threads).
4. Determine the cast and what each character can know.
5. Route specialist calls only if the scene justifies them.
6. Showrunner generates prose, proposed events/state changes, and choices. *(Qwen: have a separate State Auditor extract the events.)*
7. Validate output.
8. Present to you for review. Important state changes are inspectable.
9. Commit safely as one operation.
10. Continue from the new accepted canon.

---

## 19. Tech stack and UI [You, Qwen]

- **Backend:** Python with FastAPI, the standard `openai` SDK pointed at `https://openrouter.ai/api/v1`, and `asyncio` for parallel calls.
- **Frontend:** lightweight local web UI (HTML/JS or React) with a two-pane studio layout:
  - *Left:* distraction-free Markdown editor for reading, typing, deleting and highlight-rewriting.
  - *Right:* choice cards plus custom input, a Character/NPC Inspector, and a Chapter/Scene tree.
- **Qwen's additions:** ChromaDB (or similar), `sentence-transformers`, Ollama, Git, `usage_log.jsonl`.
- **Qwen's priority:** build the terminal prototype first; no UI until the pipeline works.
- **Qwen's concrete first steps:** stop reviewing and adding parts to the document. Open your IDE, start a Python project, install `fastapi`, `openai`, `chromadb` and `sentence-transformers`, set up Ollama locally, write the walking-skeleton script, generate Scene 1, delete a fact, and see if the system catches it.
- Multi-project isolation: also decide whether projects share one vector DB and one Ollama context or get their own (see §22).

---

## 20. Suggested file structure (merged)

```text
/novel_project            (Git repo)
  project_config.json         # Premise, genres, subgenres, tone rules
  usage_log.jsonl             # Cost logging
  /codex
    world_lore.md             # Static world rules
    characters.json           # Main character sheets + hidden motives (original called these "dynamic"; GPT suggests splitting stable identity from changing state, see character_state.json)
    character_state.json      # Current derived state
    character_knowledge.json  # Who knows what
    npc_registry.json         # Minor NPCs, factions, grudges, history, voice tags
    plot_threads.json         # Open mysteries, promises, foreshadowing
    rolling_summary.json      # Hierarchical summaries: Scene -> Chapter -> Arc (retrieval aid only, not source of truth)
  /events
    event_log.jsonl           # Append-only, with retcon entries
  /chapters
    /chapter_001
      chapter_meta.json       # Scene order, file hashes, active cast
      scene_01.md             # Editable prose
      scene_01_meta.json      # Hash, revision, event refs, status
      scene_01_snapshot.json  # State backup for rollback
      scene_02.md
  /branches
    /alternate_path_001
      branch_meta.json        # Parent branch + divergence point
```

Simplify at first. Character knowledge and plot threads can begin as sections inside existing JSON files. Define the concepts and boundaries before they get tangled. [GPT]

---

## 21. Build roadmap

### Phase 0 — Walking skeleton (COMPLETE ✅)
Built and tested. Terminal script + web UI + tests. See §0.1 for details.
1. Reads `world_lore.md` and `characters.json`.
2. Sends a prompt to OpenRouter.
3. Saves the output as `scene_01.md`.
4. Runs the State Auditor to extract events into `event_log.jsonl`.
5. Updates `character_state.json`.
6. Prints the choices.
7. Waits for your input.
8. Loops.

If this loop isn't reliable with manual terminal edits, a React UI will only hide the bugs.

### Phase 1 — Minimum reliable studio [GPT, Grok] (COMPLETE ✅)
- Project creation and Genesis data. ✅
- Local Markdown scene storage. ✅
- One Showrunner call + separate State Auditor. ✅
- Flexible choices plus custom input. ✅
- Structured event extraction. ✅
- Scene metadata, hashes, snapshots, rollback. ✅ (snapshots saved; rollback not yet implemented)
- Cost logging and basic API error handling. ✅
- Edit detection + reconciliation (hash → diff → propose → review → rebuild → flag downstream). ✅
- **Exit:** PASSED ✅ — deleted key fact from Scene 1 → retcon applied → state rebuilt → downstream flagged.

### Phase 2 — Continuity machinery [GPT, Grok] (COMPLETE ✅)
- Event log as the primary structured record. ✅
- Edit detection with reconciliation proposals for your review. ✅
- Rebuildable character, relationship, inventory and location state. ✅ (rebuild_state_from_events)
- Basic timeline and location constraints. ✅ (timeline.json populated by auditor)
- Plot-thread registry and NPC registry. ✅ (files created, populated by auditor)
- Better context retrieval. ✅ (retrieve_relevant_scenes: entity-match + recency)
- Downstream dependency warnings. ✅ (flag_downstream)
- Multi-novel support (projects/ directory, switch/create). ✅
- Scene Brief + key rotation + scene feedback. ✅
- find_fact_support: point to records supporting any fact. ✅
- **Exit:** PASSED ✅ — system points to supporting records, flags affected scenes on edit, retcon applied, state rebuilt.

### Phase 3 — Selective specialists, only if justified [GPT, Grok] *(specialized agents deleted; only Showrunner + State Auditor remain)*
- Character voice contracts and dialogue samples (enforced via prompts, not agents).
- Deterministic NPC support via `npc_registry.json` (no permanent agents).
- Knowledge-boundary and voice checks.
- **Exit:** measurable improvement on specific failure modes that justifies the cost and complexity.

### Phase 4 — Hardening and advanced [GPT, Grok]
- Model routing and provider fallbacks.
- Caching and retrieval improvements.
- Branching metadata and comparison.
- Stronger evaluation suite and prompt/model experiment tracking.
- Optional richer editor and analytics.
- **Exit:** the system is reliable enough that optimization improves a working product instead of compensating for an unstable one.

---

## 22. Still unspecified (nobody has defined these yet)

1. **Exact prompt templates** for the Showrunner and State Auditor, and the JSON schema for event-log entries. Write, test and version them like code. [Qwen]
2. **Chunking and embedding strategy** (chunk size, overlap, embedding model). Needs experimentation. [Qwen]
3. **Multi-project isolation:** do two projects share a ChromaDB instance, or each get their own? Decide before the file structure hardens. [Qwen]
4. **Concrete adversarial test cases** (Grok called for them, no one wrote them). [Qwen]
5. **A concrete timeline/location model** that can answer "can this character be here now?" without relying on model guesswork. [Grok]
6. **Rules for what counts as a "safe" auto-accept change** versus one needing your approval. [GPT]

---

## 23. Things to verify before trusting (added by me, not from the reviews)

- **Model IDs:** `google/gemma-4-26b-a4b-it:free`, `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free`, and `google/gemma-3-4b-it`. Check the live OpenRouter model list. Free tiers change.
- **"Claude 3.5 Sonnet"** as the flagship example is probably outdated. Check what's current.
- **SQLite-VSS** may be superseded by a newer project; check before picking it.
- **Small models (4B–8B) for state extraction** may be too weak at subtle extraction and honest uncertainty. Test on real scenes.
- **`atomic_write` snippet:** no `fsync`, no explicit UTF-8, can leave orphan `.tmp` files on failure. Fine as a starting point. Verify `os.replace` behavior on your OS in the Python docs.
- **Free-tier rate limits** with a multi-call pipeline. Test early.
- **Exit test:** LLM output isn't deterministic. Run it multiple times and with different edit types (deletion, rewording, changing a fact instead of removing it).
- **Competitors** (e.g., Sudowrite, NovelAI): check what they currently do if you plan to sell this.
- **Open question:** is this for your own writing or to sell to other writers? That changes how much of this is worth building.

---

## 24. Future features (added later)

### 24.1 Multi-language novel generation
- Planned languages: **English** and **Arabic (Egyptian dialect)**. A third language may be added later.
- Language is chosen at project creation (Genesis Phase) and stored in `project_config.json`.
- The Showrunner and State Auditor prompts get a language directive; prose, choices, and extracted events are all in the chosen language.
- Arabic (Egyptian dialect) needs careful prompt engineering: colloquial (عامية) not formal (فصحى), consistent register, and correct directionality (RTL) in the UI.
- Character voice contracts and genre rules are language-specific. NPC registry voice tags too.
- UI must support RTL layout for Arabic.

### 24.2 API key routing and rotation
- Support multiple API keys across multiple providers (Gemini, OpenAI, Nvidia, OpenRouter, etc.).
- A router picks a key per call and **rotates** when a key hits rate limits, quota, or errors.
- Keys are stored in config (or env), never hardcoded. Add/remove keys without code changes.
- Fallback chain: try key A → on 429/402/timeout → try key B → … → fail loudly if all exhausted.
- Track per-key usage in `usage_log.jsonl` (key id, provider, model, tokens, cost, outcome).
- Goal: never halt the workflow because one free tier ran out.

### 24.3 Audio narration (TTS) for novels
- Optional text-to-speech for generated scenes so the user can *listen* instead of read.
- Provider-agnostic: local (e.g. Piper, Coqui) or cloud (OpenAI TTS, ElevenLabs, etc.), chosen in config.
- Per-character voice assignment: map each character to a voice profile; narrator voice for prose, character voices for dialogue.
- Generate audio per scene, cache as files (e.g. `scenes/scene_01.mp3`), playable in the UI.
- Long-term: full-chapter audio and downloadable audiobook export.
- Reason: reading long novels is tiring; listening fits the "studio" feel and lowers the barrier to enjoying the work.

### 24.4 Scene feedback loop (learning from ratings)
- After each accepted scene, the user rates it 1-10 and writes free-text feedback: what worked, what didn't, voice issues, pacing, continuity slips, etc.
- Feedback is **scene-only** (no separate rating for the director brief; the brief is just the input that produced the scene).
- Feedback is stored per scene (and per generation attempt) alongside the scene file and event log.
- A future "learning" layer aggregates feedback into prompt improvements: recurring complaints (e.g. "Tovin sounds too formal", "scenes too short") become explicit constraints injected into the Showrunner/State Auditor prompts for later scenes.
- Storage: start **local** (`scene_NN_feedback.json` or a single `feedback_log.jsonl`), zero new deps, offline. Defer Supabase/Postgres to Phase 4+ (selling/cross-device/multi-user). The local format stays the same; the DB is just a mirror.
- Goal: the system gets measurably better over a novel, not just consistent. Treat feedback as training signal, not decoration.
- Privacy note: feedback may contain plot details; keep it local unless the user opts in to sharing.

### 24.8 Skills system (writing + briefing skills)
- Like Claude Code skills: the author can **add reusable skills** (markdown instruction files) that the AI consults when relevant.
- Two skill types:
  - **Writing skills:** prose craft rules ("show don't tell", "short sentences in action scenes", "no adverbs in dialogue tags").
  - **Briefing skills:** director-steering rules ("always end on a cliffhanger", "introduce a new NPC every 3 scenes", "keep scenes under 700 words").
- Skills live in a `/skills/` folder (one `.md` per skill) with a trigger condition (e.g. genre, scene type, keyword). The Showrunner loads applicable skills into its prompt at generation time.
- Authors can share/import skills (community library) or write their own.
- Optional: skill activation can be automatic (matched by context) or manual (author toggles).
- Goal: make the studio extensible without code changes; authors shape the AI's craft and steering through declarative skill files.

### 24.5 Scene Brief (pre-generation steering) — cheap, high value
- Before generating a scene, the author can fill a short "Scene Brief": constraints, must-include, must-avoid, desired ending beat (e.g. "end on a cliffhanger", "include the guard", "no magic").
- Injected into the Showrunner prompt as explicit constraints. ~20 lines of UI + prompt injection.
- This completes the "Director's Studio" steering promise (currently only post-scene choices exist).

### 24.6 API key / model rotation — Phase 1 survival infra (not Phase 4)
- Free-tier slugs rate-limit and rotate frequently. A ~30-line fallback loop (try key A → on 429/402/timeout → try key B → …) is needed before the Phase 1 exit test, not after. Move out of "future features" into Phase 1 scope.

### 24.7 Novel ingestion and style learning (future)
- The author can **add different novels** (their own past work or reference texts) to the studio.
- The AI **reads and analyzes** them: sentence rhythm, vocabulary, dialogue ratio, POV distance, pacing, descriptive density, recurring motifs, and overall voice.
- It **recognizes patterns and styles** in the writing and **learns from them** to improve its own prose.
- It then **creates named writing styles** (e.g. "Gritty Noir", "Lyrical Fantasy", "My Old Voice") that the author can **choose per novel or per scene**.
- Chosen style becomes a constraint block in the Showrunner prompt alongside genre rules and voice contracts.
- Optional: blend styles (e.g. 70% Style A + 30% Style B).
- Storage: `/styles/<style_id>.json` (feature vector + example passages + prompt template). Ingestion is a one-time analysis pass; results are cached and reusable across projects.
- Privacy: ingested novels stay local unless the user opts in to sharing.
