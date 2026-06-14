# Publishing to the Dudley Blog

The blog is an [Astro content collection](https://docs.astro.build/en/guides/content-collections/).
**Adding a post = drop one markdown file in `src/content/blog/` and push.** No layout,
no HTML, no component edits. The build generates the post page, the blog index, the tag
pages, the RSS feed, the sitemap entry, and the `llms.txt` listing for you.

Live blog: **https://nicksantulli.github.io/dudley-web/blog/**

---

## Add a post (Content Writer flow)

1. Create `src/content/blog/your-slug.md`. The filename (minus `.md`) becomes the URL:
   `your-slug` → `/blog/your-slug/`.
2. Add frontmatter (see the template below), then write the body in plain markdown.
3. Commit and push. The site rebuilds and deploys — the post is live.

That's it. Drop file → push → live.

### Frontmatter template

```markdown
---
title: "Your Headline Here"
description: "One or two sentences. Used for the meta description, OG/Twitter cards, the blog-index card, and the RSS + llms.txt entry. ~150–160 chars is ideal for search."
publishDate: 2026-06-20
category: "culture"            # becomes a tag/section: culture | roundup | outfit-explainer | archetype-deep-dive | ...
primaryKeyword: "the search phrase this post targets"   # optional
relatedApps:                    # optional — drives the in-post app CTA + related links
  - "vibe-rater"                #   vibe-rater | powell-prowl
relatedArchetypes:              # optional — links to /archetypes/<slug>/ if that page exists
  - "quiet-luxury"
tags:                           # optional — extra tags beyond the category
  - "trend-report"
faq:                            # optional but recommended for AEO — renders an FAQ + FAQPage schema
  - q: "A question a reader (or ChatGPT) would ask"
    a: "A direct, self-contained answer."
draft: false                    # set true to keep it out of the build entirely
---

Write the post in markdown. `## Headings`, **bold**, _italic_, lists, > blockquotes,
[links](https://example.com), and `---` horizontal rules all render with blog styling.
```

### Field reference

| Field | Required | Notes |
|-------|----------|-------|
| `title` | ✅ | Post headline. |
| `description` | ✅ | Meta description + OG + card + RSS + llms.txt summary. |
| `publishDate` | ✅ | `YYYY-MM-DD`. Posts sort newest-first by this date. |
| `category` | ✅ | Primary tag/section. Lowercase-kebab; rendered as a tag page at `/blog/tags/<category>/`. |
| `primaryKeyword` | — | SEO/AEO target phrase; emitted into Article schema. |
| `relatedApps` | — | `vibe-rater` and/or `powell-prowl`. First one drives the download CTA. |
| `relatedArchetypes` | — | Archetype slugs; only ones with an existing page get linked. |
| `tags` | — | Extra tags beyond `category`. Each becomes a tag page. |
| `faq` | — | `q`/`a` pairs. Renders the visible FAQ **and** the `FAQPage` JSON-LD. |
| `author` | — | Defaults to `Dudley Development`. |
| `ogImage` | — | Site-relative or absolute image URL. Defaults to the Dudley mark. |
| `featured` | — | Reserved flag (boolean). |
| `draft` | — | `true` removes the post from every output (page, index, RSS, sitemap, llms.txt). |

### What you get for free, per post

- Post page at `/blog/<slug>/` with the shared header/footer/nav.
- SEO: title, meta description, canonical, Open Graph + Twitter card.
- AEO: `BlogPosting` + `BreadcrumbList` + (if `faq`) `FAQPage` JSON-LD.
- Auto-listing on the blog index, every matching tag page, the RSS feed
  (`/blog/rss.xml`), the sitemap, and `llms.txt`.
- An app download CTA + "Keep reading" related links.

---

## How it deploys

GitHub Pages serves this repo from the **`gh-pages`** branch root. There are two ways
to publish a build to it:

### Option A — manual (works today, no extra setup)

```bash
npm run deploy
```

This builds the site and pushes `dist/` to `gh-pages`. It uses a temporary git worktree
and needs no special token scopes. Anyone with push access can run it after merging post(s).

### Option B — automatic on push (GitHub Actions) — recommended, **Owner-gated to install**

A ready-to-use workflow lives at [`docs/github-actions-deploy.yml`](docs/github-actions-deploy.yml).
Once installed it makes publishing fully hands-off: merge a post to `main` → the site
rebuilds and deploys to `gh-pages` automatically.

**To activate it (one-time, requires repo admin / a `workflow`-scoped token):**

1. Move the file to `.github/workflows/deploy.yml`.
2. Commit + push with a token that has the `workflow` scope (the automation box's token
   intentionally does **not** have this scope, so it can't install workflows itself).
3. Settings → Pages → Source stays **`gh-pages` / (root)**. No `pages` scope needed —
   the in-Actions `GITHUB_TOKEN` has the permissions to push `gh-pages`.

After that, the Content Writer's flow is exactly "drop a markdown file + push" with no
manual deploy step.
