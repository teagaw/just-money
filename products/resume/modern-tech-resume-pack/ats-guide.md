# ATS Optimization Guide — How to Beat the Bots

**Audience:** Buyers of the Modern Tech Resume Pack who want to understand *why* the templates are built the way they are.
**Outcome:** Every template in this pack passes ATS. This guide explains the rules, the data, and the edge cases.

---

## What is ATS?

**ATS = Applicant Tracking System.** Software that companies use to receive, parse, sort, and search job applications.

**The market:** Greenhouse, Lever, Workday, iCIMS, SmartRecruiters, Ashby, Gem, Jobvite, Taleo. ~75% of mid-to-large tech companies use one. ~99% of Fortune 500 use one.

**What it does:**
1. Receives the buyer's resume (DOCX, PDF, or both)
2. Parses it into structured fields: name, email, experience, education, skills
3. Indexes the fields for keyword search
4. Ranks candidates against the job description
5. Surfaces a shortlist to a human recruiter

**Where resumes get killed:**
- The parser can't extract the text (graphics, tables, columns, images)
- The keyword match score is below threshold
- The candidate is filtered out by a knockout question (visa, years of experience)

The buyer needs to *pass the parser* and *match the keywords*. This guide covers both.

---

## The 8 Rules of ATS (and Why Our Templates Follow Them)

### Rule 1: Single-column main path

**Why it matters:** Most ATS parsers (especially older ones — Taleo, Jobvite) read top-to-bottom, left-to-right. Two-column layouts can confuse them into reading across columns or skipping content.

**What we do:** The Modern and The Bold templates use a visual two-column layout for human readers, BUT they ship a single-column **ATS strip-down** version (saved as `*-ats.docx`) that uses the same content in a single column. The buyer uses the design version for emailed applications and the ATS version for online portals.

**What to avoid:** Don't submit a visually-two-column PDF to a Workday portal. Use the ATS version.

### Rule 2: Standard section headings exactly

**Why it matters:** ATS looks for specific section names to know how to categorize content. "Professional Experience" gets parsed. "Where I've Been" does not.

**What we do:** All 5 templates use exact section headings:
- `Experience` (or `Work Experience`, `Professional Experience`)
- `Education`
- `Skills`

**What to avoid:**
- ❌ "My Journey" / "What I've Done" / "Career Story" / "Background"
- ❌ "Where I Learned" / "Studies" / "Academics"
- ❌ "Tools I Love" / "Tech I Use" / "My Stack"

If the buyer wants to add custom sections (e.g., "Ventures" for a founder), they should still keep one of the standard section names as a backup header, or rename the custom section to match the JD keywords.

### Rule 3: No tables, text boxes, or graphics in the parse path

**Why it matters:** Older ATS parsers treat table cells as separate "documents." A 2-column table becomes 2 separate text streams that the parser concatenates in the wrong order.

**What we do:** The design versions (Modern, Bold) use tables and text boxes for the visual layout. The ATS versions strip these entirely and rebuild as a single-column document with no tables.

**What to avoid:** Don't submit a DOCX with a header band that's a 1×1 table with colored fill. Some parsers (notably Taleo) skip the entire table, which can hide the buyer's name and contact info. Use the ATS version.

### Rule 4: No headers, footers, or sidebar content above the parse zone

**Why it matters:** Many ATS parsers (Workday especially) skip header/footer content. If the buyer puts their name in the page header, the parser won't index it.

**What we do:** All contact info is in the body of the document, in the top 2 inches. No header/footer text in the design versions.

**What to avoid:**
- ❌ Name in the page header
- ❌ Page numbers in the footer
- ❌ "Page 1 of 2" in the footer
- ❌ Contact info split between header and body

### Rule 5: Standard fonts only in the ATS version

**Why it matters:** Most ATS can render any font, but some parsers tokenize the text using font metadata. Non-standard fonts can produce garbled output.

**What we do:** The design versions use Inter, Söhne, Charter, JetBrains Mono — all of which are common. The ATS versions are stripped to Calibri (or similar system default) and Times New Roman or Arial.

**What to avoid:** Don't use a custom display font in the ATS version. Don't use a font that requires a paid license that the buyer doesn't have.

### Rule 6: Standard date formats

**Why it matters:** ATS parses dates into structured fields (start date, end date, current). Non-standard formats confuse the parser.

**What we do:** All templates use `Jan 2022 — Present` or `2022 — Present` formats. Both are standard.

