# Midjourney Quick Reference — Printable

> One page. The 30 flags and commands you actually use. Print and pin to the wall.

---

## The Only Flags You Need to Memorize

| Flag | Range | What It Does |
|------|-------|--------------|
| `--v 6` or `--v 7` | — | **Version.** Pick one and stick to it. `v 6` is the workhorse; `v 7` is the latest. |
| `--ar W:H` | preset | **Aspect ratio.** `1:1`, `16:9`, `21:9`, `2:3`, `3:2`, `4:5`, `9:16`, `3:4` |
| `--s 100-1000` | 0-1000 | **Stylize.** Default 100. `400-750` = sweet spot for the "Midjourney look." |
| `--c 0-100` | 0-100 | **Chaos.** Higher = more variation across the 4 grid images. Sweet spot `20-40`. |
| `--q .25 / .5 / 1 / 2` | 4 stops | **Quality.** Use `2` only when you need max detail. |
| `--w 0-3000` | 0-3000 | **Weird.** Higher = stranger output. `200-500` for uncanny. `1000+` for chaos. |
| `--niji 6` | — | **Anime model.** Use instead of `--v` for authentic anime/manga. |
| `--style raw` | — | **Less Midjourney polish.** Follows your prompt more literally. |
| `--no thing` | — | **Negative prompt.** Excludes. Stack: `--no text, people, blur`. |
| `--tile` | — | **Seamless tileable.** For wallpapers, fabric, game textures. |
| `--p` | — | **Personalize.** Needs 200+ ratings first. Best at `--s 100-300`. |
| `--iw 0-2` | 0-2 | **Image weight.** How strongly a reference image is followed. |
| `--seed 12345` | integer | **Seed.** Same seed + same prompt = same image. Use to iterate. |
| `--repeat N` | integer | **Repeat.** Run the prompt N times. |
| `--stop N` | 10-100 | **Stop early.** Stops render at N% — useful for "loose" or "sketch." |

---

## The Only Slash Commands You Need

| Command | What It Does |
|---------|--------------|
| `/imagine prompt: ...` | **Generate.** The main command. |
| `/blend` | **Blend 2-5 images.** Drag images in, then `/blend`. Combines their concepts/styles. |
| `/shorten` | **Tighten a long prompt.** Get 1-3 shorter, more focused versions. |
| `/describe` | **Reverse engineer.** Paste an image, get 4 prompt guesses. |
| `/settings` | **Set defaults.** Visit once. Toggle default version, stylize, raw mode. |

---

## Multi-Prompt Weighting (the secret weapon)

```
hot::2 dog::1 --v 6
risograph::3 photographic::1 portrait --v 6
flower::-.5 pot --v 6     -- negative weight = "less of this"
```

---

## Aspect Ratios Cheat Sheet

| Ratio | Use For |
|-------|---------|
| `1:1` | Instagram post, profile pic, Behance thumbnail |
| `16:9` | YouTube thumbnail, hero image, web banner |
| `21:9` | Cinematic film still, ultrawide wallpaper |
| `2:3` | Book cover, Etsy print, portrait poster |
| `3:2` | Classic photo, blog header |
| `4:5` | Instagram feed (best for engagement) |
| `9:16` | TikTok, Instagram story, vertical video |
| `3:4` | Pinterest pin |

---

## The 5 Prompt Templates

**Photo:**
```
[subject] [action] [location], [lighting], [camera], [mood] --ar [ratio] --s [value] --v 6
```

**Illustration:**
```
[style] of [subject], [details], [palette], [mood] --ar [ratio] --style raw --s [value] --v 6
```

**3D render:**
```
3D render of [object], [material], [lighting], [background], [camera] --ar [ratio] --q 2 --v 6
```

**Anime:**
```
[character] [action] [setting], [art reference], [mood] --niji 6 --ar [ratio]
```

**Tileable pattern:**
```
[pattern style] of [motif], [palette], [mood] --tile --v 6
```

---

## The 5 Things You Always Get Wrong

1. **Forgetting the version flag.** Always `--v 6` or `--v 7`. Without it, the default can change.
2. **Keyword stuffing in v6/v7.** Both prefer natural language. Write a sentence, not a list.
3. **Asking for text.** Midjourney can't spell. Use Ideogram or Photoshop.
4. **60+ word prompts.** Specific but tight. Trim ruthlessly.
5. **Mixing 4 styles.** "Watercolor oil pastel pencil anime" = mush. Pick one, max two.

---

## One-Liner Refinements

- Want it more **photorealistic**? → Add `--style raw` + lower `--s` (100-300)
- Want it more **artistic**? → Raise `--s` (600-1000)
- Want more **variation across the grid**? → Add `--c 30-50`
- Want it to feel **uncanny or surreal**? → Add `--w 300-800`
- Want it to feel like **museum art**? → Add `--s 750-1000` + style words
- Want it to feel **modern product**? → Add `--style raw` + `--q 2`

---

*Tip: Pair this with the full `cheat-sheet.md` for deep-dive explanations.*
