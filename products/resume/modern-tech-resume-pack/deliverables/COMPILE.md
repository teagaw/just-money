# Modern Tech Resume Pack — Compile Guide

This guide explains how to turn the 5 LaTeX `.tex` files in this directory
into 5 PDFs that you can sell on Etsy, Creative Market, or Gumroad.

**Two paths:** the bash one-liner (5 min) or the Overleaf manual path (30 min,
zero install).

---

## Path A — Bash + local TeX (5 min, automated)

### Requirements
- A Unix shell (macOS Terminal, Linux, or WSL on Windows)
- `xelatex` installed:
  - **macOS:** `brew install --cask mactex` (or download MacTeX from tug.org)
  - **Linux:** `sudo apt install texlive-xetex texlive-fonts-recommended` (Debian/Ubuntu) or the equivalent for your distro
  - **Windows:** install MiKTeX (https://miktex.org/download), then ensure `xelatex` is on your PATH. WSL is easier.

### Run it

```bash
cd products/resume/modern-tech-resume-pack/deliverables
chmod +x compile.sh
./compile.sh
```

Output: `compiled/the-minimalist.pdf`, `compiled/the-modern.pdf`,
`compiled/the-bold.pdf`, `compiled/the-engineer.pdf`, `compiled/the-founder.pdf`.

The script runs `xelatex` twice per file so cross-references resolve.

### What if a compile fails?

The error log is preserved in a temp directory — re-run with `set -x` for
verbose output, or open the offending `.tex` in a text editor and check for
missing braces or an unclosed `\begin{...}` environment.

Most common issue: a missing font. The resumes use standard TeX fonts (no
external font files), so this should not happen unless you've customized the
preamble.

---

## Path B — Overleaf (zero install, 30 min)

Overleaf is a free online LaTeX editor. It compiles in the cloud, so you
don't need to install anything.

### Step 1 — Create a project

1. Go to https://www.overleaf.com and sign in (free account is fine).
2. **New Project → Blank Project**.
3. Name it `Modern Tech Resume Pack` (or anything you like).

### Step 2 — Set the compiler to XeLaTeX

The default is pdfLaTeX. This pack uses XeLaTeX (for better font support).

1. Click the **Menu** button (top-left, looks like a hamburger).
2. **Settings → Compiler → XeLaTeX**.
3. **Save**.

### Step 3 — Upload the .tex files

1. In the file panel on the left, delete the default `main.tex`.
2. Click the upload icon (or drag-and-drop).
3. Upload all 5 `.tex` files at once:
   - `the-minimalist.tex`
   - `the-modern.tex`
   - `the-bold.tex`
   - `the-engineer.tex`
   - `the-founder.tex`
4. Open `the-minimalist.tex` first. Click **Recompile** (top-right).
5. The PDF preview should appear on the right. Verify it fits on 1 page.
6. Repeat for the other 4.

### Step 4 — Download the PDFs

1. For each `.tex` file: open it → **Menu → PDF (or whatever the download icon is)** → save as `<style>.pdf`.
2. Or: at the project level, **Menu → Download → PDF**. This downloads the
   currently-open file. You'll need to switch files and re-download 5 times.

### Step 5 — Validate

For each PDF:

1. Open in any PDF viewer.
2. Verify it is exactly 1 page on US Letter (8.5" × 11") or A4.
3. Verify the text is selectable (not flattened) — this matters for ATS
   (Applicant Tracking Systems) that parse the text.
4. Verify the links work (if you added clickable hyperlinks for GitHub, LinkedIn, etc.).

---

## Path C — PowerShell + MiKTeX on Windows (10 min)

If you have MiKTeX installed and prefer PowerShell:

```powershell
cd products\resume\modern-tech-resume-pack\deliverables
$xelatex = (Get-Command xelatex).Source
$styles = @('the-minimalist', 'the-modern', 'the-bold', 'the-engineer', 'the-founder')
New-Item -ItemType Directory -Path compiled -Force | Out-Null
foreach ($s in $styles) {
    $work = New-Item -ItemType Directory -Path "$env:TEMP\resume-$s" -Force
    Copy-Item "$s.tex" $work.FullName
    Push-Location $work.FullName
    & $xelatex -interaction=nonstopmode "$s.tex" | Out-Null
    & $xelatex -interaction=nonstopmode "$s.tex" | Out-Null
    Pop-Location
    Move-Item "$work\$s.pdf" "compiled\$s.pdf" -Force
}
```

---

## Post-compile checklist

For each PDF, verify:

- [ ] Exactly 1 page (open in Adobe Acrobat or Preview, check page count)
- [ ] All text is selectable (try to copy a line)
- [ ] All hyperlinks are clickable
- [ ] No "Overfull \hbox" warnings that would push content off the page
- [ ] No clipped text or overlapping elements
- [ ] Consistent margins (should match across all 5 styles)

If a PDF comes out at 2 pages, the content is too long. The `.tex` files
should already be tuned to 1 page — but if you customized the content, you
may need to:
- Reduce bullet count on the Experience section
- Shorten the Projects section to 2-3 items
- Move the Skills list to a sidebar (if not already)
- Reduce font size by 0.5pt

---

## Packaging for sale

```
Modern-Tech-Resume-Pack-v1.zip
├── the-minimalist.pdf
├── the-modern.pdf
├── the-bold.pdf
├── the-engineer.pdf
├── the-founder.pdf
├── the-engineer-content.md       (so buyers can see what to put in their own)
├── the-modern-content.md
├── the-bold-content.md
├── the-minimalist-content.md
├── the-founder-content.md
├── ATS-optimization-guide.pdf    (export from a markdown file you'll write in v1.1)
├── cover.png                     (from your mockup-prompt tool)
├── mockup-minimalist.png
├── mockup-modern.png
├── mockup-bold.png
├── mockup-engineer.png
├── mockup-founder.png
├── la-tex-source.zip             (zip of all 5 .tex files, as a power-user bonus)
└── README.txt                    ("Open the PDFs in Adobe Acrobat, Edit PDF, and replace the sample text with your own.")
```

Upload the `.zip` to Gumroad / Etsy / Creative Market.

---

## Updating the resume pack to v1.1

The `.tex` files are parametric. The most common v1.1 update is the "swap
your info in 60 seconds" workflow:

1. Buyer opens `the-modern.tex` in Overleaf (the free tier is enough).
2. Finds the line `\name{John Doe}` and replaces with their own name.
3. Recompiles → instant PDF.

To support this, document the 5-7 lines buyers need to edit at the top of
each `.tex` file (just before `\begin{document}`). The README.md in this
folder is the right place for that buyer-facing walkthrough.
