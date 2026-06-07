# Cover Image Prompt — Marketplace Hero Shot

The cover image is the single most important asset in the listing. It runs as the thumbnail on Etsy, Gumroad, and Creative Market. It is the buyer's first impression. It is the difference between a click and a scroll-past.

This file contains the **primary cover prompt** (the one to use) and **two alternative prompts** (A/B testing options). Each prompt is written for **Midjourney v6** and **DALL-E 3**. Both are provided in a format that works for either model. A short "prompt tuning" guide is included at the end so the operator can adjust for any other model (Leonardo, Ideogram, Flux, etc.).

---

## The Brief

A premium marketplace cover image for an Instagram template bundle. The composition should feel like the cover of a high-end design annual, not a Canva-stock-photo ad. Three things must be visible in the hero composition:

1. A **smartphone mockup** (the "hero object") showing an Instagram grid view with multiple template posts visible
2. **Multiple template designs visible** inside the phone screen — at least 6 different posts in a 3×3 or 3×2 grid
3. A **soft, editorial environment** around the phone — wood, linen, soft shadows, warm light, no clutter

The aesthetic direction is **Kinfolk magazine meets Aesop store display**. Warm, restrained, premium. Cream, bone, terracotta, sage, ink. No neon, no glassmorphism, no plastic-feeling renders.

---

## Primary Prompt — "The Annual Cover"

The hero composition. The cover to use for the listing thumbnail.

### Midjourney v6 version

```
Premium mockup of a white iPhone lying flat on a warm cream linen fabric,
the phone screen displaying an Instagram grid view with 6-9 beautifully
designed Instagram post templates visible at once, the template designs
are in an editorial warm-tone color palette of cream, ink black, soft
terracotta, sage green, and bone white with serif and sans-serif
typography, the phone is angled slightly with the screen catching soft
golden hour light, surrounding the phone are subtle props -- a small
linen pouch, a single brass paperclip, a small bundle of dried wheat --
soft natural shadow falling to the lower right, the overall mood is
editorial and premium, like the cover of a Kinfolk magazine, no people
in frame, no text overlays on the photo, soft focus background with a
hint of an off-white wall, shot from a 45-degree top-down angle, color
photography, 4:5 aspect ratio, professional product photography style,
warm color grading --ar 4:5 --v 6 --style raw --s 250
```

### DALL-E 3 version (use as the prompt in ChatGPT-4 or the DALL-E web UI)

```
A premium marketplace cover image: a modern white iPhone lying flat on
a piece of warm cream linen fabric, photographed from a 45-degree
top-down angle. The phone screen shows an Instagram grid view with
six to nine beautifully designed Instagram post templates visible at
once. The templates use a refined editorial color palette of cream,
ink black, soft terracotta, sage green, and bone white. The templates
feature serif display typography paired with clean sans-serif body type.
The phone catches soft, warm golden-hour light. Around the phone are
a few subtle props: a small linen pouch, a single brass paperclip, and
a small bundle of dried wheat. A soft natural shadow falls to the
lower right. The background is softly out of focus, suggesting an
off-white wall. The overall mood is editorial and premium, like the
cover of a Kinfolk magazine or an Aesop brand display. No people, no
text overlays, no logos. Color photography, soft natural light, warm
color grading. 4:5 aspect ratio.
```

### Why this prompt works

