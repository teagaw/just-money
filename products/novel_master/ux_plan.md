# Novel Studio — UX Plan

## Purpose
Lightweight UX specification for the novel co-writing studio. Defines user flows, states, interactions, and error recovery. The visual design (`ui_plan.md`) and implementation build on top of this.

## Users and context
- **Primary user:** solo author, writing at night, dim room, single device.
- **Workflow:** generate a scene → read → choose direction → repeat. Occasionally edit earlier scenes, give feedback, review continuity.
- **Constraints:** local-first, single user, free-tier models (1–2 min per generation), no internet required for UI.
- **Devices:** desktop (primary), tablet (secondary). Mobile is nice-to-have.

---

## 1. Core user flows

### Flow 1: Generate a scene

**Entry:** App loaded, latest scene displayed.

**Steps:**
1. User reads the current scene (left pane).
2. User reviews choices (buttons below scene).
3. User either clicks a choice (fills direction input) or types a custom direction.
4. Optionally fills Scene Brief (constraints).
5. User clicks "Generate" (or presses Enter in direction input).
6. System shows progress: stage message + elapsed timer + progress bar. Generate button disabled.
7. Scene appears. Choices appear. Feedback row appears.
8. User reads new scene. Repeat.

**States:**
- **Idle:** Latest scene shown, choices visible, input enabled.
- **Generating:** Progress bar + elapsed timer + stage message. Input disabled. Cancel button visible.
- **Success:** New scene replaces old. Choices render. Feedback row appears. Input cleared.
- **Error:** Alert with message. Previous scene restored. Input re-enabled. Retry available.

**Error recovery:**
- Network/timeout: alert "Generation failed: {reason}". Previous scene remains. User can retry.
- Malformed response: alert "Scene generation failed. Try again." No partial save.
- Server down: alert "Cannot reach server. Is it running?"

**Keyboard:**
- `Enter` in direction input → Generate.
- `1`–`9` → select choice N (fills input).
- `Ctrl+Enter` → Generate (alternative).
- `Esc` → cancel generation (if in progress).

### Flow 2: Edit a scene (reconciliation)

**Entry:** User manually edits a `scene_XX.md` file, then returns to app (or clicks "Check for edits").

**Steps:**
1. System detects dirty scenes on load (hash mismatch).
2. Red "⚠ Edit detected" panel appears (left pane, above scene).
3. User clicks "Reconcile" (or auto-triggered on load).
4. System shows proposals: summary, changed passages, per-change Accept/Reject checkboxes (auto_safe pre-checked), downstream scenes warning.
5. User reviews and toggles checkboxes.
6. User clicks "Apply accepted" or "Discard all".
7. If applied: retcons appended, state rebuilt, scene marked reconciled, downstream flagged.
8. Panel disappears. Scene list refreshes.

**States:**
- **Clean:** No dirty scenes. No recon panel.
- **Dirty detected:** Red panel appears with "Edit detected in scene_NN.md".
- **Reconciling:** Spinner/progress in recon panel. "Analyzing edit…"
- **Proposals ready:** Panel shows proposals with checkboxes.
- **Applying:** "Applying…" with disabled buttons.
- **Applied:** Success message. Panel disappears. Downstream warning shown.
- **Discarded:** Panel disappears. Scene remains dirty (status stays `dirty`).
- **Error:** Alert. Panel stays. Retry available.

**Error recovery:**
- Reconciler LLM fails: alert "Reconciliation failed. Try again or discard." Panel stays.
- Apply fails mid-way: alert. Scene stays dirty. User can retry.
- No snapshot available: panel shows "Cannot reconcile — no original version saved." User must manually update state.

**Keyboard:**
- `Tab` navigates proposal checkboxes.
- `Enter` on "Apply accepted" button.

### Flow 3: Navigate scenes

**Entry:** App loaded with multiple scenes.

