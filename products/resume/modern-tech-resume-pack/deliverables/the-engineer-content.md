# The Engineer — Content (swappable)

This is the swappable content for `the-engineer.tex`. The Engineer style uses JetBrains Mono for every technology name. The visual rule: **when a word is in mono, it is a technology; when a word is in sans, it is English.** Every tech name below is wrapped in backticks because that's what the LaTeX `\m{}` macro expects.

---

## Header

- **Name:** Alex Chen
- **Title (mono, with `//` prefix):** `// Staff Software Engineer, Distributed Systems & Data Platform`
- **Contact line:** alex@chen.dev · `+1 415 555 0142` · San Francisco · `linkedin.com/in/alexchen` · `github.com/alexchen` · `alexchen.dev`

## Summary

> Engineer with 9 years building distributed systems where correctness and latency both matter. Currently operating the canonical event ingestion path at `Stripe` (`40B events/day`, `3` regions, `11` downstream systems). Looking for principal-level scope at a company where the data plane is the product.

## Experience

**STRIPE — Staff Software Engineer, Data Platform — Mar 2022 — Present**
- Own the `Kafka`-backed canonical event ingestion path serving `40B events/day` across `11` downstream systems and `3` regions
- Re-architected the write-side commit log in `Rust` + `Tokio`; reduced p99 latency from `850ms` to `120ms` with zero data loss over `14` months
- Led the multi-region active-active migration of the storage layer; cut cross-region failover time from `47s` to `4s`
- Operate the on-call rotation (`L1`/`L2`); reduced pages-per-week from `18` to `3` via SLO tightening and consumer back-pressure fixes
- Mentor 4 senior engineers through staff promo packets; 2 promoted to staff in `18` months

**CLOUDFLARE — Senior Software Engineer, Edge Network — Aug 2018 — Feb 2022**
- Shipped the anycast routing rewrite in `Go` + `eBPF`; improved global cache hit rate from `89%` to `96.4%`
- Designed the worker isolation model adopted across `8` internal teams and `3` external products

**DROPBOX — Software Engineer, Storage Infrastructure — Jul 2016 — Jul 2018**
- Built the metadata sharding layer in `C++` handling `600M objects`; reduced rebalance time from `9` hours to `22` minutes

**GOOGLE — Software Engineering Intern, Cloud Spanner — May 2015 — Aug 2015**
- Implemented the read-coalescing optimization; reduced p99 read latency by `18%` on a `50`-shard test cluster

**MICROSOFT — Software Engineering Intern, Azure Storage — May 2014 — Aug 2014**
- Built the blob-tagging feature shipped in the `GA` release

## Selected Open Source

**libchangelog-rs — Maintainer, 2023 — Present**
High-performance changelog generator in `Rust`. `1.2k` stars, used in production at `4` companies. github.com/alexchen/libchangelog-rs

**postgresql-partition-manager — Contributor, 2021 — 2023**
Time-based partition management for `PostgreSQL`. Merged `14` PRs; in production at `3` companies. github.com/pgpartman/pg_partman

**fluent-bit-kafka-output — Contributor, 2022 — 2023**
High-throughput `Kafka` output plugin. Shipped a `4×` throughput improvement (`2M` msg/s to `8.5M` msg/s on a single producer). github.com/fluent/fluent-bit

## Technical Skills

- **Languages:** `Rust`, `Go`, `Python`, `TypeScript`, `C++`
- **Systems:** `Kafka`, `PostgreSQL`, `FoundationDB`, `Cassandra`, `Flink`, `Redis`
- **Infra:** `Kubernetes`, `Terraform`, `Envoy`, `gRPC`, `Linux`, `eBPF`, `Bazel`
- **Data:** `Apache Spark`, `Apache Beam`, `dbt`, `Snowflake`
- **Discipline:** Distributed systems, consensus protocols, observability, SLO design, on-call leadership, postmortem facilitation

## Education

- **Carnegie Mellon University** — M.S. Computer Science, 2016
  - Thesis: "Verifiable Reconfiguration for Replicated State Machines" (Adviser: Prof. Liskov)
- **University of California, Berkeley** — B.S. Computer Science, 2014
  - Phi Beta Kappa; TA for CS 61B

## Talks & Publications

- **Strange Loop 2024** — "Operating `Kafka` at `40B` Events/Day"
- **QCon San Francisco 2023** — "SLO Design for Event Pipelines"
- **USENIX OSDI 2022** (co-author) — "Tunable Consistency for Multi-Region Logs"
