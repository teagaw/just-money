# The Bold — Content (swappable)

This is the swappable content for `the-bold.tex`. The Bold style uses a full-bleed color hero band at the top + asymmetric margins + accent marks. The example below shows Alex Chen as a Staff Software Engineer with strong OSS / design-engineering presence. The "Selected Work" and "Recognition" sections surface side projects and talks — these are the sections that make The Bold distinctive.

---

## Hero Band (full-bleed at the top)

- **Name:** Alex Chen
- **Title:** Staff Software Engineer — Data Platform & Open Source Maintainer
- **Contact line:** alex@chen.dev · linkedin.com/in/alexchen · github.com/alexchen · San Francisco

## Summary

> Staff engineer with 9 years shipping infrastructure that other teams build on. Operating the canonical event ingestion path at Stripe (40B events/day, 3 regions, 11 downstream systems). Side projects: 1.2k-star Rust library used in production at 4 companies. Looking for principal-level scope with design-engineering autonomy.

## Experience

**STRIPE — Staff Software Engineer, Data Platform — Mar 2022 — Present · SF**
- Owned the canonical event ingestion path serving 40B events/day across 11 downstream systems and 3 regions
- Re-architected the write-side commit log in Rust + Tokio; reduced p99 latency from 850ms to 120ms with zero data loss over 14 months
- Led the multi-region active-active migration of the storage layer; cut cross-region failover time from 47s to 4s

**CLOUDFLARE — Senior Software Engineer, Edge Network — Aug 2018 — Feb 2022 · SF**
- Shipped the anycast routing rewrite in Go + eBPF; improved global cache hit rate from 89% to 96.4%
- Designed the worker isolation model adopted across 8 internal teams and 3 external products

**DROPBOX — Software Engineer, Storage Infrastructure — Jul 2016 — Jul 2018 · SF**
- Built the metadata sharding layer in C++ handling 600M objects; reduced rebalance time from 9 hours to 22 minutes

## Selected Work (this is what makes The Bold distinctive — surface 3-5 side projects, OSS, or technical writing)

**libchangelog-rs — Maintainer, 2023 — Present**
High-performance changelog generator in Rust · 1.2k stars · 4 production users
github.com/alexchen/libchangelog-rs

**SLO Design Toolkit — Author, 2023 — Present**
Open methodology for SLO design · cited by 3 SRE teams · 800+ downloads of the workbook
github.com/alexchen/slo-toolkit

**Cloudflare Edge Blog — Co-author, 2020**
"The Anycast Routing Rewrite" · 18k Medium reads · referenced in 2 conference talks

## Recognition (talks, OSS recognition, publications)

- **Speaker, Strange Loop 2024** — "Operating Kafka at 40B Events/Day"
- **Speaker, QCon San Francisco 2023** — "SLO Design for Event Pipelines"
- **Co-author, USENIX OSDI 2022** — "Tunable Consistency for Multi-Region Logs"
- **Fast Company Innovation by Design finalist (2023)** — *Open SRE Toolkit* (community contribution)

## Skills & Tools

- **Languages:** Rust, Go, Python, TypeScript, C++
- **Systems:** Kafka, PostgreSQL, FoundationDB, Cassandra, Flink, eBPF
- **Craft:** Technical writing, design-engineering, OSS stewardship, conference speaking, RFC authorship

## Education

- **Carnegie Mellon University** — M.S. Computer Science, 2016
- **University of California, Berkeley** — B.S. Computer Science, 2014

---

## How to customize for a senior IC without OSS

If you don't have OSS or a "Selected Work" section, you can substitute:
- **Recent talks** from your own engineering blog or podcast appearances
- **High-impact internal projects** with public case studies (Stripe's eng blog, Cloudflare's blog, etc.)
- **Open RFCs** you've authored that have public writeups

If you have nothing surfaceable, switch to The Minimalist or The Engineer — The Bold without a "Selected Work" section feels incomplete.