**Steps:**
1. User uses Prev/Next buttons or dropdown to select a scene.
2. Scene prose + choices load and display.
3. Feedback row appears for that scene.
4. Nav label updates: "Viewing scene 2 of 5."

**States:**
- **Viewing latest:** Nav shows "Scene N/N". Feedback row visible.
- **Viewing older:** Nav shows "Scene X of N". Feedback row visible (for that scene).
- **Single scene:** Prev/Next disabled. Dropdown has one option.

**Error recovery:**
- Scene file missing: alert "Scene not found." Stay on current scene.

**Keyboard:**
- `←` / `→` (arrow keys) → Prev/Next (when not in input).
- Dropdown: arrow keys + Enter.

### Flow 4: Give feedback

**Entry:** A scene is displayed (any scene).

**Steps:**
1. User sees feedback row below choices (rating 1–10 + text area).
2. User sets rating and types feedback.
3. User clicks "Submit feedback" (or Ctrl+Enter).
4. Confirmation: "Feedback saved for scene N."
5. Feedback is injected into next generation's prompt.

**States:**
- **No feedback yet:** Row visible, rating defaults to 7, text empty.
- **Feedback submitted:** Confirmation message. Text cleared. Rating stays.
- **Error:** Alert "Failed to save feedback."

**Error recovery:**
- Server down: alert. Feedback not saved. User can retry.

### Flow 5: Manage project (view state, switch scenes)

**Entry:** App loaded.

**Steps:**
1. User views inspector (right pane): characters, state, events, scenes.
2. User can click a scene in the scenes list → navigates to it.
3. User can view character state (location, inventory, relationships, status).
4. User can view recent events (last 12, newest first).

**States:**
- **Populated:** All sections show data.
- **Empty (new project):** "No scenes yet. Type a direction and click Generate."
- **Loading:** "Loading…" (initial fetch).

**Error recovery:**
- Fetch fails: "Cannot load project state." Retry button.

---

## 2. State inventory (all possible UI states)

| State | Trigger | UI behavior |
|---|---|---|
| `idle` | App loaded, no generation | Scene + choices + feedback visible. Input enabled. Generate enabled. |
| `generating` | Generate clicked | Progress bar + timer + stage message. Input disabled. Generate disabled + "Generating…". Choices cleared. |
| `gen_success` | SSE `done` event | New scene renders. Choices render. Feedback row appears. Input cleared. Button re-enabled. |
| `gen_error` | SSE `error` or fetch fail | Alert. Previous scene restored. Input re-enabled. Button re-enabled. |
| `dirty_detected` | Hash mismatch on load | Red recon panel appears. |
| `reconciling` | Reconcile triggered | Spinner in recon panel. "Analyzing edit…" |
| `proposals_ready` | Reconcile returns | Checkboxes + summary + downstream warning. Apply/Discard enabled. |
| `applying` | Apply clicked | "Applying…" disabled buttons. |
| `applied` | Apply succeeds | Success alert. Panel hides. State refreshes. |
| `discarded` | Discard clicked | Panel hides. Scene stays dirty. |
| `recon_error` | Reconcile/apply fails | Alert. Panel stays (retry available). |
| `empty_project` | No scenes exist | "No scenes yet. Type a direction and click Generate." Scene area empty. |
| `offline` | Server unreachable | "Cannot reach server. Is it running?" Full-width message. |

---

## 3. Interaction spec

### Keyboard shortcuts

| Key | Context | Action |
|---|---|---|
| `Enter` | Direction input focused | Generate |
| `Ctrl+Enter` | Anywhere | Generate |
| `Esc` | Generating | Cancel generation (abort fetch) |
| `1`–`9` | Idle (not in input) | Select choice N (fills direction input) |
| `←` / `→` | Idle (not in input) | Prev/Next scene |
| `Tab` | Recon panel | Navigate proposal checkboxes |
| `Enter` | Recon "Apply" focused | Apply accepted |
| `Ctrl+Enter` | Feedback textarea | Submit feedback |

