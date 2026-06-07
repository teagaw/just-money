# Template Spec — The Bold

**Style #3 of 5** · For senior product designers, brand designers, creative directors, design engineers, founders in design-led spaces.
**Vibe:** Confident. Refined. The resume is a design artifact.

---

## 1. Design System

### Layout Grid

- **Page size:** US Letter (8.5" × 11")
- **Margins:** 1.0" left, 0.5" right, 0.5" top, 0.5" bottom (intentional asymmetry)
- **Hero band:** Full bleed (extending to page edges), 1.2" tall, accent color fill
- **Content area:** 7" wide × 9.5" tall (after hero)
- **Single column for ATS, two-zone for design** (hero + content, but content is single-column for parse safety)
- **Vertical rhythm:** 18pt baseline
- **Section spacing:** 16pt before / 8pt after for headings

### Typography

| Element | Font | Size | Weight | Color | Notes |
|---------|------|------|--------|-------|-------|
| Name (hero) | Inter Display, Söhne Breit, or Founders Grotesk | 32pt | Bold (700) | #FFFFFF | Letter-spacing -0.8px, slightly left-of-center |
| Title (hero) | Inter or Söhne | 11pt | Medium (500) | #FFFFFF at 80% opacity | Single line, left-aligned with name |
| Section heading | Inter or Söhne | 14pt | Semibold (600) | Accent color | Oversized, signals confidence |
| Role / company | Inter or Söhne | 11pt | Semibold (600) | #1A1A1A | Bold, dates in 9.5pt secondary |
| Body | Inter or Söhne | 10pt | Regular (400) | #1A1A1A | Line height 1.45 |
| Accent marks | Symbol font or unicode | 10pt | Regular | Accent color | `◆`, `▣`, or `—` before each role |
| Hairline divider | — | 0.5pt | — | Accent color | 16pt margin above and below |

**LaTeX note:** Use `fontspec` (XeLaTeX) with `Inter Display` for the name. Accent marks via `pifont` package (`\ding{169}` = ◆, `\ding{113}` = ▣).

### Color — Three Approved Variants

**Variant A: Burnt Orange** (default — most versatile)
- Hero fill: `#C84B1F` (burnt orange)
- Accent: `#C84B1F`
- Body text: `#1A1A1A`
- Secondary text: `#555555`
- Accent marks: `#C84B1F`

**Variant B: Oxblood** (for design directors, fashion/CPG-adjacent)
- Hero fill: `#6B2C2C` (oxblood)
- Accent: `#6B2C2C`
- Body text: `#1A1A1A`

**Variant C: Forest Green** (for sustainability, edtech, calm brand designers)
- Hero fill: `#1F4D3B` (forest)
- Accent: `#1F4D3B`
- Body text: `#1A1A1A`

**Variant D: Charcoal Mono** (for product designers at engineering-heavy orgs)
- Hero fill: `#1A1A1A` (charcoal)
- Accent: `#C84B1F` (orange pop on charcoal)
- Body text: `#1A1A1A`
- White name on charcoal

### Section Order

1. **Hero band** — Full-bleed color block, name + title + contact
2. **Summary** — 2-3 lines, strong voice, present tense
3. **Experience** — 3-4 roles (fewer than other styles; designers have fewer, deeper roles)
4. **Selected Work** — Portfolio pieces with role, scope, link (3-5 entries)
5. **Recognition** — Awards, features, talks (1-2 lines each)
6. **Skills & Tools** — Grouped, 1-2 lines per group
7. **Education** — Bottom, 1-2 lines

### What to Fill In

| Section | Content Source | Word Count |
|---------|----------------|------------|
| Name | Full legal name | 2-4 words |
| Title | Current role + specialty ("Principal Product Designer" or "Design Director, Brand") | 3-6 words |
| Summary | 1-2 sentences: your craft, your domain, what you ship | 30-50 words |
| Experience bullets | 3-4 bullets per role. For designers: artifact + scope + outcome | 4-6 lines per role |
| Selected Work | 3-5 portfolio pieces. Each: title, role, scope, link | 2-3 lines each |
| Recognition | Awards, publications, talks, features | 1-2 lines each |
| Skills | Design tools, methods, domains | 1-2 lines per group |
| Education | School, degree, year | 1-2 lines |

### Designer-Specific Bullet Discipline

For designers, bullets follow: **Artifact + Scope + Outcome** or **Process + Outcome + Metric**.

- ✅ Designed the rebrand system adopted across 14 product surfaces, 6 marketing sites, and the design system; reduced visual drift by 80% in the first 6 months.
- ✅ Led the design of a checkout flow used by 2M daily users; lifted conversion from 68% to 74% (a 9% relative lift, $14M annualized).
- ❌ Redesigned the checkout.