- **Specific objects.** "Linen fabric," "brass paperclip," "dried wheat" — the AI has a clear visual vocabulary to draw from.
- **Specific colors.** "Cream, ink black, soft terracotta, sage green, bone white" — locks the palette to the bundle's design system.
- **Specific typography.** "Serif display typography paired with clean sans-serif body type" — instructs the AI on the typographic feel.
- **Specific reference points.** "Kinfolk magazine," "Aesop brand display" — invokes a high-end editorial direction without copying anyone.
- **Negative cues.** "No people, no text overlays, no logos" — keeps the composition clean for later text overlay.
- **Aspect ratio locked.** 4:5 (the Etsy's preferred thumbnail ratio). The 1080×1350 frame works on every marketplace.

### Variations to try (after the first generation)

- Add `--no neon, plastic, glass, gradients` (Midjourney) to double-down on the anti-generic direction
- Replace "iPhone" with "modern smartphone" to give the model more freedom if iPhone renders are noisy
- Add "a small stack of three books" if you want more props
- Drop "dried wheat" if it feels too rustic — replace with "a small ceramic dish"

---

## Alternative Prompt 1 — "The Desk in Golden Hour"

A different composition: the phone propped up on a desk, not lying flat. Reads as a "behind-the-scenes" workspace shot.

### Midjourney v6 version

```
A modern smartphone propped up against a stack of two neutral-tone books
on a warm wooden desk, the phone screen is showing an Instagram profile
page with a curated grid of beautifully designed Instagram post templates,
the templates are in a warm editorial palette of cream, ink, terracotta
and sage with elegant serif and sans-serif typography, beside the phone
is a ceramic coffee cup with a small latte art heart, a brass pen, and
a small linen notebook, soft warm golden hour sunlight streaming in from
a window on the left, casting long soft shadows across the desk, the
mood is calm and intentional, like a quiet morning in a small design
studio, no logos no text overlays, color photography, soft natural
light, warm color grading, 4:5 aspect ratio, professional product
photography --ar 4:5 --v 6 --style raw --s 250
```

### DALL-E 3 version

```
A premium marketplace cover image: a modern smartphone propped up
against a small stack of two neutral-toned books on a warm wooden
desk. The phone screen shows an Instagram profile page with a curated
3x3 grid of nine beautifully designed Instagram post templates. The
templates use a refined warm editorial palette of cream, ink black,
soft terracotta, and sage green, with elegant serif display typography
paired with clean sans-serif body type. Beside the phone is a small
ceramic coffee cup with subtle latte art, a slim brass pen, and a
small linen-bound notebook. Warm, golden-hour sunlight streams in from
a window on the left, casting long soft shadows across the desk. The
mood is calm, intentional, and premium — like a quiet morning in a
small design studio. No logos, no text overlays, no people visible.
Color photography, soft natural light, warm color grading, 4:5 aspect
ratio.
```

### When to use this version

- A/B test against the primary prompt
- Use as a secondary cover in a carousel if the marketplace supports it
- Use in a "lifestyle" marketing context (Pinterest, blog post header, social ad)

---

## Alternative Prompt 2 — "The Grid Poster"

A flat-lay of the 9 templates themselves, no phone. Reads as a "what's inside" preview.

### Midjourney v6 version

```
A beautifully arranged flat-lay of nine square Instagram post templates
laid out in a 3x3 grid on a warm cream linen surface, the templates are
in a unified warm editorial palette of cream, ink black, soft terracotta,
sage green, and bone white, the designs feature elegant serif display
typography alongside clean sans-serif body type, the nine templates
together form a cohesive collection with different layouts but the same
visual system, soft natural overhead daylight, subtle shadow under each
card, no people, no text overlay, color photography, soft focus
background of a wooden table edge, premium product photography style,
4:5 aspect ratio --ar 4:5 --v 6 --style raw --s 250
```

### DALL-E 3 version

```
A premium marketplace cover image: a beautifully arranged flat-lay of
nine square Instagram post templates laid out in a 3x3 grid on a piece
of warm cream linen fabric. The nine templates together form a cohesive
collection — different layouts but the same warm editorial visual system.
The palette across all nine is unified: cream, ink black, soft terracotta,
sage green, and bone white. The designs feature elegant serif display
typography alongside clean sans-serif body type. Soft natural overhead
daylight. A subtle shadow under each card lifts them off the surface.
In the soft focus background is a hint of a warm wooden table edge. No
people, no logos, no text overlays, no extra props. Premium product
photography style, 4:5 aspect ratio.
```

### When to use this version

- Use as a Pinterest pin
- Use as a blog post header image
- Use as a "what's inside" detail image inside the Etsy listing gallery
- Use in an email sequence to demonstrate the bundle's content

---

## Prompt Tuning by Model

### Midjourney v6

The prompts above are tuned for v6. Key parameters:
- `--ar 4:5` — aspect ratio (Etsy thumbnail standard)
- `--v 6` — version
- `--style raw` — reduces "AI glamour," keeps the image grounded
- `--s 250` — stylization; lower = more literal, higher = more artistic. 250 is the sweet spot for premium editorial.
- Add `--no neon, plastic, glass` if the renders come back feeling too digital

### DALL-E 3 (ChatGPT-4 or DALL-E web)

Use the "natural language" versions above. DALL-E 3 doesn't take parameters. Just paste the prompt. If the result is too "AI-pretty," add a final sentence: "Avoid any of the typical AI-aesthetic gloss; the result should feel like a real photograph of a real object on a real desk."

### Leonardo (Phoenix or Kino XL)

Append: `--model phoenix --ar 4:5 --style raw --contrast medium --color warm` (Leonardo's parameter set). The "color warm" preset helps lock the warm palette.

### Ideogram

Ideogram is strong on typography. If you're using it, add a specific text-rendering instruction: "Render any visible text in the Instagram templates in elegant modern serif and clean sans-serif fonts." Ideogram sometimes renders text in a default font — being explicit helps.

### Flux (Black Forest Labs)

Flux 1.1 Pro handles the prompts above well without modification. For Flux Dev, add "ultra realistic photograph, no illustration" to push toward photo output.

### Common failures and fixes

**The phone looks fake / 3D-rendered.**
Add: "Real photograph of a real smartphone, not a 3D render." Or add: "Slight dust on the screen, fingerprints visible, no pristine showroom look."

**The colors drift cold or neon.**
The prompts explicitly say "warm editorial." If the result still drifts, add: "Avoid blue, neon, or cool tones. The image should feel like late-afternoon sunlight, not midday."

**The composition is cluttered.**
The prompts list 2-3 props only. If the AI adds more, add to the prompt: "Only the props mentioned. Nothing else on the surface. Negative space is important."

**The Instagram grid looks fake / generic.**
This is the hardest part. Most image models don't have a clean sense of what an Instagram feed looks like. Workarounds:
- Generate the composition without the grid in focus (let the phone screen be slightly soft)
- Composite the grid in post — take a screenshot of an actual curated Instagram feed, mask it onto the phone screen in Photoshop/Canva/Figma
- Use the third prompt (the flat-lay) which doesn't have a phone screen

**The text in the templates is gibberish.**
This is normal — most image models can't render coherent text inside a 100×100 px mockup. Don't try to fix this. Add text in Canva after generating the cover image. The bundle's title (or "50+ Templates") and a one-line subtitle are easy to add.

---

## Post-Production in Canva

After generating the cover image:

1. **Open the image in Canva.** New design, custom size, 1080 × 1350 (4:5).
2. **Drop the image** as the background. Fill the canvas.
3. **Add text overlay.** Suggested text:
   - **Title:** "Instagram Bundle"
   - **Subtitle:** "50+ Editorial Templates for Small Business"
   - **Footer:** "Canva Editable"
   - **Brand mark:** Your @handle or shop name
4. **Add a subtle texture overlay (optional).** A bone-colored rectangle at 30% opacity over the image can soften the AI output and make it feel more like a print cover.
5. **Export as PNG.** Use the highest quality setting.

### Recommended type for the cover overlay

- **Title:** Fraunces, 88-120pt, weight 500, color `cream` or `bone`, with a subtle drop shadow (yes, drop shadow on the title is allowed — it's the only place)
- **Subtitle:** Inter, 18-22pt, weight 400, color `bone` or `cream`, with 8% tracking
- **Footer:** Inter, 12pt, weight 600, UPPERCASE, color `bone` or `cream`, 8% tracking

### Recommended color combos for the cover text overlay

- Cream background image → text in `ink`
- Bone background image → text in `ink`
- Ink background image → text in `cream`
- Sage or terracotta background image → text in `bone`

The text should be readable in 1 second from a phone-sized thumbnail. Test by shrinking the image to 200 × 250 px and checking legibility.

---

## Final Notes

The cover image is the single most expensive variable in the listing's conversion rate. Spend 1-2 hours generating, picking, and post-producing. The three prompts above should give you 3-5 usable candidates. Pick the strongest, post-produce in Canva, and ship.

The thumbnail's job is to stop the scroll. The cover's job is to make the click feel safe. The right combination does both.

Generate 10-20 candidates. Pick the one that, when shown alongside 10 other listings, is the one you'd click. That's the one.
