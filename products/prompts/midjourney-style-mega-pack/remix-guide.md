# Remix Guide — How to Combine, Swap, and Iterate

The 250 prompts in this pack are the starting point. The real power is remixing them. Here's how.

---

## The 5 Remix Moves

### 1. SWAP THE STYLE
Take any prompt and change the leading style words.

**Original (Cinematic):**
```
a lone astronaut standing on the surface of Mars, dramatic golden hour lighting, anamorphic lens flare, dust particles in the air --ar 21:9 --s 500 --v 6
```

**Swap to Risograph:**
```
risograph print of a lone astronaut standing on the surface of Mars, two-color limited palette of orange and blue, halftone dots, registration misalignment --ar 21:9 --style raw --s 250 --v 6
```

**Swap to Watercolor:**
```
soft watercolor painting of a lone astronaut standing on the surface of Mars, wet-on-wet bleeding, paper texture visible, gentle washes of color --ar 21:9 --style raw --s 300 --v 6
```

Same scene. Three different styles. All from the same idea.

### 2. COMBINE TWO STYLES
Use the multi-prompt syntax to blend styles.

```
risograph::2 cinematic::1 portrait of a woman in neon-lit alley --ar 2:3 --v 6
```
More riso than cinematic. The `::2` means twice the weight.

```
brutalist architecture::1 oil painting::2 cathedral interior, golden light --ar 4:5 --v 6
```
More oil than brutalist. Try different ratios to find the sweet spot.

### 3. CHANGE THE TIME OF DAY
Same scene, different lighting. Massive mood shift.

- `golden hour` → `blue hour` → `midday` → `overcast` → `night`
- `harsh sunlight` → `soft window light` → `backlit` → `rim lighting`
- `candlelit` → `fluorescent` → `neon` → `moonlit`

### 4. SWAP THE SUBJECT, KEEP THE COMPOSITION
If you love the way a prompt is composed (foreground, midground, background, lighting) but want a different subject, just swap the noun.

**Original:**
```
a samurai standing in a bamboo forest, fog rolling between the trees, cinematic lighting --ar 2:3 --s 500 --v 6
```

**Swap to:**
```
a knight standing in a bamboo forest, fog rolling between the trees, cinematic lighting --ar 2:3 --s 500 --v 6
```

### 5. ADD OR REMOVE DETAILS
- Add: `+ intricate embroidery on the kimono`
- Remove: `- crowds (only the main character)`
- Specify: `exactly 3 birds, no more, no less`

---

## Common Failure Modes (and Fixes)

### Failure: "It looks generic"
**Fix:** Add a specific style reference at the start.
- ❌ "a beautiful landscape, 4k, detailed"
- ✅ "a beautiful landscape in the style of a 1980s Kodachrome slide"

**Or:** Add `--style raw` and lower `--s` to 100-200.

### Failure: "It looks too AI"
**Fix:** Specify imperfections.
- Add: "film grain, slight chromatic aberration, lens dust"
- Add: "shot on 35mm film, Portra 400"
- Add: "VHS scan artifacts, scanlines"
- Add: "Polaroid, expired film, light leak"

### Failure: "Too many things in the image"
**Fix:** Be specific about quantity.
- ❌ "some birds flying in the sky"
- ✅ "exactly 3 crows flying in formation across a gray sky"

Or use `--no` to exclude.
- `--no people, text, signs`

### Failure: "The composition is bad"
**Fix:** Specify camera angle and framing.
- `extreme wide shot`, `medium close-up`, `over-the-shoulder`
- `low angle looking up`, `bird's-eye view`, `dutch angle`
- `centered composition`, `rule of thirds`, `negative space on the left`

### Failure: "The colors are off"
**Fix:** Name the palette explicitly.
- `muted earth tones`, `neon pink and electric blue`, `monochrome sepia`
- `1980s pastel palette`, `Wes Anderson symmetry and palette`
- `high contrast black and white with one accent color of red`

### Failure: "It doesn't look like [the style I asked for]"
**Fix:** Add reference artists, art movements, or specific techniques.
- `in the style of Studio Ghibli`
- `Hayao Miyazaki aesthetic`
- `1980s anime cel-shading`
- `1990s shoujo manga, CLAMP style`
- `in the style of Edward Hopper` (for cinematic)
- `in the style of Mary Blair` (for soft pastel)
- `Hockney swimming pool palette`

### Failure: "The text in the image is gibberish"
**Fix:** Midjourney can't reliably do text. Either:
- Add text in Photoshop/Canva after
- Use Ideogram for text-heavy designs
- Or accept that the AI will make up text and lean into it as a "vibe"

### Failure: "It's close but not quite right"
**Fix:** Use `Vary (Region)` in Discord to regenerate just one part of the image. Or use `--seed` to keep the layout and tweak the prompt.

---

## Iteration Workflow

1. **Paste the prompt.** Get 4 outputs.
2. **Pick the best one.** Upscale it (U1-U4).
3. **Use `Vary (Subtle)`** for small changes.
4. **Use `Vary (Strong)`** for bigger changes.
5. **Use `Vary (Region)`** to edit just one part of the image.
6. **Pan/Zoom** with arrow buttons to extend the image.
7. **Use `--seed` to lock the lucky randomness** when you find a good one.

---

## Combining Prompts (the advanced move)

**Concept A + Concept B = New Concept**

Example: Take a Cinematic prompt and a Soft Pastel prompt. Blend the lighting and palette.

```
Cinematic prompt: a woman walking alone on a rainy street at night, neon signs reflecting in puddles, film noir lighting --ar 21:9 --s 750 --v 6

Soft Pastel prompt: soft pink and lavender sky, dreamy clouds, ethereal mood, ballerina in a tutu --ar 21:9 --style raw --s 300 --v 6

Blended: a woman walking alone on a rainy street at night, neon signs reflecting in puddles, but the entire scene rendered in soft pastel pink and lavender tones, ethereal and dreamy, film grain --ar 21:9 --s 500 --v 6
```

The blended version keeps the cinematic structure but adopts the pastel palette. This is how you invent new aesthetics.

---

## Mood → Setting → Subject (the framework)

When you want to make something from scratch, work backwards:

1. **Mood first.** "I want it to feel lonely but hopeful."
2. **Setting that supports the mood.** "Empty train station at dawn."
3. **Subject that fits.** "A single traveler with a backpack, silhouette."
4. **Style.** "Cinematic, 35mm film, golden hour."
5. **Palette.** "Muted teals and warm amber."

Final prompt:
```
a single traveler with a backpack seen from behind, standing in an empty train station at dawn, golden light streaming through tall windows, 35mm film, muted teals and warm amber palette, cinematic --ar 21:9 --s 500 --v 6
```

This is the formula. Use it.

---

## The Remixer's Checklist

Before you re-roll a prompt, ask:

- [ ] Did I specify the style explicitly?
- [ ] Did I name the palette?
- [ ] Did I specify the lighting?
- [ ] Did I specify the camera angle / framing?
- [ ] Did I use `--v 6`?
- [ ] Did I add imperfections if I want it to look "real" (film grain, etc.)?
- [ ] Did I exclude unwanted elements with `--no`?

If you answered yes to all 7, the output will be 90% there. The last 10% is just rerolling until you hit the jackpot.

---

Now go combine these 250 prompts into 10,000 unique outputs. The pack is the seed. Your remixes are the tree.
