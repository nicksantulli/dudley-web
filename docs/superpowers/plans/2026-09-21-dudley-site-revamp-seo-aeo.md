# Dudley Site Revamp, SEO, and AEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the approved App Poster Wall redesign and a verifiable SEO/AEO foundation in which every human and machine surface agrees that Last Human and the other released apps are live.

**Architecture:** Keep the site as static Astro. Extend content collections so app entries remain the product-fact source, add pure helpers for canonical URLs and topic hubs, and enforce parity through source and built-output tests. Build the visual system from semantic Astro components, migrate each route family, then publish with the existing `gh-pages` flow.

**Tech Stack:** Astro 5, TypeScript, MD/MDX content collections, static HTML/CSS, Node's built-in test runner, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-21-dudley-site-revamp-seo-aeo-design.md`

## Global Constraints

- Work only in `/Users/nicksantulli/Documents/GitHub/Dudley-Development/.worktrees/dudley-site-revamp-20260921` on `codex/dudley-site-revamp-20260921`; do not modify the dirty checkout at `/Users/nicksantulli/Documents/GitHub/dudley-web`.
- Last Human is live, first in the Dudley-owned catalog, and linked to App Store ID `6808782611` with placement-specific registered campaign tokens.
- Use the approved App Poster Wall direction: black masthead, “Pick an app. See what happens.”, full-width product bands, heavy sans type, thick rules, square or tiny radii, and real product colors/art.
- Do not ship “Independent iOS studio,” “small apps with real character,” or Last Human “coming soon” on public discovery surfaces.
- Do not add gradients, glass effects, generic feature-card grids, emoji feature icons, ornamental blobs, or shadow stacks.
- Preserve a static homepage with no hydration; the only shared browser script remains the small mobile-navigation enhancement under 3 KB uncompressed.
- Canonical HTML routes use trailing slashes; `.xml` and `.txt` endpoints retain file URLs.
- Only configured topic hubs with at least three relevant published articles are indexable; legacy tag routes are `noindex,follow` and excluded from sitemaps.
- Every first-party App Store link carries `pt=128970277`, a registered placement-specific `ct`, and `mt=8`.
- Shared CSS is at most 45 KB uncompressed; the shared logo is under 5 KB; delivered app icons are normally under 100 KB; common mobile poster images are under 350 KB.
- Verify 320, 390, 430, 844, and 1440 px widths; touch targets are at least 44 × 44 CSS px; text works at 200% zoom; WCAG 2.2 AA contrast and visible focus are required.
- Do not claim completion until source build, tests, visual QA, `gh-pages` deployment, and cache-busted live checks pass.

## Review Focus

- A live client app may intentionally lack a Dudley landing page; it must retain partner attribution, a tagged store destination, and no broken internal detail link. Tasks 2 and 7 test this.
- Slash normalization must not convert `/llms.txt`, `/blog/rss.xml`, or sitemap files into directory URLs. Task 3 tests both pure normalization and built canonicals.
- An unmapped freeform tag must remain readable text without creating an indexable route or dead link. Task 4 tests this.
- The longest app name, legal copy, and App Store action must not overflow at 320 px or 200% text zoom. Task 9 verifies this.
- A correct local build does not prove GitHub Pages or CDN state changed. Task 11 verifies source commit, deployment commit, and cache-busted live resources separately.

---

## File Map

**Create:**

- `src/lib/urls.mjs` — normalize HTML and file endpoint paths.
- `src/lib/topics.ts` — durable hub definitions, label mapping, eligibility, and post selection.
- `src/components/AppStoreAction.astro` — one accessible attributed App Store action.
- `src/components/AppPosterBand.astro` — owned, upcoming, or client product band.
- `src/components/AnswerCard.astro` — answer-first editorial link.
- `src/components/SiteHeader.astro` and `src/components/SiteFooter.astro` — shared shell.
- `src/pages/blog/topics/index.astro` and `src/pages/blog/topics/[topic].astro` — curated taxonomy.
- `scripts/content-contract.test.mjs` — source-content contracts.
- `scripts/site-integrity.test.mjs` — built metadata, canonical, sitemap, schema, link, and copy checks.
- `scripts/optimize-assets.mjs` — deterministic Sharp-based WebP derivatives for delivered art.

**Primary modifications:**

- `package.json`, `astro.config.mjs`, `public/robots.txt`, `public/assets/style.css`.
- `src/content/config.ts` and `src/content/apps/*.mdx`.
- `src/lib/blog.ts`, `src/lib/campaignLinks.mjs`, `src/layouts/Base.astro`, `src/layouts/AppLanding.astro`, and `src/layouts/BlogPost.astro`.
- `src/pages/index.astro`, blog/tag pages, `src/pages/llms.txt.ts`, and all route families using the shared shell.
- `scripts/campaign-links.test.mjs` and `scripts/built-output.test.mjs`.

## Task 1: Restore a Green Baseline

**Files:**
- Modify: `src/content/blog/why-are-prices-still-high-if-inflation-is-down.md`
- Test: `scripts/built-output.test.mjs`

**Interfaces:**
- Consumes: existing App Store attribution rules.
- Produces: a fully passing baseline for later work.

- [ ] **Step 1: Reproduce the existing failure**

```bash
npm test
```

Expected: only `no bare first-party App Store links in built output` fails for App Store ID `6780714383` in the EconByte inflation article.

- [ ] **Step 2: Route the article CTA through the attributed app page**

Replace the external bare link with:

```markdown
[Download EconByte for iPhone](/apps/econbyte/)
```

The app page owns the placement-specific external action; the article must not invent or reuse a static campaign token.

- [ ] **Step 3: Verify and commit**

```bash
npm test
git add src/content/blog/why-are-prices-still-high-if-inflation-is-down.md
git commit -m "fix: route EconByte article through attributed app page"
```

Expected: all 27 campaign-link and 18 built-output tests pass.

## Task 2: Enforce App Product Facts in Content

**Files:**
- Create: `scripts/content-contract.test.mjs`
- Create: `scripts/site-integrity.test.mjs`
- Modify: `src/content/config.ts`
- Modify: `src/content/apps/*.mdx`
- Modify: `package.json`

**Interfaces:**
- Consumes: current app status, IDs, and MDX entries.
- Produces: `posterHeadline`, `posterFacts`, `pricingSummary`, `accountSummary`, `offlineSummary`, and `privacySummary` on every app entry.

- [ ] **Step 1: Write failing source-contract tests**

