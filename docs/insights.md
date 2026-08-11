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
- `readingTime`
- `tags`

## Migration Coordination

The existing Nineteen Point Two Insights URLs should be redirected in a separate branch of the Nineteen Point Two repository. Do not create those redirects in this repository.

Old URLs should only be redirected after the WAIA Insights branch and the Nineteen Point Two redirect branch have both been reviewed, merged and verified live.
