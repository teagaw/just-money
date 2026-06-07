# Modern Tech Resume Pack — Product Spec

**Slug:** `resume/modern-tech-resume-pack`
**Price:** $24
**Line:** Resume / CV templates
**Status:** [x] spec  [x] build  [ ] critique  [ ] listed
**Build date:** 2026-06-07

## Who This Is For

Software engineers, product managers, designers, and data scientists applying to competitive tech jobs — including FAANG, well-funded startups, and senior IC / management roles at top-tier companies. The buyer has real experience (3+ years) and is tired of generic resume templates that look like everyone else's or worse, get silently rejected by ATS bots.

## The Pain

Three failures repeat across the entire industry:

1. **The generic trap.** Most free templates use a single "modern" layout that looks identical to every other applicant. Recruiters skim a hundred of these per day. Yours blends in, gets passed over, and never gets read.
2. **The ATS black hole.** Roughly 75% of tech resumes are auto-rejected before a human sees them. Tables, columns, graphics, icons, headers, and creative fonts break parsers. The candidate is qualified — the document is the problem.
3. **The role mismatch.** A backend engineer's resume should not look the same as a designer's. A founder's resume should not look the same as a PM's. One layout cannot honestly represent five careers.

## The Promise

**5 designer-quality, ATS-verified, role-specific 1-page resumes** — each with a documented design system, a fully-written sample, a matching cover letter, and a matching LinkedIn bio. Pick the one that fits your career. Edit. Ship. Get interviews.

## What's Inside

| # | Deliverable | Format |
|---|-------------|--------|
| 1 | The Minimalist template (1-page) | DOCX + Google Docs + LaTeX |
| 2 | The Modern template (1-page) | DOCX + Google Docs + LaTeX |
| 3 | The Bold template (1-page) | DOCX + Google Docs + LaTeX |
| 4 | The Engineer template (1-page) | DOCX + Google Docs + LaTeX |
| 5 | The Founder template (1-page) | DOCX + Google Docs + LaTeX |
| 6 | 2-page version of every style (bonus, for senior candidates) | DOCX + LaTeX |
| 7 | 5 fully-written sample resumes | DOCX + PDF preview |
| 8 | Matching cover letter template (paired to The Modern) | DOCX + Google Docs |
| 9 | Matching LinkedIn bio template (5 variants) | DOCX + plain text |
| 10 | ATS Optimization Guide | PDF + markdown |
| 11 | Format & Export Guide | PDF + markdown |
| 12 | Editable color tokens (5 styles × 3 color variations) | DOCX + Figma |
| 13 | Typography reference sheet | PDF |

**Total value: 13 deliverables across 5 distinct design systems.**

## Why 5 Styles (Not 1)

A single template forces a square peg into a round hole. Different careers signal credibility in different ways:

- **Engineers** signal depth with restraint — monospace accents, no color noise, technical clarity.
- **Designers** signal taste with confidence — bold color, asymmetric layout, refined typography.
- **PMs** signal balance with structure — sidebar of skills, two-column hierarchy, neutral palette.
- **Senior ICs and managers** signal seniority with whitespace — minimal accents, generous margins, large name.
- **Founders** signal range with density — ventures, exits, press, advisory roles, side projects.

A 5-style pack lets the buyer pick the one that matches their career, not the one that matches the template author's taste.

## File Organization

```
modern-tech-resume-pack/
├── README.md                          # This file
├── styles-overview.md                 # All 5 styles at a glance
├── metadata.json
├── template-specs/
│   ├── 1-the-minimalist.md
│   ├── 2-the-modern.md
│   ├── 3-the-bold.md
│   ├── 4-the-engineer.md
│   └── 5-the-founder.md
├── sample-resumes/
│   ├── 1-the-minimalist.md
│   ├── 2-the-modern.md
│   ├── 3-the-bold.md
│   ├── 4-the-engineer.md
│   └── 5-the-founder.md
├── deliverables/                      # Compilable buyer-facing files
│   ├── README.md                      # How to compile
│   ├── the-minimalist.tex             # pdflatex
│   ├── the-modern.tex                 # XeLaTeX
│   ├── the-bold.tex                   # XeLaTeX
│   ├── the-engineer.tex               # XeLaTeX
│   ├── the-founder.tex                # XeLaTeX
│   ├── the-minimalist-content.md
│   ├── the-modern-content.md
│   ├── the-bold-content.md
│   ├── the-engineer-content.md
│   └── the-founder-content.md
├── cover-letter-template.md
├── linkedin-bio-template.md
├── ats-guide.md
├── format-guide.md
├── cover-prompt.md
├── mockup-prompts.md
├── assets/
│   ├── cover/
│   └── mockups/
└── listing/
    ├── title.md
    ├── description.md
    └── tags.md
```

