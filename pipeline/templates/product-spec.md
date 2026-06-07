# Production Spec Template

Copy this file for every new product. Fill it out BEFORE building.

```markdown
# Product Spec — {Line}/{Product Name}

**Slug:** {line}/{product-name}
**Price:** $X (or $X / $Y bundle)
**Status:** [ ] spec  [ ] build  [ ] critique  [ ] listed
**Target buyer:** {one sentence}
**Pain point:** {one sentence}
**Promise:** {one sentence}

## What's Inside
- {Item 1}
- {Item 2}
- {Item 3}
- ...
- (must be ≥ 5 items for $7+, ≥ 10 for $15+, ≥ 25 for $27+)

## Files to Deliver
- [ ] {file 1.ext}
- [ ] {file 2.ext}
- [ ] cover.png (2000x2000)
- [ ] mockup-1.png
- [ ] mockup-2.png
- [ ] mockup-3.png
- [ ] listing/description.md
- [ ] listing/tags.md
- [ ] listing/title.md

## Keywords (from research)
Primary: {kw1}, {kw2}, {kw3}
Long-tail: {kw4}, {kw5}

## Quality Bar Check
- [ ] Cover looks premium
- [ ] Files open cleanly
- [ ] All checklist items in quality-bar.md
- [ ] Critique subagent approved

## Critique Notes
{link to critique.md or paste summary}

## Listing Links
- Etsy: {url}
- Gumroad: {url}
- Other: {url}
```

## Subagent Roles

When dispatching, use these prompt scaffolds:

### Research Subagent
```
You are researching the {line} market for a product: {product idea}.
Deliver:
1. Target buyer (specific: age, job, pain)
2. Top 5 competitors on Etsy/Gumroad — what they charge, what they miss
3. 13 keyword tags for Etsy
4. 5 long-tail search terms buyers actually use
5. 3 differentiation angles we can take
6. Recommended price point with reasoning
Save to: products/{line}/{slug}/research.md
```

### Builder Subagent
```
Build this product: products/{line}/{slug}/spec.md
Read the spec, then create every file listed.
Use the quality bar in pipeline/quality-bar.md.
When done, list all files created and any blockers.
```

### Critique Subagent
```
You are a tough buyer reviewing this product: products/{line}/{slug}/
- Would you pay $X for this?
- What's weak? What's missing?
- Is the cover image premium or generic?
- Are the files opening cleanly?
- Does the value match the price?
Be brutal. If it's not shippable, say exactly what to fix.
Save to: products/{line}/{slug}/critique.md
```
