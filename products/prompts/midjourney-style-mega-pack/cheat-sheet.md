# Midjourney Command Cheat Sheet

Everything you need to know to control the output. Print this. Memorize this. Reference this when prompts don't behave.

---

## Core Parameters

### `--v 6` (or `--v 7`)
**Version flag.** Always include this so the output is consistent. `--v 6` is the workhorse (photorealistic, natural language). `--v 7` is the latest model — better coherence, sharper text, stronger prompt adherence. For most prompts in this pack, `--v 6` is the right default; switch to `--v 7` when you want the absolute best. v6.1 is a refinement of v6 — generally skip it in favor of v6 or v7.
```
a red fox in snow --v 6
a red fox in snow --v 7
```

### `--ar 16:9` (aspect ratio)
**Aspect ratio.** Determines the shape of the output.
- `1:1` — square (default, social posts)
- `16:9` — widescreen (YouTube thumbnails, hero images)
- `21:9` — ultra-wide (cinematic film stills)
- `2:3` — portrait poster (book covers, Etsy print)
- `3:2` — classic photo
- `4:5` — Instagram feed
- `9:16` — vertical (stories, TikTok)
- `3:4` — Pinterest pin

```
a red fox in snow --ar 21:9 --v 6
```

### `--s 750` (stylize)
**Stylization.** How much Midjourney takes artistic liberty. Range: 0-1000. Default in v6 is 100.
- `0-99` — minimal stylization, very literal to your prompt
- `100-300` — balanced (default zone, good all-rounder)
- `400-750` — more "artistic," Midjourney's voice comes through
- `800-1000` — highly stylized, opinionated, beautiful

```
a red fox in snow --s 750 --v 6
```

### `--c 0` (chaos)
**Chaos.** 0-100. Higher = more variation between the 4 grid images.
- `0` — predictable, similar outputs
- `20-40` — sweet spot for exploration
- `100` — wild, anything goes

```
a red fox in snow --c 30 --v 6
```

### `--q 1` (quality)
**Quality / compute time.** `.25`, `.5`, `1`, `2`.
- `1` — default, balanced
- `2` — more detail, slower, more credits
- `.5` — less detail, faster

In v6 and v7, quality differences are subtle. Use `2` only when you need the maximum detail.

### `--w 0` (weird)
**Weird.** 0-3000. Pushes the output into unexpected, bizarre, or unusual territory. Higher = weirder.
- `0` — normal
- `200-500` — uncanny, surreal
- `800-1500` — distinctly strange, but usable
- `2000-3000` — full-on weird, often unhinged

Use sparingly. Some prompts love it, some hate it.

### `--niji 6`
**Niji mode.** Japanese anime model. Use this for authentic anime, manga, or Japanese illustration vibes.
```
a magical girl with silver hair --niji 6 --ar 2:3
```

### `--style raw`
**Style raw.** Reduces Midjourney's default aesthetic and follows your prompt more literally. Good for prompts with specific style references (like "watercolor" or "pencil sketch").
```
a watercolor of a flower --style raw --v 6
```

### `--no <thing>`
**Negative prompt.** Excludes something. Multiple `--no` flags stack.
```
a forest --no people, animals
```

### `--tile`
**Tile.** Generates images that can be used as repeating tiles / seamless patterns. Perfect for wallpapers, fabric prints, game textures.
```
a watercolor floral pattern --tile --v 6
```

### `--p` (personalize)
**Personalize.** Activates Midjourney's personalization model, which has learned from your past likes and ratings. Requires 200+ image ratings first.
```
a cozy reading nook --p --v 7
```
Stronger with `--s 100-300` (not the higher end, which dilutes personalization).

---

## Slash Commands

These are typed in the Midjourney prompt bar with a leading `/`, not flags.

### `/imagine`
The main command. `/imagine prompt: <your prompt>` (or just type after `/imagine`).
```
/imagine prompt: a cyberpunk samurai in neon Tokyo --ar 16:9 --v 6
```

### `/blend`
Combines 2-5 uploaded images into a new one. Drag images into the chat, then `/blend`. The model blends their concepts, styles, or composition.
```
/blend
```
Best for combining references (e.g., "this pose with that color palette").

### `/shorten`
Pastes your long prompt back as 1-3 shorter, more focused versions. Great for cleaning up wordy prompts.
```
/shorten a very long and rambling prompt here that goes on and on --v 6
```

### `/describe`
Paste an image (URL or upload) and get 4 prompt guesses back. Great for reverse-engineering an aesthetic you like.
```
/describe https://example.com/image.jpg
```

### `/settings`
Opens the Midjourney settings panel. Toggles defaults like `--v`, `--style raw`, stylize default, etc. Worth a visit once to set your preferences.