### Focus management
- After generation completes: focus returns to direction input.
- After scene navigation: focus stays on nav control used.
- After recon apply: focus returns to direction input.
- On error: focus returns to the element that triggered the action.

### Accessibility
- All interactive elements keyboard-navigable.
- Focus rings: 2px solid accent, visible on `:focus-visible`.
- ARIA labels: Prev/Next buttons, Generate, Submit feedback, proposal checkboxes.
- `aria-live="polite"` region for generation progress and status messages.
- Respect `prefers-reduced-motion`: disable transforms, keep opacity transitions instant.
- Contrast ≥4.5:1 for all text (verify against OKLCH palette).
- Semantic landmarks: `<header>`, `<main>`, `<aside>`.

### Touch targets
- Minimum 44×44px for all buttons and interactive controls.
- Expanded hit areas via pseudo-elements where visual element is smaller.

---

## 4. Error recovery patterns

| Error | Where | Recovery |
|---|---|---|
| Generation timeout/failure | Flow 1 | Alert with reason. Previous scene restored. Input re-enabled. User retries. |
| Malformed LLM response | Flow 1 | Alert "Scene generation failed." No partial save. Retry. |
| Server unreachable | All flows | Full-width "Cannot reach server" message. Auto-retry every 5s. |
| Reconciliation LLM failure | Flow 2 | Alert. Recon panel stays. Retry available. |
| Apply failure mid-way | Flow 2 | Alert. Scene stays dirty. User retries apply. |
| No snapshot for reconciliation | Flow 2 | Panel shows "Cannot reconcile — no original version saved." User edits state manually. |
| Scene file missing (navigation) | Flow 3 | Alert "Scene not found." Stay on current scene. |
| Feedback save failure | Flow 4 | Alert. Feedback not saved. Retry. |
| Fetch failure (status/load) | Flow 5 | "Cannot load project state." Retry button. |

---

## 5. Data flow (what each UI region reads/writes)

| UI Region | Reads from | Writes to |
|---|---|---|
| Scene prose | `/api/scene/{n}` or `/api/status` (last_scene) | — (read-only display; edits go through file system) |
| Choices | `/api/scene/{n}` or generate response | Fills direction input |
| Scene nav | `/api/status` (scene_count, scenes) | `viewScene(n)` → `/api/scene/{n}` |
| Generate | `/api/generate` (SSE) | Creates new scene |
| Feedback row | — | `POST /api/feedback` |
| Reconciliation | `/api/detect_edits`, `/api/reconcile` | `POST /api/apply_proposals` |
| Characters | `/api/status` (characters) | — |
| State | `/api/status` (state) | — |
| Events | `/api/status` (not yet; needs endpoint) | — |
| Scenes list | `/api/status` (scenes) | Click → `viewScene(n)` |

---

## 6. Empty states

| Region | Empty condition | Display |
|---|---|---|
| Scene prose | No scenes exist | "No scenes yet. Type a direction below and click Generate to write your first scene." |
| Choices | No scene / generating | (hidden) |
| Characters | No characters.json | "No characters defined. Edit characters.json to add your cast." |
| State | No character_state.json | "No state yet. Generate a scene to begin." |
| Events | No events | "No events recorded yet." |
| Scenes list | No scenes | "No scenes yet." |
| Reconciliation | No dirty scenes | (panel hidden) |

---

## 7. Notes for implementation
- Keep stdlib HTTP server (no new deps).
- Single HTML file with embedded CSS/JS.
- All API calls use `fetch` with proper error handling.
- Generation is long (1–2 min); show progress, allow cancel (abort fetch).
- `index.html` is re-read from disk on every request; reload the page to pick up HTML changes.
- Keyboard shortcuts must not fire when typing in inputs.
- Use CSS custom properties for all colors (theming, RTL).