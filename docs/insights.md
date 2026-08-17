# WAIA Insights

WAIA Insights is the permanent editorial home for workplace AI content on the WAIA marketing site.

## Editorial Role

Insights should strengthen WAIA as the specialist authority on evidence-led workplace AI management. The section should stay focused on operational questions, including:

- workplace AI adoption
- workplace AI value evidence
- informal and Shadow AI use
- operational visibility
- guidance and governance as enablement
- learner and manager judgement
- workflow consistency
- evidence of effective AI use
- checking, rework and capacity signals
- operational drag and hidden adoption risk

The section should not become a generic AI blog. Articles should feel calm, credible, practical, commercially grounded and operator-led.

WAIA owns workplace AI editorial content. New Insights should support the broader move from adoption activity to workplace evidence and better management decisions without claiming precise ROI, guaranteed productivity gains, prompt monitoring or employee productivity scoring.

## Core Editorial Thesis

WAIA Insights should progressively build authority around one central question:

**How does an organisation know whether workplace AI is actually improving work?**

The evidence-to-value chain is:

**Use → Evidence → Net capacity released → Deliberate redeployment → Business value**

Articles may enter this chain at different points. Some pieces will begin with adoption, some with evidence quality, some with checking and rework, some with capacity and some with management decisions. They should normally strengthen this chain rather than drift into generic AI commentary.

## Editorial Roadmap

This roadmap is a prioritised direction of travel, not a rigid publishing calendar. The sequence can change where current events, new evidence or stronger search opportunities create a better timely article.

### Published

- **How do you measure whether AI is actually saving time at work?**
  Role: cornerstone article connecting AI time savings, net capacity, redeployment and business value.

### Next

- **AI adoption is rising. That doesn’t mean organisations know whether it is working.**
  Role: distinguish adoption and activity from evidence of effectiveness.

### Planned

- **What evidence should you collect about workplace AI use?**
  Role: explain Reported → Observed → Repeated → Validated evidence.
- **Why AI productivity can be positive, neutral or negative**
  Role: establish credible measurement that can surface negative and mixed effects, not only productivity gains.
- **AI training isn’t the outcome. Better work is.**
  Role: connect learning → application → evidence → operational improvement.

## Editorial Acceptance Test

Before a proposed Insight moves into production, check:

- Does this address a real workplace AI question a buyer or operator might search for?
- Does it strengthen WAIA's evidence-to-value position?
- Does it add something distinct rather than repeat an existing Insight?
- Can material external claims be supported by credible sources?
- Does it naturally create internal-linking opportunities with existing WAIA Insights?
- Does it build topical authority around workplace AI evidence, effectiveness, capacity or management?
- Is there a reason to publish it now?
- Would the argument still be useful and credible if the article did not mention WAIA?

## Source And Output

Markdown source files live in:

`src/content/insights/`

Generated HTML lives in:

`insights/`

Build command:

```sh
node scripts/build-insights.mjs
```

The initial migration added six articles. Future Insights can be added by creating another markdown source file with the same frontmatter and running the build command.

Commit both markdown source and generated HTML after every content change.

## Frontmatter

Required fields:

- `title`
- `slug`
- `date`
- `category`
- `excerpt`

Optional fields:

- `metaTitle`
- `metaDescription`
- `ogTitle`
- `ogDescription`
- `dateModified`
- `readingTime`
- `tags`

## Workflow

`docs/insights.md` holds the durable editorial doctrine and roadmap for WAIA Insights. GitHub issues may be used for individual articles once they become active production priorities, but issues should not become the source of truth for the overall editorial direction.

## Migration Coordination

The existing Nineteen Point Two Insights URLs should be redirected in a separate branch of the Nineteen Point Two repository. Do not create those redirects in this repository.

Old URLs should only be redirected after the WAIA Insights branch and the Nineteen Point Two redirect branch have both been reviewed, merged and verified live.
