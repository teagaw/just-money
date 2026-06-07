# Template Spec — The Founder

**Style #5 of 5** · For founders, co-founders, exited founders, operators (CPO, CTO, COO), board members, advisors, VCs moving to operating roles.
**Vibe:** Dense. Story-driven. The resume is a one-page operating record.

---

## 1. Design System

### Layout Grid

- **Page size:** US Letter (8.5" × 11")
- **Margins:** 0.5" all sides (tighter than other styles — density is the point)
- **Content area:** 7.5" wide × 10" tall
- **Single column, full width** — no sidebar
- **Vertical rhythm:** 14pt baseline (tighter than other styles)
- **Section spacing:** 10pt before / 4pt after
- **Two-line headline** at the top: Name + 1-line career headline
- **Custom section names** allowed: Ventures, Operating Experience, Advisory, Press, Side Projects, etc.

### Typography

| Element | Font | Size | Weight | Color | Notes |
|---------|------|------|--------|-------|-------|
| Name | Inter, Söhne, or Founders Grotesk | 24pt | Semibold (600) | #0A0A0A | Letter-spacing -0.5px |
| Headline | Inter or Söhne | 11pt | Regular (400) | #1A1A1A | Single line, role + ventures + brand pedigree |
| Section heading | Inter or Söhne | 10pt | Semibold (600), UPPERCASE, letter-spacing 1.5px | #0A0A0A | All caps, smaller scale, no decoration |
| Role / company | Inter or Söhne | 10.5pt | Semibold (600) | #0A0A0A | Bold, dates right-aligned in 9pt mono |
| Outcome line | Inter or Söhne | 10pt | Regular (400), italic | #1A1A1A | 1-line outcome immediately under the role |
| Body | Inter or Söhne | 9.5pt | Regular (400) | #0A0A0A | Slightly smaller — density is intentional |
| Bullet | Unicode `—` (em dash) | 9.5pt | — | #0A0A0A | Compact, no `•` |
| Date | JetBrains Mono or SF Mono | 9pt | Regular (400) | #555555 | Compact `2021—Present` format |
| Logo / brand | — | — | — | — | Optional small logo glyphs in a row (PDF only) |

**LaTeX note:** Use `fontspec` (XeLaTeX) with `Inter` for sans and `JetBrains Mono` for dates. The `tabularx` package handles the right-aligned date column.

### Color — Three Approved Variants

**Variant A: Black + Single Brand** (default)
- Background: `#FFFFFF`
- Primary text: `#0A0A0A`
- Secondary text: `#555555`
- Brand accent: 1 color from the buyer's most recent venture (e.g. `#FF4F00` if their company is orange, `#0D0D0D` if neutral)
- Used sparingly: bullet markers, role-outcome lines, the headline accent

**Variant B: Charcoal Mono** (for design-aware founders)
- Background: `#0A0A0A`
- Primary text: `#FAFAFA`
- Secondary text: `#888888`
- Brand accent: 1 color (e.g. `#FF6B35`)
- White-on-charcoal for a more editorial feel

**Variant C: Off-white Print** (for printed / formal board applications)
- Background: `#FAFAF7`
- Primary text: `#0A0A0A`
- Secondary text: `#555555`
- No accent — pure print look

### Section Order (Customizable)

The Founder style **encourages buyers to use custom section names** that fit their career. The default order:

1. **Name** + 1-line headline ("Founder & CEO, Acme (Acquired by Stripe) • ex-Airbnb • YC W19")
2. **Contact line** — `email · phone · location · linkedin · personal site · twitter`
3. **Summary** *(optional, 2-3 lines, point-of-view-driven)*
4. **Ventures** *(companies founded, status, 1-line outcome each)*
5. **Operating Experience** *(non-founder roles — "I also did the work")*
6. **Advisory & Board** *(1-2 lines per engagement)*
7. **Press & Talks** *(publications, podcasts, keynotes — 1 line each)*
8. **Side Projects** *(current building, OSS, angel investments — 1 line each)*
9. **Skills & Domains** *(1-2 lines)*
10. **Education** *(at the bottom — credentials, not status)*

### What to Fill In

