# Sample Resume — The Founder (Alex Chen)

A fully filled-in example for **Style #5: The Founder**.
Use this as a reference for tone, density, and the custom-section structure. The visual version is `deliverables/the-founder.tex` and the swappable content is `deliverables/the-founder-content.md`.

**Note on the candidate:** All 5 sample resumes in this pack use the **same** Alex Chen — Staff Software Engineer, 9 years, the canonical 5-company career (Stripe → Cloudflare → Dropbox → Google → Microsoft). The Founder style is showcased here with Alex's **side venture** (the OSS project libchangelog-rs) as the framing — the realistic shape of a "Founder-track" tech career, not a YC dropout profile. If you actually founded a company, replace the OSS venture with your real one (the `the-founder-content.md` includes the swap).

---

```

Alex Chen
Staff Software Engineer & OSS Maintainer • libchangelog-rs (1.2k stars) • ex-Stripe, Cloudflare,
Dropbox, Google, Microsoft

alex@chen.dev • +1 415 555 0142 • San Francisco
linkedin.com/in/alexchen • github.com/alexchen • alexchen.dev


VENTURES
────────

LIBCHANGELOG-RS                                       2023 — Present
Maintainer & Sole Author
  High-performance changelog generator in Rust. 1.2k stars on GitHub; in
  production at 4 companies. Self-funded, no external capital.

  — Designed and shipped the v1 in 6 weekends; adopted by 2 companies within
    the first 3 months
  — Maintain the release pipeline, security advisories, and 3 company-specific
    forks
  — Sustained 1.2k stars and 180 merged PRs without a team, all while working
    full-time at Stripe


SLO DESIGN TOOLKIT                                    2023 — Present
Author
  Open methodology + workbook for designing SLOs. 800+ downloads, cited by 3 SRE
  teams in public retrospectives. Self-published under CC-BY.

  — Wrote the first draft in 4 days during a Stripe on-call break; iterated
    over 6 months with 12 design partners
  — Picked up coverage in 2 SRE newsletters and one ACM SIGOPS blog post


OPERATING EXPERIENCE
────────────────────

STRIPE                                                 2022 — Present
Staff Software Engineer, Data Platform
  — Own the Kafka-backed canonical event ingestion path serving 40B events/day
    across 11 downstream systems and 3 regions
  — Re-architected the write-side commit log in Rust + Tokio; reduced p99
    latency from 850ms to 120ms with zero data loss over 14 months
  — Led the multi-region active-active migration of the storage layer; cut
    cross-region failover from 47s to 4s
  — Operate the on-call rotation (L1/L2); reduced pages-per-week from 18 to 3
    via SLO tightening and consumer back-pressure fixes


CLOUDFLARE                                             2018 — 2022
Senior Software Engineer, Edge Network
  — Shipped the anycast routing rewrite in Go + eBPF; improved global cache
    hit rate from 89% to 96.4%
  — Designed the worker isolation model adopted across 8 internal teams and
    3 external products


DROPBOX                                                2016 — 2018
Software Engineer, Storage Infrastructure
  — Built the metadata sharding layer in C++ handling 600M objects; reduced
    rebalance time from 9 hours to 22 minutes via consistent-hash sharding


GOOGLE                                                 2015
Software Engineering Intern, Cloud Spanner
  — Implemented the read-coalescing optimization; reduced p99 read latency
    by 18% on a 50-shard test cluster


MICROSOFT                                              2014
Software Engineering Intern, Azure Storage
  — Built the blob-tagging feature shipped in the GA release


ADVISORY & BOARD
────────────────

SLO Design Working Group       Founding contributor       2023 — Present
libchangelog-rs governance     Sole maintainer            2023 — Present
ACM SIGOPS                      Occasional reviewer        2022 — Present


PRESS & TALKS
─────────────

Stripe Press (2024)             "Operating Kafka at 40B Events/Day" (Strange Loop)
QCon San Francisco (2023)       "SLO Design for Event Pipelines"
USENIX OSDI 2022 (co-author)    "Tunable Consistency for Multi-Region Logs"
ACM SIGOPS Blog (2023)          Cited SLO Design Toolkit in "Observability for the Rest of Us"


SKILLS & DOMAINS
────────────────

Domains       Distributed systems, data infrastructure, observability,
              SLO design, OSS stewardship
Discipline    0↔1 platform products, technical writing, public speaking,
              RFC authorship, founding-team pattern recognition


EDUCATION
─────────

Carnegie Mellon University            M.S. Computer Science, 2016
                                      Thesis: "Verifiable Reconfiguration for
                                      Replicated State Machines" (Adviser: Prof. Liskov)
University of California, Berkeley    B.S. Computer Science, 2014
                                      Phi Beta Kappa; TA for CS 61B
```

