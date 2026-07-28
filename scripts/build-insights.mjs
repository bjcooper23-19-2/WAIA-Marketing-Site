import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const contentDir = path.join(root, "src/content/insights");
const outputDir = path.join(root, "insights");
const siteUrl = "https://waia.co.uk";
const enquiryUrl = "https://tally.so/r/gDgbQP";
const loginUrl = "https://waia.nineteenpointtwo.com/login";
const cloudflareToken = "9fa2711aed53428980734989cf03178a";
const requiredFrontmatter = ["title", "slug", "date", "category", "excerpt"];
const safeSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const escapeJson = (value) => JSON.stringify(value);

const isExternalUrl = (href) => /^https?:\/\//.test(href);

const linkAttributes = (href) =>
  isExternalUrl(href) ? ' target="_blank" rel="noopener noreferrer"' : "";

const inlineMarkdown = (value = "") =>
  escapeHtml(value).replace(
    /\[([^\]]+)\]\(([^)\s]+)\)/g,
    (_, text, href) =>
      `<a href="${escapeHtml(href)}"${linkAttributes(href)}>${text}</a>`,
  );

const tidyHtml = (value) => `${value.replace(/[ \t]+$/gm, "").trimEnd()}\n`;

const parseMarkdown = (source, file) => {
  const match = source.match(/^---\n([\s\S]+?)\n---\n([\s\S]*)$/);
  if (!match) {
    throw new Error(`${file} requires YAML-style frontmatter.`);
  }

  const data = {};
  for (const line of match[1].split("\n")) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    data[key] = value;
  }

  for (const key of requiredFrontmatter) {
    if (!data[key]) {
      throw new Error(`${file} is missing required frontmatter: ${key}`);
    }
  }

  return { data, body: match[2].trim() };
};

const validateSlug = (slug, file) => {
  if (!slug) {
    throw new Error(`${file} is missing required frontmatter: slug`);
  }

  if (!safeSlugPattern.test(slug)) {
    throw new Error(
      `${file} has an unsafe slug "${slug}". Use lowercase letters, numbers and single hyphens only.`,
    );
  }
};

const paragraphClass = (paragraph) =>
  paragraph.some((line) => line === '<p class="table-note">')
    ? ' class="table-note"'
    : "";

const paragraphText = (paragraph) =>
  paragraph
    .filter((line) => line !== '<p class="table-note">' && line !== "</p>")
    .join(" ");

const markdownToHtml = (markdown) => {
  const lines = markdown.split("\n");
  const blocks = [];
  let paragraph = [];
  let list = [];
  let table = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    const text = paragraphText(paragraph);
    if (text)
      blocks.push(`<p${paragraphClass(paragraph)}>${inlineMarkdown(text)}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (!list.length) return;
    blocks.push(
      `<ul>${list.map((item) => `<li>${inlineMarkdown(item)}</li>`).join("")}</ul>`,
    );
    list = [];
  };

  const parseTableRow = (line) =>
    line
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((cell) => cell.trim());

  const isTableSeparator = (line) =>
    /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line.trim());

  const flushTable = () => {
    if (!table.length) return;
    const [header, ...rows] = table;
    const thead = `<thead><tr>${header
      .map((cell) => `<th>${inlineMarkdown(cell)}</th>`)
      .join("")}</tr></thead>`;
    const tbody = rows.length
      ? `<tbody>${rows
          .map(
            (row) =>
              `<tr>${row.map((cell) => `<td>${inlineMarkdown(cell)}</td>`).join("")}</tr>`,
          )
          .join("")}</tbody>`
      : "";
    blocks.push(
      `<div class="table-wrap"><table>${thead}${tbody}</table></div>`,
    );
    table = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      flushTable();
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushParagraph();
      flushList();
      flushTable();
      blocks.push(`<h2>${inlineMarkdown(trimmed.slice(3))}</h2>`);
      continue;
    }

    if (trimmed.startsWith("### ")) {
      flushParagraph();
      flushList();
      flushTable();
      blocks.push(`<h3>${inlineMarkdown(trimmed.slice(4))}</h3>`);
      continue;
    }

    if (trimmed.startsWith("- ")) {
      flushParagraph();
      flushTable();
      list.push(trimmed.slice(2));
      continue;
    }

    if (trimmed.includes("|") && trimmed.startsWith("|")) {
      flushParagraph();
      flushList();
      if (!isTableSeparator(trimmed)) {
        table.push(parseTableRow(trimmed));
      }
      continue;
    }

    flushTable();
    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();
  flushTable();
  return blocks.join("\n");
};

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00Z`));

