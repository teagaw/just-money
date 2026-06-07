# Template Spec — The Minimalist

**Style #1 of 5** · For senior+ ICs, staff engineers, principal engineers, directors, VPs.
**Vibe:** Quiet confidence. Whitespace does the work.

---

## 1. Design System

### Layout Grid

- **Page size:** US Letter (8.5" × 11")
- **Margins:** 0.75" all sides (top, bottom, left, right)
- **Content area:** 7" wide × 9.5" tall
- **Single column, full width** — no sidebar, no sub-columns
- **Vertical rhythm:** 18pt baseline grid. Every line and section break lands on the grid.
- **Section spacing:** 14pt before each section heading, 8pt after, 6pt between entries, 4pt between bullets in a list.

### Typography

| Element | Font | Size | Weight | Color | Notes |
|---------|------|------|--------|-------|-------|
| Name | Charter, Garamond, or Cormorant Garamond | 28pt | Regular (400) | #111111 | Slight letter-spacing -0.5px |
| Tagline (optional) | Inter or Söhne | 11pt | Regular (400) | #555555 | 1-line role descriptor below name |
| Section heading | Inter or Söhne | 9pt | Semibold (600), UPPERCASE, letter-spacing 1.5px | #111111 | Optional 0.5pt hairline above |
| Subheading (role / company) | Inter or Söhne | 11pt | Semibold (600) | #111111 | Company on left, dates right-aligned |
| Body | Inter or Söhne | 10.5pt | Regular (400) | #1A1A1A | Line height 1.45 |
| Bullet text | Inter or Söhne | 10.5pt | Regular (400) | #1A1A1A | Bullet character: `—` (em dash), not `•` |
| Link / URL | Inter or Söhne | 10.5pt | Regular (400) | #111111 | No underline; trust the color |
| Date | Inter or Söhne | 10.5pt | Regular (400) | #555555 | Right-aligned when paired with role |

**LaTeX note:** Use `charter` or `newpxtext` + `newpxmath` packages. Set body via `\setlength{\parskip}{0pt}` and `\setlength{\parindent}{0pt}` then manage spacing with `\vspace{6pt}` between bullets.

### Color

- **Primary text:** `#111111`
- **Secondary text:** `#555555` (dates, tagline)
- **Body text:** `#1A1A1A`
- **Background:** `#FFFFFF`
- **No accent color.** No rules thicker than 0.5pt. No fills. No boxes.

The restraint is the point. The only graphic element allowed is a single 0.5pt hairline rule under the name.

### Section Order (top to bottom)

1. **Name** + optional 1-line tagline
2. **Contact line** — email · phone · location · LinkedIn · GitHub (or personal site) — separated by `·` (middle dot)
3. **Summary** *(optional, 2-3 lines max — skip if career speaks for itself)*
4. **Experience** — 3-5 roles, most recent first
5. **Selected Projects** *(optional — for staff+ who need to surface side/OSS work)*
6. **Skills** — grouped by category, 1 line per group
7. **Education** — at the bottom, not the top (career > credentials)
8. **Speaking / Writing / Awards** *(optional, 1 line each)*

### What to Fill In

| Section | Content Source | Word Count |
|---------|----------------|------------|
| Name | Full legal name as on passport / visa docs | 2-4 words |
| Tagline | Your title at your current (or most recent) company. Optional. | 5-10 words |
| Contact | Email, phone (E.164 format +1 555 123 4567), city, LinkedIn, GitHub | 1 line |
| Summary | 1-2 sentences stating what you do and the level you do it at. Skip clichés. | 30-50 words |
| Experience | For each role: company, title, dates, 3-5 bullet points. Each bullet = action + scope + outcome. Quantify. | 5-7 lines per role |
| Projects | 2-4 projects. Each: name, role, 1-line description, link. | 2-3 lines each |
| Skills | Group: Languages, Frameworks, Systems, Tools. 4-8 per group. | 1 line per group |
| Education | School, degree, year. Honors only if top-tier (Phi Beta Kappa, summa cum laude). | 1-2 lines |

### Bullet Point Discipline

Each bullet answers: *What did I do, at what scale, with what outcome?*

- ✅ Reduced p99 API latency from 850ms to 120ms by re-architecting the data ingestion path across 4 services and 11 downstream consumers.
- ❌ Worked on performance improvements for the API.

