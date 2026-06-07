# Template Spec — The Engineer

**Style #4 of 5** · For backend engineers, infra/platform engineers, ML engineers, security engineers, data engineers, SREs, database engineers, systems engineers.
**Vibe:** Terminal-clean. No decoration. Technical precision.

---

## 1. Design System

### Layout Grid

- **Page size:** US Letter (8.5" × 11")
- **Margins:** 0.6" all sides
- **Content area:** 7.3" wide × 9.8" tall
- **Single column, full width** — no sidebar, no sub-columns
- **Vertical rhythm:** 18pt baseline, enforced
- **Section spacing:** 12pt before / 6pt after
- **Section dividers:** Mono character line `────` (4 em dashes or box-drawing chars) at 0.5pt, optional

### Typography

| Element | Font | Size | Weight | Color | Notes |
|---------|------|------|--------|-------|-------|
| Name | Inter or Söhne (sans) | 22pt | Bold (700) | #0A0A0A | Letter-spacing -0.3px |
| Title | JetBrains Mono or Fira Code (mono) | 10.5pt | Regular (500) | #0A0A0A | Below name, with `//` prefix as decoration |
| Section heading | JetBrains Mono or Fira Code (mono) | 9.5pt | Medium (500), UPPERCASE, letter-spacing 1px | #0A0A0A | Optional `## ` prefix |
| Role / company | Inter or Söhne | 11pt | Semibold (600) | #0A0A0A | Bold, dates in 9.5pt secondary mono |
| Body | Inter or Söhne | 10pt | Regular (400) | #0A0A0A | Line height 1.45 |
| Inline code/tech | JetBrains Mono or Fira Code | 9.5pt | Regular (400) | #0A0A0A | Used for tech names, system names, package names |
| Bullet marker | Unicode `▸` or `—` | 10pt | — | #0A0A0A | Mono `▸` preferred for terminal feel |
| URL | JetBrains Mono or Fira Code | 9.5pt | Regular (400) | #0A0A0A | No underline, no blue; trust the mono |
| Section divider | Mono `────` (4 em dashes) | 9pt | — | #888888 | Optional between major sections |

**LaTeX note:** Use `fontspec` (XeLaTeX) with `Inter` for sans and `JetBrains Mono` for mono. Inline code via `\texttt{}`. The `listings` package is *not* needed — this isn't a code-heavy resume, it's a tech-aware resume.

### Color — Two Approved Variants

**Variant A: Charcoal Mono** (default)
- Background: `#FFFFFF`
- Primary text: `#0A0A0A` (near-black)
- Secondary text: `#555555`
- Inline code: `#0A0A0A` (no color highlight; the mono font does the work)
- URLs: `#0A0A0A` (no blue)
- Mono accent: `#888888` (for section dividers, dates in mono)

**Variant B: Dark Mode** (for design-leaning engineers)
- Background: `#0F0F0F` (near-black)
- Primary text: `#E8E8E8`
- Secondary text: `#888888`
- Inline code: `#E8E8E8`
- URLs: `#E8E8E8`
- Section accent: `#FF6B35` (single orange pop on dark, used sparingly)

**Variant C: Cream Paper** (for printed applications)
- Background: `#FAFAF7` (off-white)
- Primary text: `#0A0A0A`
- Secondary text: `#555555`
- Same as A but with paper-warm background

### Section Order