const readingTime = (body) => {
  const words = body.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 220))} min read`;
};

const articleTitleOverrides = new Map([
  ["ai-adoption-vs-ai-effectiveness", "AI Adoption vs AI Effectiveness | WAIA"],
  [
    "operational-strain-beneath-workplace-ai-adoption",
    "Operational Strain Beneath Workplace AI | WAIA",
  ],
  [
    "shadow-ai-workplace-ai-adoption",
    "Shadow AI and Workplace AI Adoption | WAIA",
  ],
]);

const browserTitle = (article) =>
  articleTitleOverrides.get(article.slug) ||
  (article.metaTitle
    ? article.metaTitle.replace(" | Nineteen Point Two", " | WAIA")
    : `${article.title} | WAIA`);

const navLink = (href, label, current = false) =>
  `<a href="${href}"${current ? ' aria-current="page"' : ""}>${label}</a>`;

const header = (current = "") => `
<header>
  <nav class="nav" aria-label="Main navigation">
    <a class="brand waia-brand" href="/" aria-label="WAIA home">
      <img class="brand-logo" src="/assets/brand/waia-lockup-dark.svg" alt="WAIA" width="360" height="92" />
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-navigation">Menu</button>
    <div class="nav-links" id="site-navigation">
      ${navLink("/", "Product", current === "product")}
      ${navLink("/how-it-works/", "How it works", current === "how-it-works")}
      ${navLink("/who-its-for/", "Who it’s for", current === "who-its-for")}
      ${navLink("/insights/", "Insights", current === "insights")}
      ${navLink("/pricing/", "Pricing", current === "pricing")}
      ${navLink("/data-privacy/", "Data &amp; privacy", current === "data-privacy")}
    </div>
    <div class="nav-actions">
      <a class="nav-sign-in" href="${loginUrl}">Sign in</a>
      <a class="nav-cta" href="${enquiryUrl}" target="_blank" rel="noopener noreferrer">Ask to see WAIA</a>
    </div>
  </nav>
</header>`;

const footer = `
<footer>
  <div class="footer-grid">
    <span>&copy; 2026 Nineteen Point Two Ltd.</span>
    <span>WAIA is a Nineteen Point Two product.</span>
    <span>
      <a href="/">Product</a> |
      <a href="/how-it-works/">How it works</a> |
      <a href="/who-its-for/">Who it’s for</a> |
      <a href="/insights/">Insights</a> |
      <a href="/pricing/">Pricing</a> |
      <a href="/data-privacy/">Data &amp; privacy</a>
    </span>
    <span>
      <a href="/terms/">Terms</a> |
      <a href="/ai-use-statement/">AI use statement</a>
      |
      <a href="https://www.nineteenpointtwo.com/privacy/" target="_blank" rel="noopener noreferrer">Privacy</a>
      |
      <a href="https://www.nineteenpointtwo.com/cookies/" target="_blank" rel="noopener noreferrer">Cookies</a>
    </span>
  </div>
</footer>`;

const faviconLinks = `
<link rel="icon" href="/assets/favicon/waia-favicon.svg" type="image/svg+xml" />
<link rel="icon" href="/assets/favicon/waia-favicon.ico" sizes="any" />
<link rel="icon" href="/assets/favicon/waia-favicon-32.png" type="image/png" sizes="32x32" />
<link rel="apple-touch-icon" href="/assets/favicon/waia-apple-touch-icon.png" />`;

const cloudflareBeacon = `
<!-- Cloudflare Web Analytics -->
<script
  type="module"
  src="https://static.cloudflareinsights.com/beacon.min.js"
  data-cf-beacon='{"token": "${cloudflareToken}"}'