---

## Multi-Prompts and Weighting

### `::` (multi-prompt)
Split a prompt into concepts and weight them individually.
```
hot::2 dog::1 --v 6
```
This is 2x as "hot" as "dog."

### Use cases:
```
vintage::2 futuristic::1 city --v 6
risograph::3 photographic::1 portrait --v 6
```

### Negative weight (skip)
```
flower::-.5 pot --v 6
```

---

## Image Prompts

You can drag-and-drop an image into Midjourney to use it as a reference. The image URL goes at the start.
```
https://example.com/photo.jpg a woman in the same pose but in anime style --niji 6
```

Multiple image URLs are separated by spaces. The first has the strongest weight.

You can also use `--iw 2` (image weight, 0-2) to control how strongly the image reference is followed.

---

## Permutation Prompts

Generate variations automatically using `{}`:
```
a {red, blue, green} dragon --v 6
```
This generates 3 jobs: red, blue, green.

```
a {1, 2, 3, 4, 5} {cat, dog} --v 6
```
This generates 15 jobs (5 numbers × 2 animals).

---

## Useful Flags Quick Reference

| Flag | What | Range / Example |
|------|------|------|
| `--v` | Version | `--v 6` or `--v 7` |
| `--ar` | Aspect ratio | `--ar 16:9` |
| `--s` | Stylize | `--s 100-1000` |
| `--c` | Chaos | `--c 0-100` |
| `--q` | Quality | `--q .25 / .5 / 1 / 2` |
| `--w` | Weird | `--w 0-3000` |
| `--niji 6` | Niji (anime) mode | `--niji 6` |
| `--style raw` | Less Midjourney flair | `--style raw` |
| `--no` | Negative | `--no text` |
| `--iw` | Image weight | `--iw 0-2` |
| `--tile` | Seamless tileable | `--tile` |
| `--p` | Personalize | `--p` |
| `--seed` | Same seed = same result | `--seed 12345` |
| `--repeat` | Repeat prompt N times | `--repeat 4` |
| `--stop` | Stop at N% | `--stop 80` |

---

## `--seed` (the secret weapon)

Same seed = same starting randomness. If you find a prompt you love, copy the seed and use it to fine-tune.
```
a red fox in snow --seed 42 --v 6
```

Change one word, keep the seed, see what changes.

---

## `--stop 80`

Stops the render at 80% complete. Useful for "loose" or "sketch" looks.

---

## Common Mistakes

- **Forgetting the version flag** — defaults to whatever Midjourney ships with at the moment, which can change
- **Too many commas in v6/v7** — both prefer natural language, not keyword lists
- **Asking for legible text** — Midjourney is bad at text. Use Ideogram or Photoshop
- **Too long a prompt** — over 60 words and you start getting noise. Be specific but tight
- **Mixing too many styles** — "watercolor oil pastel pencil anime" gives a mess. Pick one or two
- **Setting `--s` to 0 and expecting vibes** — `--s 0` is literal. Use `--s 400-750` for the "Midjourney look"

---

## Pro Tips

1. **Always set a version flag** (most prompts in this pack use `--v 6`; switch to `--v 7` for the latest model)
2. **Lower `--s` + add `--style raw` for prompts with specific style words** (e.g., "watercolor," "pencil")
3. **Higher `--s` for abstract or mood prompts** (e.g., "ethereal," "dreamy")
4. **`--c 20-40` is the sweet spot for exploring a concept**
5. **Use `--seed` to lock in lucky randomness**
6. **`/describe`** — paste an image, get 4 prompt guesses. Great for reverse-engineering styles
7. **`/shorten`** — paste a wordy prompt, get tighter versions back
8. **`/blend`** — combine 2-5 reference images into a new concept
9. **`--tile`** — add to any prompt to make it seamlessly repeating (great for wallpapers, fabric, game textures)
10. **`--p`** — once you've rated 200+ images, personalize kicks in and starts predicting your taste

---

## Quick Templates

**Photo prompt:**
```
[subject] [action] [location], [lighting], [camera angle], [mood] --ar [ratio] --s [value] --v 6
```

**Illustration prompt:**
```
[style] of [subject], [details], [palette], [mood] --ar [ratio] --style raw --s [value] --v 6
```

**Render prompt:**
```
3D render of [object], [material], [lighting], [background], [camera] --ar [ratio] --q 2 --v 6
```

**Anime prompt:**
```
[character] [action] [setting], [art style reference], [mood] --niji 6 --ar [ratio]
```

**Tileable pattern prompt:**
```
[pattern style] of [motif], [palette], [mood] --tile --v 6
```

That's the whole language. Now go use it.
