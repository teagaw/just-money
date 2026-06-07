# Sample Resume — The Bold (Alex Chen)

A fully filled-in example for **Style #3: The Bold**.
Use this as a reference for tone, density, and the asymmetric hero layout. The visual version is `deliverables/the-bold.tex` and the swappable content is `deliverables/the-bold-content.md`.

**Note on the candidate:** All 5 sample resumes in this pack use the **same** Alex Chen — Staff Software Engineer, 9 years, the canonical 5-company career (Stripe → Cloudflare → Dropbox → Google → Microsoft). The Bold style is showcased here with Alex's **OSS / design-engineering side projects** as the framing — a Staff SWE with 1.2k GitHub stars, conference talks, and a strong Selected Work section. If you don't have OSS, talks, or surfaceable side projects, switch to The Minimalist or The Engineer — The Bold without a "Selected Work" section feels incomplete.

---

```
██████████████████████████████████████████████████████████████████████████████████
█                                                                                █
█   ALEX CHEN                                                                    █
█   Staff Software Engineer — Data Platform & Open Source Maintainer              █
█   alex@chen.dev · linkedin.com/in/alexchen · github.com/alexchen · San Francisco█
█                                                                                █
██████████████████████████████████████████████████████████████████████████████████


SUMMARY
━━━━━━━
Staff engineer with 9 years shipping infrastructure that other teams build on.
Operating the canonical event ingestion path at Stripe (40B events/day, 3 regions,
11 downstream systems). Side projects: 1.2k-star Rust library used in production
at 4 companies. Looking for principal-level scope with design-engineering autonomy.


EXPERIENCE
━━━━━━━━━━

▣ STRIPE                                              Senior Software Engineer  Mar 2022 — Present
  Data Platform                                              San Francisco
  ──────────────────────────────────────────────────────────────────────────────
  Owned the canonical event ingestion path serving 40B events/day across 11
  downstream systems and 3 regions.

  Re-architected the write-side commit log in Rust + Tokio; reduced p99 latency
  from 850ms to 120ms with zero data loss over 14 months.

  Led the multi-region active-active migration of the storage layer; cut
  cross-region failover time from 47s to 4s.


▣ CLOUDFLARE                                           Senior Software Engineer  Aug 2018 — Feb 2022
  Edge Network                                               San Francisco
  ──────────────────────────────────────────────────────────────────────────────
  Shipped the anycast routing rewrite in Go + eBPF; improved global cache hit
  rate from 89% to 96.4%.

  Designed the worker isolation model adopted across 8 internal teams and 3
  external products.


▣ DROPBOX                                              Software Engineer         Jul 2016 — Jul 2018
  Storage Infrastructure                                     San Francisco
  ──────────────────────────────────────────────────────────────────────────────
  Built the metadata sharding layer in C++ handling 600M objects; reduced
  rebalance time from 9 hours to 22 minutes via consistent-hash sharding.


SELECTED WORK
━━━━━━━━━━━━━

◆ LIBCHANGELOG-RS — Maintainer, 2023 — Present
  High-performance changelog generator in Rust. 1.2k stars. Used in production
  at 4 companies. github.com/alexchen/libchangelog-rs

◆ SLO DESIGN TOOLKIT — Author, 2023 — Present
  Open methodology for SLO design. Cited by 3 SRE teams. 800+ downloads.
  github.com/alexchen/slo-toolkit

◆ CLOUDFLARE EDGE BLOG — Co-author, 2020
  "The Anycast Routing Rewrite" — 18k Medium reads, referenced in 2 conference talks.


RECOGNITION
━━━━━━━━━━━

Speaker, Strange Loop 2024                — "Operating Kafka at 40B Events/Day"
Speaker, QCon San Francisco 2023          — "SLO Design for Event Pipelines"
Co-author, USENIX OSDI 2022               — "Tunable Consistency for Multi-Region Logs"
Fast Company Innovation by Design finalist (2023) — Open SRE Toolkit (community contribution)


SKILLS & TOOLS
━━━━━━━━━━━━━━

LANGUAGES  Rust, Go, Python, TypeScript, C++
SYSTEMS    Kafka, PostgreSQL, FoundationDB, Cassandra, Flink, eBPF
CRAFT      Technical writing, design-engineering, OSS stewardship,
           conference speaking, RFC authorship


EDUCATION
━━━━━━━━━

Carnegie Mellon University            M.S. Computer Science, 2016
University of California, Berkeley    B.S. Computer Science, 2014
```

---

## Reading Notes for the Buyer

**The single-candidate promise:** This is the **same Alex Chen** you see in the Minimalist, Modern, Engineer, and Founder samples — Stripe → Cloudflare → Dropbox → Google → Microsoft, 9 years, Staff SWE. The Bold style shows that career with a **side-projects-heavy** lens. The Experience section is shorter than other styles because the **Selected Work** section does more work here.

**Density:** 1 page, ~480 words. The hero band carries the name + title + contact. The body carries the career + side projects + recognition. The page is intentionally asymmetric (1.0" left, 0.5" right) — the asymmetry is a small but visible design choice.

**Hero band logic:** The full-bleed burnt-orange (or chosen variant) hero band is the first thing the eye lands on. It says: "I take my work seriously enough to design for myself." This is the difference between an engineer-with-design-tastes' resume and a generic engineer's resume.

**Bullet shape:** Every bullet answers: *what artifact did I build, at what scale, with what outcome?*

- "Owned the canonical event ingestion path serving 40B events/day" — system + scale
- "Re-architected the write-side commit log in Rust + Tokio" — system + tech
- "reduced p99 latency from 850ms to 120ms with zero data loss over 14 months" — outcome (both endpoints) + durability proof

**"Selected Work" section is critical for senior SWEs:** Engineers with OSS, technical writing, or design-engineering work need a section to surface it. The Selected Work section lets the buyer surface 3-5 of their best non-job-titled artifacts with artifact + scope + link. The Experience section is for context; Selected Work is for proof.

**Recognition section is social proof:** Talks, OSS recognition, publications — these signal "others noticed the work." Quality over quantity; 2-4 of the best, not the full list.

**Asymmetric margins:** 1.0" left and 0.5" right is intentional. It creates a left-heavy visual rhythm that says "I made a choice." Do not "fix" it to symmetric margins — that erases the design.

**What the buyer should change:**
- The color variant (default is burnt orange; oxblood, forest green, and charcoal are also available by changing `\definecolor{boldAccent}`)
- The hero band text (name, title, contact)
- The Selected Work entries (their 3-5 best side projects with links)
- The Recognition section (their best 2-4 talks / awards / OSS recognition)
- The Skills & Tools (their actual stack)

**What the buyer should NOT change:**
- The full-bleed hero band — it is the visual identity
- The asymmetric margins — they are part of the design
- The accent marks before roles — they are the typographic signal
- The hairline dividers between sections — they are the visual rhythm
- The section order (Summary → Experience → Selected Work → Recognition → Skills → Education)