Create `scripts/content-contract.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const APPS = resolve('src/content/apps');
const files = readdirSync(APPS).filter((name) => name.endsWith('.mdx'));
const frontmatter = (name) => {
  const source = readFileSync(join(APPS, name), 'utf8');
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(match, `${name} is missing frontmatter`);
  return match[1];
};

test('every app defines poster and disclosure facts', () => {
  for (const file of files) {
    const data = frontmatter(file);
    for (const key of ['posterHeadline', 'posterFacts', 'pricingSummary', 'accountSummary', 'offlineSummary', 'privacySummary']) {
      assert.match(data, new RegExp(`^${key}:`, 'm'), `${file} is missing ${key}`);
    }
    assert.match(data, /^posterFacts:\n(?:  - .+\n?){2,3}/m, `${file} needs two or three posterFacts`);
  }
});

test('live client work may omit a landing page only with partner attribution', () => {
  const client = frontmatter('dude-wheres-this-house.mdx');
  assert.match(client, /^status: "live"$/m);
  assert.match(client, /^landingPage: false$/m);
  assert.match(client, /^developedFor: "HomeLight"$/m);
  assert.match(client, /^appStoreId: "6779785617"$/m);
});

test('Last Human source facts are live', () => {
  const data = frontmatter('last-human.mdx');
  assert.match(data, /^status: "live"$/m);
  assert.match(data, /^appStoreId: "6808782611"$/m);
  assert.doesNotMatch(data, /coming soon/i);
});
```

Add it to `package.json` before the build. Also create `scripts/site-integrity.test.mjs` with `import test from 'node:test'; test('site integrity suite is wired', () => {});` so the full command can reference it now.

```json
"test": "node --test scripts/content-contract.test.mjs && npm run build && node --test scripts/campaign-links.test.mjs && node --test scripts/built-output.test.mjs && node --test scripts/site-integrity.test.mjs"
```

- [ ] **Step 2: Confirm the contract fails**

```bash
node --test scripts/content-contract.test.mjs
```

Expected: missing-key failures for every app.

- [ ] **Step 3: Strengthen the Astro schema**

Add to the app object in `src/content/config.ts`:

```ts
posterHeadline: z.string().min(12).max(90),
posterFacts: z.array(z.string().min(3).max(100)).min(2).max(3),
pricingSummary: z.string().min(3).max(180),
accountSummary: z.string().min(3).max(180),
offlineSummary: z.string().min(3).max(180),
privacySummary: z.string().min(3).max(220),
```

Apply `superRefine` to enforce:

```ts
if (app.status === 'live' && !app.appStoreId) issue('appStoreId', 'Live apps require an App Store ID');
if (app.status === 'live' && !app.developedFor && app.landingPage === false) issue('landingPage', 'Live Dudley-owned apps require a landing page');
if (app.status !== 'live' && app.appStoreId) issue('appStoreId', 'Unreleased apps cannot expose an App Store ID');
```

Implement `issue` as a local callback to `ctx.addIssue({ code: z.ZodIssueCode.custom, path: [path], message })`.

- [ ] **Step 4: Add verified facts to all seven app entries**

Use existing MDX and privacy policies. Last Human's core entry is:

```yaml
posterHeadline: "Dodge the bots before they optimize your desk."
posterFacts:
  - "50 escalating office floors"
  - "Five bot types and four power-ups"
  - "No account; playable offline"
pricingSummary: "Free to download; optional one-time Remove Ads purchase at the price shown in the app."
accountSummary: "No account required."
offlineSummary: "Playable offline after download."
privacySummary: "Gameplay progress stays on device; see the Last Human privacy policy for advertising and diagnostics details."
```

For the other apps, use only claims already supported by their entries. Do not generalize ads, purchases, account, offline, or privacy behavior.

- [ ] **Step 5: Verify and commit**

```bash
node --test scripts/content-contract.test.mjs
npm run build
git add package.json scripts/content-contract.test.mjs scripts/site-integrity.test.mjs src/content
git commit -m "feat: centralize visible app release facts"
```

## Task 3: Canonical, Entity, Robots, and Sitemap Foundations

**Files:**
- Create: `src/lib/urls.mjs`
- Modify: `scripts/site-integrity.test.mjs`
- Modify: `src/layouts/Base.astro`
- Modify: `astro.config.mjs`
- Modify: `public/robots.txt`
- Modify: `src/pages/apps/powell-prowl/index.astro`
- Modify: slashless internal links found by `rg "rel\('/(about|support|terms/vibe-rater)'" src`

**Interfaces:**
- Consumes: `abs()` and site constants.
- Produces: `normalizePublicPath(path: string): string`, stable `#organization` and `#website` IDs, one canonical per indexable HTML page, and explicit search-crawler access.

- [ ] **Step 1: Write failing URL tests**

Add to `scripts/site-integrity.test.mjs`:

```js
import assert from 'node:assert/strict';
import { normalizePublicPath } from '../src/lib/urls.mjs';

test('normalizePublicPath adds slashes only to HTML routes', () => {
  assert.equal(normalizePublicPath('/about'), '/about/');
  assert.equal(normalizePublicPath('/about/'), '/about/');
  assert.equal(normalizePublicPath('/'), '/');
  assert.equal(normalizePublicPath('/llms.txt'), '/llms.txt');
  assert.equal(normalizePublicPath('/blog/rss.xml'), '/blog/rss.xml');
});
```