---

## Reading Notes for the Buyer

**The single-candidate promise:** This is the **same Alex Chen** you see in the Minimalist, Modern, Bold, and Engineer samples — Stripe → Cloudflare → Dropbox → Google → Microsoft, 9 years, Staff SWE. The Founder style shows that career with a **side-venture / range** lens. The Experience section is renamed "Operating Experience" to fit the founder framing; the canonical 5-company career is the same.

**Why an OSS project as a "venture":** Many staff+ engineers with a side venture have a real, scaled OSS project — not a YC company. The "Ventures" section in this template is genuinely flexible: drop in any side project that you own, ship continuously, and treat like a business (release pipeline, security advisories, customer relationships). If you have a real YC company, see `the-founder-content.md` for the swap.

**Density:** 1 page, ~620 words. The body is 9.5pt — smaller than other styles. The 14pt baseline and 0.5" margins let the page hold more. The density is intentional — a staff engineer with 1 active side venture, 5 operating roles, 3 advisory engagements, and 4 press features has too much material for a normal 1-pager.

**The headline is the most important line:** "Staff Software Engineer & OSS Maintainer · libchangelog-rs (1.2k stars) · ex-Stripe, Cloudflare, Dropbox, Google, Microsoft" — 20 words that compress the entire career. If the buyer can't compress their career into 1 line, they need to keep building until they can.

**Section order is custom:** Unlike other styles, the Founder style encourages custom section names:
- **Ventures** — your side projects, scaled OSS, or actual companies (with status and outcome)
- **Operating Experience** — your non-founder employer history
- **Advisory & Board** — often missing from other styles
- **Press & Talks** — social proof
- **Side Projects** — current building, OSS, angel checks

**Bullet shape:** Every bullet uses **Hire / Build / Ship** or **Action + Scope + Outcome**:
- "Designed and shipped the v1 in 6 weekends" — ship + scope (time)
- "adopted by 2 companies within the first 3 months" — outcome (adoption)
- "Sustained 1.2k stars and 180 merged PRs" — outcome (the metric)

**Press & Talks is social proof:** A speaker's conference features, podcast appearances, and papers are not vanity — they are signals that "others noticed the work." Pick 3-5 of your best, with the most prestigious first.

**Side Projects signals "still building":** The Side Projects section is your chance to signal you are still a practitioner. For an SWE with a side venture, this is the most important section — the buyer is not "retired from building," they are between things.

**What the buyer should change:**
- The headline — this is the most important line; rewrite it until it's right
- The Ventures entries — the most important section; list 2-4 with outcomes and bullets
- The Operating Experience — list 2-5 non-founder roles, with the same density
- The Advisory & Board — only include real engagements with real impact
- The Press & Talks — pick 3-5 of the best, not the full list
- The Side Projects — make sure they signal "still building"

**What the buyer should NOT change:**
- The headline structure (role + current venture + exits + pedigree)
- The custom section names (Ventures, Operating Experience, etc.) — they are the design
- The right-aligned mono dates
- The 9.5pt body (smaller than other styles; the density is the point)
- The 0.5" margins (tighter than other styles; the density is the point)

**When this style is wrong:** If the buyer is applying to an IC engineering role, the density and the custom sections will signal "I want to be CEO," which is the opposite of what an IC application needs. For IC roles, use The Engineer or The Minimalist. The Founder style is for peer-level or executive-level opportunities.