**Designer rules:**
1. Always include the artifact (the *thing* you designed).
2. Always include the scope (users reached, surfaces touched, team size).
3. When possible, include the outcome (business metric, qualitative result, recognition).
4. Designers don't have to be as metric-driven as PMs — craft and process language is acceptable.

---

## 2. File Outputs

- `3-the-bold/1-page.docx`
- `3-the-bold/1-page.tex`
- `3-the-bold/1-page.pdf`
- `3-the-bold/1-page-ats.docx` *(strips hero, single column)*
- `3-the-bold/color-variant-orange.docx`
- `3-the-bold/color-variant-oxblood.docx`
- `3-the-bold/color-variant-forest.docx`
- `3-the-bold/color-variant-charcoal.docx`
- `3-the-bold/2-page.docx`
- `3-the-bold/2-page.tex`
- `3-the-bold/sample-filled.md` *(see `sample-resumes/3-the-bold.md`)*

---

## 3. DOCX / Google Docs Implementation

### Building the Hero Band

**Method: Single-row table with colored fill**
- Insert > Table > 1 row × 1 column
- Set width to 7.5" (full content area)
- Set height to 1.2" (Cell Size > Row Height > Exactly 1.2")
- Cell fill: accent color
- Cell margins: 0.5" left, 0.4" top, 0.2" bottom
- Type the name (white, 32pt, bold) on one line
- Press Enter, type the title (white, 11pt, medium)
- Set cell text alignment to top-left
- Remove all table borders (right-click table > Table Properties > Borders and Shading > None)

### Hairline Dividers

- Between each section, insert Insert > Horizontal Line
- Format the line: 0.5pt, accent color
- Paragraph spacing: 16pt before, 16pt after

### Accent Marks Before Roles

- Type the accent character (`◆`, `▣`, or `—`) in accent color before each role entry
- Color the character only (select character > Font Color > Accent)
- Format: `◆ Senior Designer · Acme · 2022—Present`

### Google Docs

- Hero band: use a 1×1 table with cell color
- Hairlines: Insert > Horizontal Line (use 1px approximation of 0.5pt)
- Accent marks: Insert > Special Characters, search "diamond" or "black square"
- Export: File > Download > .docx

---

## 4. LaTeX Implementation

```latex
\documentclass[letterpaper,10pt]{article}

\usepackage[margin=0.5in, left=1in]{geometry}
\usepackage{fontspec}
\usepackage{xcolor}
\usepackage{tikz}
\usepackage{enumitem}
\usepackage{tabularx}
\usepackage{hyperref}
\usepackage{pifont}                 % accent marks (\ding{169}=diamond, \ding{113}=square)

\setmainfont{Inter}[Scale=0.95]
\setsansfont{Inter}[Scale=0.95]

\definecolor{boldAccent}{HTML}{C84B1F}  % burnt orange default
\definecolor{boldBody}{HTML}{1A1A1A}
\definecolor{boldSec}{HTML}{555555}

\setlength{\parindent}{0pt}
\pagestyle{empty}
\setlist[itemize]{label=\textcolor{boldAccent}{\ding{113}}, leftmargin=1.5em, itemsep=2pt, topsep=2pt}

\newcommand{\mainhead}[1]{%
  \vspace{16pt}
  {\bfseries\fontsize{14}{18}\selectfont\textcolor{boldAccent}{#1}}
  \vspace{4pt}
  \noindent\textcolor{boldAccent}{\rule{\linewidth}{0.5pt}}
  \vspace{4pt}
}

\newcommand{\role}[4]{%
  \vspace{4pt}
  {\bfseries\fontsize{11}{14}\selectfont\textcolor{boldBody}{#1}} \hfill \textcolor{boldSec}{#4} \\
  \textit{#2} \hfill \textcolor{boldSec}{#3}
  \vspace{2pt}
}

% Use tikz to draw the hero band as a full-width block
\newcommand{\heroband}[3]{%
  \begin{tikzpicture}[remember picture, overlay]
    \fill[boldAccent] (current page.north west) ++(0in,-0.5in) rectangle ++(8.5in,-1.2in);
  \end{tikzpicture}
  \vspace{-1.2in}
  \begin{minipage}{\linewidth}
    \vspace{0.1in}
    {\color{white}\bfseries\fontsize{32}{36}\selectfont #1} \\[4pt]
    {\color{white}\fontsize{11}{14}\selectfont #2} \\
    {\color{white!80}\fontsize{10}{14}\selectfont #3}
  \end{minipage}
}

\begin{document}

\heroband{Alex Chen}{Principal Product Designer — Design Systems \& Brand}{alex@chen.dev · linkedin.com/in/alexchen · alexchen.design · San Francisco}

\vspace{18pt}

\mainhead{Summary}
Principal designer with 8 years shaping product, brand, and design systems at companies that ship fast and write about it. Led the design system that scaled across 4 products and 60+ engineers. Looking for a design leadership role at a company where design is a product decision, not a polish step.

\mainhead{Experience}

\role{Stripe}{Senior Product Designer, Design Systems}{Mar 2022 — Present}{SF}
\begin{itemize}
  \item Owned the unified design system (Helix) used across Atlas, Dashboard, and Terminal; reduced component drift from 38\% to 4\% in 14 months
  \item Led the rebrand rollout across 9 product surfaces, 4 marketing sites, and the design system itself
  \item Founded the cross-product design council with 11 designers across 3 product lines
\end{itemize}

\role{Figma}{Product Designer, Core Canvas}{Aug 2019 — Feb 2022}{SF}
\begin{itemize}
  \item Designed the multiplayer cursors and presence system adopted by 4M+ daily users
  \item Led the dark mode release; shipped to 100\% of users in 6 weeks
\end{itemize}

\role{Airbnb}{Product Designer, Trips}{Jul 2017 — Jul 2019}{SF}
\begin{itemize}
  \item Designed the host onboarding flow; lifted completed listings from 41\% to 58\%
\end{itemize}

\mainhead{Selected Work}

\noindent\textbf{Helix Design System} — Lead Designer, 2022—Present \\
\textcolor{boldSec}{Multi-product system at Stripe · 60+ engineers · 9 surfaces} \\
\textit{helix.stripe.com}

\vspace{6pt}
\noindent\textbf{Multiplayer Presence} — Product Designer, 2020—2022 \\
\textcolor{boldSec}{Real-time collaboration at Figma · 4M+ DAU} \\
\textit{figma.com/multiplayer}

\vspace{6pt}
\noindent\textbf{Host Onboarding Redesign} — Lead Designer, 2017—2019 \\
\textcolor{boldSec}{Airbnb Trips · 17\% lift in completed listings}

\mainhead{Recognition}

\noindent\textbf{Fast Company Innovation by Design} (2023) — Helix Design System \\
\noindent\textbf{Speaker, Config 2024} — "Designing for Trust at Scale" \\
\noindent\textbf{Awwwards Site of the Day} (2021) — figma.com redesign

\mainhead{Skills \& Tools}

\noindent\textbf{Design:} Figma, FigJam, Principle, After Effects, Framer \\
\textbf{Method:} Design systems, brand identity, motion, prototyping, user research \\
\textbf{Code:} HTML, CSS, basic React, SwiftUI (design-engineering literacy)

\mainhead{Education}

\noindent\textbf{RISD} — B.F.A. Graphic Design, 2017 \\
\noindent\textbf{Year-long self-study} — Type design with Undercase Type, 2021

\end{document}
```