Rules:
1. Start with a strong verb (Built, Led, Designed, Reduced, Increased, Owned, Architected, Migrated, Shipped).
2. Always include a number when truth permits (%, $, count, scale).
3. Never start with "I", "We", or "Responsible for".
4. One outcome per bullet. No compound sentences.
5. Max 2 lines per bullet.

---

## 2. File Outputs

For this style, the pack ships:

- `1-the-minimalist/1-page.docx` — Word & Google Docs editable
- `1-the-minimalist/1-page.tex` — LaTeX (Overleaf-ready)
- `1-the-minimalist/1-page.pdf` — rendered preview
- `1-the-minimalist/1-page-ats.docx` — stripped ATS version (uses default Calibri, single column, no serif name)
- `1-the-minimalist/2-page.docx` — senior version with 2 extra roles + talks section
- `1-the-minimalist/2-page.tex`
- `1-the-minimalist/sample-filled.md` — fully written example (see `sample-resumes/1-the-minimalist.md`)

---

## 3. DOCX / Google Docs Implementation

- **Page setup:** Letter, margins 0.75" all
- **Default font:** Söhne (if available) or Inter. Fallback: Helvetica Neue.
- **Name:** Paragraph, single line, font 28pt, color #111111
- **Tagline:** Paragraph, single line, 11pt, color #555555, no spacing before, 12pt spacing after
- **Contact line:** Paragraph, single line, 10.5pt, color #1A1A1A, separated by `·` (use Insert > Special Character > Middle Dot or copy from this spec: `·`)
- **Hairline rule:** Insert > Horizontal Line, 0.5pt, color #111111, 14pt before / 14pt after
- **Section heading:** Paragraph, UPPERCASE, letter-spacing 1.5px (Format > Text > Advanced > Character Spacing), 9pt, semibold, color #111111, 14pt before / 8pt after
- **Role entry:** 2-column-style: Company (left) and Date (right) on the same line. Use a 2-column table with invisible borders OR use a right-aligned tab stop at 7".
- **Bullets:** Custom bullet character `—` (em dash). Format > Bullets & Numbering > Custom > Character code 2014.
- **Date format:** `Jan 2021 — Present` (en dash `—` U+2013, not hyphen)

### Google Docs-Specific

- Use a single table with invisible borders for the role/date alignment (2 columns, left + right with right-aligned cell)
- Hairline rule: Insert > Horizontal Line (1px works as 0.5pt approximation)
- Custom bullet: Use the special character tool, paste `—` (em dash, U+2014) into the custom bullet field
- Export to .docx via File > Download > Word (.docx) to preserve formatting

---

## 4. LaTeX Implementation