></script>
<!-- End Cloudflare Web Analytics -->`;

const jsonLdScript = (data) =>
  `<script type="application/ld+json">${JSON.stringify(data).replaceAll("<", "\\u003c")}</script>`;

const documentShell = ({
  title,
  description,
  canonical,
  body,
  type = "website",
  publishedDate = "",
  ogTitle = title,
  ogDescription = description,
  structuredData,
}) => `<!doctype html>
<html lang="en-GB">
  <head>
    <link rel="stylesheet" href="/assets/css/workplace-ai-academy.css" />
    <link rel="stylesheet" href="/assets/css/insights.css" />
    <link rel="canonical" href="${canonical}" />
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta property="og:title" content="${escapeHtml(ogTitle)}" />
    <meta property="og:description" content="${escapeHtml(ogDescription)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:site_name" content="WAIA" />
    ${publishedDate ? `<meta property="article:published_time" content="${publishedDate}" />` : ""}
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escapeHtml(ogTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(ogDescription)}" />
    ${faviconLinks}
    ${structuredData ? jsonLdScript(structuredData) : ""}
  </head>
  <body class="product-waia insights-page">
    <div class="noise"></div>
    <div class="site">
      ${header("insights")}
      ${body}
      ${footer}
    </div>
    <script src="/assets/js/nav.js" defer></script>
    ${cloudflareBeacon}
  </body>
