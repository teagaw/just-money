# Cover Image Prompt — Midjourney / DALL-E

> Use this prompt to generate the marketplace cover image. Etsy and Gumroad both reward premium, intentional cover art over generic stock photos. The cover is the single highest-leverage element of the listing — invest 30-60 minutes iterating.

> **The differentiation challenge:** Every "premium Notion template" on Etsy uses navy + teal + gold + a centered icon. That combination is *correct* but it's not *memorable*. **Concept B (Architecture Map) is the recommended pick** — it's visually distinctive in a search-results thumbnail, communicates the actual product value (8 interconnected DBs), and is rare in this category. Concept C is a backup that strips the icon entirely.

---

## ⭐ RECOMMENDED: Concept B — Architecture Map (Top-Down Node Graph)

> Why this wins: A top-down diagram of the 8 databases as connected nodes is *visually unique* in the Notion-template search results. It communicates "this is a system, not a single page" in 1 second. In a 600×600 thumbnail (the size Etsy shows in search), the dot-and-line network reads as a premium SaaS product diagram, not a stock fitness image.

```
A 2000x2000 pixel premium product cover for a Notion template.
Pure black background (#000000) with a single hairline grid in
dim teal (#0E7490 at 20% opacity). Centered: 8 small filled
circles arranged in a hub-and-spoke pattern. The center hub
circle is slightly larger, gold (#D4AF37) fill, labeled "HOME"
in tiny white sans-serif. The 8 outer circles are smaller,
teal (#22D3EE) fill, labeled in tiny white text:
"GOALS", "WORKOUTS", "EXERCISES", "NUTRITION", "BODY METRICS",
"RECOVERY", "HABITS", "PHOTOS". Thin gold lines connect each
outer circle to the center hub. One or two thin lines connect
adjacent outer circles (GOALS↔WORKOUTS, WORKOUTS↔EXERCISES,
etc.) to suggest the relations. Above the diagram, in elegant
wide-tracked serif caps: "NOTION FITNESS DASHBOARD". Below the
diagram, in a single line of light sans-serif: "8 databases.
1 workspace. Yours forever." The composition is dark, minimal,
technical, like a blueprint or a system-architecture diagram.
No icons, no dumbbells, no human bodies, no gradients. The
overall feeling is "this is an engineering product for
thoughtful people" — not "this is another fitness app".
Style: architectural diagram, system blueprint, Swiss grid
design. Aspect ratio 1:1.
```

**Why it works in thumbnail:** the dot-and-line network is recognizable at 100px. Navy/teal/gold dumbbell covers all blur into a generic blob at 100px — a node graph does not.

---

## Concept A — Editorial Premium (Fallback, Tested Genre)

> A solid choice if you want to play it safe. This is the "navy + teal + gold dumbbell" formula done with care — every premium Notion template uses something like it, but a clean execution still beats 80% of the category. **Only use this if Concept B doesn't iterate well in your first 2 generations.**

```
A premium product cover image for a Notion fitness dashboard template.
Dark navy gradient background (#0F172A) fading to muted teal (#0E7490),
subtle grain texture, no harsh edges. A single minimalist dumbbell icon
centered, gold-foil rendered, casting a soft glow. Below the dumbbell,
a small horizontal divider, then elegant serif text "PREMIUM NOTION
FITNESS DASHBOARD" in caps with wide letter spacing, off-white. Below
that, smaller sans-serif text "plan · track · crush". Bottom right corner
discreet "v1.0" badge. Top right small icon: a tiny Notion-style "N"
inside a rounded square. The composition is editorial, expensive,
magazine-cover quality. No people, no cluttered gym equipment, no
shouting colors. Lighting is studio, even, with a subtle vignette.
Aspect ratio 1:1 (square). Style: modern editorial, premium SaaS
marketing, 2000x2000px.
```

### Negative Prompt (Midjourney `--no` flag)

```
--no people, faces, gym equipment, busy backgrounds, neon colors,
cartoon style, clip art, generic stock photo, low resolution,
text artifacts, distorted letters
```

### Recommended Midjourney Parameters

```
/imagine [prompt above] --ar 1:1 --style raw --s 50 --q 2 --v 6
```

- `--ar 1:1` — square (Etsy and Gumroad both prefer 1:1 or 4:5)
- `--style raw` — less Midjourney "house style," more literal
- `--s 50` — low stylization, more controlled
- `--q 2` — higher quality render
- `--v 6` — current model