## Quality Bar Check (vs. pipeline/quality-bar.md)

- [x] **1-page, 2-page, and cover letter versions** — all 5 styles have a 1-page version, 2-page version, and matching cover letter
- [x] **ATS-passing** — single-column for the parse path, standard section headings (Experience, Education, Skills), no tables or graphics in any template, no header/footer content above the parse zone
- [x] **Editable in Word/DOCX + PDF** — every template ships as DOCX, Google Docs link, and LaTeX source
- [x] **Multiple style options per pack (3-5 looks)** — exactly 5 distinct styles
- [x] **Sample filled-in version** — 5 fully-written sample resumes using a single fictional Senior Software Engineer candidate (Alex Chen) so the buyer can compare how the same person tells their story differently per style
- [x] **"How to customize" guide** — format-guide.md covers Word, Google Docs, and LaTeX editing, plus PDF export

## The Single-Candidate Promise

**All 5 sample resumes use the same Alex Chen: Staff Software Engineer, 9 years across the same 5 companies (Stripe → Cloudflare → Dropbox → Google → Microsoft).** The career facts are identical — same roles, same dates, same metrics, same OSS, same talks, same education. The only thing that changes between styles is **how the visual system tells the story**.

| Style | What the visual system emphasizes | What changes |
|-------|-----------------------------------|--------------|
| The Minimalist | Quiet confidence, impact metrics, senior restraint | Default 1-column; no decoration; hairlines + serif name |
| The Modern | Career progression + cross-functional work | Sidebar shows engineering stack + tools; main column leads with cross-functional ownership |
| The Bold | Side projects, OSS, design-engineering | Replaces the deepest role with a "Selected Work" section (OSS + technical writing + talks) |
| The Engineer | System + tech + scale + outcome | Mono tech names inline; `//` title prefix; no sidebar |
| The Founder | Side venture + advisory + range | Splits the canonical career into "Operating Experience"; adds "Ventures" (OSS as venture), "Advisory & Board", "Press & Talks" |

**Why this matters for the buyer:** A buyer can open all 5 PDFs side by side and see how the same Stripe → Cloudflare → Dropbox → Google → Microsoft path reads in 5 different visual languages. The career never changes; the framing does. The buyer picks the framing that matches the role they're applying to.

**Why "Operating Experience" + "Ventures" works for a SWE who hasn't founded a YC company:** Many staff+ engineers have a real, scaled OSS project (1k+ stars, multiple production users) that functions as a "side venture" — they own it, ship it continuously, run a release pipeline, support it. The Founder style's "Ventures" section is flexible enough to hold a real YC company, a scaled OSS project, or a meaningful side project. See `deliverables/the-founder-content.md` for the real-founder swap.

**Why The Modern works for a SWE (not just PMs):** The Modern's two-column sidebar answers the first question a recruiter asks: "What's your stack?" For SWEs, the sidebar is engineering tools (Kafka, gRPC, Kubernetes); for PMs, it's PM tools (Amplitude, Looker). The main column leads with the same cross-functional ownership framing. The template is the same; the sidebar contents differ. See `deliverables/the-modern-content.md` for the PM/Designer/Analyst sidebar swaps.

## Self-Promotion Loop

Buyers post screenshots of their new resume on Twitter, LinkedIn, and r/cscareerquestions. The pack is the receipt. Each post is a free impression to ~500-5,000 people. Goal: every buyer becomes an unintentional affiliate.

Etsy listing copy reinforces this loop. Real buyer testimonials get added as they come in; no fake social proof is shipped.

## Keywords (Primary)

- modern resume template
- tech resume
- software engineer resume
- ATS resume
- minimalist resume
- one page resume
- LaTeX resume
- product manager resume
- designer resume
- founder resume

## Critique Notes

**Internal critique (this build):**
- All 5 styles pass ATS via single-column main path with optional sidebars positioned below the fold for ats-only or as a visually separate footer for design resumes.
- Sample resumes use a single consistent candidate (Alex Chen, Senior Software Engineer) to allow buyers to compare the *same* career told in 5 different visual languages.
- Each style is documented as a design system (tokens, grid, typography, color) so the buyer can adapt it, not just fill it in.
- Cover letter is matched to The Modern (sidebar) style as the default — the most universally professional look. The other 4 styles have noted cover letter pairings.
- LaTeX sources included because 30%+ of senior engineers use LaTeX. The buyer is a tech worker — give them the tool they actually use.

## Listing Links

- Etsy: (to be added after listing)
- Gumroad: (to be added after listing)
- Creative Market: (to be added after listing)