**What to avoid:**
- ❌ "January '22 to today"
- ❌ "01/2022 - ongoing"
- ❌ "Q1 2022 - Current"
- ❌ "2022.01 — Now"

### Rule 7: Filename matters

**Why it matters:** Some ATS systems index the filename. "resume_final_v3.docx" tells the parser nothing. "Alex-Chen-Resume-2026.docx" tells the parser (and the recruiter) who this is.

**What we do:** The format guide includes the recommended filename: `FirstName-LastName-Resume-2026.docx`.

**What to avoid:**
- ❌ "resume.docx"
- ❌ "resume_final_v3.docx"
- ❌ "Alex_Chen_resume_new.docx"
- ❌ "Resume (1).docx"

### Rule 8: Submit DOCX for online portals, PDF for email

**Why it matters:** Most ATS portals accept both, but DOCX is the safer format. The parser was designed to read DOCX. PDF is fine for most modern parsers (Greenhouse, Lever, Ashby), but older parsers (Taleo, some Workday configurations) prefer DOCX.

**What we do:** The pack ships DOCX as the primary format and PDF as a preview. The buyer submits DOCX to online portals, PDF to humans via email.

**What to avoid:** Don't submit a Google Doc link. Don't submit a Pages file. Don't submit a screenshot.

---

## Keyword Strategy

The ATS ranks candidates by keyword match against the job description. The buyer needs to surface the right keywords in their resume — not as a keyword dump, but as natural, specific, contextual language.

### The Keyword Research Process (5 minutes)

1. **Open the job description.** Read it once for content.
2. **Read it a second time for keywords.** Highlight every:
   - Tool name (Kafka, Figma, Amplitude, etc.)
   - Skill term (distributed systems, A/B testing, design systems, etc.)
   - Domain term (fintech, marketplace, B2B SaaS, etc.)
   - Certification (AWS, GCP, k8s, etc.)
3. **Write each keyword on a sticky note.** Cluster them: technical, domain, soft.
4. **Open the resume.** For each cluster, count how many times the keyword appears.
5. **The 80/20 rule:** the buyer should match ~80% of the explicit keywords, in the order they appear in the JD.

### Where to Place Keywords

- **Title (top of resume).** Mirror the JD's role title exactly. If the JD says "Senior Software Engineer, Data Platform," the resume should say "Senior Software Engineer, Data Platform" — not "Staff Software Engineer (Data)."
- **Skills section.** List the tools and skills the JD names, in the JD's language. If the JD says "Postgres," the resume should say "Postgres" — not "PostgreSQL." (Both are correct; match the JD.)
- **Experience bullets.** The 3-5 bullets per role are the buyer's chance to surface the skills. Each bullet should mention at least one named skill/tool.
- **Summary (optional).** A 1-2 sentence summary at the top can include 2-3 of the most important keywords.

### What NOT to Do

- ❌ **Don't keyword-stuff.** "Kafka Kafka Kafka Kafka" gets the buyer flagged as spam.
- ❌ **Don't add a hidden "Skills" section in white text.** ATS parsers detect this and auto-reject.
- ❌ **Don't lie about skills.** "Expert in Rust" when the buyer has read one Rust book gets the buyer caught in the interview.
- ❌ **Don't use synonyms that the ATS doesn't know.** "Built distributed systems" (where the JD says "Kafka") won't match. Use both: "Built distributed systems in Kafka."

### The Skill Synonym Trap

ATS keyword search is usually exact-match or fuzzy-match. The buyer should know that "PM" and "Product Manager" may or may not match the same way in a given ATS. Best practice: use the long form the first time, abbreviation thereafter.

> Senior Product Manager (PM) — Activation & Growth

This matches both "Senior Product Manager" and "PM" in the keyword search.

---

## Section-by-Section ATS Optimization

### Name (top of resume)

- Use full legal name, no nicknames
- If the buyer goes by a different name professionally, include both: "Alex Chen (Alexander Chen)" — this matches both search patterns

### Contact

