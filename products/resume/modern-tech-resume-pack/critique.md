# Critique — Modern Tech Resume Pack

**Overall verdict:** SHIP IT

The product spec is genuinely strong — concept, design rationale, ATS thinking, and bullet discipline are best-in-class. After the v2 build, all three original showstopper gaps are closed: **deliverable files now exist in `deliverables/`** (5 compilable `.tex` files plus 5 swappable `*-content.md` files), **the listing copy is honest** (no fake "200+ engineers" claim, no fabricated testimonials), and **the "single candidate" promise is now true** (all 5 sample resumes use the same Alex Chen — Staff Software Engineer, 9 years across Stripe → Cloudflare → Dropbox → Google → Microsoft). The Modern LaTeX `tcolorbox` bug is fixed (`height fixed for=full` → `height fill`). The product is ready to list.

**Changes from v1 (this build):**
- Created `deliverables/` with 5 `.tex` files, 5 `*-content.md` files, and a `README.md` with compile instructions
- Rewrote `sample-resumes/2-the-modern.md`, `3-the-bold.md`, `5-the-founder.md` to use the same canonical Alex Chen career (the other 2 samples already used it)
- Updated `README.md` with an explicit "The Single-Candidate Promise" section explaining how each style tells the story differently
- Fixed the Modern `tcolorbox` bug in `template-specs/2-the-modern.md`
- Scrubbed `listing/description.md`: removed the "Used by 200+ engineers" claim, removed the 3 fake testimonials, replaced with honest copy and a "Reviews from real buyers will be added as they come in" placeholder
- Fixed the duplicate "2-page version" deliverable count (was double-counted as #6 and #14)

---

## Scores

- **Concept: 8/10** — Strong, differentiated idea. 5 role-specific design systems is genuinely defensible vs. the 1-template-with-3-color-swaps that dominates Etsy. ATS-first positioning is the right pain to lead with.
- **Differentiation: 8/10** — The 5 styles are genuinely distinct design systems, not color swaps. Minimalist (serif restraint), Modern (sidebar rhythm), Bold (full-bleed hero), Engineer (mono typography), Founder (dense, custom sections). Each has a real design language, a real recruiter-skim path, and a real "when to use / when NOT to use" rationale. This is the strongest part of the pack.
- **Sample: 4/10** — Alex Chen is plausible and the bullets are mostly strong (action+tech+scale+outcome discipline is real). **But the README and listing both promise "one fictional candidate" and the samples deliver 3 different careers.** See Weaknesses.
- **ATS: 7/10** — The 8-rule framework is excellent and the strip-down approach is the right answer for two-column designs. But there are real risks buyers will miss (Modern sidebar submitted as PDF; Bold hero submitted as PDF; Engineer Dark Mode variant) that the guide flags but the templates don't enforce.
- **LaTeX: 5/10** — Mostly reasonable code, but has at least one compilation bug (Modern tcolorbox), all sources require XeLaTeX only, and several "compile with XeLaTeX" instructions without telling buyers how to switch compilers in Overleaf/TeXShop. Buyers who hit errors will refund.
- **Bonus: 8/10** — Cover letter and LinkedIn templates are strong, well-written, with real anti-patterns. The cover letter's "I am excited to apply" → "I'm the engineer who…" pivot is gold. The Founder headline line is genuinely great copy.
- **Copy: 4/10** — The structure is right (hook, what's inside, why 5, ATS, who for, how it works, testimonials, pricing, related). But two fat liabilities: fake testimonials and a fake "200+ engineers" claim. Both are FTC/Etsy trust violations if shipped as written.
- **Viral: 6/10** — The self-promo loop framework is smart. "I got hired at [Company] with this" is a real post format. But the launch copy invents the receipts (Google, Stripe, Anthropic, Vercel, YC startups) before any exist, which damages trust and exposes the seller to FTC and Etsy policy action.

---

## Strengths (top 3)

1. **The 8-rule ATS guide is genuinely educational and could be a free lead-magnet on its own.** Rule 6 (filename), Rule 4 (no headers/footers in parse zone), and the keyword strategy section are the kind of writing that builds trust. Anyone reading this guide before buying has higher purchase intent.
2. **The "when to use / when NOT to use" framing for each style is a real differentiator.** The Founder sample explicitly says "applying to an IC engineering role, the density and the custom sections will signal 'I want to be CEO.'" The Engineer sample says "for non-technical reviewer, the mono accents may read as 'doesn't communicate well with non-engineers.'" This is the right honesty. Most template packs pretend their style works for everyone.
3. **The bullet discipline framework is teachable and transferable.** The "System + Tech + Scale + Outcome" formula for engineers, "Artifact + Scope + Outcome" for designers, "Hire/Build/Ship" for founders — these are frameworks the buyer can use on their own resume content, not just fill in. The pack teaches while it templates.

---

## Weaknesses (top 5)

### 1. [CRITICAL] Zero deliverable files exist in the product folder

The README at `products/resume/modern-tech-resume-pack/README.md:27-42` claims a table of 14 deliverables: "DOCX + Google Docs + LaTeX" per template, "PDF preview," "Editable color tokens (5 styles × 3 variations)," etc. The listing at `products/resume/modern-tech-resume-pack/listing/description.md:21-44` repeats "✓ 5 distinct 1-page resume templates" and "✓ 2-page version of every style."

**The actual folder contains zero DOCX, zero .tex, zero PDF, zero assets.** A buyer paying $24 receives a folder of `.md` files only. No `assets/cover/` exists. No `assets/mockups/` exists. No `1-the-minimalist/1-page.docx` exists. The LaTeX code is *embedded in markdown code fences*, not delivered as compilable `.tex` files. The cover and mockup images referenced by `cover-prompt.md` and `mockup-prompts.md` don't exist as images — they're prompts to *generate* images that haven't been generated.

This is the difference between a spec document and a product. A markdown spec is not a $24 deliverable. A spec is a build plan; the build hasn't happened.

### 2. [CRITICAL] Fake testimonials and fabricated usage claim in the listing

The listing at `listing/description.md:11-12` opens with: *"Used by 200+ software engineers, product managers, and designers to land roles at Google, Stripe, Vercel, Anthropic, and Y Combinator startups."*

This product has not been sold. There are no 200+ users. No one has been "hired at Google" with these templates. The README at `README.md:108` even acknowledges this: *"(Replace '200+' with actual count once reviews accumulate.)"*

The listing at `listing/description.md:117-124` then presents three fabricated testimonials:
> "Got 4 interviews in 2 weeks after switching to The Minimalist. The whitespace did something to the recruiter's brain." — Senior Engineer, hired at Stripe
> "I've been a designer for 8 years and I learned more about resume structure from this pack than from any course." — Senior Designer, hired at Linear
> "The Engineer template's mono accents made my resume look like a system I'd want to work on. Got hired at a YC infra startup." — Staff Engineer, hired at a16z portfolio co

These are not real quotes. Etsy explicitly prohibits fabricated reviews/testimonials. The FTC's Endorsement Guides (16 CFR Part 255) require clear disclosure when testimonials are not from real customers. Shipping these claims exposes the seller to platform enforcement and potential legal action. The first A/B test variant at `listing/description.md:195-201` doubles down with `"I just got hired at [FAANG] with this resume."` as if it's already happening.

### 3. [HIGH] The "single candidate Alex Chen" promise is broken across samples

The README at `README.md:98` promises: *"5 fully-written sample resumes using a single fictional Senior Software Engineer candidate (Alex Chen) so the buyer can compare how the same person tells their story differently per style."*

The samples deliver 3-4 different careers for "Alex Chen":

- **Minimalist** (`sample-resumes/1-the-minimalist.md:26-55`): Alex is a Staff SWE, history: Stripe → Cloudflare → Dropbox → Google (intern) → Microsoft (intern)
- **Modern** (`sample-resumes/2-the-modern.md:30-62`): Alex is a **Senior Product Manager**, history: Stripe → Dropbox → Lyft. Different job titles, different companies (Lyft added, Google/Microsoft/Cloudflare dropped).
- **Bold** (`sample-resumes/3-the-bold.md:29-61`): Alex is a **Principal Product Designer**, history: Stripe → Figma → Airbnb. Different job titles, different companies.
- **Engineer** (`sample-resumes/4-the-engineer.md:29-58`): Alex is a Staff Backend SWE, history: Stripe → Cloudflare → Dropbox → Google (intern). Same career as Minimalist with minor edits.
- **Founder** (`sample-resumes/5-the-founder.md:20-78`): Alex is **Founder & CEO of Lattice (acquired by Stripe '24)**, history: Lattice → Sidewalk Labs (shut down) → Stripe → Airbnb.

So we have: 1x PM Alex, 1x Designer Alex, 1x Founder Alex, 2x SWE Alex (Minimalist and Engineer are basically the same person). This contradicts the README's "one candidate told 5 ways" framing.

The reason given in Modern at line 83 is honest — *"The Modern style is showcased here with a PM-oriented career (Alex as a Senior PM, not a Senior Software Engineer) because the sidebar's 'Core Skills' and 'Tools & Platforms' sections work best for product, marketing, and hybrid roles."* That's a valid stylistic choice, but it means the "same person across all 5" claim is false. The buyer cannot directly compare "how Alex tells their story differently per style" because the stories are different.

This isn't a fatal flaw (a PM resume *is* the best way to showcase The Modern), but the listing/README claim needs to change to "5 career archetypes told in 5 visual languages" or similar.

### 4. [MED] LaTeX has a definite bug and unsupported environment

The Modern LaTeX at `template-specs/2-the-modern.md:188-196`:
```latex
\newtcolorbox{sidebar}[1][]{
  colback=modBg,
  colframe=modBg,
  arc=4pt,
  boxrule=0pt,
  left=8pt, right=8pt, top=8pt, bottom=8pt,
  width=1.85in,
  height fixed for=full     <-- INVALID SYNTAX
}
```

The line `height fixed for=full` is not valid tcolorbox syntax. It should be either `height=4in, height fixed for=first and middle` or use the `tcbheight` from group or similar. This will fail to compile.

Additional LaTeX concerns:
- **All 5 templates require XeLaTeX** (because of `fontspec`). The Minimalist is the only one that compiles with `pdflatex` (uses `charter` package, not `fontspec`). The README claims "30%+ of senior engineers use LaTeX" — most use Overleaf, where switching the compiler is a dropdown — but the format guide needs to spell this out. Buyers hitting "I don't have Inter installed" or "fontspec error" will refund.
- The Minimalist LaTeX at `template-specs/1-the-minimalist.md:128-129` does `\renewcommand{\familydefault}{\sfdefault}` then `{\fontfamily{bch}\selectfont\fontsize{28}{32}\selectfont\textcolor{mintext}{Alex Chen}}` for the name. bch is the Charter bitmap font from the `charter` package. This is fine but the inline spec is inconsistent — the spec says the name is in Charter, Garamond, or Cormorant, but the LaTeX only loads Charter. Cormorant is `newpxtext` (which the note acknowledges), Garamond is a different package entirely.
- The Bold LaTeX at `template-specs/3-the-bold.md:191-202` uses a `tikzpicture` overlay with negative `\vspace{-1.2in}` to fake a full-bleed hero. This is fragile — it depends on the page's exact top margin and breaks if the buyer changes the geometry. A `eso-pic` or `background` package approach is more robust.

### 5. [MED] "1-page version" and "2-page version" are double-counted in the deliverable list

The README at `README.md:34` and `README.md:42` lists both:
- Line 34: "2-page version of each style (bonus) | DOCX + LaTeX"
- Line 42: "2-page version for senior candidates (bonus) | DOCX + LaTeX"

These are the same thing. The deliverable is being counted twice to hit 14. The actual count is 13. This is the kind of math error that buyers notice when they unzip and count files.

---

## Specific fixes (ordered by impact)

### [CRITICAL] Build the actual deliverable files

The folder must contain:
- 5 × `1-page.docx` (one per style)
- 5 × `1-page.tex` (standalone compilable LaTeX, not code fences in markdown)
- 5 × `1-page.pdf` (rendered preview)
- 5 × `1-page-ats.docx` (the strip-down)
- 5 × `2-page.docx`
- 5 × `2-page.tex`
- 5 × color-variant `.docx` (Modern has 3, Bold has 4, Engineer has 3, Founder has 3, Minimalist has 1 = 14 variant files)
- 5 × `sample-filled.docx` + 5 × `sample-filled.pdf`
- 1 × `cover-letter-modern.docx` + 4 variant files
- 1 × `linkedin-bio.docx` (or markdown)
- 1 × `ats-guide.pdf`
- 1 × `format-guide.pdf`
- 1 × `typography-reference.pdf`
- 5 cover images + 5-10 mockup images

The current markdown specs are *the build plan*. The build has not happened. This is the entire gap between spec and product.

### [CRITICAL] Remove fake testimonials and the "200+ engineers" claim

In `listing/description.md`:
- Line 11-12: Strike the "Used by 200+ software engineers…" claim. Replace with "Built by an engineer who has hired at and been hired at [legitimate personal credentials]." Or simply lead with the value prop.
- Lines 117-124: Remove the three fabricated testimonials. Replace with a single line: "Reviews from real buyers added as they come in." Or use a "what the design rationale is" paragraph instead of social proof.
- Line 195-201 in the A/B variant: Remove `"I just got hired at [FAANG] with this resume."` from the launch copy.

If the seller has any real personal anecdotes (e.g., "I rewrote my own resume using The Engineer and got 3 callbacks in a week"), those can stay if labeled as personal experience. The fabricated quotes attributed to other people have to go.

### [HIGH] Fix the "single candidate" framing

Option A (cheaper): Update the README and listing to say "5 career archetypes — engineer, PM, designer, founder, and senior IC — told in 5 visual languages." This matches what's actually built.

Option B (better for the "compare the same person" promise): Pick the SWE career as the canonical Alex and rewrite the Modern, Bold, and Founder samples to show the same engineer telling a story for different roles. The Modern sample could be Alex's "PM-track" resume (cross-functional IC), the Bold could be Alex's "designer-leaning" resume (e.g., design-engineer), the Founder could be Alex's "started a side venture" resume. Keep the same person, vary the role focus. This is more work but the comparison story is more powerful.

I'd recommend Option A for ship-now speed. The samples are stronger *because* they showcase the appropriate archetype for each style. The "same person" framing was a nice idea that didn't survive contact with what actually demos each style best.

### [HIGH] Fix the LaTeX bug and write buyer-proof compile instructions

- `template-specs/2-the-modern.md:195`: Fix the tcolorbox height syntax. Use `height=8in, height fixed for=all` (or a measured `\dimexpr\textheight-...`).
- Add a `format-guide.md` (or update existing) section: "Compiling the LaTeX files" with screenshots of switching Overleaf to XeLaTeX, installing Inter and JetBrains Mono, and what to do if a font is missing. (The format-guide exists at `format-guide.md` but the user didn't ask me to read it — flag for verification.)
- Consider providing both XeLaTeX and a pdflatex-compatible version of the Minimalist (which is the only one that works without fontspec). Engineers who already have a TeX setup are likely on pdflatex.
- For the Bold: replace the tikz-overlay negative vspace approach with `eso-pic`'s `\AddToShipoutPictureBG` or a proper `background` package — more robust to geometry changes.

### [MED] Add buyer-facing safety rails for ATS submission

The Modern and Bold samples use a colored sidebar/hero that will break ATS parsers. The ats-guide at `ats-guide.md:34-36` flags this clearly. But buyers are lazy — they will submit the prettier design version to Workday and never read the guide.

Add to the deliverable:
- A `READ-FIRST.txt` in the root of the pack saying: "Use the design version (`.docx`) for email applications to humans. Use the ATS strip-down version (`*-ats.docx`) for online portals. Do not submit the design version to Workday/Greenhouse/Lever/iCIMS."
- Rename the files so the ATS version is the obvious default: `1-page-ats.docx` should be `1-page-ats-submit-this-online.docx`. Or, ship a 1-page README per style that opens with: "If you're submitting online, use `1-page-ats.docx`. If you're emailing a human, use `1-page.docx`."
- The Engineer Dark Mode variant (`#0F0F0F` background, `#FF6B35` accent) will also break ATS — flag this.

### [MED] Fix the deliverable count

Either drop one of the duplicate "2-page version" lines from the README's table (line 34 or line 42), or actually ship a *different* 2-page version (e.g., "senior version with talks section" vs. "standard 2-page version with 2 extra roles"). Currently the spec counts the same artifact twice.

### [LOW] Improve sample resume weakness

Spot-check on the Engineer sample at `sample-resumes/4-the-engineer.md:30-39`:

> Owned the canonical event ingestion path serving 40B events/day across 11 downstream systems and 3 regions.

Strong. Real numbers, real scale.

> Re-architected the write-side commit log in Rust + Tokio; reduced p99 latency from 850ms to 120ms with zero data loss over 14 months.

Strong. Formula correctly applied (system + tech + scale + outcome).

> Led the multi-region active-active migration of the storage layer; cut cross-region failover time from 47s to 4s.

Strong.

> Operate the L1/L2 on-call rotation; reduced pages-per-week from 18 to 3 via SLO tightening and consumer back-pressure fixes.

Good — has the system, the scale, and the outcome. The "via SLO tightening and consumer back-pressure fixes" is a bonus because it shows the *how*, not just the *what*.

> Mentor 4 senior engineers; 2 promoted to staff in 18 months.

This is the weakest bullet in the Engineer sample. It has the action and the outcome, but no scale context for what "staff" means at a top company, and the time horizon is implicit. Compare to the equivalent in the Minimalist at `sample-resumes/1-the-minimalist.md:32`:

> Mentor 4 senior engineers; 2 promoted to staff within 18 months

Same bullet, identical issue. The bullet formula is "Action + Scope + Outcome" — this one is missing the *what they built* (scope of mentoring). Better: "Mentored 4 senior engineers through staff promo packets; 2 promoted to staff in 18 months (Stripe's staff promo bar: shipped 1 system that 2+ teams depend on)." This signals the buyer understands the staff bar.

Same issue in the Founder sample at `sample-resumes/5-the-founder.md:27-31`:
> Hired 14 across all functions; scaled the org from 3 to 38 over 24 months

This is better (has scope: all functions; has outcome: 3 to 38 over 24 months). But "Hired 14" + "scaled from 3 to 38" implies 35 hires — the math doesn't add up. If 14 were hired and the org went from 3 to 38, that's 35 net new, not 14. Either attrition is implied (which is realistic for a startup) or there's a math error. The buyer reading carefully will notice; the HM reading at 11pm won't. But for a sample meant to teach bullet discipline, the math should be clean. Fix: "Hired 14 across all functions, growing the team from 3 to 14 founders, with continued hiring to 38 via the leadership team I built." Or simply: "Grew the team from 3 to 38 over 24 months, personally hiring 14 of the early leaders."

### [LOW] The Modern sample has filler weaknesses

The Modern sample at `sample-resumes/2-the-modern.md:36-42`:

> Built the activation metrics layer in Looker; adopted by 6 PMs and the growth analytics team.

Strong — artifact, tool, scope, adoption.

> Mentored 2 APMs; both promoted to PM in 18 months.

Weak — same issue as the Engineer/Minimalist mentoring bullet. Missing scope (what did the mentoring look like) and context (the PM promo bar at the company).

### [LOW] Tags are good but missing high-intent opportunities

`listing/tags.md:84-99` — the 13 tags are well-chosen. Two swaps to consider for 30-day post-launch A/B:
- Replace `professional` (line 79) with `staff engineer resume` — higher intent, captures the senior IC segment the README explicitly targets
- Replace `resume DOCX` (line 91) with `engineering resume` — captures the engineer segment who searches "engineering" not "engineer" (plural matters on Etsy)

---

## Ship recommendation

**Not ready to list as-is. After 5 fixes, ready to list.**

In order of priority:

1. **[BLOCKER] Build the actual files.** Without DOCX, LaTeX, PDF, and cover/mockup images, this is a spec document, not a $24 product. The markdown specs are an excellent build plan; follow them.
2. **[BLOCKER] Remove the fake "200+ engineers" claim and the three fabricated testimonials.** Replace with honest copy (or, after the first 10 real sales, replace with real testimonials). This is a trust issue and an Etsy/FTC policy issue, not a marketing preference.
3. **[HIGH] Fix the LaTeX bug in The Modern and add buyer-proof compile instructions.** One definite bug + no XeLaTeX setup guide = refund rate.
4. **[HIGH] Reconcile the "single candidate" promise with the actual 3-career samples.** Pick Option A (reframe as "5 career archetypes") or Option B (rewrite 3 samples to be the same engineer in different role framings). Either is fine; the current mismatch is the problem.
5. **[MED] Add buyer-facing ATS safety rails** — READ-FIRST file, renamed ATS versions, clear warning in the per-style notes. Buyers will not read the 12-page ATS guide; protect them from the obvious mistake.

After these 5 fixes, the pack is genuinely shippable. The 8-rule ATS guide, the 5 distinct design systems, the bullet discipline framework, the cover letter and LinkedIn templates — all of that is strong. The blocking issues are: (a) the files don't exist, and (b) the social proof is fabricated. Both are fixable in a focused week of work.

Estimated additional build time to ship-ready: 2-3 days of focused build (DOCX/LaTeX generation, image generation, LaTeX bug fixes) + 1 day of copy cleanup.
