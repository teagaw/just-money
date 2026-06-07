# The Minimalist — Content (swappable)

This is the swappable content for `the-minimalist.tex`. Replace the lines below with your own — the LaTeX file references the same structure but you don't have to edit the LaTeX to swap content. For the LaTeX, the rules are:
- Names go where `Alex Chen` appears
- Bullets go where the `item` lines appear
- Don't touch the `%` comment lines or `\newcommand` definitions

---

## Header

- **Name:** Alex Chen
- **Tagline:** Staff Software Engineer — Distributed Systems & Data Platform
- **Contact line:** alex@chen.dev · +1 415 555 0142 · San Francisco, CA · linkedin.com/in/alexchen · github.com/alexchen

## Summary

> Staff engineer with 9 years building distributed systems at scale. Owned the data platform serving 40B events/day at Stripe; led the re-architecture that cut p99 write latency 7×. Looking for principal-level scope at a company where the data model is the product.

## Experience

**STRIPE — Staff Software Engineer, Data Platform — Mar 2022 — Present**
- Owned the canonical event ingestion path serving 40B events/day across 11 downstream systems and 3 regions
- Re-architected the write-side commit log in Rust + Tokio; reduced p99 latency from 850ms to 120ms with zero data loss over 14 months
- Led the multi-region active-active migration of the storage layer; cut cross-region failover time from 47s to 4s
- Operate the L1/L2 on-call rotation; reduced pages-per-week from 18 to 3 via SLO tightening and consumer back-pressure fixes
- Mentored 4 senior engineers through staff promo packets; 2 promoted to staff in 18 months

**CLOUDFLARE — Senior Software Engineer, Edge Network — Aug 2018 — Feb 2022**
- Shipped the anycast routing rewrite in Go + eBPF; improved global cache hit rate from 89% to 96.4%
- Designed the worker isolation model adopted across 8 internal teams and 3 external products; reduced cross-tenant contention by 71%

**DROPBOX — Software Engineer, Storage Infrastructure — Jul 2016 — Jul 2018**
- Built the metadata sharding layer in C++ handling 600M objects; reduced rebalance time from 9 hours to 22 minutes via consistent-hash sharding

**GOOGLE — Software Engineering Intern, Cloud Spanner — May 2015 — Aug 2015**
- Implemented the read-coalescing optimization; reduced p99 read latency by 18% on a 50-shard test cluster

**MICROSOFT — Software Engineering Intern, Azure Storage — May 2014 — Aug 2014**
- Built the blob-tagging feature shipped in the GA release

## Selected Open Source

**libchangelog-rs — Maintainer, 2023 — Present**
High-performance changelog generator written in Rust. 1.2k stars, used in production at 4 companies. github.com/alexchen/libchangelog-rs

**postgresql-partition-manager — Contributor, 2021 — 2023**
Time-based partition management for PostgreSQL. Merged 14 PRs; in production at 3 companies. github.com/pgpartman/pg_partman

## Skills

- **Languages:** Go, Rust, Python, TypeScript, C++
- **Systems:** Kafka, PostgreSQL, FoundationDB, Cassandra, Flink
- **Infra:** Kubernetes, Terraform, Envoy, gRPC, Linux, eBPF
- **Discipline:** Distributed systems, consensus protocols, observability, SLO design, on-call leadership

## Education

- **Carnegie Mellon University** — M.S. Computer Science, 2016
- **University of California, Berkeley** — B.S. Computer Science, 2014

## Speaking

- **Strange Loop 2024** — "Operating Kafka at 40B Events/Day"
- **QCon San Francisco 2023** — "SLO Design for Event Pipelines"
- **USENIX OSDI 2022 (co-author)** — "Tunable Consistency for Multi-Region Logs"
