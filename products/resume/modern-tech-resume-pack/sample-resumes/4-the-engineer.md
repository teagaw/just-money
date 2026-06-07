# Sample Resume — The Engineer (Alex Chen)

A fully filled-in example for **Style #4: The Engineer**.
Use this as a reference for tone, density, and the mono-typographic system. The visual version is `template-specs/4-the-engineer.md`.

---

```

Alex Chen
// Staff Backend Engineer, Distributed Systems & Data Platform

alex@chen.dev · +1 415 555 0142 · San Francisco
linkedin.com/in/alexchen · github.com/alexchen · alexchen.dev
────────────────────────────────────────────────────────────────────────────────


SUMMARY
───────
Staff engineer with 9 years building distributed systems where correctness and
latency both matter. Currently operating the canonical event ingestion path at
Stripe (40B events/day, 3 regions, 11 downstream systems). Looking for principal-
level scope at a company where the data plane is the product.


EXPERIENCE
──────────

STRIPE                                                   Mar 2022 — Present
Staff Software Engineer, Data Platform
  ▸ Own the Kafka-backed canonical event ingestion path serving 40B events/day
    across 11 downstream systems and 3 regions.
  ▸ Re-architected the write-side commit log in Rust + Tokio; reduced p99
    latency from 850ms to 120ms with zero data loss over 14 months.
  ▸ Led the multi-region active-active migration of the storage layer; cut
    cross-region failover time from 47s to 4s.
  ▸ Operate the L1/L2 on-call rotation; reduced pages-per-week from 18 to 3
    via SLO tightening and consumer back-pressure fixes.
  ▸ Mentor 4 senior engineers; 2 promoted to staff in 18 months.


CLOUDFLARE                                               Aug 2018 — Feb 2022
Senior Software Engineer, Edge Network
  ▸ Shipped the anycast routing rewrite in Go + eBPF; improved global cache
    hit rate from 89% to 96.4%.
  ▸ Designed the worker isolation model adopted across 8 internal teams and
    3 external products; reduced cross-tenant contention by 71%.


DROPBOX                                                   Jul 2016 — Jul 2018
Software Engineer, Storage Infrastructure
  ▸ Built the metadata sharding layer in C++ handling 600M objects; reduced
    rebalance time from 9 hours to 22 minutes via consistent-hash sharding.


GOOGLE                                                    May 2015 — Aug 2015
Software Engineering Intern, Cloud Spanner
  ▸ Implemented the read-coalescing optimization; reduced p99 read latency
    by 18% on a 50-shard test cluster.


SELECTED OPEN SOURCE
────────────────────

libchangelog-rs                  Maintainer, 2023 — Present
  High-performance changelog generator written in Rust. 1.2k stars, used in
  production at 4 companies. github.com/alexchen/libchangelog-rs

postgresql-partition-manager     Contributor, 2021 — 2023
  Time-based partition management for PostgreSQL. Merged 14 PRs; now in
  production at 3 companies' infra. github.com/pgpartman/pg_partman

fluent-bit-kafka-output         Contributor, 2022 — 2023
  High-throughput Kafka output plugin. Shipped a 4× throughput improvement
  (2M msg/s → 8.5M msg/s on a single producer). github.com/fluent/fluent-bit


TECHNICAL SKILLS
────────────────

Languages    Rust · Go · Python · TypeScript · C++
Systems      Kafka · PostgreSQL · FoundationDB · Cassandra · Flink · Redis
Infra        Kubernetes · Terraform · Envoy · gRPC · Linux · eBPF · Bazel
Data         Apache Spark · Apache Beam · dbt · Snowflake
Discipline   Distributed systems · consensus protocols · observability ·
             SLO design · on-call leadership · postmortem facilitation


EDUCATION
─────────

Carnegie Mellon University        M.S. Computer Science, 2016
                                  Thesis: "Verifiable Reconfiguration for
                                  Replicated State Machines" (Adviser: Prof. Liskov)

University of California, Berkeley  B.S. Computer Science, 2014
                                  Phi Beta Kappa; TA for CS 61B


TALKS & PUBLICATIONS
────────────────────

Strange Loop 2024                "Operating Kafka at 40B Events/Day"
QCon San Francisco 2023          "SLO Design for Event Pipelines"
USENIX OSDI 2022 (co-author)    "Tunable Consistency for Multi-Region Logs"
```

---

## Reading Notes for the Buyer

**Density:** 1 page, ~480 words. The body text is 10pt sans, but the *tech names* are 9.5pt mono. The density is the design — there is no whitespace to skim; there is content to read.

**Title with `//` prefix:** The line after the name reads `// Staff Backend Engineer, Distributed Systems & Data Platform`. The `//` is a code-comment reference. It is the only "design" element in the entire template. If the buyer wants to drop it, they can — but the buyer should know that the reviewer will register it.

**Mono inline tech names:** Every technology in the resume is in mono: `Kafka`, `PostgreSQL`, `Rust`, `Tokio`, `eBPF`, `FoundationDB`. The visual rule: *when a word is in mono, it is a technology; when a word is in sans, it is English.* The reader's eye learns this in the first 10 seconds.

**Bullet shape — the formula:** Every bullet uses the **System + Tech + Scale + Outcome** formula:

- "Re-architected the write-side commit log" — system (the commit log)
- "in Rust + Tokio" — tech (the language + async runtime)
- "serving 40B events/day" — scale (the volume)
- "p99 latency from 850ms to 120ms" — outcome (the number, both endpoints)
- "with zero data loss over 14 months" — outcome (the durability proof)

**OSS section is mandatory for senior engineers:** The Open Source section is not optional. A staff engineer with 9 years of experience who does not have meaningful OSS contributions is signaling "I only write code at work." A staff engineer with 1k+ stars on a library they maintain is signaling "I am still a practitioner." The buyer should list:

- 1-2 personal projects with 100+ stars (if they have them)
- 2-3 substantial contributions to well-known repos (merged PRs, sustained engagement)

**The `────` dividers between major sections:** These are 4 em dashes in mono, light gray (#888888), 9pt. They signal "section break" without adding visual weight. The buyer can replace with `────` characters or with actual 0.5pt horizontal lines — both are in the template.

**The bullet marker is `▸`:** A small right-pointing triangle in mono. The buyer can swap to `—` (em dash) if they prefer. The triangle signals "I read code" without being loud.

**What the buyer should change:**
- The name, contact, and `//` title
- The experience bullets — every bullet must follow System + Tech + Scale + Outcome
- The OSS section — only list contributions that are real and findable
- The technical skills — group by category, mono for tech names
- The talks/publications — only list real talks and papers

**What the buyer should NOT change:**
- The mono typographic system — it is the design
- The bullet marker (`▸` or `—`)
- The section order (Experience → OSS → Skills → Education)
- The `────` dividers between major sections
- The mono formatting of tech names in body text

**When this style is wrong:** If the buyer is applying to a non-technical reviewer (HR screen, sales HM, design HM without engineering background), the mono accents may read as "doesn't communicate well with non-engineers." For those applications, use The Modern or The Minimalist instead. The Engineer style is for technical reviewers.
