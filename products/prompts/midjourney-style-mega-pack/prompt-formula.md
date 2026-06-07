# The Prompt Formula

You don't need to copy 250 prompts forever. You need to learn the pattern. This is the pattern.

---

## The 8-Slot Formula

Every great Midjourney prompt has 8 slots. Some are required, some are optional, but the more you fill, the better the output.

```
[STYLE] + [SUBJECT] + [ACTION/POSE] + [SETTING] + [LIGHTING] + [PALETTE] + [CAMERA] + [PARAMETERS]
```

### Slot 1: STYLE
The artistic style. Pick one or combine two.
- Cinematic, anime, watercolor, oil painting, risograph, 3D render, isometric, brutalist, soft pastel, vaporwave
- Reference artists: "in the style of [artist name]"
- Reference eras: "1980s," "Renaissance," "1920s Art Deco"

### Slot 2: SUBJECT
What's the main thing in the image? Be specific.
- ❌ "a woman"
- ✅ "a young woman in her late 20s with curly red hair and freckles"

### Slot 3: ACTION/POSE
What is the subject doing?
- Standing, walking, sitting, looking over shoulder, hands raised, reading
- "caught mid-laugh," "in a moment of contemplation," "mid-stride"

### Slot 4: SETTING
Where is this happening?
- A specific place with details: "a sun-drenched Parisian café in the morning"
- Don't say "outside" — say "a wildflower meadow in the foothills at dawn"

### Slot 5: LIGHTING
This is the most-skipped slot and the most important.
- Golden hour, blue hour, midday, overcast, twilight
- Backlit, rim lighting, chiaroscuro, candlelit, neon
- Harsh fluorescent, soft window light, dappled forest light

### Slot 6: PALETTE
Name the colors. Don't say "colorful."
- Muted earth tones, neon pink and electric blue, monochrome sepia
- 1980s pastel palette, Wes Anderson palette, autumnal ochre and burgundy
- Monochromatic black and white with red accents

### Slot 7: CAMERA
How is the shot framed?
- Wide shot, medium close-up, extreme close-up, over-the-shoulder
- Low angle looking up, bird's-eye view, Dutch angle, eye-level
- Centered composition, rule of thirds, negative space on the left

### Slot 8: PARAMETERS
The Midjourney flags.
- `--v 6` (always)
- `--ar [ratio]` (always)
- `--s [stylize]`
- `--c [chaos]`
- `--style raw` (for specific style words)
- `--q [quality]`
- `--niji 6` (for anime)
- `--no [exclusions]`

---

## Worked Examples

### Example 1: Cozy Bookstore
1. **Style:** "warm oil painting"
2. **Subject:** "an elderly woman reading a worn paperback"
3. **Action:** "sitting in a leather armchair, glasses perched on her nose, smiling softly at the page"
4. **Setting:** "a cramped independent bookstore with floor-to-ceiling shelves"
5. **Lighting:** "warm afternoon light filtering through a small window"
6. **Palette:** "rich browns, deep reds, and golden amber"
7. **Camera:** "medium close-up, slightly low angle, soft focus background"
8. **Parameters:** `--ar 4:5 --s 600 --v 6`

**Final prompt:**
```
warm oil painting of an elderly woman reading a worn paperback, sitting in a leather armchair, glasses perched on her nose, smiling softly at the page, a cramped independent bookstore with floor-to-ceiling shelves, warm afternoon light filtering through a small window, rich browns, deep reds, and golden amber palette, medium close-up, slightly low angle, soft focus background --ar 4:5 --s 600 --v 6
```

### Example 2: Cyberpunk Alley
1. **Style:** "cinematic cyberpunk"
2. **Subject:** "a young hacker with a cybernetic arm"
3. **Action:** "leaning against a wet wall, holding a cigarette, looking sideways at the camera"
4. **Setting:** "a narrow back alley in Neo-Tokyo"
5. **Lighting:** "neon signs reflecting in puddles, fog in the air, pink and teal light"
6. **Palette:** "neon pink, electric teal, deep black, glowing white"
7. **Camera:** "low angle, 35mm film grain, anamorphic lens flare"
8. **Parameters:** `--ar 21:9 --s 500 --v 6`

**Final prompt:**
```
cinematic cyberpunk of a young hacker with a cybernetic arm, leaning against a wet wall, holding a cigarette, looking sideways at the camera, narrow back alley in Neo-Tokyo, neon signs reflecting in puddles, fog in the air, pink and teal light, neon pink, electric teal, deep black, glowing white palette, low angle, 35mm film grain, anamorphic lens flare --ar 21:9 --s 500 --v 6
```

### Example 3: Cozy Kitchen
1. **Style:** "soft pastel illustration"
2. **Subject:** "a tabby cat"
3. **Action:** "sitting on a kitchen counter next to a flour-dusted bowl"
4. **Setting:** "a small cottage kitchen with copper pots and dried herbs"
5. **Lighting:** "soft morning light, gentle shadows"
6. **Palette:** "cream, dusty rose, sage green, warm white"
7. **Camera:** "eye-level, shallow depth of field, bokeh"
8. **Parameters:** `--ar 1:1 --style raw --s 400 --v 6`

**Final prompt:**
```
soft pastel illustration of a tabby cat sitting on a kitchen counter next to a flour-dusted bowl, a small cottage kitchen with copper pots and dried herbs, soft morning light, gentle shadows, cream, dusty rose, sage green, warm white palette, eye-level, shallow depth of field, bokeh --ar 1:1 --style raw --s 400 --v 6
```

---

## The Optional Slots

You can omit some slots, but the more you fill, the more controlled the output.

**Minimum (3 slots):** Style + Subject + Parameters
```
watercolor of a fox --ar 1:1 --v 6
```
Works, but generic.

**Standard (5 slots):** Style + Subject + Setting + Lighting + Parameters
```
watercolor of a fox in a snowy pine forest, soft afternoon light, white background --ar 1:1 --style raw --v 6
```
Better.

**Premium (8 slots):** All slots filled.
```
detailed watercolor painting of a red fox curled up sleeping in a snowy pine forest, soft afternoon light filtering through tall trees, rich warm browns and cool blues palette, white paper texture visible, gentle washes, eye-level, shallow depth of field, --ar 1:1 --style raw --s 300 --v 6
```
Best.

---

## Anti-Patterns (avoid these)

- ❌ "A beautiful image of..."
- ❌ "High quality, 4K, 8K, ultra-detailed" (Midjourney v6 already does this)
- ❌ "Photorealistic" without specifying what kind of photo
- ❌ "Trending on ArtStation" (these tags are no longer effective in v6)
- ❌ Too many styles mashed together: "watercolor oil pastel pencil anime"
- ❌ Asking for text you want readable

---

## The Remix Loop

Once you have a prompt you love:

1. **Lock the seed** (`--seed 12345`)
2. **Change one thing** — palette, lighting, time of day, camera angle
3. **Re-roll.** Compare. Keep the best.
4. **Repeat** with a different one-thing change.
5. **Save the seeds** of the winners. Use them in future prompts.

---

## Your Turn

Pick one of the 250 prompts in this pack. Apply the 8-slot formula to break it down. See how the slots map. Then build your own.

After 10 prompts, you won't need this pack anymore. You'll just need the patterns. That's the real product.

Now go make something.
