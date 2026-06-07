# The Founder — Content (swappable)

This is the swappable content for `the-founder.tex`. The Founder style is dense and story-driven. The example below shows Alex Chen as a Staff Software Engineer with a side venture (an OSS project) — this is the realistic shape of a "Founder-track" tech career, not a YC dropout profile. If you actually founded a company, replace the OSS venture with your real one.

---

## Header

- **Name:** Alex Chen
- **Headline (1 line, 12–25 words):** Staff Software Engineer & OSS Maintainer · `libchangelog-rs` (1.2k stars) · ex-Stripe, Cloudflare, Dropbox, Google, Microsoft
- **Contact line:** alex@chen.dev · `+1 415 555 0142` · San Francisco · `linkedin.com/in/alexchen` · `github.com/alexchen` · `alexchen.dev`

## Summary

> Staff engineer with 9 years operating the canonical data plane at `Stripe` (`40B` events/day, `3` regions). Maintainer of `libchangelog-rs` (`1.2k` stars, `4` production users) on the side. Considering principal roles and select advisory engagements where infrastructure decisions are product decisions.

## Ventures (replace with your own companies or side projects — for SWEs without a startup, an OSS project with real users is a legitimate "venture")

**libchangelog-rs — Maintainer & Sole Author — 2023 — Present**
High-performance changelog generator in `Rust`. `1.2k` stars on GitHub; in production at `4` companies. Self-funded, no external capital.

- Designed and shipped the v1 in `6` weekends; adopted by `2` companies within the first `3` months
- Maintain the release pipeline, security advisories, and `3` company-specific forks
- Sustained `1.2k` stars and `180` merged PRs without a team, all while working full-time at `Stripe`

**SLO Design Toolkit — Author — 2023 — Present**
Open methodology + workbook for designing SLOs. `800+` downloads, cited by `3` SRE teams in public retrospectives. Self-published under CC-BY.

- Wrote the first draft in `4` days during a Stripe on-call break; iterated over `6` months with `12` design partners
- Picked up coverage in `2` SRE newsletters and one `ACM SIGOPS` blog post

## Operating Experience (your real employer history, framed as "the work you did")

**STRIPE — Staff Software Engineer, Data Platform — Mar 2022 — Present**
- Own the `Kafka`-backed canonical event ingestion path serving `40B` events/day across `11` downstream systems and `3` regions
- Re-architected the write-side commit log in `Rust` + `Tokio`; reduced p99 latency from `850ms` to `120ms` with zero data loss over `14` months
- Led the multi-region active-active migration of the storage layer; cut cross-region failover from `47s` to `4s`
- Operate the on-call rotation (`L1`/`L2`); reduced pages-per-week from `18` to `3` via SLO tightening and consumer back-pressure fixes

**CLOUDFLARE — Senior Software Engineer, Edge Network — Aug 2018 — Feb 2022**
- Shipped the anycast routing rewrite in `Go` + `eBPF`; improved global cache hit rate from `89%` to `96.4%`
- Designed the worker isolation model adopted across `8` internal teams and `3` external products

**DROPBOX — Software Engineer, Storage Infrastructure — Jul 2016 — Jul 2018**
- Built the metadata sharding layer in `C++` handling `600M` objects; reduced rebalance time from `9` hours to `22` minutes

**GOOGLE — Software Engineering Intern, Cloud Spanner — May 2015 — Aug 2015**
- Implemented the read-coalescing optimization; reduced p99 read latency by `18%` on a `50`-shard test cluster

**MICROSOFT — Software Engineering Intern, Azure Storage — May 2014 — Aug 2014**
- Built the blob-tagging feature shipped in the `GA` release

## Advisory & Board

- **SLO Design Working Group** — Founding contributor (`2023` — Present)
- **libchangelog-rs governance** — Sole maintainer (`2023` — Present)
- **ACM SIGOPS** — Occasional reviewer (`2022` — Present)

## Press & Talks

- **Stripe Press** (`2024`) — "Operating Kafka at `40B` Events/Day" (Strange Loop)
- **QCon San Francisco** (`2023`) — "SLO Design for Event Pipelines"
- **USENIX OSDI** (`2022`) — Co-author, "Tunable Consistency for Multi-Region Logs"
- **ACM SIGOPS Blog** (`2023`) — Cited SLO Design Toolkit in "Observability for the Rest of Us"

## Skills & Domains

- **Domains:** Distributed systems, data infrastructure, observability, SLO design, OSS stewardship
- **Discipline:** 0↔1 platform products, technical writing, public speaking, RFC authorship, founding-team pattern recognition

## Education

- **Carnegie Mellon University** — M.S. Computer Science, `2016`
  - Thesis: "Verifiable Reconfiguration for Replicated State Machines" (Adviser: Prof. Liskov)
- **University of California, Berkeley** — B.S. Computer Science, `2014`
  - Phi Beta Kappa; TA for CS 61B

---

## How to adapt for an actual founder

If you're an actual founder (YC, bootstrap, or otherwise), replace the **Ventures** section with your companies:

**CompanyName — Founder & CEO — 2020—2024 (Acq. Acquirer)**
1-line outcome, e.g. "Built the X platform from 0 to $2.4M ARR; 8 employees at acquisition."

- Capital raised (e.g. "$3.2M seed, YC W19")
- Headcount growth (e.g. "Hired 14 across eng, design, GTM; scaled from 3 to 38 over 24 months")
- Product ship cadence (e.g. "Shipped v1 in 11 weeks; iterated weekly with 12 design partners")
- Exit or status (e.g. "Acquired by Stripe in 18 months" / "Still operating, profitable at month 14")

The `Operating Experience` section can then hold your pre-founder IC roles (typically 1-2 of them).