**LaTeX tips:**
- Compile with `XeLaTeX` (for `fontspec` + Inter)
- The `tikz` overlay creates the full-bleed hero that breaks out of the margins
- The `\heroband` command takes 3 args: name, title, contact
- Color variants: change `\definecolor{boldAccent}` and re-compile
- The `\mainhead` includes an automatic hairline in the accent color

---

## 5. ATS Strip-Down

1. Remove the hero band — name in plain 18pt bold at top, 1-line title in 11pt below
2. Remove the hairline dividers — use paragraph spacing only
3. Remove the colored `▣` bullets — use Word's default `•`
4. Remove all color — black text
5. Drop the "Selected Work" if it duplicates the portfolio link
6. Keep "Recognition" and "Skills" as standard sections

**Output:** `1-page-ats.docx`. Use this for online portals. Use the design version when emailing or sharing as PDF.

---

## 6. Customization Checklist

- [ ] Pick a color variant that matches the target company's brand warmth
- [ ] Replace name, title, contact in the hero band
- [ ] Rewrite summary with a strong voice — designers can break the PM-summary rules
- [ ] Each experience bullet = artifact + scope + outcome
- [ ] "Selected Work" section replaces some of "Experience" depth — link to the portfolio
- [ ] Add portfolio link (Figma portfolio, personal site, Read.cv)
- [ ] Save 2 versions: design + ATS
- [ ] Export PDF with embedded fonts
- [ ] Filename: `FirstName-LastName-Resume-2026.pdf`

---

## 7. Design Rationale

The Bold works because **designers are evaluated on taste, and the resume is the first taste test**. A timid, generic resume from a designer signals either (a) the designer's taste is not their strength, or (b) the designer doesn't understand the assignment.

The full-bleed hero, the asymmetric margins, the oversized section headings, the accent marks — each is a small choice that says "I notice the details." The choice of *which* color variant (burnt orange vs. oxblood vs. forest vs. charcoal) says "I know what this company is and I'm choosing accordingly."

The risk: this style fails ATS more than any other. The pack ships the stripped single-column version. Use the design version for the HM email. Use the ATS version for Workday.

When to use The Bold: applying to a role where the hiring manager is a designer, a creative director, or a design-aware founder. When *not* to use it: applying to a backend engineering role, a finance role, or a backend-heavy ML role. The aesthetic mismatch is louder than the candidate's qualifications.
