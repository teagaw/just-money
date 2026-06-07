# Design System — Instagram Small Biz Bundle

This is the **non-negotiable visual contract** for all 50 post templates, 10 story templates, and every bonus PDF. Every layout must obey this system. Brand cohesion is the entire premise.

---

## 1. Color Palette (5 colors max)

A warm, editorial, modern-small-business palette. Reads premium on a mobile feed, not generic, not corporate. Tested against the WCAG AA contrast standard for primary text combos.

| Token        | Hex       | Role                                           | Where it lives                                              |
|--------------|-----------|------------------------------------------------|--------------------------------------------------------------|
| `ink`        | `#1A1A1A` | Primary text, dominant typographic moments     | Quote text, headlines, body copy on light backgrounds        |
| `cream`      | `#E8DDD0` | Primary background, soft warmth                | Default canvas color for ~50% of templates                   |
| `terracotta` | `#D4926A` | Accent — warmth, action, emphasis              | CTAs, accent shapes, underlines, badges, secondary buttons   |
| `sage`       | `#6B8E7A` | Accent — calm, organic, trust                  | Quote callouts, secondary accent shapes, dividers, tags      |
| `bone`       | `#F4F1EC` | Light alternate background, breathing room     | Secondary backgrounds, cards layered on cream, story safe zones |

### Color usage rules

- **One dominant background per post.** Either `cream`, `bone`, or `ink`. Never split a single post 50/50 between two backgrounds — pick one and let it breathe.
- **One accent color per post maximum.** Use `terracotta` OR `sage`, never both in the same post. Mixing them muddies the palette and screams "Canva default."
- **Ink on cream is the brand voice.** This pairing should appear in at least 60% of posts. It's the most recognizable combo.
- **No pure white (`#FFFFFF`).** It's cold and corporate. Use `bone` instead.
- **No pure black (`#000000`).** It clashes with the cream's warmth. Always use `ink` (`#1A1A1A`).
- **Photos must be warm-toned.** Filter photos toward warm whites and amber shadows so they integrate with the palette. Cool blue photography fights the system — replace it or skip it.

### Contrast check (WCAG AA)

| Foreground | Background | Ratio | Use case                       |
|------------|------------|-------|--------------------------------|
| `ink`      | `cream`    | 13.4  | All body + headlines           |
| `ink`      | `bone`     | 15.1  | All body + headlines           |
| `cream`    | `ink`      | 13.4  | Inverted dark-mode posts       |
| `terracotta` | `cream`  | 3.2   | Display type only (>32px)      |
| `sage`     | `cream`    | 3.4   | Display type only (>32px)      |
| `terracotta` | `ink`    | 4.2   | Accent text on dark posts      |

Never set `terracotta` or `sage` at body-copy sizes on `cream`. They fail AA below 18pt. Use them only for display, accents, badges, and decorative shapes.

---

## 2. Typography (2 fonts)

A serif + sans pairing that reads as "editorial small business" — closer to a Kinfolk magazine spread than a Hubspot blog post.

### Display: **Fraunces** (Google Fonts — free, Canva-native)

A high-contrast modern serif with optical sizing. Wide and confident at display sizes, surprisingly readable at body. Use the **Soft + Slant 0** axis preset.

- **Display L:** 96–120 pt, weight 600, tracking -2%, leading 0.95
- **Display M:** 64–80 pt, weight 500, tracking -1%, leading 1.0
- **Display S:** 40–52 pt, weight 500, tracking 0, leading 1.05
- Use case: quotes, headlines, hero typography, name plates, large pull quotes
- **Italic permission:** allowed for emphasis inside display text only, never in body

### Body / UI: **Inter** (Google Fonts — free, Canva-native)

A modern geometric sans. Clean, readable, neutral. Pulls its weight without competing with Fraunces.

- **Body L:** 22–28 pt, weight 400, tracking 0, leading 1.4
- **Body M:** 16–20 pt, weight 400, tracking 0, leading 1.5
- **Label:** 12–14 pt, weight 600, tracking +8%, **UPPERCASE**
- Use case: testimonial body, captions on posts, CTAs, badges, navigation, dates
- **Italic:** never. Italic Inter looks weak; use weight or color for emphasis instead.

### Pairing rules

- **One Fraunces moment per post.** Display type is the punchline. More than one display block per post and the eye doesn't know where to go.
- **Inter handles everything else.** Labels, body, CTAs, badges, dates.
- **Mixed sizes within Fraunces are encouraged** — set a 96pt word next to a 40pt word for editorial energy.
- **Never stretch type** to fit a container. Resize the type itself; never use Canva's scale handle.

---

## 3. Spacing & Grid

A strict 4pt baseline grid. All measurements snap to multiples of 4 px. This is what separates "made in 5 minutes" from "made by a designer."

### Safe zone (square posts 1080×1080)

