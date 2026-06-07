# Cover Image Prompt — Midjourney / DALL-E

**Use:** The primary thumbnail / cover image for Etsy, Creative Market, Gumroad, and the buyer's own site.
**Dimensions:** 2400 × 2400 px (square, Etsy-recommended). Use 2000 × 2000 minimum.
**Aspect ratio:** 1:1.
**Style target:** Premium, calm, editorial — feels like a $200 template, not a generic stock image.

---

## Primary Prompt (Midjourney v6+)

```
A premium minimalist resume cover design, top-down flat lay of a single sheet of US Letter paper
on a warm off-white linen surface, the paper showing a beautifully typeset resume with the name
"ALEX CHEN" in elegant serif typography, a thin hairline rule below, and clean single-column body
text, soft natural window light from the left, no harsh shadows, the paper casting a subtle
realistic shadow on the linen, a single brass pen lying diagonally in the lower right corner, no
other objects, no logos, no watermarks, no text overlays, no borders, no frames, editorial product
photography, soft 35mm film grain, neutral warm color palette with cream and charcoal, shot on
Hasselblad H6D, 100mm lens, f/4, shallow depth of field, photorealistic, ultra high detail,
8K resolution --ar 1:1 --style raw --v 6.1
```

### Negative prompt (append with `--no`):
```
--no text overlays watermarks logos frames borders low quality blurry grainy noisy oversaturated
cartoon illustration 3D render stock photo style
```

### Parameter notes:
- `--ar 1:1` for square (Etsy thumbnail)
- For a 4:5 portrait variant (Instagram, Pinterest): `--ar 4:5`
- For a 16:9 hero variant (landing page): `--ar 16:9` — change the composition accordingly
- `--style raw` reduces Midjourney's "opinionated" stylization; closer to photoreal
- `--v 6.1` (or whatever is current) for best text rendering

---

## Alternate Prompt (DALL-E 3 / GPT-4o image)

```
A premium top-down flat lay photograph of a single US Letter sheet of paper on a warm off-white
linen surface. The paper shows a beautifully typeset resume with "ALEX CHEN" in elegant serif
type at the top, a thin hairline rule below the name, and clean single-column body text in
modern sans-serif. Soft natural window light from the upper left, creating a gentle realistic
shadow. A single brass pen lies diagonally in the lower right corner. Editorial product
photography, neutral warm palette of cream and charcoal, Hasselblad-style, 8K detail, no
overlays, no watermarks, no borders, no logos, no text other than what's on the resume itself.
```

---

## Variant Prompts (for A/B testing)

### Variant B: Side-by-side 5 styles
```
A premium editorial photograph showing five sheets of US Letter paper arranged in a slight fan
on a warm linen surface, each paper showing a different resume style: one minimalist with serif
type, one with a sage-green sidebar, one with a burnt-orange hero band, one with monospace
accents, one with a dense founder layout, soft natural light from the left, a brass letter
opener resting in the lower right, editorial product photography, 35mm film grain, neutral warm
palette, 8K detail --ar 1:1 --style raw --v 6.1
```

### Variant C: In-hand shot
```
A premium editorial photograph of a single sheet of US Letter resume paper held in a hand
against a soft cream background, the resume showing "ALEX CHEN" in elegant serif type with a
hairline rule below, the hand relaxed and natural, the paper slightly tilted to catch the light,
soft diffused studio lighting, no harsh shadows, shallow depth of field, neutral warm palette,
8K detail --ar 4:5 --style raw --v 6.1
```

### Variant D: On a desk, contextual
```
A premium top-down photograph of a single sheet of US Letter resume paper on a clean modern
desk, beside a half-glass of water, a small succulent in a ceramic pot, a brass desk lamp arm
just visible at the top, the resume showing "ALEX CHEN" in elegant serif typography, soft
afternoon natural light, editorial product photography, calm and refined atmosphere, neutral
warm palette, 8K detail --ar 1:1 --style raw --v 6.1
```

### Variant E: Floating in space (for Etsy thumbnail punch)
```
A single sheet of US Letter paper floating in a warm cream void, the paper slightly tilted
toward the camera, the resume showing "ALEX CHEN" in elegant serif type with a hairline rule
below, soft drop shadow giving the paper weight, no other objects, premium minimal
advertising aesthetic, 8K detail --ar 1:1 --style raw --v 6.1
```

---

## Post-Processing Checklist

After generating, the buyer (or designer) should:

1. **Verify text legibility.** AI image generators often garble text. If "ALEX CHEN" doesn't render correctly, re-prompt or composite the text in Photoshop.
2. **Crop to 2400 × 2400** for Etsy / Creative Market.
3. **Color-correct** in Lightroom or Photoshop. The neutral warm palette should be calibrated to feel premium, not yellow.
4. **Add a subtle vignette** to draw the eye to the resume.
5. **Add the pack's branding** in a corner — a small "5 styles · ATS-passing" tagline, or a simple "Modern Tech Resume Pack" wordmark. Keep it under 10% of the image area.
6. **Export as PNG** for lossless quality, or JPG at 95% quality for smaller file size.

---

## Common Pitfalls

- ❌ **AI generators adding fake text.** "ALEX CHEN" often becomes "ALIX CHEH" or similar. Re-roll or composite the real text.
- ❌ **Too many props.** A pen, a coffee cup, a plant, a watch, a notebook — the buyer should pick ONE prop or none. Premium = restraint.
- ❌ **Bright colors.** Pastels and muted tones say "premium." Saturated reds and yellows say "Fiverr."
- ❌ **Visible brand watermarks.** No Nike swooshes, no Apple logos, no obvious brand cues.
- ❌ **Tilted / askew composition.** Premium = aligned. A slightly off-kilter paper reads as "I tried for casual and missed."
- ❌ **Stock photo vibes.** The buyer should aim for "editorial product photography" — calm, intentional, refined.

---

## Etsy Thumbnail Best Practices

Etsy thumbnails are tiny (about 270 × 270 in search results). The cover image must:

- Be **legible at thumbnail size** — the name on the resume should be readable
- Have **high contrast** — light paper on dark surface, or vice versa
- Use **a single focal point** — the resume, not the props
- **Avoid text overlays** that become illegible at thumbnail size (the Etsy algorithm penalizes low-click thumbnails)

For Etsy, the buyer should consider generating **2 variants**: a square one (1:1) for the main listing and a 4:5 portrait one (4:5) for category / search pages. Test both.