</html>`;

const loadArticles = async () => {
  let files;

  try {
    files = (await readdir(contentDir)).filter((file) => file.endsWith(".md"));
  } catch (error) {
    throw new Error(
      `Unable to read Insights content directory at ${contentDir}: ${error.message}`,
    );
  }

  if (!files.length) {
    throw new Error(
      `No Insights markdown sources found in ${contentDir}. Add at least one .md file with the required frontmatter.`,
    );
  }

  const articles = [];
  const slugs = new Map();

  for (const file of files) {
    const source = await readFile(path.join(contentDir, file), "utf8");
    const { data, body } = parseMarkdown(source, file);
    validateSlug(data.slug, file);

    if (slugs.has(data.slug)) {
      throw new Error(
        `Duplicate Insights slug "${data.slug}" found in ${slugs.get(data.slug)} and ${file}.`,
      );
    }

    slugs.set(data.slug, file);
    articles.push({
      ...data,
      body,
      html: markdownToHtml(body),
      formattedDate: formatDate(data.date),
      readingTime: data.readingTime || readingTime(body),
      url: `${siteUrl}/insights/${data.slug}/`,
    });
  }

  return articles.sort((a, b) => b.date.localeCompare(a.date));
};

const renderIndex = (articles) => {
  const cards = articles
    .map(
      (article) => `
        <article class="insight-card">
          <div class="article-meta">
            <time datetime="${article.date}">${article.formattedDate}</time>
            <span>${escapeHtml(article.category)}</span>
            <span>${escapeHtml(article.readingTime)}</span>
          </div>
          <h3>${escapeHtml(article.title)}</h3>
          <p>${escapeHtml(article.excerpt)}</p>
          <a class="insight-read-link" href="/insights/${article.slug}/">Read insight</a>
        </article>`,
    )
    .join("\n");

  return documentShell({
    title: "WAIA Insights | Workplace AI Adoption Thinking",
    description:
      "Practical WAIA thinking on making workplace AI use visible, guided and manageable across teams, managers and operating workflows.",
    canonical: `${siteUrl}/insights/`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "WAIA Insights",
      description:
        "Practical thinking on workplace AI adoption, operational visibility and managed AI use.",
      url: `${siteUrl}/insights/`,
      publisher: {
        "@type": "Organization",
        name: "WAIA",
        legalName: "Nineteen Point Two Ltd",
        url: siteUrl,
      },
      hasPart: articles.map((article) => ({
        "@type": "Article",
        headline: article.title,
        url: article.url,
        datePublished: article.date,
      })),
    },
    body: `
      <main id="top">
        <section class="insights-hero">
          <div class="container">
            <div class="eyebrow">Insights</div>
            <h1>Practical thinking for managed workplace AI adoption.</h1>
            <p class="lede">
              WAIA Insights is a calm editorial home for making workplace AI use visible,
              guided and manageable. The focus is operational: how people use AI at work,
              how managers support judgement and how organisations reduce hidden adoption risk.
            </p>
          </div>
        </section>
        <section class="insights-list-section">
          <div class="container">
            <div class="section-head">
              <div class="eyebrow">Latest thinking</div>
              <h2>Operator-led notes on AI use in the work itself.</h2>
              <p>
                These pieces are not generic AI commentary. They examine the practical
                signals leaders need when informal use, workflow variation, governance,
                manager confidence and evidence of effective AI use start to matter.
              </p>
            </div>
            <div class="insight-grid">
              ${cards}
            </div>
          </div>
        </section>
        <section class="insights-cta-section">
          <div class="container insights-cta-panel">
            <div>
              <div class="eyebrow">From thinking to operating rhythm</div>
              <h2>See how WAIA makes adoption visible enough to manage.</h2>
              <p>
                WAIA helps organisations move from informal AI use to shared guidance,
                manager support and evidence-led follow-up.
              </p>
            </div>
            <div class="hero-actions">
              <a class="btn primary" href="/how-it-works/">See how it works</a>
              <a class="btn secondary" href="${enquiryUrl}" target="_blank" rel="noopener noreferrer">Ask to see WAIA</a>
            </div>
          </div>
        </section>
      </main>`,
  });
};

const renderArticle = (article) =>
  documentShell({
    title: browserTitle(article),
    description: article.metaDescription || article.excerpt,
    ogTitle: article.ogTitle || article.title,
    ogDescription:
      article.ogDescription || article.metaDescription || article.excerpt,
    canonical: article.url,
    type: "article",
    publishedDate: `${article.date}T00:00:00Z`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.metaDescription || article.excerpt,
      datePublished: article.date,
      mainEntityOfPage: article.url,
      publisher: {
        "@type": "Organization",
        name: "WAIA",
        legalName: "Nineteen Point Two Ltd",
        url: siteUrl,
      },
    },
    body: `
      <main id="top">
        <article class="insight-article">
          <header class="article-header">
            <div class="article-shell">
              <a class="back-link" href="/insights/">Back to Insights</a>
              <div class="article-meta">
                <span>${escapeHtml(article.category)}</span>
                <time datetime="${article.date}">${article.formattedDate}</time>
                <span>${escapeHtml(article.readingTime)}</span>
              </div>
              <h1>${escapeHtml(article.title)}</h1>
              <p class="lede">${escapeHtml(article.excerpt)}</p>
            </div>
          </header>
          <div class="article-body">
            <div class="article-shell">
              ${article.html}
            </div>
          </div>
        </article>
        <section class="article-cta-section">
          <div class="container article-cta-panel">
            <div>
              <div class="eyebrow">WAIA operating note</div>
              <h2>Make the operational signal visible.</h2>
              <p>
                This article points to a practical management question: can leaders see
                how AI use is changing work, judgement and follow-up? WAIA helps make
                those signals visible without turning adoption into surveillance.
              </p>
            </div>
            <div class="hero-actions">
              <a class="btn primary" href="${enquiryUrl}" target="_blank" rel="noopener noreferrer">Ask to see WAIA</a>
              <a class="btn secondary" href="/how-it-works/">How WAIA works</a>
            </div>
          </div>
        </section>
      </main>`,
  });

const articles = await loadArticles();

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });
await writeFile(
  path.join(outputDir, "index.html"),
  tidyHtml(renderIndex(articles)),
);

for (const article of articles) {
  const articleDir = path.join(outputDir, article.slug);
  await mkdir(articleDir, { recursive: true });
  await writeFile(
    path.join(articleDir, "index.html"),
    tidyHtml(renderArticle(article)),
  );
}

console.log(
  `Built ${articles.length} WAIA insight article${articles.length === 1 ? "" : "s"}.`,
);