| Section | Content Source | Word Count |
|---------|----------------|------------|
| Name | Full legal name | 2-4 words |
| Headline | Compress the entire career into 1 line: role, current venture, exits, pedigree | 12-25 words |
| Summary | Optional. A specific point of view or thesis ("I'm a founder-operator who's scaled 0→1→100 twice and is looking for the third.") | 25-45 words |
| Ventures | For each: name, your role, dates, status, 1-line outcome + 2-3 bullets of proof | 4-7 lines each |
| Operating Experience | For each non-founder role: company, title, dates, 1-line outcome, 2-3 bullets | 4-6 lines each |
| Advisory | Company, your role, 1-line impact | 1-2 lines each |
| Press & Talks | Outlet, title, year | 1 line each |
| Side Projects | Current building, OSS, angel investments | 1-2 lines each |
| Skills | Domains, methods, specializations | 1-2 lines |
| Education | School, degree, year | 1-2 lines |

### Founder-Specific Bullet Discipline

For founders, bullets follow: **Action + Scope + Outcome** OR **Hire / Build / Ship** verbs.

- ✅ Built Acme from 0 → 8-person team → $2.4M ARR → acquired by Stripe in 18 months.
- ✅ Raised $3.2M seed (YC W19); built the founding team and shipped the first version in 11 weeks.
- ✅ Hired 14 across eng, design, GTM; scaled the org from 3 to 38 over 24 months.
- ❌ Was the CEO of Acme.
- ❌ Managed a team.

**Founder rules:**
1. **Outcomes over responsibilities.** A founder is judged on what they built, not what they did.
2. **Numbers are mandatory.** ARR, users, headcount, capital raised, exits, valuation.
3. **Compaction is a feature.** Founders can fit more on a page than ICs. The density is the signal.
4. **Story arc matters.** The Ventures section should read like a story — each venture builds on the last.
5. **Press is social proof.** A TechCrunch feature, a YC batch, a podcast appearance — all signal credibility.

---

## 2. File Outputs

- `5-the-founder/1-page.docx`
- `5-the-founder/1-page.tex`
- `5-the-founder/1-page.pdf`
- `5-the-founder/1-page-ats.docx` *(strips dates-to-mono swap, removes logos)*
- `5-the-founder/variant-default.docx`
- `5-the-founder/variant-charcoal.docx`
- `5-the-founder/variant-print.docx`
- `5-the-founder/2-page.docx` *(adds full venture details, press, and operating history)*
- `5-the-founder/2-page.tex`
- `5-the-founder/sample-filled.md` *(see `sample-resumes/5-the-founder.md`)*

---

## 3. DOCX / Google Docs Implementation

### Headline Line

- After the name, on a new line, type the headline
- Format: `Founder & CEO, Acme (Acquired by Stripe) • ex-Airbnb • YC W19`
- Use the `•` bullet for separators (U+2022)
- 11pt, regular weight, color #1A1A1A
- Spacing: 2pt before / 12pt after

### Right-Aligned Dates with Tab Stops

- Use a custom tab stop at 7.0" with right alignment
- For each role: type `Role, Company` then Tab then `2021—Present` (en dash)
- The dates in mono: 9pt, JetBrains Mono, color #555555
- This creates the look of a date column without using a table

### Outcome Line Under Each Role

- After the company + date line, on a new line in italic, write 1 outcome sentence
- 10pt, italic, color #1A1A1A
- Example: *Acquired by Stripe in 18 months; reached $2.4M ARR with 8 employees.*
- Spacing: 0pt before / 4pt after

### Custom Section Names

- The template ships with default section names (Ventures, Operating Experience, etc.)
- To rename a section: highlight the heading text and retype
- Common renames: "Companies Built" instead of "Ventures", "Operating History" instead of "Operating Experience", "Boards" instead of "Advisory & Board"
- The structure stays; only the heading text changes

### Logo Strip (PDF only)

- For PDF distribution (NOT for ATS submission), add a single row of small logos at the bottom
- Logos of: companies founded, boards, accelerators, press logos
- Use Insert > Pictures, size each to ~0.5" wide
- Spacing: 16pt before / 0pt after
- **Skip this section for ATS submission** — logos are not parseable

### Google Docs

- Tab stops: Format > Align & Indent > Custom tab stops
- Mono font: Google Fonts has JetBrains Mono
- Headline separator: copy `•` from this spec or use Insert > Special Characters
- Export: File > Download > .docx

---

## 4. LaTeX Implementation

