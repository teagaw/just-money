# Novel Studio — Home Page (Project Launcher) UX Plan

## Purpose
A dedicated home page that replaces the top-bar project selector. Three primary actions: Continue (resume existing project), Start new (create project), Improve (import rough draft). Must feel like a purposeful tool, not a marketing page.

## Information architecture

```
┌─────────────────────────────────────────────────────┐
│  Top bar: Novel Studio wordmark (left)  [Settings]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │  Continue   │  │  Start New  │  │  Improve    │ │
│  │  (resume)   │  │  (create)   │  │  (import)   │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
│                                                     │
│  ── Recent projects ──────────────────────────────  │
│  ┌───────────────────────────────────────────────┐  │
│  │ Project card: name, genre, scenes, last edited │  │
│  │ Project card: name, genre, scenes, last edited │  │
│  │ ...                                           │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ── Quick actions ────────────────────────────────  │
│  [Open project folder]  [Settings]  [Help]          │
└─────────────────────────────────────────────────────┘
```

## Three primary actions

### 1. Continue (resume existing project)
- **Entry:** Home page loads, recent projects shown.
- **Flow:** Click project card → project loads → studio view opens with latest scene.
- **Project card shows:** name, genre/subgenre (badge), language, scene count, last modified (relative: "2 hours ago"), last scene preview (first 80 chars).
- **Empty state:** "No projects yet. Start a new novel or import a rough draft."
- **Sort:** Most recently modified first.
- **Keyboard:** Arrow keys navigate cards, Enter opens, Delete key deletes (with confirmation).

### 2. Start new (create project)
- **Entry:** Click "Start New" card or button.
- **Flow (wizard, 4 steps):**
  1. **Name + Language:** Project name (text input), language (English / Arabic Egyptian dialect).
  2. **Genre:** Genre dropdown (30 options) → subgenre dropdown (filtered by genre). Optional.
  3. **Premise:** Textarea for rough pitch/premise. Optional but recommended.
  4. **Cast + Lore:** Add characters (name, role, voice) and world lore. Optional — can be filled later.
- **On submit:** Create project, switch to it, open studio view with Scene 1 ready to generate.
- **Skip option:** "Skip and use defaults" on each step.
- **Keyboard:** Tab between fields, Enter to advance, Esc to cancel.

### 3. Improve (import rough draft)
- **Entry:** Click "Improve" card or button.
- **Flow:**
  1. **Input:** Textarea (paste) or file upload (.txt, .md). Shows character count + estimated scene count.
  2. **Analyze:** AI reads the draft, identifies structure, pacing, voices, plot threads, weak points. Shows analysis summary.
  3. **Choose action:** "Improve prose" / "Add details" / "Fix continuity" / "Expand scenes" / "Rewrite dialogue" / "Change tone" (multi-select).
  4. **Review:** AI processes scene-by-scene. Each proposed change shown in the reconciliation panel (same as edit reconciliation). Author accepts/rejects.
  5. **Commit:** Accepted changes applied. Imported novel becomes a project.
- **Empty state:** "Paste your rough draft above or upload a file."
- **Progress:** SSE streaming with stage messages (same as generation).

## Layout

### Desktop (>900px)
- Top bar: 48px, wordmark left, settings gear right.
- Three action cards in a row (equal width, ~300px each).
- Recent projects: 2-column grid of project cards.
- Quick actions row at bottom.

### Tablet (600-900px)
- Action cards: 2 on first row, 1 on second.
- Projects: single column.
- Quick actions: wrap.

### Mobile (<600px)
- Action cards: stacked vertically.
- Projects: single column, compact cards.
- Top bar: wordmark only, hamburger menu for settings.

## Component specs

### Action cards (Continue / Start New / Improve)
- Size: ~280×160px, rounded corners (8px), subtle border.
- Icon: small SVG icon (book, plus, pencil) at top-left, 24px, muted.
- Title: 16px, semibold, text color.
- Description: 13px, muted, 2 lines max.
- Hover: border color shifts to accent, subtle lift (translateY -2px).
- Active/selected: accent border, subtle accent background tint.
- Keyboard: focusable, Enter activates.

