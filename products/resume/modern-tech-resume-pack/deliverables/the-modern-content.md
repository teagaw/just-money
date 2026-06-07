# The Modern — Content (swappable)

This is the swappable content for `the-modern.tex`. The Modern style uses a colored sidebar (left) + main column (right). The sidebar answers "what's your stack?" and the main column answers "what did you ship?"

**Important style choice for this template:** the sidebar works for any technical IC, not just PMs. The example below shows Alex Chen as a Staff Software Engineer with cross-functional leadership experience — replace the sidebar items with your own engineering stack.

---

## Header (in the colored band at the top)

- **Name:** Alex Chen
- **Title (in band):** Staff Software Engineer — Data Platform & Cross-Functional Lead

## Sidebar (left column, 1.85" wide)

**CONTACT**
- alex@chen.dev
- +1 415 555 0142
- San Francisco, CA

**LINKS**
- linkedin.com/in/alexchen
- github.com/alexchen
- alexchen.dev

**CORE SKILLS** *(engineering skills for this example; PMs would put Roadmapping, OKRs, etc.)*
- Distributed Systems · Architecture · Cross-Functional Leadership · Mentorship · SLO Design · Tech Strategy

**TOOLS & PLATFORMS**
- Kafka, gRPC, Kubernetes, Terraform, Linear, Notion, JIRA, Datadog, Looker, Snowflake

**LANGUAGES** *(spoken, not programming)*
- English (native)
- Mandarin (professional)

**INTERESTS** *(1 line, keep light)*
- Systems reading. Bouldering. Building mechanical keyboards.

## Summary (top of main column)

> Staff engineer with 9 years building distributed systems at scale. Operating the canonical event ingestion path at Stripe (40B events/day, 3 regions, 11 downstream systems). Currently partnering with PM, Design, and Data Science to ship infra decisions as product. Looking for principal-level scope at a company where the data plane is the product.

## Experience (main column, right side)

**STRIPE — Staff Software Engineer, Data Platform — Mar 2022 — Present · San Francisco**
- Owned the SMB-facing data activation roadmap alongside 3 PMs and 2 design leads; shipped 9 platform experiments in 2024 that lifted trial-to-paid visibility from 11.2% to 14.8%
- Re-architected the write-side commit log in Rust + Tokio; reduced p99 latency from 850ms to 120ms with zero data loss over 14 months
- Led the multi-region active-active migration of the storage layer; cut cross-region failover time from 47s to 4s
- Coached 4 senior engineers and 2 PM partners; 2 engineers promoted to staff in 18 months

**CLOUDFLARE — Senior Software Engineer, Edge Network — Aug 2018 — Feb 2022 · San Francisco**
- Shipped the anycast routing rewrite in Go + eBPF; improved global cache hit rate from 89% to 96.4%
- Designed the worker isolation model adopted across 8 internal teams and 3 external products

**DROPBOX — Software Engineer, Storage Infrastructure — Jul 2016 — Jul 2018 · San Francisco**
- Built the metadata sharding layer in C++ handling 600M objects; reduced rebalance time from 9 hours to 22 minutes

**GOOGLE — Software Engineering Intern, Cloud Spanner — May 2015 — Aug 2015 · Mountain View**
- Implemented the read-coalescing optimization; reduced p99 read latency by 18% on a 50-shard test cluster

**MICROSOFT — Software Engineering Intern, Azure Storage — May 2014 — Aug 2014 · Redmond**
- Built the blob-tagging feature shipped in the GA release

## Education

- **Carnegie Mellon University** — M.S. Computer Science, 2016
- **University of California, Berkeley** — B.S. Computer Science, 2014

## Speaking & Recognition

- **Strange Loop 2024** — "Operating Kafka at 40B Events/Day"
- **QCon San Francisco 2023** — "SLO Design for Event Pipelines"
- **USENIX OSDI 2022 (co-author)** — "Tunable Consistency for Multi-Region Logs"

---

## How to customize for a non-engineer

If you're a PM/Designer/Analyst using The Modern, replace the sidebar's "Core Skills" and "Tools & Platforms" with your own stack:

| If you are a… | Core Skills | Tools & Platforms |
|---------------|-------------|-------------------|
| PM | Roadmapping · OKRs · User Research · A/B Testing · SQL · Pricing Strategy · Cohort Analysis | Amplitude, Looker, Mixpanel, Notion, JIRA, Linear, Tableau, Optimizely |
| Designer | Design Systems · Brand Identity · Prototyping · User Research · Motion · Design-Engineering | Figma, FigJam, Framer, Principle, After Effects, Webflow, Lottie |
| Analyst | SQL · Python · Experimentation · Causal Inference · Forecasting · Stakeholder Mgmt | Snowflake, dbt, Looker, Hex, Mode, Amplitude, Optimizely |

The rest of the resume (header, summary, experience, education) follows the same rules as other styles.
