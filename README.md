# Dudley Development — website

The marketing + legal + programmatic-SEO/AEO site for
[Dudley Development](https://github.com/nicksantulli), a small independent iOS studio.

**Live:** https://nicksantulli.github.io/dudley-web/

## Stack

[Astro](https://astro.build) (v5) → 100% static HTML output. Content lives in
**content collections** (Markdown/MDX + typed frontmatter), and dynamic routes
template one page per entry — so adding pages is a data edit, not hand-written HTML.

- No client JS shipped by default (clean, crawlable semantic HTML — an AEO win)
- `@astrojs/sitemap` auto-generates `sitemap-index.xml`
- schema.org JSON-LD on every page (Organization + page-type schema)

## Structure

```
src/
├── consts.ts              # site URL, base path, App Store IDs — single source of truth
├── content/
│   ├── config.ts          # collection schemas (apps, archetypes, comparisons, tools, blog)
│   ├── apps/*.mdx         # one file per app  → /apps/<slug>/
│   ├── archetypes/*.mdx   # one file per Vibe Rater archetype → /archetypes/<slug>/
│   ├── comparisons/*.mdx  # one file per comparison → /compare/<slug>/
│   ├── tools/*.mdx        # one file per tool/quiz → /tools/<slug>/
│   └── blog/*.md          # one file per blog post → /blog/<slug>/  (see PUBLISHING.md)
├── lib/blog.ts            # blog helpers (published posts, tags, date fmt)
├── layouts/               # Base + per-page-type layouts (build the JSON-LD)
├── components/            # FAQ, InternalLinks, AppCTA, VibeQuiz
└── pages/                 # static pages + [slug] routes + blog/ (index, [slug], tags, rss.xml) + llms.txt.ts
public/                    # served as-is: app-ads.txt, robots.txt, assets/, .nojekyll
                           #   + legacy .html redirect stubs (preserve old App Store URLs)
```

`llms.txt` is now generated (`src/pages/llms.txt.ts`) so new blog posts are listed for
answer engines automatically.

## Adding content (the programmatic part)

- **New app** → add `src/content/apps/<slug>.mdx`. The landing page, schema, and FAQ generate automatically. Add the App Store ID in `src/consts.ts` when live.
- **New archetype** → add `src/content/archetypes/<slug>.mdx`. (Remaining to write: drip, serve, gorpcore-prophet, npc-affectionate — see `vault/growth/seo-aeo/`.)
- **New comparison / tool** → add a file in the matching collection.
- **New blog post** → drop `src/content/blog/<slug>.md` and push. Index, tag pages, RSS,
  sitemap, and `llms.txt` update automatically. Full guide: [`PUBLISHING.md`](PUBLISHING.md).

Content templates + the keyword/AEO plan live in the Dudley vault at
`vault/growth/seo-aeo/`.

> ⚠️ Comparison pages must list **real** apps and be honest — no fabricated
> competitors (penalized by Google, distrusted by AI engines).

## Local dev

```bash
npm install
npm run dev        # http://localhost:4321/dudley-web/
npm run build      # outputs to dist/
npm run preview    # serve the built dist/
```

## Deploy (free, zero Owner action)

GitHub Pages serves **legacy-style from the `gh-pages` branch root**
(Settings → Pages → Source: `gh-pages` `/`). Deploy by building and pushing
`dist/` to that branch — **no GitHub Actions workflow and no `pages`/`workflow`
token scope needed**:

```bash
npm run deploy     # builds, then publishes dist/ to gh-pages via a temp worktree
```

Live within ~1 minute at https://nicksantulli.github.io/dudley-web/.

**Optional auto-deploy:** a ready GitHub Actions workflow at `docs/github-actions-deploy.yml`
makes pushes to `main` build + deploy automatically (so the Content Writer never runs a
manual step). Installing it needs a `workflow`-scoped token — see [`PUBLISHING.md`](PUBLISHING.md).

### Custom domain (later)

When the Owner registers a domain, it's a one-place change:
set `ORIGIN_HOST`/`BASE` in `src/consts.ts` and `site`/`base` in `astro.config.mjs`
(to the root domain + `/`), add a `CNAME` file in `public/`, and redeploy. The
optional GitHub Actions workflow / Cloudflare Pages migration can follow then.

### app-ads.txt

`app-ads.txt` is served at `/dudley-web/app-ads.txt` now and at the domain root
once a custom domain is live. It must be reachable at the root of the domain set as
each app's marketing URL in App Store Connect for the AdMob crawler to find it.

© Dudley Development.