### Project cards
- Size: full width of grid cell, ~120px height.
- Layout: name (bold, 14px) + genre badge (small pill, accent) on first row. Scene count + last edited (muted, 12px) on second row. Last scene preview (12px, italic, muted, 1 line truncated) on third row.
- Hover: border shifts to accent.
- Click: opens project.
- Right-click or long-press: context menu (rename, delete, export).
- Empty state: dashed border, "No projects yet" text.

### Wizard steps (Start New)
- Modal overlay (centered, max-width 600px, dark card).
- Step indicator: "Step 2 of 4" with progress dots.
- Back/Next buttons at bottom.
- Skip link on optional steps.
- Esc closes (with confirmation if data entered).

### Import panel (Improve)
- Modal overlay (centered, max-width 700px).
- Textarea (full width, 10 rows) for paste.
- "Or upload file" button (file input, .txt/.md).
- Character count + estimated scene count below textarea.
- "Analyze" button (disabled until text present).
- Analysis results: summary card with structure, pacing, voice, plot threads, weak points.
- Action checkboxes: improve prose, add details, fix continuity, expand scenes, rewrite dialogue, change tone.
- "Start improvement" button.

## Visual design
- **Theme:** Same warm dark as studio (OKLCH tinted neutrals, amber accent).
- **Cards:** Subtle border, no shadow (flat). Hover: border shifts to accent.
- **Typography:** System sans for UI, serif only in scene previews.
- **Motion:** Card hover: border-color 150ms ease-out. Modal enter: opacity + translateY(8px), 200ms. No bounce.
- **Spacing:** 24px between sections, 16px between cards, 8px within cards.
- **Empty state:** Centered text, muted, with a subtle illustration or icon.

## Interaction patterns
- **Project cards:** Click opens. Hover shows border accent. Right-click context menu.
- **Action cards:** Click opens modal/wizard. Hover shows border accent + slight lift.
- **Wizard:** Tab between fields. Enter advances. Esc cancels (with confirmation).
- **Import:** Paste or upload. Analyze button. Review results. Start improvement.
- **Keyboard:** Arrow keys navigate project cards. Enter opens. Delete key deletes (with confirmation). Escape closes modals.

## Empty/error states
- **No projects:** "No novels yet. Start a new one or import a rough draft." with action cards highlighted.
- **Import empty:** "Paste your rough draft above or upload a file." Analyze button disabled.
- **Import error:** "Could not analyze draft: {reason}." Retry button.
- **Generation error:** Alert (existing pattern).
- **Offline:** "Cannot reach server. Is it running?"

## Accessibility
- All interactive elements keyboard-navigable.
- Focus rings: 2px solid accent.
- ARIA labels on all buttons and cards.
- `aria-live="polite"` for status messages.
- Semantic landmarks: `<header>`, `<main>`, `<nav>`, `<aside>`.
- Respect `prefers-reduced-motion`.

## Data flow
| UI Region | Reads from | Writes to |
|---|---|---|
| Project cards | `GET /api/projects` | — |
| Action cards | — | Opens modal/wizard |
| Wizard | `GET /api/genres` | `POST /api/new_project` |
| Import panel | — | `POST /api/import_novel` (new) |
| Analysis results | `POST /api/analyze_novel` (new) | — |
| Project delete | — | `POST /api/delete_project` |

## New API endpoints needed
- `POST /api/import_novel` {text, filename} → creates project from imported text, returns project name
- `POST /api/analyze_novel` {text} → returns analysis (structure, pacing, voices, plot threads, weak points)

## Implementation notes
- Single HTML file, vanilla JS, stdlib server. No new deps.
- Home page is the default route (`/`). Studio view is `/studio` or a separate page.
- Actually, simpler: home page and studio are the same page with a view toggle. Or separate routes.
- Recommended: separate routes. `/` = home, `/studio` = writing view. Or use hash routing: `/#home`, `/#studio`.
- Hash routing is simpler (no server changes). Use `/#home` and `/#studio`.

## What this replaces
- Current: top-bar project selector + "+ New" button + "Delete" button.
- New: dedicated home page with project cards + action cards + wizard + import.

## Migration
- Existing projects (in `projects/`) are shown on the home page.
- The current studio view becomes `/studio` or `/#studio`.
- Top bar simplifies: wordmark + branch selector + status (no project selector on studio page — project switching goes through home page).