```latex
\documentclass[letterpaper,10.5pt]{article}

\usepackage[margin=0.75in]{geometry}
\usepackage{charter}        % or newpxtext for Cormorant/Garamond
\usepackage{helvet}         % sans for headings and bullets
\renewcommand{\familydefault}{\sfdefault}  % make sans default
\usepackage[T1]{fontenc}
\usepackage[utf8]{inputenc}
\usepackage{microtype}
\usepackage{enumitem}
\usepackage{hyperref}
\usepackage{xcolor}
\usepackage{tabularx}
\usepackage{ragged2e}

\definecolor{mintext}{HTML}{111111}
\definecolor{minsec}{HTML}{555555}

\setlength{\parindent}{0pt}
\setlength{\parskip}{0pt}
\pagestyle{empty}

% Section heading command
\newcommand{\sectionhead}[1]{%
  \vspace{14pt}%
  {\fontfamily{phv}\selectfont\bfseries\fontsize{9}{11}\selectfont
   \textcolor{mintext}{\MakeUppercase{#1}}}%
  \vspace{8pt}%
}

% Role entry command (company left, dates right)
\newcommand{\role}[3]{%
  \begin{tabularx}{\linewidth}{@{}Xr@{}}
    \textbf{#1} & \textcolor{minsec}{#3} \\
    \textit{#2} & \\
  \end{tabularx}
  \vspace{4pt}
}

% Bullet with em-dash
\setlist[itemize]{label=— , leftmargin=1.5em, itemsep=2pt, topsep=2pt}

\hypersetup{colorlinks=true, urlcolor=mintext, linkcolor=mintext}

\begin{document}

{\fontfamily{bch}\selectfont\fontsize{28}{32}\selectfont
 \textcolor{mintext}{Alex Chen}}

\vspace{2pt}
{\fontfamily{phv}\selectfont\fontsize{11}{14}\selectfont
 \textcolor{minsec}{Staff Software Engineer — Distributed Systems}}

\vspace{6pt}
{\fontfamily{phv}\selectfont\fontsize{10.5}{15}\selectfont
 \textcolor{mintext}{alex@chen.dev · +1 415 555 0142 · San Francisco, CA · linkedin.com/in/alexchen · github.com/alexchen}}

\vspace{6pt}
\noindent\rule{\linewidth}{0.5pt}
\vspace{6pt}

\sectionhead{Summary}
Staff engineer with 9 years building distributed systems at scale. Owned the data platform serving 40B events/day at Stripe; led the re-architecture that cut p99 write latency 7×. Looking for principal-level scope at a company where the data model is the product.

\sectionhead{Experience}

\role{Stripe}{Staff Software Engineer, Data Platform}{Mar 2022 — Present}
\begin{itemize}
  \item Owned the canonical event ingestion path serving 40B events/day across 11 downstream systems
  \item Re-architected the write-side commit log; reduced p99 latency from 850ms to 120ms with zero data loss
  \item Led the migration from a single-region Kafka cluster to multi-region active-active over 14 months
  \item Mentored 4 senior engineers; 2 promoted to staff within 18 months
\end{itemize}

\vspace{6pt}
\role{Cloudflare}{Senior Software Engineer, Edge Network}{Aug 2018 — Feb 2022}
\begin{itemize}
  \item Shipped the Anycast routing overhaul that improved cache hit rate from 89\% to 96.4\%
  \item Designed the worker isolation model adopted across 8 internal teams
\end{itemize}

\vspace{6pt}
\role{Dropbox}{Software Engineer, Storage Infrastructure}{Jul 2016 — Jul 2018}
\begin{itemize}
  \item Built the metadata sharding layer handling 600M objects; reduced rebalance time from 9 hours to 22 minutes
\end{itemize}

\sectionhead{Skills}
\textbf{Languages:} Go, Rust, Python, TypeScript \quad
\textbf{Systems:} Kafka, PostgreSQL, FoundationDB, Cassandra \\
\textbf{Infra:} Kubernetes, Terraform, Envoy, Linux \\
\textbf{Discipline:} Distributed systems, consensus protocols, observability, on-call leadership

\sectionhead{Education}
\textbf{Carnegie Mellon University} — M.S. Computer Science, 2016 \\
\textbf{University of California, Berkeley} — B.S. Computer Science, 2014

\end{document}
```

**LaTeX tips:**
- Use `Overleaf` for the buyer — free, no install, real-time preview
- Compile with `pdflatex`
- The `\role{}` command handles the left/right alignment so the buyer only fills in 3 fields per role

---

## 5. ATS Strip-Down

The ATS version is the same content with these changes:

- Drop the serif name → use Calibri Light 24pt
- Drop the hairline rule
- Drop the custom `—` bullets → use Word's default `•`
- Drop the color → all text black
- Drop the right-aligned dates → put dates on a new line under company
- Drop the tagline → just name + contact
- Drop the section letter-spacing → use Word's default Heading 1/2 styles

**Save as:** `1-page-ats.docx` in the same folder. Use this for online application portals. Use the design version for emailed applications to a human.

---

## 6. Customization Checklist

When the buyer receives the file, they should:

- [ ] Replace name, contact, tagline
- [ ] Update experience bullets with quantified outcomes
- [ ] Adjust skills to match the role (don't list everything)
- [ ] Drop the summary if career speaks for itself (10+ years)
- [ ] Add a "Selected Projects" section if OSS / side work is relevant
- [ ] Save 2 versions: the design version + the ATS strip-down
- [ ] Export PDF with embedded fonts (Word: Options > Save > "Embed fonts in the file")
- [ ] Filename: `FirstName-LastName-Resume-2026.pdf`

---

## 7. Design Rationale

The Minimalist works because **it trusts the reader to read**. There is no chrome to skim past. There is no color to interrupt. The eye falls on the name, then the company names, then the bullet points, then the dates. That is the order of importance for a senior candidate. The whitespace says: *I have done enough that I do not need to fill the page.*

A senior resume that fills the page feels junior. A senior resume with 40% whitespace feels senior. The buyer uses this template when they want the page to do the talking.
