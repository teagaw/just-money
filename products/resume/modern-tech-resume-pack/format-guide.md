# Format & Export Guide — Edit in Word, Google Docs, or LaTeX

**Audience:** Buyers of the Modern Tech Resume Pack.
**Outcome:** The buyer can open the template, edit their content, export a PDF, and submit — in any of the 3 supported tools.

---

## Quick Reference: Which Format to Use When

| Use case | Best format | Why |
|----------|-------------|-----|
| Edit the resume quickly in a familiar tool | DOCX (Word / Google Docs) | Familiar UI, real-time preview, easy to share |
| Submit to an online ATS portal (Workday, Greenhouse, Lever) | DOCX | ATS parsers are designed for DOCX |
| Email to a human recruiter or HM | PDF | Preserves formatting across systems |
| Build a custom version (LaTeX power user) | LaTeX (`.tex`) | Total control, reproducible, Overleaf-ready |
| Print for an in-person interview | PDF | What you see is what they see |
| Share a public link (e.g., portfolio) | PDF hosted on personal site | Universal, no formatting issues |

The pack ships **all three** for every template: DOCX, LaTeX, and PDF preview. The buyer picks.

---

## Editing in Microsoft Word

### Opening the template

1. Open Microsoft Word (any version 2016+)
2. File > Open > browse to the template DOCX
3. If a "Protected View" banner appears, click "Enable Editing"
4. **Save a copy immediately** as `FirstName-LastName-Resume-2026.docx` — never edit the original template

### Editing the content

The template uses Word's built-in paragraph and character formatting. To edit:

- **Name:** Click on the name, type to replace
- **Title / tagline:** Click and replace
- **Contact line:** Click and replace (keep the `·` middle-dot separators or use ` | ` pipes)
- **Section headings:** Click and replace (keep them UPPERCASE, keep the letter-spacing)
- **Bullets:** Press Enter after a bullet, Word continues the list. To remove a bullet, press Backspace at the start of the line, or click the bullet and select "None"
- **Date format:** Type `Jan 2022 — Present` (en dash, not hyphen). For dates, use the en dash character: type `2022`, then `—` (the key sequence is `2014` then `2013` on Windows numeric keypad, or just paste from this doc)
- **Hyperlinks:** Select the text > Insert > Link > paste the URL

### Customizing the colors (The Modern, The Bold, The Founder)

1. Click on the colored element (sidebar fill, hero band, hairline rule)
2. Format > Shape Fill (or Table Properties > Shading)
3. Pick a new color using the color picker
4. **Use the eyedropper** to match a specific color from the buyer's most recent company's brand

### Customizing the fonts