- Email: a professional address (no "coolpartykid2003@...") — ideally firstname.lastname@gmail.com
- Phone: E.164 format with country code (+1 415 555 0142)
- Location: city and state (or city and country for non-US)
- LinkedIn: full URL (https://linkedin.com/in/alexchen) — some ATS use this for matching
- GitHub / portfolio: full URL, only if relevant to the role

### Summary (optional)

- 1-3 sentences
- Include 2-3 of the JD's top keywords
- Mirror the role title
- State the buyer's level (Senior, Staff, Principal)
- No clichés

### Experience

- Company name (no abbreviations unless universally known: IBM, AWS)
- Job title (match the JD's language)
- Dates (Jan 2022 — Present format)
- Location (City, State or Remote)
- 3-5 bullets per role
- Each bullet: action verb + named skill + scale + outcome
- Mention the JD's keywords naturally

### Education

- School name (no abbreviations unless universally known: MIT, CMU)
- Degree + major + year
- Honors only if top-tier (Phi Beta Kappa, summa cum laude, top of class)
- GPA only if 3.7+ and the buyer is <5 years out of school
- Coursework only if the buyer is <3 years out of school

### Skills

- Group by category (Languages, Systems, Tools, etc.)
- 4-8 skills per group
- Use the JD's exact language ("Postgres" or "PostgreSQL" — match the JD)
- Avoid the "Skills" section if the buyer has 20+ skills — that signals "I list everything I've ever touched" — instead, integrate skills into the bullets

---

## Common ATS Mistakes (and How Our Templates Avoid Them)

| Mistake | What happens | How our templates handle it |
|---------|--------------|----------------------------|
| Submitting a 2-column PDF to a Workday portal | Parser reads across columns, output is garbled | We ship a single-column `*-ats.docx` for portal submission |
| Using "Professional Journey" as a section name | Parser doesn't recognize it as Experience | All templates use `Experience` as the section name |
| Putting name in the page header | Parser skips header, candidate has no name | All contact info is in the body, top 2 inches |
| Submitting a Google Doc link | Most ATS don't parse Google Docs | All templates are DOCX and PDF |
| Filename: "resume_final_v3.docx" | Parser doesn't know who this is | Format guide recommends `FirstName-LastName-Resume-2026.docx` |
| Hidden white-text keyword section | Parser detects and auto-rejects | All text is visible |
| Icons, logos, or graphics in the body | Parser skips or garbles | All visual elements are in the design version only |
| Date format: "01/2022 - ongoing" | Parser doesn't know the end date | All templates use `Jan 2022 — Present` |

---

## Testing the Resume

Before submitting, the buyer can test their resume in 3 ways:

1. **Copy-paste the resume into a plain text editor.** If the content reads top-to-bottom in the right order, the ATS will parse it correctly. If the order is jumbled, the layout is too complex.

2. **Use a free ATS simulator.** Tools like [Jobscan](https://www.jobscan.co) (free tier) or [Resume Worded](https://resumeworded.com) score the resume against a JD. The buyer should aim for 80%+ match.

3. **Submit to a real ATS as a test.** Apply to a real (low-priority) job and see what the recruiter sees. Most ATS portals have a candidate-facing view ("My Application") that shows how the resume was parsed.

---

## Edge Cases

### Career changers

Career changers need to bridge keywords. The buyer should:
- Mirror the JD's language even if their old role used different terms ("growth marketing" instead of "performance marketing")
- Add a "Summary" section that explicitly states the career change and the transferable skills
- Use a "Selected Projects" section to surface relevant side projects, certifications, or bootcamp work

### International candidates

- Use the country code in phone numbers
- List visa status only if explicitly asked
- For US-based roles, "Authorized to work in the US" goes in the summary or contact line if the JD requires it
- For non-US-based roles, the buyer can list the city and country; some roles require "Willing to relocate" in the contact line

### Candidates with gaps

- Don't try to hide gaps — ATS doesn't care, but recruiters will
- Add a one-line context for any gap >6 months: "Career break for caregiving (2020)" or "Sabbatical: independent study in distributed systems"
- Use the present tense for current roles; past tense for past roles — but never the present perfect ("have been working") which is ambiguous

### Candidates with non-traditional backgrounds

- Bootcamp grads: lead with the bootcamp + the projects built, not the previous career
- Self-taught: lead with the OSS contributions and the public artifacts
- Career returners: lead with the most recent role, add a context line in the summary

---

## The Bottom Line

ATS is a tool, not a judge. It can only filter — it cannot evaluate. The buyer's job is to *not get filtered*. The 8 rules above and the 5 templates in this pack are designed to make the buyer ATS-safe while still looking like a designed document to a human reader.

When in doubt: **submit the ATS version to portals, send the design version to humans, never the other way around.**
