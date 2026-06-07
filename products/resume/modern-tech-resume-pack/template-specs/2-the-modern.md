# Template Spec — The Modern

**Style #2 of 5** · For product managers, product designers, data scientists, marketing & growth leaders, hybrid IC/lead roles.
**Vibe:** Balanced. Structured. Friendly professional.

---

## 1. Design System

### Layout Grid

- **Page size:** US Letter (8.5" × 11")
- **Margins:** 0.5" all sides
- **Sidebar width:** 1.85"
- **Main column width:** 5.4" (with 0.25" gutter between)
- **Total content width:** 7.5"
- **Sidebar background:** subtle color block (off-white #F4F1EC for sage variant, #EAF1F4 for blue variant)
- **Sidebar border-radius:** subtle 4px on the color block
- **Vertical rhythm:** 16pt baseline
- **Section spacing:** 12pt before / 6pt after for headings

### Typography

| Element | Font | Size | Weight | Color | Notes |
|---------|------|------|--------|-------|-------|
| Name | Inter or Söhne | 22pt | Bold (700) | #FFFFFF (on color band) | Letter-spacing -0.3px |
| Title / tagline | Inter or Söhne | 10.5pt | Medium (500) | #FFFFFF at 85% opacity | 1 line below name |
| Section heading (main) | Inter or Söhne | 11pt | Semibold (600) | Accent color (e.g. #2C5F7F blue, #5A7A5E sage) | UPPERCASE, letter-spacing 0.8px |
| Section heading (sidebar) | Inter or Söhne | 10pt | Semibold (600), UPPERCASE, letter-spacing 1px | #1A1A1A | All caps, smaller scale |
| Role / company | Inter or Söhne | 11pt | Semibold (600) | #1A1A1A | Bold, dates below in 9.5pt secondary |
| Body | Inter or Söhne | 10pt | Regular (400) | #1A1A1A | Line height 1.4 |
| Sidebar body | Inter or Söhne | 9.5pt | Regular (400) | #2A2A2A | Slightly tighter |
| Sidebar skill tags | Inter or Söhne | 9pt | Medium (500) | Accent color (e.g. #2C5F7F) | Inline, separated by `·` |

**LaTeX note:** Use `fontspec` (XeLaTeX) or `sourcesanspro` (pdflatex) for Inter fallback. Sidebar implemented via `tcolorbox` or `paracol` package.

### Color — Two Approved Variants

**Variant A: Muted Blue** (default)
- Sidebar background: `#EAF1F4` (pale blue-gray)
- Accent: `#2C5F7F` (deep teal-blue)
- Name band background: `#2C5F7F`
- Body text: `#1A1A1A`
- Secondary text: `#555555`

**Variant B: Sage Green**
- Sidebar background: `#EEF1EC` (warm pale sage)
- Accent: `#5A7A5E` (forest sage)
- Name band background: `#5A7A5E`
- Body text: `#1A1A1A`
- Secondary text: `#555555`

**Variant C: Warm Sand** (bonus, for design-leaning PMs)
- Sidebar background: `#F4F1EC` (warm off-white)
- Accent: `#8B6F4E` (muted bronze)
- Name band background: `#8B6F4E`

### Section Order

**Sidebar (left, top to bottom):**
1. Contact — email, phone, location
2. Links — LinkedIn, GitHub, portfolio, personal site
3. Core Skills — grouped, 4-6 per group
4. Tools & Platforms
5. Languages (spoken)
6. Certifications
7. Interests (optional, 1 line)

**Main column (right, top to bottom):**
1. Header band (1.1" tall) — Name + title in white-on-color
2. Summary — 2-3 lines, present tense, role-focused
3. Experience — 3-5 roles, most recent first
4. Selected Projects or Key Initiatives
5. Education
6. Awards / Speaking (optional)

### What to Fill In

| Section | Content Source | Word Count |
|---------|----------------|------------|
| Name | Full legal name | 2-4 words |
| Title | Current role + specialization (e.g., "Senior PM, Growth") | 3-6 words |
| Summary | Who you are + what you ship + what you're looking for | 35-55 words |
| Experience bullets | For each role: company, title, dates, 3-5 bullets, each = action + scope + metric | 5-7 lines per role |
| Skills (sidebar) | Group: Product, Analytics, Tech, Strategy. 4-7 per group | 1 line per group |
| Tools | Figma, Amplitude, Looker, Notion, JIRA, etc. | 1 line |
| Languages | English (native), Spanish (professional), etc. | 1 line |
| Education | School, degree, year | 1-2 lines |

### Bullet Point Discipline

Same rules as The Minimalist, with one addition for PMs:

- ✅ Launched onboarding redesign that lifted day-7 retention from 38% to 51% across 2M MAU, working with 3 squads and 2 design leads.
- ❌ Led the onboarding project.

**PM-specific rule:** Always include the team size or cross-functional partners. PMs ship through other people — that work should be visible.

---

## 2. File Outputs

- `2-the-modern/1-page.docx`
- `2-the-modern/1-page.tex`
- `2-the-modern/1-page.pdf`
- `2-the-modern/1-page-ats.docx` *(strips the sidebar; converts to single column)*
- `2-the-modern/color-variant-blue.docx`
- `2-the-modern/color-variant-sage.docx`
- `2-the-modern/color-variant-sand.docx`
- `2-the-modern/2-page.docx`
- `2-the-modern/2-page.tex`
- `2-the-modern/sample-filled.md` *(see `sample-resumes/2-the-modern.md`)*

---

## 3. DOCX / Google Docs Implementation

### Building the Sidebar

**Option A: Text box (recommended for design fidelity)**
- Insert > Text Box > Draw Text Box
- Position at left margin, full height
- Fill: variant background color, no border, 4px corner radius
- Width 1.85", full content height
- Inside: section headings (UPPERCASE), then content with appropriate spacing

**Option B: Single-column table (better for ATS-compatibility)**
- Insert > Table > 1 row × 2 columns
- Left column width: 1.85", right column width: 5.4"
- Left cell fill: variant background color
- Left cell vertical alignment: top
- No visible borders

### Header Band

- Insert > Shape > Rectangle
- Width: full page minus margins (7.5")
- Height: 1.1"
- Fill: accent color
- Position: anchored to top of page
- Text overlay: Name in 22pt white bold, centered or left-aligned with 0.4" left padding
- Title in 10.5pt white, below name, left-aligned with 0.4" left padding

### Skills Tags in Sidebar

- Group label: bold, 9.5pt, color #1A1A1A, UPPERCASE
- Skills list: 9pt, accent color, separated by ` · ` middle dot
- Example: `Roadmapping · OKRs · User Research · A/B Testing · SQL`

### Google Docs

- Use a 2-column table for sidebar/main layout
- No table borders (set all to 0)
- Header band: use Insert > Drawing > Shape > Rectangle OR a 1-row 1-column table with colored background and white text
- Export to .docx via File > Download

---

## 4. LaTeX Implementation

```latex
\documentclass[letterpaper,10pt]{article}

\usepackage[margin=0.5in]{geometry}
\usepackage{fontspec}              % XeLaTeX
\usepackage{xcolor}
\usepackage{tcolorbox}
\usepackage{enumitem}
\usepackage{tabularx}
\usepackage{hyperref}
\usepackage{ragged2e}
\usepackage{multicol}

% Set main font (requires Inter installed locally; fallback to default sans)
\setmainfont{Inter}[Scale=0.95]
\setsansfont{Inter}[Scale=0.95]

\definecolor{modAccent}{HTML}{2C5F7F}    % muted blue
\definecolor{modBg}{HTML}{EAF1F4}        % pale blue-gray
\definecolor{modBody}{HTML}{1A1A1A}
\definecolor{modSec}{HTML}{555555}

\setlength{\parindent}{0pt}
\pagestyle{empty}
\setlist[itemize]{label=— , leftmargin=1.4em, itemsep=2pt, topsep=2pt}

% Sidebar as tcolorbox
% (FIXED: original used `height fixed for=full` which is invalid tcolorbox syntax.
%  Replaced with `height fill` so the sidebar fills the column on all pages.)
\newtcolorbox{sidebar}[1][]{
  colback=modBg,
  colframe=modBg,
  arc=4pt,
  boxrule=0pt,
  left=8pt, right=8pt, top=8pt, bottom=8pt,
  width=1.85in,
  height fill
}

\newcommand{\sidehead}[1]{%
  \vspace{6pt}
  {\bfseries\fontsize{10}{12}\selectfont\textcolor{modBody}{\MakeUppercase{#1}}}
  \vspace{2pt}
}

\newcommand{\sidebody}[1]{%
  {\fontsize{9.5}{12}\selectfont\textcolor{modBody}{#1}}
}

\newcommand{\sideacc}[1]{%
  {\fontsize{9}{12}\selectfont\textcolor{modAccent}{#1}}
}

\newcommand{\mainhead}[1]{%
  \vspace{12pt}
  {\bfseries\fontsize{11}{14}\selectfont\textcolor{modAccent}{\MakeUppercase{#1}}}
  \vspace{4pt}
}

\begin{document}

% Header band
\noindent\begin{tcolorbox}[colback=modAccent, colframe=modAccent, boxrule=0pt,
  left=14pt, right=14pt, top=12pt, bottom=12pt, arc=0pt]
  {\color{white}\bfseries\fontsize{22}{26}\selectfont Alex Chen} \\[4pt]
  {\color{white}\fontsize{10.5}{14}\selectfont Senior Product Manager — Growth \& Activation}
\end{tcolorbox}

\vspace{6pt}

% Two-column layout
\noindent\begin{minipage}[t]{1.85in}
\begin{sidebar}
\sidehead{Contact}
\sidebody{alex@chen.dev} \\
\sidebody{+1 415 555 0142} \\
\sidebody{San Francisco, CA}

\sidehead{Links}
\sideacc{linkedin.com/in/alexchen} \\
\sideacc{alexchen.dev} \\
\sideacc{github.com/alexchen}

\sidehead{Core Skills}
\sideacc{Roadmapping · OKRs · User Research · A/B Testing · SQL · Figma · Retargeting}

\sidehead{Tools \& Platforms}
\sidebody{Amplitude, Looker, Mixpanel, Notion, JIRA, Linear, Tableau, Heap}

\sidehead{Languages}
\sidebody{English (native) \\ Mandarin (professional)}

\sidehead{Interests}
\sidebody{Endurance cycling. Bouldering. Reading systems theory.}
\end{sidebar}
\end{minipage}%
\hfill
\begin{minipage}[t]{5.4in}

\mainhead{Summary}
Senior PM with 7 years driving activation and growth at consumer tech companies. Shipped the redesign of two onboarding flows that lifted D7 retention by 30\%+ across 5M MAU. Looking for a senior IC or group PM role at a company where activation is the metric that matters.

\mainhead{Experience}

\noindent\textbf{Stripe} \hfill \textcolor{modSec}{Mar 2022 — Present} \\
\textit{Senior Product Manager, Atlas (Acquisition)} \hfill \textcolor{modSec}{San Francisco}
\begin{itemize}
  \item Owned the SMB activation roadmap; shipped 9 experiments in 2024 that lifted trial-to-paid from 11.2\% to 14.8\%
  \item Led the redesign of the merchant dashboard's first-run experience across 3 squads and 2 design leads
  \item Built the activation metrics layer in Looker; adopted by 6 PMs and the growth analytics team
\end{itemize}

\vspace{4pt}
\noindent\textbf{Dropbox} \hfill \textcolor{modSec}{Aug 2019 — Feb 2022} \\
\textit{Product Manager, New User Activation} \hfill \textcolor{modSec}{San Francisco}
\begin{itemize}
  \item Launched the team-spaces onboarding flow; lifted D7 team activation from 24\% to 41\%
  \item Co-led the migration to amplitude; reduced analytics tool spend by \$180k/year
\end{itemize}

\vspace{4pt}
\noindent\textbf{Lyft} \hfill \textcolor{modSec}{Jul 2017 — Jul 2019} \\
\textit{Associate Product Manager, Rider Growth} \hfill \textcolor{modSec}{San Francisco}
\begin{itemize}
  \item Ran 23 A/B tests on the rider referral program; grew referral-attributed rides from 8\% to 14\% of weekly volume
\end{itemize}

\mainhead{Education}
\textbf{Stanford University} — M.S. Management Science \& Engineering, 2017 \\
\textbf{Duke University} — B.S. Economics, Public Policy, 2015

\end{minipage}

\end{document}
```

**LaTeX tips:**
- Compile with `XeLaTeX` (required for `fontspec` + Inter)
- For Overleaf: change compiler to XeLaTeX in the project settings
- The `tcolorbox` package gives the rounded corner on the sidebar
- To swap colors: change `modAccent` and `modBg` definitions

---

## 5. ATS Strip-Down

The ATS version strips everything visual and rebuilds as a single column:

1. Remove the sidebar tcolorbox
2. Remove the header band — name in plain 18pt bold at top
3. Move all sidebar content (Contact, Skills, Tools, Languages, Interests) into the main flow with regular headings
4. Remove all color — black text only
5. Use standard bullet `•`
6. Use the same experience content

**Output:** `1-page-ats.docx` in the same folder. Same content, single column, no design.

---

## 6. Customization Checklist

- [ ] Pick a color variant (blue / sage / sand)
- [ ] Replace name, title, contact
- [ ] Rewrite summary in present tense, role-focused
- [ ] Update skills to match the JD (read the job description twice; copy exact terms)
- [ ] Quantify every bullet (%, $, count, scale)
- [ ] Add team size to PM bullets ("3 squads and 2 design leads")
- [ ] Save 2 versions: design + ATS
- [ ] Export PDF with embedded fonts
- [ ] Filename: `FirstName-LastName-Resume-2026.pdf`

---

## 7. Design Rationale

The Modern works because **it signals balance in 4 seconds**. The sidebar communicates "I have a stack of skills AND a track record of shipping." The main column tells the story. The color (any variant) says "I am a professional" without saying "I am a designer."

For PMs and hybrid roles, this is the safest bet. The 3 color variants let the buyer match the company's brand warmth (Stripe = blue, Notion = sand-ish, Linear = sage-ish) without being on-the-nose.

The sidebar is the most ATS-risky element. That's why the pack ships a stripped single-column ATS version. Use the design version when emailing a human. Use the ATS version when uploading to Workday, Lever, Greenhouse, or iCIMS.