1. Select all text: Ctrl+A
2. Home > Font > pick the buyer's preferred sans (Inter, Söhne, Helvetica Neue)
3. For mono accents (The Engineer), select the tech names and change them to JetBrains Mono or Fira Code
4. If the buyer doesn't have these fonts installed, Word will substitute. **Install the fonts first** for best results. Free downloads:
   - Inter: [rsms.me/inter](https://rsms.me/inter)
   - Söhne: [klim.co.nz/sohne](https://klim.co.nz/sohne) (paid; or use Inter as a free alternative)
   - JetBrains Mono: [jetbrains.com/lp/mono](https://www.jetbrains.com/lp/mono/)
   - Fira Code: [github.com/tonsky/FiraCode](https://github.com/tonsky/FiraCode)
   - Charter / Garamond: any system serif

### Saving and exporting

- **Save as DOCX:** File > Save As > Word Document (.docx) — the default
- **Export as PDF:** File > Save As > PDF. **Important:** before exporting, go to File > Options > Save > "Embed fonts in the file" — this ensures the PDF looks the same on every device
- **Print preview:** File > Print to see exactly what will print/PDF

### Common Word issues

| Issue | Fix |
|-------|-----|
| Fonts look different on another device | Install the fonts on the other device, or use PDF export with embedded fonts |
| Section heading letter-spacing disappears | Word's letter-spacing is per-paragraph, not per-style. Select the heading, Format > Font > Advanced > Character Spacing > 1.5pt |
| Custom bullet (`—` or `▸`) shows as `?` or `[]` | The character isn't supported. Use Insert > Symbol > pick from the table |
| Colors look different on screen vs. PDF | Calibrate the monitor, or use sRGB color picker values |
| The sidebar table doesn't have borders | That's intentional. Right-click the table > Table Properties > Borders and Shading > None |

---

## Editing in Google Docs

### Opening the template

1. Open Google Docs (any browser, signed in)
2. File > Open > Upload > select the template DOCX
3. Google Docs converts the DOCX to its native format — some formatting may shift
4. **Make a copy immediately:** File > Make a Copy > rename to `FirstName-LastName-Resume-2026`
5. **Export a backup as DOCX** before editing: File > Download > Microsoft Word (.docx)

### Editing the content

Google Docs editing is similar to Word:
- Click and type to replace
- The middle-dot separator `·` may convert to a different character; if so, use Insert > Special Characters > search "middle dot" and paste
- Custom bullets (em dash, triangle) work the same way: Format > Bullets & Numbering > List Options > paste the character

### Sidebar / hero band (The Modern, The Bold)

In Google Docs, the cleanest way to build a colored block:

1. Insert > Table > 1 row × 1 column
2. Right-click the cell > Table Properties > set the width and the cell background color
3. Type the content
4. To remove the table border: right-click > Table Properties > set border width to 0pt for all sides

### Saving and exporting

- **Save:** Google Docs auto-saves; no manual action needed
- **Export as DOCX:** File > Download > Microsoft Word (.docx) — this preserves most formatting
- **Export as PDF:** File > Download > PDF Document (.pdf)
- **For maximum DOCX fidelity:** Use Word for the final 10% of edits after doing 90% in Google Docs. Some Google Docs features (like drawings, certain table features) don't export cleanly to DOCX

### Common Google Docs issues

| Issue | Fix |
|-------|-----|
| Fonts revert to Arial after upload | Install Inter / Söhne via Google Fonts in your Drive (free for Inter, JetBrains Mono) |
| Table border shows in PDF even though set to 0 | Use a 1×1 text box with a colored fill instead of a table |
| Letter-spacing doesn't apply | Google Docs supports character spacing: Format > Text > Capitalization > Small Caps (alternative for letter-spacing) |
| Custom bullet shows as `?` | Use Insert > Special Characters, search "em dash" or "black right-pointing pointer" |

---

## Editing in LaTeX (Overleaf)

### Why LaTeX?

LaTeX is the standard for technical resumes because:
- Reproducible — the source is plain text, version-controlled
- Beautiful typography out of the box
- Free (Overleaf, TeXShop, MiKTeX)
- The same source compiles to identical PDFs on any machine

The buyer doesn't need to install LaTeX locally — **Overleaf** ([overleaf.com](https://overleaf.com)) is a free online editor that compiles in the browser. Recommended.

### Opening the template

1. Go to [overleaf.com](https://overleaf.com) and sign in (free)
2. New Project > Upload Project > upload the `1-page.tex` (or relevant) file
3. **Set the compiler:** Menu > Compiler > **XeLaTeX** (required for `fontspec` and Inter)
4. Click "Recompile" — the PDF preview updates

### Editing the content

LaTeX edits are direct text edits in the `.tex` source:

- **Name:** Find the line `\textcolor{engBody}{Alex Chen}` and replace `Alex Chen` with the buyer's name
- **Title:** Find the `// Staff Backend Engineer, ...` line and replace the title
- **Contact:** Find the contact line and replace each field, keeping the `·` middle-dot separators
- **Bullets:** Each `\item` is a bullet. Add or remove `\item` lines
- **Tech names in mono:** Use `\m{Kafka}` instead of `Kafka` — the `\m{}` command wraps the text in mono

### Customizing the color (The Modern, The Bold, The Founder, The Engineer)

Find the `\definecolor{...}{HTML}{XXXXXX}` line near the top of the file and change the hex value:

```latex
% The Modern: muted blue default
\definecolor{modAccent}{HTML}{2C5F7F}    % change to {5A7A5E} for sage
\definecolor{modBg}{HTML}{EAF1F4}        % change to {EEF1EC} for sage
```

Recompile. The PDF updates.

### Customizing the fonts

The default templates use Inter for sans and JetBrains Mono for mono. Overleaf has these pre-installed. If the buyer wants different fonts:

```latex
% Change the main font
\setmainfont{Source Sans 3}[Scale=0.95]   % alternative: open-source

% Change the mono font
\setmonofont{Fira Code}[Scale=0.85]       % alternative: Fira Code
```

Overleaf auto-resolves font names from its font library. For a local LaTeX install, the buyer needs to install the fonts system-wide.

### Compiling and exporting

- **Compile:** Click "Recompile" (or Ctrl+S)
- **Download PDF:** Menu > PDF (or the download icon)
- **Download source:** Menu > Source

### Common LaTeX issues

| Issue | Fix |
|-------|-----|
| `Font "Inter" not found` | Check the compiler is set to XeLaTeX (not pdfLaTeX). If using local LaTeX, install Inter system-wide |
| The mono accents look like sans | Verify the font names in `\setmonofont{}` — typo = fallback to default |
| The sidebar bleeds off the page | Adjust the `width=1.85in` in the `\newtcolorbox{sidebar}` definition |
| The hero band doesn't extend full-width | The `tikz` overlay requires the page to be set up correctly. Ensure `\usepackage{tikz}` is loaded and the overlay is in the correct scope |
| Accent color doesn't change | Check the `\definecolor{}` line is BEFORE any command that uses the color |

---

## PDF Export — The Right Way

PDF export is the final step. Three rules:

### Rule 1: Embed fonts

Fonts that aren't embedded show as substitutes on the recipient's device. This destroys the design.

**Word:** File > Options > Save > check "Embed fonts in the file" > save > export to PDF.
**Google Docs:** Fonts are embedded automatically when exporting to PDF.
**LaTeX:** Fonts are embedded automatically in the compiled PDF (via `fontspec` + XeLaTeX).

### Rule 2: Use sRGB color

Some monitors and PDF viewers use different color spaces. sRGB is the universal standard. If the buyer picks a color in CMYK or P3, it may shift on the recipient's screen.

**To check:** Open the PDF in Adobe Acrobat > Tools > Print Production > Output Preview. The buyer should see "No color warnings."

### Rule 3: Compress the file

A 1-page resume PDF should be **under 500 KB**. Most templates compile to under 200 KB. If the PDF is larger:

- Reduce the image resolution (any images should be 150 DPI max for screen, 300 DPI for print)
- Use "Save for Web" or "Optimize for Screen" in the export settings
- Re-export from the source (DOCX or LaTeX) rather than rasterizing

---

## Filename Conventions

The buyer should use these filenames:

| Document | Filename |
|----------|----------|
| Resume (PDF) | `FirstName-LastName-Resume-2026.pdf` |
| Resume (DOCX) | `FirstName-LastName-Resume-2026.docx` |
| Cover letter | `FirstName-LastName-CoverLetter-CompanyName.pdf` |
| LinkedIn export | `FirstName-LastName-LinkedIn-2026.pdf` |

**Why these names work:**
- Recruiters can find them in their inbox
- ATS systems can parse the candidate name from the filename
- The year indicates the version
- No "v3_final_FINAL" nonsense

---

## Sharing & Privacy

Three rules for sharing the resume:

1. **Remove personal metadata before sharing the DOCX.** In Word: File > Info > Inspect Document > "Check for Issues" > "Inspect" > "Remove all" under "Document Properties and Personal Information." Then save.

2. **Don't share the LaTeX source publicly unless the buyer wants it shared.** The `.tex` file contains the buyer's full content. The PDF is the shareable artifact.

3. **Use a personal site or portfolio host for the PDF.** Recommended: the buyer's own domain, or a free Notion page exported to PDF, or a Carrd/Framer site. Avoid public Google Drive links — they expire.

---

## Buyer Customization Checklist

Before submitting any application, the buyer should:

- [ ] Filename follows the convention above
- [ ] DOCX is the format submitted to ATS portals
- [ ] PDF is the format emailed to humans
- [ ] PDF has embedded fonts (verified by opening on a different device)
- [ ] Personal metadata stripped from the DOCX
- [ ] Page count is 1 (or 2 for the senior version, or 3 only for executive)
- [ ] All hyperlinks work (clickable in PDF)
- [ ] Spell-check has been run (Word: Review > Spelling & Grammar)
- [ ] The buyer has read the resume out loud to catch awkward phrases
- [ ] The buyer has shown the resume to one trusted friend for a sanity check

---

## When the Buyer Should Re-Export

Re-export the resume from the source (DOCX or LaTeX) every time. Don't re-export from a PDF — every export loses some quality. The source files are the truth; the PDF is the artifact.

If the buyer makes a change in the design version, they need to make the same change in the ATS strip-down version. Keep both versions in sync. A small discipline that pays off when the buyer is applying to 20+ roles in a week.
