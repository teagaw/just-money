# Deliverables — Modern Tech Resume Pack

This folder contains the 5 compilable LaTeX sources for the Modern Tech Resume Pack, plus the swappable content for each. Every file uses the same fictional candidate — **Alex Chen, Staff Software Engineer, 9 years** — so you can directly compare how the same career tells a different story across the 5 visual languages.

## What's in this folder

| File | What it is | Compiler |
|------|-----------|----------|
| `the-minimalist.tex` | Style 1: Quiet, serif, single-column | **pdflatex** |
| `the-modern.tex` | Style 2: Sidebar + main column | **XeLaTeX** |
| `the-bold.tex` | Style 3: Full-bleed hero band | **XeLaTeX** |
| `the-engineer.tex` | Style 4: Mono tech-name accents | **XeLaTeX** |
| `the-founder.tex` | Style 5: Dense, side-venture-friendly | **XeLaTeX** |
| `*-content.md` | Swappable content (your text goes here) | — |
| `README.md` | This file | — |

## The single-candidate promise

The README of the pack promises that all 5 sample resumes use the same fictional Senior Software Engineer (Alex Chen, 9 years across Stripe → Cloudflare → Dropbox → Google → Microsoft) so you can directly compare how the same career is told in 5 visual languages.

What changes between styles is **emphasis and framing**, not the underlying facts:

| Style | What it emphasizes | Sections it changes |
|-------|-------------------|---------------------|
| Minimalist | Impact metrics, senior restraint | Standard 1-column with summary + experience + OSS + skills + education |
| Modern | Career progression, cross-functional work | Adds a colored sidebar with stack + tools; main column shows PM-adjacent leadership |
| Bold | Side projects, OSS, design-engineering | Replaces one Experience role with a "Selected Work" + "Recognition" section |
| Engineer | System + tech + scale + outcome | Mono tech names inline; no sidebar; `//` title prefix |
| Founder | Side venture, advisory, range | Splits experience into "Ventures" (OSS project as venture) + "Operating Experience" (canonical 5-company career) + Advisory + Press |

**The career facts (companies, dates, scale numbers, OSS metrics) are identical across all 5 files.** A buyer can open all 5 PDFs side by side and see how the same Stripe → Cloudflare → Dropbox → Google → Microsoft path reads in 5 different visual languages.

## How to compile (Overleaf)

1. Go to [overleaf.com](https://www.overleaf.com) and create a new project (Blank Paper).
2. Upload one of the `.tex` files (e.g. `the-engineer.tex`) to the project.
3. **Set the compiler:** Click the compiler dropdown in the toolbar (it usually says "LaTeX" or "pdfLaTeX"). For all styles except The Minimalist, pick **XeLaTeX**. For The Minimalist, pick **pdfLaTeX** (or leave the default).
4. Hit **Recompile**. The PDF appears on the right.
5. To download, click the PDF and use the download icon.

All 5 templates use Inter and JetBrains Mono, which are **pre-installed on Overleaf** — no font setup needed.

## How to compile locally (Mac / Linux / Windows with TeX Live)

You'll need a TeX distribution with XeLaTeX support:

- **Mac:** Install [MacTeX](https://tug.org/mactex/) (full version, ~5GB) or BasicTeX + `tlmgr install fontspec` + `tlmgr install charter`
- **Linux (Debian/Ubuntu):** `sudo apt-get install texlive-xetex texlive-fonts-recommended texlive-fonts-extra`
- **Windows:** Install [TeX Live](https://tug.org/texlive/) full scheme

Then download the fonts:
- **Inter:** https://fonts.google.com/specimen/Inter
- **JetBrains Mono:** https://www.jetbrains.com/lp/mono/

Install them to your OS font directory and run:

```bash
xelatex the-engineer.tex   # for styles 2, 3, 4, 5
pdflatex the-minimalist.tex # for style 1
```

A `.pdf` will be produced alongside the `.tex` file.

## How to swap the content for your own resume

You have two paths:

**Path A (no LaTeX):** Edit the matching `*-content.md` file, then use the markdown as your reference while editing the `.tex` file directly. The markdown mirrors the LaTeX structure 1:1.

**Path B (LaTeX):** Open the `.tex` file in any text editor and replace the placeholder content. The structure to find:

```latex
% The candidate's name
{\fontsize{28}{32}\selectfont\textcolor{mintext}{Alex Chen}}   % <-- replace

% A role entry
\role{Stripe}{Staff Software Engineer, Data Platform}{Mar 2022 --- Present}   % <-- replace
\begin{itemize}
  \item Owned the canonical event ingestion...   % <-- replace
\end{itemize}
```

For mono tech names in The Engineer template, use the `\m{}` macro:

```latex
Re-architected the write-side commit log in \m{Rust} + \m{Tokio}
```

Do not change anything inside `\definecolor{...}`, `\setmainfont{...}`, or `\newcommand{...}` unless you know what you're doing.

## ATS submission note

These `.tex` files produce the **design version** of each style. For online application portals (Workday, Greenhouse, Lever, iCIMS), use the stripped single-column `.docx` version instead — colored sidebars and full-bleed hero bands will break ATS parsers.

The DOCX ATS versions are not included in this folder; they live in the main pack's `.docx` files. The format-guide (in the parent folder) explains how to strip the design for ATS submission.

## Verifying the LaTeX compiles

If you have XeLaTeX installed locally, you can sanity-check the files by running:

```bash
xelatex -interaction=nonstopmode the-engineer.tex
```

A successful run will produce a `the-engineer.pdf` and a log file with no fatal errors. Warnings about missing references or undefined citations are OK for a 1-page resume; the PDF still renders.

## License

For personal job applications, unlimited. No resale, no redistribution. See the main pack README for full terms.