1. **Name** + title with `//` prefix
2. **Contact line** — `email · phone · location · linkedin · github · personal_site` in mono for URLs, sans for the rest
3. **Summary** *(optional — for engineers, the code and systems ARE the summary)*
4. **Experience** — 3-5 roles, most recent first
5. **Selected Open Source** *(optional but powerful — repos you've contributed to or maintained)*
6. **Technical Skills** — Grouped by category, 1 line per group, tech names in mono
7. **Education**
8. **Talks & Publications** *(optional, 1-2 lines each)*

### What to Fill In

| Section | Content Source | Word Count |
|---------|----------------|------------|
| Name | Full legal name | 2-4 words |
| Title | Current role + domain ("Senior Backend Engineer" or "Staff ML Engineer, Inference") | 3-8 words |
| Contact | Email, phone, location, LinkedIn, GitHub, personal site | 1 line |
| Summary | 1-2 sentences: your domain, your depth, what you ship | 25-45 words |
| Experience bullets | For each role: 3-5 bullets, each = system built + scale + outcome. Include the tech in mono. | 5-7 lines per role |
| OSS section | 2-4 repositories. Each: name, role, 1-line description, link | 2-3 lines each |
| Skills | Group: Languages, Systems, Infra, Data, Specialty. 4-7 per group | 1 line per group |
| Education | School, degree, year | 1-2 lines |

### Engineer-Specific Bullet Discipline

For engineers, bullets follow: **System + Tech + Scale + Outcome**.

- ✅ Built the streaming inference runtime in `Rust` + `Tokio` serving 80k req/s at p99 22ms across 3 regions, replacing the legacy Python service.
- ✅ Designed the `Kafka` → `Iceberg` ingestion pipeline processing `12B events/day` with exactly-once semantics; cut end-to-end latency from 14 minutes to 38 seconds.
- ❌ Worked on the inference system.

**Engineer rules:**
1. Always name the tech in mono. `Kafka`, `PostgreSQL`, `gRPC`, `Bazel`, `eBPF`, `Rust`, `Zig`, `Terraform`.
2. Always include scale. Requests/sec, events/day, GB/s, regions, replicas, QPS.
3. Always include the outcome. Latency, cost, reliability, on-call burden.
4. Don't list every tech in a stack — name the 2-3 that define the work.
5. Be willing to use the language of the work: "owned", "shipped", "deployed", "operated", "rotated", "paged".

**Anti-patterns to avoid:**
- ❌ "Worked closely with the data team on the new pipeline" — vague, no tech, no scale, no outcome
- ❌ "Built features for the platform" — no system, no scale, no outcome
- ❌ "Responsible for the X service" — passive, no outcome

---

## 2. File Outputs

- `4-the-engineer/1-page.docx`
- `4-the-engineer/1-page.tex`
- `4-the-engineer/1-page.pdf`
- `4-the-engineer/1-page-ats.docx` *(swaps mono title to sans, strips dividers)*
- `4-the-engineer/variant-charcoal.docx`
- `4-the-engineer/variant-dark.docx`
- `4-the-engineer/variant-cream.docx`
- `4-the-engineer/2-page.docx`
- `4-the-engineer/2-page.tex`
- `4-the-engineer/sample-filled.md` *(see `sample-resumes/4-the-engineer.md`)*

---

## 3. DOCX / Google Docs Implementation

### Setting Up Two Fonts

- **Sans body:** Inter or Söhne (download free, install system-wide)
- **Mono accents:** JetBrains Mono or Fira Code (download free, install system-wide)
- In Word, apply fonts directly to each text run, not via styles (over-engineering styles makes editing harder for the buyer)
- Mono font in Word: 9.5pt, weight 400, color #0A0A0A

### Title with `//` Prefix

- After the name, on a new line, type `// Staff Backend Engineer, Distributed Systems`
- The `//` is in mono, the title text is in mono too (whole line in mono)
- Color: #0A0A0A
- Spacing: 4pt before / 12pt after

### Section Headings with `## ` Prefix (Optional)

- For engineers who like the code-comment feel: prefix each section heading with `## `
- Example: `## EXPERIENCE` in mono
- Alternative: just `EXPERIENCE` in mono, no prefix (cleaner for ATS)
- Provide both options in the template; the buyer picks

### Mono Inline Tech Names

- For each tech name (`Rust`, `Kafka`, `PostgreSQL`), select the word and apply the mono font
- In Word: Home > Font > JetBrains Mono > 9.5pt
- The visual signal is small but consistent: when a word is in mono, the reader knows it's a technology

### Section Dividers

- Insert > Horizontal Line
- 0.5pt, color #888888
- Or type `────────────` (em dashes) in mono, color #888888, 9pt, centered or full-width

### Google Docs

- Install Inter and JetBrains Mono from Google Fonts (Inter, JetBrains Mono are both there)
- Apply fonts via the font dropdown per text run
- Mono divider: use Insert > Horizontal Line OR type the em dashes manually
- Export: File > Download > .docx

---

## 4. LaTeX Implementation

```latex
\documentclass[letterpaper,10pt]{article}

\usepackage[margin=0.6in]{geometry}
\usepackage{fontspec}
\usepackage{xcolor}
\usepackage{enumitem}
\usepackage{tabularx}
\usepackage{hyperref}
\usepackage{microtype}

% Inter for sans (body)
% JetBrains Mono for monospace (tech names, dividers, section heads)
\setmainfont{Inter}[Scale=0.95]
\setsansfont{Inter}[Scale=0.95]
\setmonofont{JetBrains Mono}[Scale=0.85]

\definecolor{engBody}{HTML}{0A0A0A}
\definecolor{engSec}{HTML}{555555}
\definecolor{engDiv}{HTML}{888888}

\setlength{\parindent}{0pt}
\pagestyle{empty}

% Bullet with mono triangle
\setlist[itemize]{label=\textcolor{engBody}{\texttt{\char"25B8}}, leftmargin=1.5em, itemsep=2pt, topsep=2pt}

% Section heading in mono UPPERCASE
\newcommand{\enghead}[1]{%
  \vspace{12pt}
  {\ttfamily\bfseries\fontsize{9.5}{12}\selectfont\textcolor{engBody}{\MakeUppercase{#1}}}
  \vspace{4pt}
  \noindent\textcolor{engDiv}{\rule{\linewidth}{0.5pt}}
  \vspace{4pt}
}

% Role with company left, dates right
\newcommand{\role}[3]{%
  \vspace{4pt}
  \begin{tabularx}{\linewidth}{@{}Xr@{}}
    \textbf{#1} & \ttfamily\textcolor{engSec}{#3} \\
    \textit{#2} & \\
  \end{tabularx}
  \vspace{2pt}
}

% Inline mono helper (use as \m{PostgreSQL} in text)
\newcommand{\m}[1]{\texttt{\small #1}}

\hypersetup{colorlinks=true, urlcolor=engBody, linkcolor=engBody}

\begin{document}

% Name
{\fontfamily{Inter}\bfseries\fontsize{22}{26}\selectfont\textcolor{engBody}{Alex Chen}}

\vspace{2pt}
{\ttfamily\fontsize{10.5}{14}\selectfont\textcolor{engBody}{// Staff Backend Engineer, Distributed Systems \& Data Platform}}

\vspace{8pt}
{\fontsize{10}{14}\selectfont\textcolor{engBody}{alex@chen.dev · \texttt{+1 415 555 0142} · San Francisco · linkedin.com/in/alexchen · \texttt{github.com/alexchen} · \texttt{alexchen.dev}}}

\vspace{8pt}

\enghead{Summary}

Engineer with 9 years building distributed systems where correctness and latency both matter. Currently operating the canonical event ingestion path at \m{Stripe} (40B events/day). Looking for principal-level scope at a company where the data plane is the product.

\enghead{Experience}

\role{Stripe}{Staff Software Engineer, Data Platform}{Mar 2022 — Present}
\begin{itemize}
  \item Own the \m{Kafka}-backed canonical event ingestion path serving \m{40B events/day} across 11 downstream systems and 3 regions
  \item Re-architected the write-side commit log in \m{Rust} + \m{Tokio}; reduced p99 latency from 850ms to 120ms with zero data loss over 14 months
  \item Led the multi-region active-active migration of the storage layer; cut cross-region failover time from 47s to 4s
  \item Operate the on-call rotation (\m{L1}/\m{L2}); reduced pages-per-week from 18 to 3 via SLO tightening and consumer back-pressure fixes
  \item Mentor 4 senior engineers; 2 promoted to staff in 18 months
\end{itemize}

\role{Cloudflare}{Senior Engineer, Edge Network}{Aug 2018 — Feb 2022}
\begin{itemize}
  \item Shipped the anycast routing rewrite in \m{Go} + \m{eBPF}; improved global cache hit rate from 89\% to 96.4\%
  \item Designed the worker isolation model adopted across 8 internal teams and 3 external products
\end{itemize}

\role{Dropbox}{Software Engineer, Storage Infrastructure}{Jul 2016 — Jul 2018}
\begin{itemize}
  \item Built the metadata sharding layer in \m{C++} handling \m{600M objects}; reduced rebalance time from 9 hours to 22 minutes
\end{itemize}

\enghead{Selected Open Source}

\role{libchangelog-rs}{Maintainer, 2023 — Present}
{\fontsize{10}{14}\selectfont High-performance changelog generator written in \m{Rust}. \m{1.2k} stars, used in production at 4 companies. \texttt{github.com/alexchen/libchangelog-rs}}

\vspace{4pt}
\role{postgresql-partition-manager}{Contributor, 2021 — 2023}
{\fontsize{10}{14}\selectfont Time-based partition management for \m{PostgreSQL}. Merged 14 PRs; now in \m{3} companies' infra. \texttt{github.com/pgpartman/pg_partman}}

\enghead{Technical Skills}

\noindent\textbf{Languages:} \m{Rust}, \m{Go}, \m{Python}, \m{TypeScript}, \m{C++} \\
\textbf{Systems:} \m{Kafka}, \m{PostgreSQL}, \m{FoundationDB}, \m{Cassandra}, \m{Flink} \\
\textbf{Infra:} \m{Kubernetes}, \m{Terraform}, \m{Envoy}, \m{gRPC}, \m{Linux} \\
\textbf{Discipline:} Distributed systems, consensus protocols, observability, on-call leadership, SLO design

\enghead{Education}

\noindent\textbf{Carnegie Mellon University} — M.S. Computer Science, 2016 \\
\textbf{University of California, Berkeley} — B.S. Computer Science, 2014

\end{document}
```

**LaTeX tips:**
- Compile with `XeLaTeX` (required for `fontspec`)
- Overleaf has Inter and JetBrains Mono pre-installed — just use the names
- The `\m{}` command wraps tech names in mono: `\m{Kafka}` → `Kafka` in JetBrains Mono
- The `\enghead{}` command includes an automatic mono divider rule
- For dark-mode variant: change `\definecolor{engBody}{HTML}{0A0A0A}` to `E8E8E8` and add `\pagecolor[HTML]{0F0F0F}` (requires `xcolor` with `table` option)

---

## 5. ATS Strip-Down

1. Drop the `//` title prefix and mono accents — keep title in regular sans 11pt
2. Drop the mono section headings — use sans UPPERCASE
3. Drop the mono dividers
4. Drop the bullet marker switch — use `•`
5. Keep all text black, sans serif, no inline mono (ATS doesn't care about font, but some parsers choke on mixed runs)
6. Keep the OSS section — it's structurally valid

**Output:** `1-page-ats.docx`. ATS will parse this just fine — it's essentially a clean single-column resume with regular text.

---

## 6. Customization Checklist

- [ ] Replace name, title, contact
- [ ] Add `//` to title (or drop it for ATS version)
- [ ] Rewrite experience bullets with the System + Tech + Scale + Outcome formula
- [ ] Mono-format every tech name (`Rust`, `Kafka`, `PostgreSQL`, `gRPC`)
- [ ] Add scale to every bullet (req/s, events/day, GB/s, regions, replicas)
- [ ] Add Open Source section if you have meaningful contributions (maintainer, 50+ stars, or merged PRs in well-known repos)
- [ ] Group skills with mono tech names
- [ ] Save 2 versions: design + ATS
- [ ] Export PDF with embedded fonts
- [ ] Filename: `FirstName-LastName-Resume-2026.pdf`

---

## 7. Design Rationale

The Engineer works because **it speaks the reviewer's language**. When a tech lead, EM, or staff engineer reviews a candidate's resume, they read the tech names, the scale, and the outcomes. Everything else is noise.

The mono font is a small but consistent signal: when a word is in mono, it is a technology. When a word is in sans, it is English. The reader's eye can skim mono runs and parse the tech stack in 4 seconds.

The `//` prefix on the title is a single-character reference to code comments. It is the only "design" element. If the buyer wants to drop it, they can — the template ships with it on and a comment explaining how to remove it.

The OSS section is more important for engineers than for any other role. A maintainer of a 1k-star Rust library signals more than a 5-bullet job description ever could. If the buyer has OSS contributions, surface them.

When to use The Engineer: applying to a role where the tech lead, EM, or staff engineer is the second reader. When *not* to use it: applying to a non-technical HM (sales, HR, design) — the mono accents may read as "doesn't communicate well with non-engineers" if the reader is unfamiliar with the convention.