```latex
\documentclass[letterpaper,9.5pt]{article}

\usepackage[margin=0.5in]{geometry}
\usepackage{fontspec}
\usepackage{xcolor}
\usepackage{enumitem}
\usepackage{tabularx}
\usepackage{hyperref}
\usepackage{microtype}
\usepackage{ragged2e}

\setmainfont{Inter}[Scale=0.95]
\setsansfont{Inter}[Scale=0.95]
\setmonofont{JetBrains Mono}[Scale=0.85]

\definecolor{fndrBody}{HTML}{0A0A0A}
\definecolor{fndrSec}{HTML}{555555}
\definecolor{fndrBrand}{HTML}{FF4F00}    % default brand accent (override per buyer)

\setlength{\parindent}{0pt}
\pagestyle{empty}

\setlist[itemize]{label=\textcolor{fndrBrand}{—}, leftmargin=1.3em, itemsep=1pt, topsep=1pt}

% Section heading
\newcommand{\fhead}[1]{%
  \vspace{10pt}
  {\bfseries\fontsize{10}{12}\selectfont\textcolor{fndrBody}{\MakeUppercase{#1}}}
  \vspace{4pt}
}

% Venture/role entry
\newcommand{\fventure}[4]{%
  \vspace{2pt}
  \begin{tabularx}{\linewidth}{@{}Xr@{}}
    \textbf{#1} \textemdash{} \textit{#2} & \ttfamily\textcolor{fndrSec}{#3} \\
  \end{tabularx}
  \vspace{1pt}
  {\fontsize{10}{12}\selectfont\textit{#4}}
  \vspace{2pt}
}

% Role entry (non-venture, with bullets)
\newcommand{\frole}[3]{%
  \vspace{2pt}
  \begin{tabularx}{\linewidth}{@{}Xr@{}}
    \textbf{#1}, \textit{#2} & \ttfamily\textcolor{fndrSec}{#3} \\
  \end{tabularx}
  \vspace{1pt}
}

% Inline mono helper
\newcommand{\m}[1]{\texttt{\small #1}}

\hypersetup{colorlinks=true, urlcolor=fndrBody, linkcolor=fndrBody}

\begin{document}

% Name + headline
{\fontfamily{Inter}\bfseries\fontsize{24}{28}\selectfont\textcolor{fndrBody}{Alex Chen}}

\vspace{2pt}
{\fontsize{11}{14}\selectfont\textcolor{fndrBody}{Founder \& CEO, Lattice (Acquired by Stripe '24) $\bullet$ ex-Airbnb, Stripe $\bullet$ YC W19}}

\vspace{8pt}
{\fontsize{10}{14}\selectfont\textcolor{fndrBody}{alex@lattice.so $\bullet$ \texttt{+1 415 555 0142} $\bullet$ San Francisco $\bullet$ linkedin.com/in/alexchen $\bullet$ \texttt{alexchen.dev} $\bullet$ \texttt{@alexchen}}}

\vspace{6pt}

% Optional summary
% \fhead{Summary}
% Founder-operator with 2 exits and 1 active venture. Looking for a board or operating role at a Series B+ company where the next 18 months are about scaling distribution, not building the product.

\fhead{Ventures}

\fventure{Lattice}{Founder \& CEO}{2020—2024 (Acq. Stripe)}
{Built the developer tools platform from 0 to \$2.4M ARR; 8 employees at acquisition. Acquired by Stripe in 18 months from launch.}

\begin{itemize}
  \item Raised \$3.2M seed (YC W19); built the founding team across eng, design, and GTM
  \item Shipped the v1 product in 11 weeks; iterated weekly with 12 design partners for the first 6 months
  \item Hired 14 across all functions; scaled the org from 3 to 38 over 24 months
  \item Negotiated the Stripe acquisition; led the integration of the Lattice team into Stripe's developer org
\end{itemize}

\fventure{Sidewalk Labs}{Co-founder \& CTO}{2018—2020 (Shut down)}
{Built a peer-to-peer marketplace for urban delivery; reached 14k MAU before shutting down to join Stripe.}

\begin{itemize}
  \item Co-founded with two college friends; raised \$400k pre-seed from a16z and angels
  \item Built the matching engine and driver app; launched in 2 cities
  \item Made the shutdown call after 14 months; the unit economics never worked
\end{itemize}

\fhead{Operating Experience}

\frole{Stripe}{Senior Engineer, Developer Platform}{2017—2018}
\begin{itemize}
  \item Tech-led the developer onboarding redesign; cut time-to-first-API-call from 47 min to 11 min
\end{itemize}

\frole{Airbnb}{Software Engineer, Trios (Labs)}{2015—2017}
\begin{itemize}
  \item Built the prototype for Airbnb Trips experiences; piloted in 3 cities before the team spun out
\end{itemize}

\fhead{Advisory \& Board}

\noindent \textbf{Remote.com} — \textit{Board Observer} (2021—Present) \\
\textbf{Tip Jar} — \textit{Technical Advisor} (2023—Present) \\
\textbf{YC} — \textit{Part-time Partner, Reading Applications} (2024—Present)

\fhead{Press \& Talks}

\noindent \textbf{Stripe Press} (2024) — "Lattice Joins Stripe" \\
\textbf{YC Continuity} (2023) — Podcast: "What I Wish I Knew Before My First Acquisition" \\
\textbf{TechCrunch Disrupt} (2022) — Speaker, "Founder Mode" panel \\
\textbf{a16z Podcast} (2021) — "Building Developer-First Products"

\fhead{Side Projects}

\noindent \textbf{angel.co/alexchen} — 14 angel checks, 3 follow-ons, 1 exit \\
\textbf{github.com/alexchen/dotfiles} — 4.2k stars \\
\textbf{building} — A small notetool for founders. Private beta.

\fhead{Skills \& Domains}

\noindent\textbf{Domains:} Developer tools, infrastructure, marketplaces, payments, B2B SaaS \\
\textbf{Discipline:} 0→1 product, founding teams, fundraising, M\&A, board governance

\fhead{Education}

\noindent\textbf{Stanford University} — B.S. Computer Science, 2015 \\
\textit{Phi Beta Kappa; TA for CS107; dorm resident on the entrepreneurial hall}

\end{document}
```

