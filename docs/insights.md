# WAIA Insights

WAIA Insights is the permanent editorial home for WAIA's point of view on the transformation of work.

WAIA's broader doctrine is defined in [`docs/waia-beliefs.md`](./waia-beliefs.md). Insights should apply and develop that belief system rather than create a separate editorial philosophy.

## Editorial Role

Insights should strengthen WAIA as the specialist authority on helping SMBs navigate a fast-moving transformation in how work gets done through People, Process and Data.

The section should stay focused on operational questions, including:

- how roles, skills, judgement, confidence and culture are changing
- how managers should respond to changing expectations and ways of working
- workflow redesign and repeatable operating practices
- informal and fragmented use of new technology
- evidence of effective use and better work
- checking, rework and capacity signals
- deliberate redeployment of released capacity
- governance as enablement
- organisational learning and standardisation
- automation and human review
- operational drag and hidden transformation risk

AI will remain an important subject because it is a major catalyst for the current transformation, but Insights should not become a generic AI blog. Articles should feel calm, credible, practical, commercially grounded and operator-led.

WAIA owns this editorial territory. New Insights should support the broader move from activity and experimentation to better work, stronger evidence and better management decisions without claiming precise ROI, guaranteed productivity gains, prompt monitoring or employee productivity scoring.

## Core Editorial Thesis

WAIA Insights should progressively build authority around three connected questions:

**What changed in the work?**

**What changed for the people doing it?**

**What evidence tells us whether that change is worthwhile?**

The evidence-to-value chain is:

**Use → Evidence → Net capacity released → Deliberate redeployment → Business value**

Articles may enter this chain at different points. Some pieces will begin with adoption or experimentation, some with people and culture, some with workflow design, some with evidence quality, some with checking and rework, and some with management decisions.

They should normally strengthen the wider People, Process and Data doctrine rather than drift into generic technology commentary.

## Language Principle

Do not use **AI** by default when the real subject is work, people, process, evidence, judgement, management or transformation.

Use **AI** when AI is genuinely the subject, when clarity requires it, or where search intent and market language make it useful.

Use the language of work when the work is the subject.

Prefer natural language around:

- transformation of work
- workflows
- new ways of working
- judgement
- capacity
- evidence
- operating practices
- organisational learning
- management decisions
- automation
- culture
- assisted or technology-enabled work

Do not replace **AI** with vague euphemisms where that would reduce clarity. The aim is not to avoid the term. It is to stop making the technology the subject of every sentence.

## Editorial Roadmap

This roadmap is a prioritised direction of travel, not a rigid publishing calendar. The sequence can change where current events, new evidence or stronger search opportunities create a better timely article.

### Published

- **How do you measure whether AI is actually saving time at work?**
  Role: cornerstone article connecting time savings, net capacity, redeployment and business value.
- **AI adoption is rising. That doesn’t mean organisations know whether it is working.**
  Role: distinguish adoption and activity from evidence of effectiveness while beginning to widen the discussion from technology use to transformation of work.

### Planned

- **What evidence should you collect about workplace AI use?**
  Role: explain Reported → Observed → Repeated → Validated evidence.
- **Why AI productivity can be positive, neutral or negative**
  Role: establish credible measurement that can surface negative and mixed effects, not only productivity gains.
- **AI training isn’t the outcome. Better work is.**
  Role: connect learning → application → evidence → operational improvement and reinforce the wider People, Process and Data position.

Future roadmap additions should deliberately broaden into people, management, culture, workflow design, organisational learning and automation where they strengthen the core doctrine.

## Editorial Acceptance Test

Before a proposed Insight moves into production, check:

- Does this address a real question a buyer, operator, manager or employee might have about how work is changing?
- Does it strengthen WAIA's People, Process and Data position?
- Does it strengthen the evidence-to-value approach?
- Does it add something distinct rather than repeat an existing Insight?
- Can material external claims be supported by credible sources?
- Does it naturally create internal-linking opportunities with existing WAIA Insights?
- Does it build topical authority around work, evidence, effectiveness, capacity, management, culture or transformation?
- Is there a reason to publish it now?
- Would the argument still be useful and credible if the article did not mention WAIA?
- Does it remain consistent with the principles and boundaries in `docs/waia-beliefs.md`?

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

`docs/waia-beliefs.md` is the durable source of truth for WAIA's wider doctrine on the transformation of work.

`docs/insights.md` is the source of truth for how that doctrine is expressed through the Insights programme, including the editorial roadmap, language guidance and article-specific acceptance criteria.

GitHub issues may be used for individual articles once they become active production priorities, but issues should not become the source of truth for either the wider belief system or the overall editorial direction.

## Migration Coordination

The existing Nineteen Point Two Insights URLs should be redirected in a separate branch of the Nineteen Point Two repository. Do not create those redirects in this repository.

Old URLs should only be redirected after the WAIA Insights branch and the Nineteen Point Two redirect branch have both been reviewed, merged and verified live.