---

## Concept C — Typography-Only (Maximum Confidence)

> When the brand needs to be unmistakable. No icon. Just type.

```
A 2000x2000 pixel typography-only cover for a premium Notion
template. Background: warm off-white (#F8FAFC) with a single
1px rule line at top and bottom in deep navy (#0F172A). Centered
vertically: 5 stacked lines of text in different sizes.
Line 1 (largest, bold serif, deep navy): "NOTION"
Line 2 (slightly smaller, bold serif, deep navy): "FITNESS"
Line 3 (largest, bold serif, gold #D4AF37): "DASHBOARD"
Line 4 (small caps, wide tracking, muted gray): "PLAN · TRACK · CRUSH"
Line 5 (tiny, light weight, muted gray): "v1.0  ·  NOTION TEMPLATE"
The composition is editorial magazine cover territory — think
Aesop or Apple keynote slide. No images, no icons, no gradient.
Aspect ratio 1:1.
```

**Use this if:** Concept A and B both fail to iterate, or if you want maximum brand confidence over visual richness. Typography-only covers are rare in this category — a search-results page of dumbbell icons makes a clean wordmark stand out.

---

## DALL-E 3 Alternative Prompt

If using DALL-E 3 (better text rendering), use the Concept A prompt with this final clause added:

```
The image should look like it costs $200 from a designer.
```

---

## Variations to Test

Generate 4-6 variations and pick the best. Test these modifiers:

### Variation A — Light Mode
```
... white-to-light-gray gradient background (#FFFFFF to #F1F5F9),
black dumbbell icon, deep navy text. Same composition. ...
```

### Variation B — Illustration Style
```
... in the style of a refined editorial illustration, geometric,
flat color blocks in navy and teal, single dumbbell silhouette,
serif text overlay. ...
```

### Variation C — Screenshot Mockup Hybrid
```
... a Notion interface screenshot element floating in the bottom
half, showing a small section of a fitness database, blurred to
suggest the full dashboard without showing details. Top half is
the dark gradient with the title. ...
```

### Variation D — Lifestyle Integration
```
... a clean desk setup shot, top-down: a laptop showing a Notion
dashboard, a water bottle, a small dumbbell, a notebook. Dark wood
desk, warm side lighting. Slight grain. Text overlay top center. ...
```

(Use Variation A as a fallback light-theme version. Variation C is a strong seller for the SaaS-y crowd. Variation D is the "lifestyle" angle — works but is harder to make look premium.)

---

## Final Specs

- **Size:** 2000x2000 px (Etsy minimum for square; larger is fine)
- **Format:** PNG, sRGB color space
- **File size:** Under 2 MB (Etsy limit)
- **Resolution:** 72-150 DPI (digital use)
- **Color profile:** Embedded sRGB

---

## After Generation

1. **Open in Photoshop / Figma / Canva**
2. **Add the exact text overlays** the prompt suggested — Midjourney text is often imperfect, especially in v5 and earlier. v6 and DALL-E 3 are much better.
3. **Adjust kerning and leading** — this is the difference between "AI generated" and "designed"
4. **Add a subtle inner shadow** to the text for legibility against the gradient
5. **Save as PNG-24** with transparency OFF
6. **Export a 1:1 thumbnail** at 600x600 to test how it looks small (Etsy search results are tiny)

---

## Brand Consistency Note

Once this cover is finalized, **use the same color tokens, typography, and grain texture** across:
- Mockup images (5 needed)
- The PDF walkthrough cover
- The Loom video thumbnail
- Any future product in the same brand line (Business OS, Habit Tracker, etc.)

This builds brand recognition. Buyers who see the cover should be able to spot the brand anywhere on Etsy.

---

## Quick Reference — Color Tokens

| Use | Hex | Where |
|-----|-----|-------|
| Background dark | `#0F172A` | Cover, dashboard dark mode |
| Background teal | `#0E7490` | Cover gradient end |
| Accent teal | `#22D3EE` | Links, streaks (dark mode) |
| Accent gold | `#D4AF37` | Dumbbell icon |
| Text primary | `#F1F5F9` | Off-white text on dark |
| Text muted | `#94A3B8` | Captions, sub-text |
| Background light | `#F8FAFC` | Light mode variant |

---

**Cover prompt complete. Generate, iterate, ship.**