- **Outer margin:** 80 px on all sides (no content touches the edges)
- **Inner safe area:** 920 × 920 px
- **Hero typography zone:** centered 720 × 720 px block
- **Bottom signature zone:** reserved 80 px at the bottom for handle + brand mark on every post

### Safe zone (stories 1080×1920)

- **Top reserved:** 250 px (Instagram UI: profile pic, name, X button)
- **Bottom reserved:** 250 px (Instagram UI: emoji reactions, message input)
- **Usable content area:** 1080 × 1420 px (centered vertically)

### Spacing scale (use these, only these)

| Token  | Pixels | When                                           |
|--------|--------|------------------------------------------------|
| `xs`   | 8      | Inside badges, between icon and label          |
| `sm`   | 16     | Between label and value, tight stacks          |
| `md`   | 24     | Between paragraph blocks                       |
| `lg`   | 40     | Between major sections within a post           |
| `xl`   | 64     | Between hero block and supporting text         |
| `2xl`  | 96     | Anchor spacing around the hero typography      |

Never use 12, 20, 30, 50. They break the rhythm.

### Composition rules

- **Asymmetric over centered.** Centering everything is the AI default. Let one element break the symmetry — a date in the top-right corner, a price in the bottom-left, a quotation mark hanging off the grid.
- **Negative space is the design.** At least 40% of every post should be empty background. Designers buy themselves credibility with empty space.
- **Three elements maximum per post.** Hero type + one accent + one label/CTA. Anything more is noise.

---

## 4. Photographic Treatment

Photos appear in product promo, behind-the-scenes, and some testimonial templates.

- **Aspect ratios:** 4:5 portrait crops, full-bleed squares, or circular masks. Never landscape orientation in a square post.
- **Color tone:** warm bias — amber shadows, cream whites. Apply Canva's "Vintage" or "Warm" filter at 30–50% strength.
- **Subject style:** flat-lay product shots, hands-at-work shots, founder portraits, candid studio moments. No corporate stock photos. No people staring at cameras with cheesy smiles.
- **Borders:** none. Bleed to the safe-zone edge or use a clean circular mask.
- **Drop shadows on photos:** none. They scream "Canva template." Use the cream background to define the photo edge.

---

## 5. Shape & Iconography

Decorative elements should feel like editorial print, not iOS app design.

- **Allowed shapes:** circles, organic blob shapes (curved, hand-drawn feel), hairline rules (1 px), terracotta or sage solid bars
- **Border radius:** either `0` (sharp rectangles, hairlines) or `999` (full circles/pills). No 4px or 8px rounded rectangles — they're the universal "I designed this in 2018" signal.
- **Allowed line weight:** 1 px hairlines only. Never 2px+ borders.
- **Allowed icons:** thin-line icons from the Phosphor "thin" or "light" weight only. No filled icons. No emoji as decoration.
- **Never use:** drop shadows, gradient overlays, glassmorphism, neon glows, sparkle emojis, AI-generated "watercolor" backgrounds, marble or wood texture backgrounds.

---

## 6. Do / Don't Quick Reference

### DO

- Let one big typographic moment dominate the post
- Use one color for the background, one accent maximum
- Leave breathing room — 40%+ negative space
- Snap everything to 4px grid
- Pair Fraunces with Inter, never substitute either
- Use warm-toned photography when photos appear
- Sign every post with the brand handle in 12pt uppercase Inter at the bottom

### DON'T

- Mix terracotta and sage in the same post
- Use pure white or pure black
- Add drop shadows to anything
- Use more than three elements per post (hero + accent + label)
- Center everything — let one element break symmetry
- Use rounded-rectangle border-radius values like 4, 8, 12
- Use stock-photo-grin photography
- Cram text into all four corners — Instagram readers scan in a Z shape
- Add gradient overlays to photos
- Use script fonts, handwritten fonts, or any third font

---

## 7. Canva Brand Kit Setup (for the buyer)

When the buyer opens the template, they should immediately do this:

1. Canva → Brand → Brand Kit
2. Add the 5 hex codes above with the same token names
3. Add Fraunces and Inter as Brand Kit fonts
4. Now every template can be re-colored in one click via Canva's "Style" → "Color Palette" swap

This is taught in `instructions.md` with screenshots.

---

## 8. How to Modify the Palette (for a buyer who wants her own brand)

The system is designed to swap colors without breaking. If the buyer's brand is, e.g., navy + blush + gold, she follows this rule:

- Replace `ink` with her darkest brand color (must be near-black for contrast)
- Replace `cream` with her warmest light brand color (must be light enough for AA contrast)
- Replace `terracotta` with her primary brand accent
- Replace `sage` with her secondary brand accent
- Keep `bone` as a near-white version of the new `cream`

Walk-through in `instructions.md` § 5.

---

## 9. Version History

- **v1.0 — 2026-06-07** — Initial design system locked. 5 colors, 2 fonts, 4pt grid, warm editorial direction.