**LaTeX tips:**
- Compile with `XeLaTeX`
- The `\fventure{}` command takes 4 args: name, role, dates, outcome-line — then add bullets manually
- The `\frole{}` command takes 3 args: company, title, dates — bullets below
- For the brand accent: change `\definecolor{fndrBrand}{HTML}{FF4F00}` to the buyer's color
- For the charcoal variant: change background to `#0A0A0A` (requires `\pagecolor`)
- For the print variant: no color accents, all text in black

---

## 5. ATS Strip-Down

1. Drop the headline separator `•` — replace with `|` or just a single space
2. Drop the italic outcome line — fold into the role description
3. Drop the bullet marker color — use Word's default `•`
4. Drop the brand accent color — black text only
5. Drop the logo strip (ATS can't parse it anyway)
6. Keep all section names, but use standard synonyms where possible
   - "Ventures" → "Experience" (with company names that are the ventures)
   - "Operating Experience" → fold into "Experience"
   - "Advisory & Board" → "Experience" or "Additional Experience"
7. Drop the Press & Talks section (or fold into summary)

**Output:** `1-page-ats.docx`. The single-column structure with standard section names is fully ATS-compliant.

---

## 6. Customization Checklist

- [ ] Replace name, headline, contact
- [ ] Pick a brand accent color (use the buyer's most recent venture's brand)
- [ ] Rewrite the headline in 1 line: role, current/exit, pedigree
- [ ] List 2-4 ventures with outcomes and bullets
- [ ] List 2-3 operating experience roles (non-founder)
- [ ] Add Advisory & Board section (if applicable)
- [ ] Add Press & Talks (only the best 3-5)
- [ ] Add Side Projects (current building, OSS, angel checks)
- [ ] Save 2 versions: design (with logo strip for PDF) + ATS (no logos)
- [ ] Export PDF with embedded fonts
- [ ] Filename: `FirstName-LastName-Resume-2026.pdf`

---

## 7. Design Rationale

The Founder works because **founders are evaluated on range, not depth**. A single venture, a single role, a single specialty — these are the wrong signals. The Founder template signals: "I have done this multiple times, in different shapes, and I can do it again."

The custom section names (Ventures, Operating Experience, Advisory, Press, Side Projects) are not arbitrary. They map to the *kind* of work a founder does, not the *kind of employer* they had. The structure says: "I think in terms of things I've built, not jobs I've held."

The dense layout is intentional. A founder with 2 exits, 3 advisory roles, 8 press features, and 14 angel checks has too much material for a 1-pager. The 9.5pt body, the 14pt baseline, and the 0.5" margins let the page hold more without looking cramped.

The headline is the most important single line on the resume. "Founder & CEO, Lattice (Acquired by Stripe '24) • ex-Airbnb, Stripe • YC W19" tells the entire career in 20 words. If the buyer can't compress their career into 1 line, they don't have a headline yet — they need to keep building.

When to use The Founder: applying to a role where the buyer is also a peer (board seat, advisor, GM, co-founder, exec). When *not* to use it: applying to an IC engineering role — the density and custom sections will signal "I want to be CEO," which is the opposite of what an IC application needs.