Run `node --test scripts/site-integrity.test.mjs`. Expected: `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 2: Implement the normalizer**

Create `src/lib/urls.mjs`:

```js
export function normalizePublicPath(path) {
  const value = String(path);
  const match = value.match(/^([^?#]*)([?#].*)?$/);
  const pathname = match?.[1] || '/';
  const suffix = match?.[2] || '';
  if (pathname === '/') return `/${suffix}`;
  if (/\.[a-z0-9]+$/i.test(pathname)) return `${pathname}${suffix}`;
  return `${pathname.replace(/\/+$/, '')}/${suffix}`;
}
```

Run the focused test; expected PASS.

- [ ] **Step 3: Add built canonical and robots tests**

Add a recursive `dist/**/*.html` walker, then assert:

```js
test('every indexable HTML page has one slash-normalized canonical', () => {
  for (const page of htmlPages()) {
    if (/<meta name="robots" content="[^"]*noindex/i.test(page.html)) continue;
    const links = [...page.html.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(links.length, 1, `${page.rel} canonical count`);
    assert.match(links[0], /^https:\/\/dudleyapps\.com\/(?:$|.*\/$)/, `${page.rel} canonical slash`);
  }
});

test('robots explicitly allows OAI-SearchBot and names both sitemaps', () => {
  const robots = readFileSync(resolve('dist/robots.txt'), 'utf8');
  assert.match(robots, /User-agent: OAI-SearchBot\nAllow: \//);
  assert.match(robots, /sitemap-index\.xml/);
  assert.match(robots, /sitemap-images\.xml/);
});
```

In the same file, add metadata uniqueness and internal-link checks:

```js
const capture = (html, pattern) => html.match(pattern)?.[1]?.trim() ?? '';

test('indexable titles and descriptions are present and unique', () => {
  const seen = new Map();
  for (const page of htmlPages()) {
    if (/<meta name="robots" content="[^"]*noindex/i.test(page.html)) continue;
    const title = capture(page.html, /<title>([^<]+)<\/title>/i);
    const description = capture(page.html, /<meta name="description" content="([^"]+)"/i);
    assert.ok(title && description, `${page.rel} needs title and description`);
    const key = `${title}\n${description}`;
    assert.ok(!seen.has(key), `${page.rel} duplicates ${seen.get(key)}`);
    seen.set(key, page.rel);
  }
});

test('root-relative HTML links resolve to built routes', () => {
  for (const page of htmlPages()) {
    for (const match of page.html.matchAll(/href="(\/[^"]*)"/g)) {
      const pathname = match[1].split(/[?#]/)[0];
      if (!pathname || /\.[a-z0-9]+$/i.test(pathname)) continue;
      const target = pathname === '/' ? resolve('dist/index.html') : resolve('dist', pathname.replace(/^\//, ''), 'index.html');
      assert.ok(existsSync(target), `${page.rel} links to missing ${pathname}`);
    }
  }
});
```

Run `npm run build && node --test scripts/site-integrity.test.mjs`. Expected: failures for current slash inconsistencies and OAI entry.

- [ ] **Step 4: Normalize shared metadata and entity IDs**

In `Base.astro`:

```ts
import { normalizePublicPath } from '../lib/urls.mjs';
const publicPath = normalizePublicPath(path);
const canonical = abs(publicPath);
const orgId = abs('/#organization');
const websiteId = abs('/#website');
```

Add `@id: orgId` to Organization, switch its logo to `/assets/dudley-mark.svg`, and link the homepage WebSite with `@id: websiteId` and `publisher: { '@id': orgId }`. App/article schemas reference `#organization` instead of redefining it.

- [ ] **Step 5: Enforce route and crawler policy**

Set `trailingSlash: 'always'` in `astro.config.mjs`. Exclude `/apps/powell-prowl/`, all `/blog/tags/` paths, support/privacy, RSS, and `llms.txt` from the page sitemap. Add:

```txt
User-agent: OAI-SearchBot
Allow: /
```

Keep `/apps/powell-prowl/` as a `noindex,follow` compatibility page with canonical and visible link to `/apps/monetary-policy-independence-day/`. Normalize all slashless internal links returned by the task's `rg` command.

- [ ] **Step 6: Verify and commit**

```bash
npm test
git diff --check
git add astro.config.mjs public/robots.txt scripts/site-integrity.test.mjs src/lib/urls.mjs src/layouts/Base.astro src/pages src/layouts
git commit -m "feat: enforce canonical and crawler contracts"
```

## Task 4: Replace Indexable Tag Sprawl with Durable Topic Hubs

**Files:**
- Create: `src/lib/topics.ts`
- Create: `src/pages/blog/topics/index.astro`
- Create: `src/pages/blog/topics/[topic].astro`
- Modify: `src/lib/blog.ts`
- Modify: `src/pages/blog/index.astro`
- Modify: `src/pages/blog/[page].astro`
- Modify: `src/layouts/BlogPost.astro`
- Modify: `src/pages/blog/tags/index.astro`
- Modify: `src/pages/blog/tags/[tag].astro`
- Modify: `scripts/content-contract.test.mjs`
- Modify: `scripts/site-integrity.test.mjs`
- Modify: `astro.config.mjs`

**Interfaces:**
- Consumes: `Post`, `postTags()`, `tagSlug()`, and `getPublishedPosts()`.
- Produces: `TOPIC_HUBS`, `TopicSlug`, `topicForLabel(label)`, `postsForTopic(posts, slug)`, and `eligibleTopicHubs(posts, minimum = 3)`.

- [ ] **Step 1: Write failing taxonomy tests**

Pin the six exact slugs in `scripts/content-contract.test.mjs`. Add built checks:

```js
test('legacy tag pages are noindex and absent from the page sitemap', () => {
  const sitemap = readFileSync(resolve('dist/sitemap-0.xml'), 'utf8');
  assert.doesNotMatch(sitemap, /\/blog\/tags\//);
  const legacy = readFileSync(resolve('dist/blog/tags/privacy/index.html'), 'utf8');
  assert.match(legacy, /<meta name="robots" content="noindex,follow"/);
});

test('an unmapped freeform tag is text, not a dead link', () => {
  const article = readFileSync(resolve('dist/blog/gorpcore-prophet-won/index.html'), 'utf8');
  assert.doesNotMatch(article, /href="\/blog\/tags\/gorpcore-prophet-won\//);
});
```

Run `npm run build && node --test scripts/site-integrity.test.mjs`. Expected: FAIL because tag routes are currently indexable and article tags always link.

- [ ] **Step 2: Define the typed topic registry**

Create `src/lib/topics.ts`:

```ts
import type { Post } from './blog';
import { postTags, tagSlug } from './blog';

export const TOPIC_HUBS = {
  'iphone-privacy': { title: 'iPhone Privacy', description: 'Plain-English answers about photo access, contacts, location, screenshots, metadata, and app permissions.' },
  'ai-media': { title: 'AI Images & Media', description: 'How AI-generated media, labels, training controls, watermarks, provenance, and authenticity signals work.' },
  'internet-culture': { title: 'Internet Culture', description: 'Clear explanations of vibe language, social trends, group-chat behavior, and the internet’s stranger corners.' },
  economics: { title: 'Economics in Plain English', description: 'Inflation, prices, interest rates, central banks, and economic headlines without textbook fog.' },
  'app-store': { title: 'The App Store Explained', description: 'Practical answers about iPhone app releases, privacy disclosures, age checks, downloads, and updates.' },
  'dudley-guides': { title: 'Dudley App Guides', description: 'How Dudley apps work, what they cost, and what to expect before downloading.' },
} as const;

export type TopicSlug = keyof typeof TOPIC_HUBS;

const TAG_TO_TOPIC: Record<string, TopicSlug> = {
  privacy: 'iphone-privacy', 'iphone-privacy': 'iphone-privacy', 'photo-privacy': 'iphone-privacy', 'app-permissions': 'iphone-privacy',
  'ai-photos': 'ai-media', 'ai-photo-apps': 'ai-media', 'ai-training': 'ai-media', c2pa: 'ai-media', synthid: 'ai-media',
  culture: 'internet-culture', 'gen-z-slang': 'internet-culture', 'vibe-check': 'internet-culture',
  inflation: 'economics', economics: 'economics', cpi: 'economics',
  'app-store': 'app-store', 'age-assurance': 'app-store',
  viberater: 'dudley-guides', 'vibe-rater': 'dudley-guides', 'table-talk': 'dudley-guides', econbyte: 'dudley-guides',
};

export const topicForLabel = (label: string): TopicSlug | undefined => TAG_TO_TOPIC[tagSlug(label)];

export function postsForTopic(posts: Post[], slug: TopicSlug): Post[] {
  return posts.filter((post) => postTags(post).some((label) => topicForLabel(label) === slug));
}

export function eligibleTopicHubs(posts: Post[], minimum = 3) {
  return Object.entries(TOPIC_HUBS)
    .map(([slug, meta]) => ({ slug: slug as TopicSlug, ...meta, posts: postsForTopic(posts, slug as TopicSlug) }))
    .filter((hub) => hub.posts.length >= minimum);
}
```

Expand mappings only for observed labels with a clear semantic fit. Unmapped labels intentionally remain text.

- [ ] **Step 3: Build only eligible hub routes**

`src/pages/blog/topics/[topic].astro` returns paths from `eligibleTopicHubs(await getPublishedPosts())`. Each page renders its unique definition, accurate count, article list, canonical, and visible `CollectionPage`/`ItemList` data. The topics index lists the same eligible array. Never add filler articles to reach the threshold.

- [ ] **Step 4: Convert current taxonomy navigation**

In articles and blog lists, render each unique mapped hub once as a link. Render remaining labels as `<span class="tag-label">`. Replace primary `/blog/tags/` navigation with `/blog/topics/`.

Keep legacy static tag paths, pass `robots="noindex,follow"` through `Base.astro`, remove their `CollectionPage` schema, and show a visible link to the mapped hub or `/blog/`. Do not generate new legacy routes for future freeform labels.

Extend `Base.astro` with this exact prop and output rule:

```ts
robots?: 'index,follow' | 'noindex,follow' | 'noindex,nofollow';
```

```astro
{robots && <meta name="robots" content={robots} />}
```

Migrate the existing `noindex` boolean callers to `robots="noindex,follow"`, then remove the boolean prop so each compatibility route states its intent explicitly.

- [ ] **Step 5: Verify and commit**

```bash
npm test
rg -n 'href=.*blog/tags' src --glob '*.astro'
git diff --check
git add astro.config.mjs scripts src/lib src/layouts/BlogPost.astro src/pages/blog
git commit -m "feat: consolidate blog taxonomy into durable topics"
```

Expected: tests pass; any remaining `blog/tags` reference is confined to the compatibility templates, not primary navigation.

## Task 5: Generate AEO and Structured Facts from Shared Content

**Files:**
- Modify: `src/content/config.ts`
- Modify: `src/layouts/BlogPost.astro`
- Modify: `src/layouts/AppLanding.astro`
- Modify: `src/pages/llms.txt.ts`
- Modify: `src/lib/campaignLinks.mjs`
- Modify: `scripts/campaign-links.test.mjs`
- Modify: `scripts/site-integrity.test.mjs`

**Interfaces:**
- Consumes: app facts, eligible topics, and stable entity IDs.
- Produces: `LLMS_APP_STORE_TOKENS`, visible answer summaries, named provenance, linked schema entities, and parity-checked `llms.txt`.

- [ ] **Step 1: Add failing parity and provenance tests**

```js
test('Last Human live facts agree across HTML and llms.txt', () => {
  const outputs = [
    readFileSync(resolve('dist/apps/last-human/index.html'), 'utf8'),
    readFileSync(resolve('dist/index.html'), 'utf8'),
    readFileSync(resolve('dist/llms.txt'), 'utf8'),
  ];
  for (const output of outputs) {
    assert.match(output, /Last Human/);
    assert.match(output, /6808782611|Live on the App Store/);
    assert.doesNotMatch(output, /Last Human[\s\S]{0,180}coming soon/i);
  }
});

test('article schema links a person, publisher, dates, and main entity', () => {
  const html = readFileSync(resolve('dist/blog/can-iphone-apps-see-your-contacts/index.html'), 'utf8');
  assert.match(html, /"@type":"BlogPosting"/);
  assert.match(html, /"author":\{"@type":"Person"/);
  assert.match(html, /"publisher":\{"@id":"https:\/\/dudleyapps\.com\/#organization"\}/);
  assert.match(html, /"dateModified":/);
  assert.match(html, /"mainEntityOfPage":/);
});
```

Also parse every structured-data body:

```js
test('every JSON-LD block parses', () => {
  for (const page of htmlPages()) {
    const blocks = [...page.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    blocks.forEach((match, index) => assert.doesNotThrow(() => JSON.parse(match[1]), `${page.rel} JSON-LD block ${index}`));
  }
});
```

Pin representative schema-to-page facts:

```js
const jsonLd = (html) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  .flatMap((match) => { const value = JSON.parse(match[1]); return Array.isArray(value) ? value : [value]; });

test('representative schema facts match visible pages', () => {
  const appHtml = readFileSync(resolve('dist/apps/last-human/index.html'), 'utf8');
  const app = jsonLd(appHtml).find((value) => value['@type'] === 'SoftwareApplication');
  assert.equal(app.name, 'Last Human: Dodge the Bots');
  assert.match(app.downloadUrl, /id6808782611/);
  assert.match(appHtml, new RegExp(app.name));
  assert.match(appHtml, /Live on the App Store/);

  const postHtml = readFileSync(resolve('dist/blog/can-iphone-apps-see-your-contacts/index.html'), 'utf8');
  const post = jsonLd(postHtml).find((value) => value['@type'] === 'BlogPosting');
  assert.match(postHtml, new RegExp(post.headline.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(postHtml, new RegExp(`datetime="${post.datePublished.slice(0, 10)}`));
  assert.match(postHtml, new RegExp(`datetime="${post.dateModified.slice(0, 10)}`));
});
```

Run after build. Expected: FAIL because app facts in `llms.txt` are handwritten and article author is an Organization.

- [ ] **Step 2: Add editorial provenance fields**

In the blog schema:

```ts
author: z.string().default('Nicholas Santulli'),
reviewedBy: z.string().optional(),
answerSummary: z.string().min(20).max(420).optional(),
```

Render `answerSummary ?? description` below the H1. Show written-by, published, updated when different, and reviewed-by when supplied. Do not override a post that explicitly names another author.

- [ ] **Step 3: Centralize `llms.txt` tokens**

Export a frozen `LLMS_APP_STORE_TOKENS` map from `src/lib/campaignLinks.mjs`, keyed by App Store ID and populated from each app's existing `.llms` token. If a set lacks that property, add a unique static token registered to `/llms.txt` and pin it in `scripts/campaign-links.test.mjs` before use.

- [ ] **Step 4: Generate `llms.txt` from collections**

Load and sort the app collection. Build each app bullet from `name`, `description`, `status`, `operatingSystem`, `accountSummary`, `offlineSummary`, and `pricingSummary`. Live apps get a correctly tagged store link; owned apps also get their canonical landing page. Unreleased apps get no store URL. Generate the topic section from `eligibleTopicHubs(posts)` and keep a bounded recent-answer list. Replace the generic studio introduction with concrete identity and catalog language.

- [ ] **Step 5: Link app and article schemas**

Use `author: { '@id': abs('/#organization') }`, `publisher: { '@id': abs('/#organization') }`, and `mainEntityOfPage: { '@id': abs(path) }` on apps. Use a visible `Person` author and `#organization` publisher on posts. Emit FAQ schema only when the same FAQ is visible.

- [ ] **Step 6: Verify and commit**

```bash
npm test
git diff --check
git add scripts src/content/config.ts src/layouts/AppLanding.astro src/layouts/BlogPost.astro src/pages/llms.txt.ts src/lib/campaignLinks.mjs
git commit -m "feat: generate answer-engine facts from site content"
```

## Task 6: Build the Shared App Poster Visual System

**Files:**
- Create: `src/components/SiteHeader.astro`
- Create: `src/components/SiteFooter.astro`
- Create: `src/components/AppStoreAction.astro`
- Create: `src/components/AppPosterBand.astro`
- Create: `src/components/AnswerCard.astro`
- Modify: `src/layouts/Base.astro`
- Modify: `public/assets/style.css`
- Modify: `scripts/site-integrity.test.mjs`

**Interfaces:**
- Consumes: app facts, tagged hrefs, current navigation, and contact constants.
- Produces: semantic shell and poster components with no client hydration.

- [ ] **Step 1: Inspect the selected design reference**

Use `product-design:image-to-code` and inspect:

```text
/Users/nicksantulli/.codex/generated_images/01a0c425-4c4b-7351-99e0-825dc654d409/exec-86e45b92-5939-4b11-8c0b-2633785e3dd0.png
```

Match hierarchy, contrast, rules, and product-band rhythm. Do not reproduce stale release text.

- [ ] **Step 2: Add failing shell tests**

```js
test('shared shell uses the SVG mark and avoids rejected copy', () => {
  const home = readFileSync(resolve('dist/index.html'), 'utf8');
  assert.match(home, /src="\/assets\/dudley-mark\.svg"/);
  assert.doesNotMatch(home, /Independent iOS studio|small apps with real character/i);
});

test('homepage ships no Astro hydration', () => {
  const home = readFileSync(resolve('dist/index.html'), 'utf8');
  assert.doesNotMatch(home, /astro-island|client:(?:load|idle|visible|media|only)/);
});
```

Run after build. Expected: FAIL on the PNG mark and old copy.

- [ ] **Step 3: Extract the shell without changing navigation behavior**

Move navigation, brand, accessible `<details>` menu, social links, and footer groups into the new shell components. Preserve skip navigation, keyboard behavior, Escape close, and non-JavaScript access. Use `/assets/dudley-mark.svg` at 30 × 30. Footer line:

```html
<p>Games, conversation starters, and useful things for iPhone.</p>
```

- [ ] **Step 4: Implement component contracts**

`AppStoreAction.astro` props: `{ appName: string; href: string; compact?: boolean }`. It renders nothing for an empty URL, otherwise one external link with `rel="noopener"` and an app-specific label.

`AppPosterBand.astro` props:

```ts
interface Props {
  slug: string; name: string; headline: string; description: string;
  icon: string; facts: string[];
  status: 'live' | 'coming_soon' | 'in_development';
  storeHref?: string; detailHref?: string; developedFor?: string;
  art?: string; reverse?: boolean;
}
```

It renders `<section data-app={slug}>`, text status, art/icon, facts, store action, and a detail link only when supplied. Never render a disabled fake button.

`AnswerCard.astro` props: `{ title: string; description: string; href: string; date: Date; topic?: string }`.

- [ ] **Step 5: Replace global tokens and generic primitives**

Start `style.css` with:

```css
:root {
  --ink: #0b0b0a; --paper: #f5f0e6; --paper-bright: #fffdf7;
  --muted: #5d574e; --rule: #0b0b0a; --focus: #1463ff;
  --radius: 4px; --wrap: 1180px; --measure: 70ch;
  --step--1: clamp(.875rem, .84rem + .15vw, .95rem);
  --step-0: clamp(1rem, .94rem + .25vw, 1.125rem);
  --step-1: clamp(1.25rem, 1.08rem + .7vw, 1.75rem);
  --step-2: clamp(1.75rem, 1.35rem + 1.6vw, 3rem);
  --step-3: clamp(2.5rem, 1.65rem + 3.4vw, 5.5rem);
}
```

Add black chrome, thick rules, solid product fields, 44 px controls, focus rings, and reduced-motion rules. Delete or stop using pill, gradient, emoji-feature, glass, and shadow-card styles.

- [ ] **Step 6: Build, inspect, and commit**

```bash
npm run build
npm run dev -- --host 127.0.0.1 --port 4321
```

Inspect `/about/` at 390 and 1440 px, then stop the server.

```bash
npm test
git diff --check
git add public/assets/style.css scripts/site-integrity.test.mjs src/components src/layouts/Base.astro
git commit -m "feat: add Dudley app poster design system"
```

## Task 7: Rebuild the Homepage Around Live Products

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/lib/campaignLinks.mjs`
- Modify: `scripts/built-output.test.mjs`
- Modify: `scripts/site-integrity.test.mjs`
- Modify: `public/assets/style.css`

**Interfaces:**
- Consumes: poster/answer components, app facts, and homepage campaign tokens.
- Produces: approved homepage hierarchy with Last Human first and separate upcoming/client sections.

- [ ] **Step 1: Change homepage expectations before markup**

Replace the current first-card test:

```js
test('Last Human is the first live Dudley product', () => {
  const home = pages.find((p) => p.rel === '/index.html')?.html ?? '';
  const lastHuman = home.indexOf('data-app="last-human"');
  const tableTalk = home.indexOf('data-app="table-talk"');
  assert.ok(lastHuman >= 0 && tableTalk > lastHuman);
});
```

Add:

```js
test('homepage uses the approved product-first message', () => {
  const home = readFileSync(resolve('dist/index.html'), 'utf8');
  assert.match(home, /Pick an app\. See what happens\./);
  assert.match(home, /Games, conversation starters, and useful things for iPhone\./);
  assert.doesNotMatch(home, /Why Dudley|Polish is the point|feature-icon|class="grad"/);
});
```

Run after build. Expected: FAIL.

- [ ] **Step 2: Partition and order app data**

```ts
const order = ['last-human', 'table-talk', 'vibe-rater', 'econbyte', 'monetary-policy-independence-day'];
const rank = new Map(order.map((slug, index) => [slug, index]));
const ownedLive = allApps.filter((a) => !a.data.developedFor && a.data.status === 'live')
  .sort((a, b) => (rank.get(a.slug) ?? 99) - (rank.get(b.slug) ?? 99));
const upcoming = allApps.filter((a) => !a.data.developedFor && a.data.status !== 'live');
const clientApps = allApps.filter((a) => a.data.developedFor);
```

Keep the unique homepage token mapping and throw at build time if a live app lacks one.

- [ ] **Step 3: Replace homepage structure**

```astro
<section class="home-intro">
  <div class="wrap home-intro-inner">
    <h1>Pick an app. See what happens.</h1>
    <p>Games, conversation starters, and useful things for iPhone.</p>
  </div>
</section>
```

Follow with `AppPosterBand` for owned live apps, three to five curated `AnswerCard` links, “Next from Dudley,” “Built for others,” and a compact support/contact band. Use real Last Human assets and never the mock's stale status.

- [ ] **Step 4: Pin the client-work edge case**

```js
test('client work has attribution and a tagged store action without a broken detail link', () => {
  const home = readFileSync(resolve('dist/index.html'), 'utf8');
  const band = home.match(/<section[^>]+data-app="dude-wheres-this-house"[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.match(band, /Built for HomeLight|Created for HomeLight/);
  assert.match(band, /id6779785617\?pt=128970277&amp;ct=/);
  assert.doesNotMatch(band, /href="\/apps\/dude-wheres-this-house\//);
});
```

- [ ] **Step 5: Visual QA and commit**

Inspect `/` at 320, 390, 430, 844, and 1440 px. Confirm Last Human leads, art crops intentionally, and no name/action overflows.

```bash
npm test
git diff --check
git add public/assets/style.css scripts src/lib/campaignLinks.mjs src/pages/index.astro
git commit -m "feat: launch product-first App Poster Wall homepage"
```

## Task 8: Migrate App and Editorial Route Families

**Files:**
- Modify: `src/layouts/AppLanding.astro`
- Modify: `src/layouts/BlogPost.astro`
- Modify: `src/pages/blog/index.astro`
- Modify: `src/pages/blog/[page].astro`
- Modify: `src/pages/blog/topics/index.astro`
- Modify: `src/pages/blog/topics/[topic].astro`
- Modify: `public/assets/style.css`
- Modify: `scripts/site-integrity.test.mjs`

**Interfaces:**
- Consumes: shared shell/components, topic registry, app facts, and schema IDs.
- Produces: product-detail and editorial pages matching the homepage without weakening search intent.

- [ ] **Step 1: Add representative route tests**

```js
test('app pages expose pricing, account, offline, and privacy facts', () => {
  const html = readFileSync(resolve('dist/apps/last-human/index.html'), 'utf8');
  for (const label of ['Pricing', 'Account', 'Offline', 'Privacy']) {
    assert.match(html, new RegExp(`>${label}<`));
  }
  assert.match(html, /Live on the App Store/);
});

test('answer articles lead with a summary and provenance', () => {
  const html = readFileSync(resolve('dist/blog/can-iphone-apps-see-your-contacts/index.html'), 'utf8');
  assert.match(html, /class="answer-summary"/);
  assert.match(html, /Written by Nicholas Santulli/);
  assert.match(html, /<time/);
});
```

Run after build. Expected: FAIL on fact labels and answer summary.

- [ ] **Step 2: Recompose app pages**

Use a product-color hero with icon, `posterHeadline`, status, and `AppStoreAction`. Immediately below, render:

```astro
<dl class="app-facts">
  <div><dt>Pricing</dt><dd>{app.pricingSummary}</dd></div>
  <div><dt>Account</dt><dd>{app.accountSummary}</dd></div>
  <div><dt>Offline</dt><dd>{app.offlineSummary}</dd></div>
  <div><dt>Privacy</dt><dd>{app.privacySummary}</dd></div>
</dl>
```

Keep MDX body, visible FAQ, privacy/support links, related content, Smart App Banner, and tagged CTA. Remove duplicate card/status styling.

- [ ] **Step 3: Recompose editorial pages**

The blog index gets a concise title, eligible topic directory, featured answer, and recent-answer list. Use `AnswerCard` for repeated items. Articles retain a 68–72 character measure, summary after H1, visible provenance/freshness, one hub link, body hierarchy, disclosure near Dudley app promotion, and current related links.

- [ ] **Step 4: Inspect representative routes**

At 320 and 1440 px inspect:

```text
/apps/last-human/
/apps/vibe-rater/
/blog/
/blog/can-iphone-apps-see-your-contacts/
/blog/topics/iphone-privacy/
```

Verify heading order, fact readability, links, art crop, article measure, dates, topic links, and focus.

- [ ] **Step 5: Verify and commit**

```bash
npm test
git diff --check
git add public/assets/style.css scripts/site-integrity.test.mjs src/layouts/AppLanding.astro src/layouts/BlogPost.astro src/pages/blog
git commit -m "feat: apply poster and answer layouts to core routes"
```

## Task 9: Migrate Utility Routes and Complete Responsive Accessibility

**Files:**
- Modify: `src/pages/about.astro`
- Modify: `src/pages/contact.astro`
- Modify: `src/pages/support/index.astro`
- Modify: `src/pages/support/[slug].astro`
- Modify: `src/pages/privacy/index.astro`
- Modify: `src/pages/privacy/*.astro`
- Modify: `src/layouts/Comparison.astro`
- Modify: `src/layouts/Tool.astro`
- Modify: `src/layouts/Archetype.astro`
- Modify: `src/pages/404.astro`
- Modify: `src/components/ContactForm.astro`
- Modify: `src/components/FAQ.astro`
- Modify: `public/assets/style.css`
- Modify: `scripts/site-integrity.test.mjs`

**Interfaces:**
- Consumes: shared shell, tokens, article measure, and control/focus styles.
- Produces: consistent secondary routes with unchanged legal, support, form, quiz, and comparison behavior.

- [ ] **Step 1: Add semantic and copy tests**

```js
test('discovery pages contain no rejected studio copy', () => {
  const discovery = htmlPages().filter((page) => !page.rel.startsWith('/privacy/'));
  for (const page of discovery) {
    assert.doesNotMatch(page.html, /Independent iOS studio|small apps with real character/i, page.rel);
  }
});

test('every HTML page has one h1 and a skip-link target', () => {
  for (const page of htmlPages()) {
    assert.equal([...page.html.matchAll(/<h1\b/g)].length, 1, `${page.rel} h1 count`);
    assert.match(page.html, /href="#main"/);
    assert.match(page.html, /id="main"/);
  }
});
```

Run after build. Expected: FAIL on remaining old copy or route semantics revealed by the suite.

- [ ] **Step 2: Apply shared hierarchy without changing purpose**

Use plain page headers, thick rules, consistent reading measure, and square controls. Support/privacy pages prioritize task completion and legal text. Contact keeps its endpoint, field names, and hidden values. Comparison/tool/archetype pages retain structured data and interactions. The 404 links to the app catalog, support, and blog.

About identifies Dudley Development, LLC and Nicholas Santulli directly, then explains products and per-app differences with canonical links.

- [ ] **Step 3: Run the mobile/accessibility matrix**

At 320, 390, 430, 844, and 1440 px inspect homepage, Last Human, one article, one hub, About, Contact, Support, one privacy page, and 404. Repeat the 320 px set at 200% zoom or equivalent larger text.

Verify every route against this exact list:

```text
no horizontal overflow
44 x 44 minimum interactive targets
visible keyboard focus and logical Tab order
mobile menu opens by keyboard and closes with Escape
status remains understandable without color
decorative images have empty alt text
meaningful images have concise alt text
reduced motion removes nonessential movement
forms retain visible labels and errors
dark preference does not make native controls unreadable
```

- [ ] **Step 4: Fix observations at the owning component and rerun**

Do not use route-specific negative margins or viewport hacks. Recheck the exact failing route/width after each fix, then rerun the whole matrix once.

- [ ] **Step 5: Verify and commit**

```bash
npm test
git diff --check
git add public/assets/style.css scripts/site-integrity.test.mjs src/components src/layouts src/pages
git commit -m "feat: complete responsive Dudley route redesign"
```

## Task 10: Optimize Assets and Enforce Performance Budgets

**Files:**
- Modify: image references across `src/**/*.astro`
- Create: optimized derivatives in `public/assets/`
- Create: `scripts/optimize-assets.mjs`
- Modify: `package.json`
- Modify: `scripts/site-integrity.test.mjs`
- Modify: `scripts/gen-image-sitemap.mjs` only if derivative discovery fails

**Interfaces:**
- Consumes: final rendered dimensions and existing source art.
- Produces: bounded asset sizes, intrinsic dimensions, no image-driven layout shift, and a production build within budgets.

- [ ] **Step 1: Add failing asset-budget tests**

```js
import { statSync } from 'node:fs';

test('shared and rendered assets stay within budgets', () => {
  assert.ok(statSync(resolve('public/assets/dudley-mark.svg')).size < 5_000);
  assert.ok(statSync(resolve('public/assets/style.css')).size <= 45_000);
  for (const name of ['last-human-icon', 'table-talk-icon', 'vibe-rater-icon', 'econbyte-icon', 'powell-prowl-icon', 'dude-wheres-this-house-icon']) {
    const files = ['avif', 'webp', 'png'].map((ext) => resolve(`public/assets/${name}.${ext}`)).filter(existsSync);
    assert.ok(files.some((file) => statSync(file).size <= 100_000), `${name} lacks a <=100 KB source`);
  }
});
```

Run the suite. Expected: FAIL for oversized PNG-only icons.

- [ ] **Step 2: Generate non-destructive derivatives**

Pin the already-transitive encoder as a direct development dependency:

```bash
npm install --save-dev sharp@^0.34.5
```

Create `scripts/optimize-assets.mjs`:

```js
import sharp from 'sharp';
import { resolve } from 'node:path';

const names = ['last-human', 'table-talk', 'vibe-rater', 'econbyte', 'powell-prowl', 'dude-wheres-this-house'];
for (const name of names) {
  await sharp(resolve(`public/assets/${name}-icon.png`))
    .resize({ width: 256, height: 256, fit: 'cover', withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(resolve(`public/assets/${name}-icon.webp`));
}
```

Run `node scripts/optimize-assets.mjs`. Preserve source PNGs. Use `<picture>` with WebP and PNG fallback, explicit width/height, `decoding="async"`, and lazy loading except the first above-the-fold Last Human visual.

- [ ] **Step 3: Remove oversized defaults from delivered pages**

Use `dudley-mark.svg` in chrome and compressed `og-home` imagery for social defaults. Confirm no HTML references `dudley-lockup.png`. Leave the unreferenced source file in place rather than deleting source art.

Add a built test that every homepage app band includes a `.webp` `<source>` and that `dudley-lockup.png` is absent from HTML. This pins delivered usage rather than merely proving a small file exists.

- [ ] **Step 4: Measure production output**

```bash
npm run build
find dist/assets -maxdepth 1 -type f -exec stat -f '%z %N' {} \; | sort -nr | head -30
wc -c public/assets/style.css
```

Start `npm run preview -- --host 127.0.0.1 --port 4322`, then run Lighthouse 12 for `/`, `/apps/last-human/`, `/blog/`, `/blog/can-iphone-apps-see-your-contacts/`, `/blog/topics/iphone-privacy/`, and `/support/`:

```bash
for route in home apps-last-human blog blog-contacts blog-topic-iphone-privacy support; do
  case "$route" in
    home) url="/" ;;
    apps-last-human) url="/apps/last-human/" ;;
    blog) url="/blog/" ;;
    blog-contacts) url="/blog/can-iphone-apps-see-your-contacts/" ;;
    blog-topic-iphone-privacy) url="/blog/topics/iphone-privacy/" ;;
    support) url="/support/" ;;
  esac
  npx --yes lighthouse@12 "http://127.0.0.1:4322${url}" --chrome-flags="--headless" --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=".lighthouse-${route}.json"
done
```

Required mobile targets: Performance 90+, Accessibility 95+, Best Practices 95+, SEO 95+. Remove `.lighthouse-home.json`, `.lighthouse-apps-last-human.json`, `.lighthouse-blog.json`, `.lighthouse-blog-contacts.json`, `.lighthouse-blog-topic-iphone-privacy.json`, and `.lighthouse-support.json` after recording scores; do not commit them.

- [ ] **Step 5: Verify and commit**

```bash
npm test
git diff --check
git add public/assets scripts/site-integrity.test.mjs scripts/gen-image-sitemap.mjs src
git commit -m "perf: optimize Dudley site assets and loading"
```

## Task 11: Whole-Branch Review and Live Deployment

**Files:**
- Modify only files required by verified failures.
- Verify: source, `dist/`, `origin/main`, `origin/gh-pages`, and live URLs.

**Interfaces:**
- Consumes: completed Tasks 1–10.
- Produces: reviewed source commit, deployed Pages commit, and live evidence.

- [ ] **Step 1: Run clean verification**

```bash
git status --short
npm test
git diff --check
npm audit --omit=dev
```

Expected: clean tree before testing, all tests pass, no diff errors, no unexpected route/content warnings, and no unreviewed high/critical production dependency finding. Fix compatible production findings or document the exact package, advisory, exposure, and accepted reason before release; do not use `npm audit fix --force`.

- [ ] **Step 2: Record output counts**

```bash
python3 - <<'PY'
from pathlib import Path
import re
dist = Path('dist')
pages = list(dist.rglob('*.html'))
sitemap = (dist / 'sitemap-0.xml').read_text()
print('html_pages', len(pages))
print('sitemap_urls', sitemap.count('<url>'))
print('legacy_tag_urls_in_sitemap', len(re.findall(r'/blog/tags/', sitemap)))
print('topic_urls_in_sitemap', len(re.findall(r'/blog/topics/', sitemap)))
indexable = [p for p in pages if 'name="robots" content="noindex' not in p.read_text()]
word_counts = [len(re.sub(r'<[^>]+>', ' ', p.read_text()).split()) for p in indexable]
print('indexable_under_120_words', sum(count < 120 for count in word_counts))
print('indexable_under_180_words', sum(count < 180 for count in word_counts))
PY
```

Expected: zero legacy tags in sitemap, fewer indexable taxonomy URLs than the 91-tag baseline, and at least one hub if the corpus meets the threshold.

- [ ] **Step 3: Run final visual/product review**

Use `product-design:audit` and `build-web-apps:frontend-testing-debugging`. Review the route matrix at 320, 390, 430, 844, and 1440 px. Capture homepage and Last Human at 390 and 1440 for comparison to the approved direction. Verify keyboard, zoom, reduced motion, links, and real store destinations.

- [ ] **Step 4: Request whole-branch code review**

Use `superpowers:requesting-code-review` against `origin/main`. Resolve every correctness, regression, accessibility, SEO, or deployment finding. Run the focused test after each correction and `npm test` after review is clean.

- [ ] **Step 5: Commit review corrections if present**

```bash
git add -A
git commit -m "fix: address Dudley revamp review findings"
npm test
git status --short --branch
git log --oneline origin/main..HEAD
```

If review creates no changes, skip only the commit; still run the verification commands.

- [ ] **Step 6: Publish source without touching the dirty checkout**

```bash
git fetch origin
git log --oneline --decorate -5 origin/main
git merge-base --is-ancestor origin/main HEAD
git push -u origin codex/dudley-site-revamp-20260921
```

If `origin/main` advanced, integrate it in this isolated worktree and rerun `npm test`. After review passes, publish with the non-forcing fast-forward command `git push origin HEAD:main`. If branch protection rejects direct publication, create `gh pr create --base main --head codex/dudley-site-revamp-20260921 --title "Revamp Dudley site SEO and product experience" --body-file docs/superpowers/specs/2026-09-21-dudley-site-revamp-seo-aeo-design.md`, merge it through the protected path, attach the pull request to the task, then run `git fetch origin && git merge --ff-only origin/main && npm test` before deployment. Never switch, reset, or clean `/Users/nicksantulli/Documents/GitHub/dudley-web`.

- [ ] **Step 7: Deploy the reviewed source**

```bash
predeploy_pages="$(git rev-parse origin/gh-pages)"
npm run deploy
git fetch origin
git rev-parse HEAD
git rev-parse origin/main
git rev-parse origin/gh-pages
```

Record all three IDs. Confirm `public/CNAME` remains `dudleyapps.com` and deployment reports success.

- [ ] **Step 8: Verify cache-busted live resources**

Set `source_sha="$(git rev-parse --short=12 origin/main)"`, then inspect response HTML/text at:

```bash
curl -fsSL "https://dudleyapps.com/?rev=${source_sha}"
curl -fsSL "https://dudleyapps.com/apps/last-human/?rev=${source_sha}"
curl -fsSL "https://dudleyapps.com/blog/?rev=${source_sha}"
curl -fsSL "https://dudleyapps.com/llms.txt?rev=${source_sha}"
curl -fsSL "https://dudleyapps.com/robots.txt?rev=${source_sha}"
curl -fsSL "https://dudleyapps.com/sitemap-0.xml?rev=${source_sha}"
```

Verify homepage headline, Last Human order/status/store URL, canonicals, Organization/WebSite IDs, hub eligibility, tag exclusion, `OAI-SearchBot`, and `llms.txt` parity. Treat a stale uncached page as a cache condition, not proof of deploy failure.

If live verification finds a release-blocking regression, record `failed_pages="$(git rev-parse origin/gh-pages)"` and restore only the deployment branch with `git push --force-with-lease=refs/heads/gh-pages:${failed_pages} origin ${predeploy_pages}:refs/heads/gh-pages`. Verify the restored live output. Revert source with a normal revert commit; never rewrite `main`.

- [ ] **Step 9: Perform authenticated indexing actions only if access exists**

If Search Console is already accessible, inspect coverage and request indexing for the homepage, Last Human page, and eligible hubs. If IndexNow credentials and script are available, run it and record its response separately. Never report submission as indexing or ranking.

- [ ] **Step 10: Produce the release handoff**

Report source branch/final commit, `origin/main`, `origin/gh-pages`, test totals, Lighthouse results, visual routes/widths, verified live URLs, sitemap/topic counts, and any explicitly deferred item with reason and owner.

Use `superpowers:verification-before-completion` before stating the site is live and complete.
