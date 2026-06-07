# Sample Resume — The Minimalist (Alex Chen)

A fully filled-in example for **Style #1: The Minimalist**.
Use this as a reference for tone, density, and bullet discipline. The visual version is `template-specs/1-the-minimalist.md`.

---

```
                                                  Alex Chen
                                              ─────────────

alex@chen.dev · +1 415 555 0142 · San Francisco, CA · linkedin.com/in/alexchen · github.com/alexchen


SUMMARY
───────
Staff engineer with 9 years building distributed systems at scale. Currently operating
the canonical event ingestion path at Stripe (40B events/day, 3 regions, 11 downstream
systems). Looking for principal-level scope at a company where the data plane is the
product.


EXPERIENCE
──────────

STRIPE                                                  Mar 2022 — Present
Staff Software Engineer, Data Platform                                  San Francisco
  — Own the Kafka-backed event ingestion path serving 40B events/day
  — Re-architected the write-side commit log in Rust + Tokio; p99 latency 850ms → 120ms
  — Led the multi-region active-active migration of the storage layer
  — Operate the L1/L2 on-call rotation; reduced pages-per-week 18 → 3
  — Mentor 4 senior engineers; 2 promoted to staff in 18 months


CLOUDFLARE                                              Aug 2018 — Feb 2022
Senior Software Engineer, Edge Network                                  San Francisco
  — Shipped the anycast routing rewrite in Go + eBPF; cache hit rate 89% → 96.4%
  — Designed the worker isolation model adopted by 8 internal teams and 3 products


DROPBOX                                                  Jul 2016 — Jul 2018
Software Engineer, Storage Infrastructure                              San Francisco
  — Built the metadata sharding layer in C++ for 600M objects
  — Reduced rebalance time 9 hours → 22 minutes via consistent-hash sharding


GOOGLE                                                    May 2015 — Aug 2015
Software Engineering Intern, Cloud Spanner                              Mountain View
  — Implemented the read-coalescing optimization; reduced p99 read latency 18%


MICROSOFT                                                May 2014 — Aug 2014
Software Engineering Intern, Azure Storage                              Redmond
  — Built the blob-tagging feature shipped in the GA release


SELECTED OPEN SOURCE
────────────────────
libchangelog-rs                Maintainer, 2023 — Present
  High-performance changelog generator in Rust. 1.2k stars. Used in production at 4 companies.
  github.com/alexchen/libchangelog-rs

postgresql-partition-manager   Contributor, 2021 — 2023
  Time-based partition management for PostgreSQL. Merged 14 PRs. Adopted by 3 companies.


SKILLS
──────
Languages    Go, Rust, Python, TypeScript, C++
Systems      Kafka, PostgreSQL, FoundationDB, Cassandra, Flink
Infra        Kubernetes, Terraform, Envoy, gRPC, Linux, eBPF
Discipline   Distributed systems, consensus protocols, observability, SLO design, on-call


EDUCATION
─────────
Carnegie Mellon University                       M.S. Computer Science, 2016
University of California, Berkeley               B.S. Computer Science, 2014
  Phi Beta Kappa; TA for CS 61B


SPEAKING
────────
Strange Loop 2024              "Operating Kafka at 40B Events/Day"
QCon San Francisco 2023        "SLO Design for Event Pipelines"
```

---

## Reading Notes for the Buyer

**Density:** 1 page, ~520 words including contact and headers. Body text fills about 65% of the vertical space — the remaining 35% is intentional whitespace. That ratio is the signal of seniority.

**Section order:** Experience comes before Open Source, which comes before Skills, which comes before Education. The order is: *what you've done → what you've built for free → what you know → where you learned it*. The buyer can swap any of these but should preserve the order — top of the resume is always "what proves you can do the job."

**Bullet shape:** Every bullet answers three questions: *what did I do, at what scale, with what outcome?*

- "Re-architected the write-side commit log" — what (the commit log, the write path)
- "in Rust + Tokio" — how (the tech)
- "p99 latency 850ms → 120ms" — outcome (the number, the direction)

**Names in mono / role names in sans:** In the actual DOCX/LaTeX version, tech names like `Kafka`, `Rust`, `PostgreSQL`, and `eBPF` are in mono. The reader's eye learns: "mono = technology." This is the only typographic signal in the entire template.

**Why no summary feels like a summary:** The summary at the top is just three sentences. It says: *what level I'm at, what I'm working on right now, what I want next*. A senior resume doesn't need a 4-line bio. It needs a one-glance orientation.

**Why Education is at the bottom:** For a senior with 9 years, the degree is a credential, not a credentialing event. The reader will check it but won't make a decision based on it. The bottom placement says: "I have the degree, you can see it, but my work is the point."

**What the buyer should change:**
- Replace Alex Chen with their name
- Replace the contact line with their own
- Rewrite each bullet using the formula above (action + tech + scale + outcome)
- Drop roles that are more than 10 years old unless they are particularly relevant
- Add OSS only if they have meaningful contributions (maintainer, 100+ stars, or merged PRs in well-known repos)
- Keep the speaking section only if the talks are real and findable

**What the buyer should NOT change:**
- The order of the sections
- The 28pt serif name (this is the design)
- The whitespace ratio (do not fill the page)
- The bullet character (em dash, not bullet)
- The hairline rule under the name (one 0.5pt line, no more)
