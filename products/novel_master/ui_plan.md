# Novel Studio — UI Redesign Plan

## Purpose and audience
A local-first novel co-writing studio used daily by a single author. The UI must support repeated, focused writing sessions: reading generated prose, choosing next directions, reviewing continuity, and giving feedback. It is a tool, not a marketing page — dense, quiet, scannable.

## Design direction
- **Tone:** Editorial, calm, literary. Like a well-designed reading app (Kindle/iA Writer) crossed with a quiet code editor. No flashy animations, no SaaS dashboard clichés.
- **Theme:** Dark. The author writes at night in a dim room. Tinted neutrals toward a warm amber hue (not pure black/white). OKLCH color space.
- **Memorable detail:** The scene prose area is treated as a "page" — a slightly lighter panel with a subtle left margin rule, serif type, and generous line height. Everything else is chrome around the page.
- **Color strategy:** Restrained — tinted neutrals + one accent (warm amber, ≤10% of surface). Accent used only for primary actions and active states.
- **Typography:** Serif (Georgia or Literata) for prose; sans-serif (system/Inter) for UI chrome. Cap prose line length at 65–75ch. Hierarchy via scale + weight contrast.
- **Motion:** CSS transitions only (150ms, ease-out). Enter/exit for panels. No layout animations. Press states on buttons (scale 0.97).
- **Layout:** Two-pane. Left = reading + writing (scene, choices, brief, feedback). Right = inspector (characters, state, events, scenes, recon). Responsive: stack on narrow screens.

## Layout structure

```
┌─────────────────────────────────────────────────────┐
│ Top bar: title, scene nav (prev/next/dropdown), status │
├──────────────────────────────┬──────────────────────┤
│                              │ Inspector (tabs or   │
│  Page (scene prose)          │ scrollable sections) │
│  ─────────────────           │  - Characters        │
│  Choices (buttons)           │  - State             │
│  Scene brief (textarea)      │  - Events            │
│  Direction input + Generate  │  - Scenes list       │
│  Feedback row                │  - Reconciliation    │
│                              │                      │
└──────────────────────────────┴──────────────────────┘
```

## Component specs

### Top bar
- Fixed height, subtle bottom border.
- Left: "Novel Studio" wordmark (small, muted).
- Center: scene navigator — Prev button, dropdown (Scene 1…N), Next button. Tabular nums.
- Right: status text ("Scene 3 of 3 accepted"), generation progress (when active).

### Left pane — the "page"
- Lighter background than chrome (e.g., #1e1e1e vs #141414).
- Prose area: max-width 65ch, centered, serif, 1.7 line-height, 18px.
- Subtle left margin rule (1px, muted) to evoke a page margin.
- Choices: full-width buttons, left-aligned text, subtle border, hover highlight with accent. Numbered.
- Scene brief: compact textarea (2 rows), muted placeholder.
- Direction input + Generate button: input flexes, button fixed width, amber accent.
- Feedback row: rating (1–10) + text, collapsible, muted styling.
- Reconciliation panel: red-bordered card, appears when dirty scenes exist.

### Right pane — inspector
- Scrollable sections, each a flat group (no nested cards).
- Section headers: small caps, muted, with a thin bottom border.
- Characters: name (bold), role + voice (muted, small).
- State: per-character location/inventory/status in compact rows.
- Events: small monospace-ish list, type + summary.
- Scenes: simple list, current scene highlighted.
- Reconciliation: red accent card (same as left).

### Progress / loading
- When generating: a thin progress bar at the top of the left pane (amber, animated).
- Loading text below the bar: "Calling Showrunner… 12s elapsed, ~78s remaining."
- Generate button disabled + "Generating…" text.
- No spinner; the progress bar + elapsed time is enough.

### Typography
- Prose: Georgia (or system serif), 18px, 1.7 line-height, 65ch max.
- UI labels: system sans, 12–13px, muted.
- Section headers: 11px, uppercase, letter-spacing 0.08em, muted.
- Buttons: 14px, medium weight.
- Code/IDs: monospace, 12px.

### Color (OKLCH, tinted neutrals)
- Background (chrome): oklch(0.13 0.005 60) — very dark warm gray.
- Background (page): oklch(0.16 0.005 60) — slightly lighter.
- Background (card/inspector): oklch(0.14 0.005 60).
- Border: oklch(0.25 0.005 60).
- Text (primary): oklch(0.90 0.005 60).
- Text (muted): oklch(0.55 0.005 60).
- Accent (amber): oklch(0.72 0.12 70) — warm amber, used sparingly.
- Danger (recon): oklch(0.65 0.15 25) — muted red.
- Success: oklch(0.70 0.12 145) — muted green.

### Motion
- Panel enter: opacity 0→1 + translateY(4px)→0, 150ms ease-out.
- Button hover: background-color 100ms.
- Button press: scale(0.97), 80ms.
- Progress bar: width transition 300ms ease-out.
- No bounce, no elastic, no layout animations.

### Responsive
- Below 900px: stack panes vertically (page on top, inspector below).
- Below 600px: reduce prose font to 16px, choices full-width, nav wraps.

### Accessibility
- All interactive elements keyboard-navigable.
- Focus rings visible (accent color, 2px).
- ARIA labels on icon buttons.
- Contrast ratios ≥4.5:1 for text.
- Respect `prefers-reduced-motion`.

### Anti-patterns to avoid
- No purple gradients, decorative blobs, oversized hero text.
- No cards inside cards.
- No `transition: all`.
- No glassmorphism.
- No generic "AI made this" look (no Inter everywhere, no rounded-everything).

## Implementation notes
- Keep stdlib HTTP server (no new deps).
- Single HTML file with embedded CSS/JS (no build step).
- Use CSS custom properties for all colors (easy theming).
- Markdown rendering: minimal (bold, italic, dialogue quotes) — no full markdown parser needed; regex-based.
- No framework; vanilla JS with fetch + DOM manipulation.
- Estimated effort: 2–3 hours for a full polish pass.

## What changes vs. current
- Current: flat dark gray, generic buttons, no typography hierarchy, no motion, cramped spacing.
- New: warm-tinted dark theme, serif prose on a "page" panel, amber accent used sparingly, proper spacing rhythm, subtle motion, keyboard navigation, responsive layout.