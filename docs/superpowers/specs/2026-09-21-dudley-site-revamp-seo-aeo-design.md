# Dudley Website Revamp, SEO, and AEO Design

**Date:** 2026-09-21  
**Status:** Approved design direction; implementation pending plan approval  
**Repository:** `dudley-web`  
**Target:** `https://dudleyapps.com/`

## 1. Decision summary

Dudley Development will move from a generic beige card-based studio site to a product-first **App Poster Wall**. The homepage will open with the blunt headline **“Pick an app. See what happens.”** and use full-width product bands built from each app's real artwork, palette, and premise. Last Human will lead because it is the newest live release.

The redesign will also reduce crawl bloat, standardize URLs and metadata, strengthen app and article entities, and make every answer surface derive from the same facts. The work remains a static Astro site and should require no client-side JavaScript on the homepage beyond the existing progressively enhanced mobile navigation.

The release will be developed in an isolated worktree based on current `origin/main`, then published to the source branch and `gh-pages` with cache-busted live verification. The user's dirty local `main` checkout will not be modified.

## 2. Why this change

### 2.1 Product and design findings

The current site is technically usable but communicates a template more strongly than a point of view. Specific signals to remove include:

- the “Independent iOS studio” eyebrow;
- vague positioning such as “small apps with real character”;
- generic feature-card grids, rounded pills, emoji-led value props, gradients, soft shadows, and repeated beige surfaces;
- repeated app cards that give every product the same visual weight;
- copy that describes the studio before showing what people can download or do.

The current mobile experience has sound fundamentals—semantic structure, usable touch targets, and no observed horizontal overflow—but it inherits the same generic hierarchy and long-form repetition as desktop.

### 2.2 Search and answer-engine baseline

The 2026-09-21 live crawl found:

- 157 URLs in the page sitemap;
- 91 tag pages;
- 79 tag pages with fewer than 180 words;
- 73 pages with fewer than 120 words;
- no HTTP status failures in the sampled crawl;
- a meta-refresh `/apps/powell-prowl/` compatibility page with no useful title, description, or standalone canonical signal;
- `/about/` canonicalizing to `/about` while the server redirects the other way;
- `/terms/vibe-rater/` canonicalizing to the slashless form;
- duplicate or competing tag routes for `vibe-rater` and `viberater`;
- live homepage content that says EconByte is available while `llms.txt` says it is launching soon.

The current source build also has one pre-existing failing check: the EconByte inflation article contains an untagged first-party App Store link. This must be corrected as part of implementation before release.

### 2.3 Performance baseline

The current shared media is oversized for its rendered use:

- `dudley-lockup.png`: approximately 2.3 MB;
- `dudley-mark.png`: approximately 607 KB despite rendering at 30 × 30 pixels;
- several app icons: up to approximately 703 KB;
- shared `style.css`: approximately 34.9 KB uncompressed.

An existing `dudley-mark.svg` is approximately 476 bytes and should replace the raster mark in the shared chrome where visual parity is confirmed.

## 3. Goals and non-goals

### Goals

1. Make the products, especially Last Human, the first and strongest impression.
2. Establish a recognizable visual system that uses real product identity rather than generic startup styling.
3. Make the site excellent from 320 px mobile widths through wide desktop layouts.
4. Improve organic search quality by consolidating thin taxonomy pages and removing canonical inconsistencies.
5. Improve answer-engine retrieval through direct answers, consistent entity facts, named ownership, dated review signals, and crawlable text.
6. Prevent status drift between homepage, app pages, structured data, `llms.txt`, support pages, and App Store calls to action.
7. Preserve attribution campaign tokens and all verified App Store IDs.
8. Keep the site static, fast, accessible, and easy to maintain.
9. Publish safely without overwriting unrelated local work.

### Non-goals

- Rebuilding the site as a client-rendered application.
- Adding a CMS, database, user accounts, animation framework, or analytics vendor.
- Inventing testimonials, download counts, ratings, awards, or product claims.
- Generating large amounts of filler copy to hit arbitrary word counts.
- Adding speculative schema types solely to influence answer engines.
- Redesigning the apps themselves.
- Removing legal, privacy, support, or historic compatibility routes that still serve users or App Review.

## 4. Selected visual direction: App Poster Wall

### 4.1 Homepage opening

The masthead is bold black with a compact Dudley wordmark, clear navigation, and a high-contrast mobile menu. Directly beneath it:

- **H1:** “Pick an app. See what happens.”
- **Supporting line:** “Games, conversation starters, and useful things for iPhone.”
- No eyebrow, studio-category badge, self-congratulatory value statement, or gradient text.

The page immediately transitions into product bands. Last Human is first and is explicitly labeled **Live on the App Store**, never “coming soon.”

### 4.2 Product bands

Each Dudley-owned app receives a full-width band with:

- the app name and a concrete one-sentence premise;
- its icon or a lightweight crop of existing product art;
- a plain status label;
- one primary App Store action for live apps;
- one secondary “See how it works” or “Learn more” action when a landing page exists;
- two or three verifiable product facts, not generic benefits;
- a slug-specific palette derived from the real product identity.

The bands use a reusable `AppPosterBand.astro` component. They may alternate text/media alignment on larger screens, but mobile always uses a predictable single-column reading order: name, premise, art, facts, actions.

Coming-soon apps do not compete with live products. They appear in a smaller **Next from Dudley** section after the live catalog. Client work appears in a quiet, separate **Built for others** section with clear partner attribution.

### 4.3 Visual language

- Heavy, legible sans-serif display type paired with a neutral text face or a disciplined single-family system.
- Thick black rules and strong solid color fields.
- Square corners or a very small radius; no pill-shaped containers except a platform-native App Store badge if used.
- No gradients, glass effects, floating cards, ornamental blobs, generic sparkles, emoji feature icons, or shadow stacks.
- Subtle print texture is allowed only if it is CSS-generated or a tiny optimized repeat asset and never harms text contrast.
- Product imagery must come from existing app art or specifically approved assets. The selected concept image is directional only; its stale “coming soon” Last Human wording must not ship.
- Motion is optional and limited to brief opacity/translation feedback. The experience must be fully understandable with motion disabled.

### 4.4 Copy voice

Copy should be specific, compact, and human:

- lead with what the product does;
- prefer concrete nouns, numbers, and constraints already supported by product data;
- avoid phrases such as “crafted with care,” “real character,” “innovative,” “seamless,” and “privacy-first” unless the following sentence proves the claim;
- state privacy behavior directly, for example “No account. Works offline.”;
- state business model details directly, without implying every app has identical ads, purchases, or data behavior.

## 5. Information architecture

### 5.1 Homepage

Order:

1. compact masthead;
2. headline and supporting line;
3. live Dudley app poster bands, with Last Human first;
4. a compact **Useful answers** module with three to five editorially selected articles;
5. **Next from Dudley** for unreleased products;
6. **Built for others** for client work;
7. concise contact/support band;
8. footer.

The current generic **Why Dudley** feature grid is removed. About-studio content remains available through the About page and footer rather than delaying product discovery.

### 5.2 App detail pages

App pages retain their dedicated URL and structured data but adopt the poster system:

- direct product H1 and one-line answer;
- live/coming-soon status adjacent to the primary action;
- concrete product facts and screenshots/art;
- plain-language privacy and pricing summary with links to full policy/support;
- useful FAQ only when the answers are app-specific and visible on the page;
- related articles or products based on explicit relationships in content data.

### 5.3 Blog and articles

The blog index becomes an editorial directory rather than a stream of identical cards. It leads with a small set of durable topic hubs and then recent answers.

Each factual article should follow this order where appropriate:

1. exact question as H1;
2. 40–80 word direct answer immediately below;
3. concise explanation with scannable H2 sections;
4. caveats, platform/version limits, or jurisdiction limits;
5. sources with direct links;
6. named author, reviewed/updated date, and applicable product disclosure;
7. related hub and related answers.

The structure is a content standard, not a rigid visual template. Satirical, announcement, and product-story articles may use a different narrative structure if their search intent is not a factual question.

### 5.4 Secondary routes

- **About:** identify Dudley Development, LLC and Nicholas Santulli plainly; explain what is built and how privacy/ads/purchases vary by app. Do not lead with “independent studio.”
- **Support and privacy:** prioritize task completion and legal accuracy over poster styling; apply shared type, spacing, rules, navigation, and footer.
- **Contact:** preserve current support routing and form behavior while simplifying presentation.
- **Comparisons, tools, and archetypes:** retain useful functionality and search intent, but use the new visual tokens and stronger provenance/disclosure treatment.
- **404 and compatibility routes:** use shared chrome, clear recovery actions, and correct indexing directives.

## 6. Component and data architecture

### 6.1 Single source of app truth

`src/content/apps/*.mdx` remains the authoritative app catalog. Extend its schema only where a fact has multiple consumers. Recommended structured fields are:

- `name`, `tagline`, `description`, `status`, `appStoreId`, `landingPage`, `order`;
- `developedFor` for client work;
- `posterHeadline` and `posterFacts` for the product bands;
- `pricingSummary`, `accountSummary`, `offlineSummary`, and `privacySummary` for visible, app-specific facts;
- `dateAdded` and `lastUpdated`;
- existing `operatingSystem`, `applicationCategory`, FAQ, support, relationship, icon, and image fields.

Color and layout variants should be keyed by slug in a small typed presentation map rather than entered as arbitrary frontmatter. App Store campaign tokens remain in `src/lib/campaignLinks.mjs`; product content must not duplicate them.

All of these surfaces must consume the same app entry and status:

- homepage poster bands;
- app detail pages;
- About catalog;
- Support index and per-app support pages;
- structured data;
- Smart App Banners;
- `llms.txt`;
- sitemap eligibility;
- build-time release invariants.

### 6.2 Shared components

Implementation should introduce or refactor toward:

- `AppPosterBand.astro` — live/coming-soon/client presentation with typed variants;
- `AppStoreAction.astro` — accessible App Store CTA using registered campaign tokens;
- `AnswerCard.astro` — compact editorial link with question, direct-answer excerpt, date, and hub;
- `TopicHubHeader.astro` — hub definition and article count;
- shared `SiteHeader.astro` and `SiteFooter.astro` extracted from `Base.astro` if that reduces duplication without obscuring semantics;
- `Base.astro` as the sole owner of canonical, social metadata, Organization identity, breadcrumbs, and global shell.

The implementation should avoid a premature component library. Components are warranted only when they encode a repeated semantic or invariant.

### 6.3 CSS organization

`public/assets/style.css` should be refactored around a small token layer:

- ink, paper, muted ink, rule, focus, and product accent variables;
- a fluid type scale using `clamp()` with bounded minimums and maximums;
- spacing steps with a 4 px base;
- maximum reading width of approximately 68–72 characters for article prose;
- a wide display wrapper for product bands;
- breakpoints driven by content, not device names.

Page-specific styles may remain colocated in Astro components when they are truly local. Shared patterns should move to the global stylesheet.

## 7. SEO architecture

### 7.1 Canonicals and trailing slashes

The canonical policy is **one trailing slash for every HTML route except file-like endpoints** such as `.xml` and `.txt`.

- Set Astro's `trailingSlash` behavior to `always` and keep file-like endpoints exempt through their explicit routes.
- Normalize `Base.astro` input paths before building canonicals.
- Update internal links to the slash form.
- Add build checks that every indexable HTML page has exactly one canonical matching its deployed URL.
- Exclude compatibility pages, `noindex` pages, support/privacy routes, RSS, and `llms.txt` from the page sitemap as intended.
- Keep `/apps/powell-prowl/` only as a `noindex` compatibility route with a canonical and visible link to `/apps/monetary-policy-independence-day/`; it must not appear in the sitemap.

### 7.2 Topic consolidation

The topic configuration will define six durable hubs:

1. `/blog/topics/iphone-privacy/`
2. `/blog/topics/ai-media/`
3. `/blog/topics/internet-culture/`
4. `/blog/topics/economics/`
5. `/blog/topics/app-store/`
6. `/blog/topics/dudley-guides/`

Each hub must have:

- a unique definition and scope written for readers;
- at least three genuinely relevant articles before it is indexable;
- a manually maintained description, title, and representative image where available;
- links to all included published articles;
- `CollectionPage` or `ItemList` schema only when it accurately mirrors visible content.

A configured hub becomes indexable only when it has at least three genuinely relevant published articles. Until then, it is not linked as a destination, is omitted from the sitemap, and is either not generated or is generated `noindex` for editorial preview. The initial release may therefore index fewer than six hubs. This guard prevents the redesign from replacing thin tag pages with thin hub pages merely to reach a target count.

Freeform article tags remain useful as internal labels, but they do not automatically earn indexable routes. A typed mapping assigns each tag/category to zero or one durable hub.

Legacy `/blog/tags/*/` routes are handled conservatively in the first release:

- omit every legacy tag route from the sitemap;
- render it `noindex,follow` while historic links continue to work;
- show a visible path to its mapped topic hub or the blog index;
- canonicalize true aliases/duplicates to one equivalent legacy URL or mapped hub only when the content is substantively equivalent;
- do not create new tag routes for new freeform labels;
- update all current navigation and article links to use topic hubs, while displaying secondary tags as non-link labels.

This approach reduces indexable thin content immediately without creating a wave of broken URLs on GitHub Pages. If hosting later supports real HTTP redirects, mapped legacy tag routes can become permanent redirects.

### 7.3 Titles, descriptions, and social metadata

- Every indexable page receives a unique title and description that match its visible purpose.
- Homepage metadata describes Dudley's catalog, names Last Human as the newest release, and avoids making one older app the site's only subject.
- App titles lead with the app name and concrete category/premise.
- Article titles preserve the exact user question where that is the search intent.
- Open Graph and X metadata use the same canonical fact set.
- Default social imagery must be compressed and correctly sized; app/article imagery should override it when available.

### 7.4 Structured data

Use only schema that is supported by visible content:

- one stable `Organization` entity with an `@id` such as `https://dudleyapps.com/#organization`;
- one stable `WebSite` entity with an `@id` such as `https://dudleyapps.com/#website` and publisher linkage;
- `BreadcrumbList` on non-home pages;
- `SoftwareApplication` on app detail pages, with factual operating system, application category, offer/pricing, status, image, and publisher linkage;
- `BlogPosting` or `Article` on editorial pages, with named author, publisher, publish date, modified date, image, and canonical main entity;
- `CollectionPage`/`ItemList` on curated hubs when visible lists match the data;
- FAQ schema only where the same FAQ is visible and the page meaningfully answers those questions.

Do not add unsupported reviews, ratings, aggregate offers, `HowTo`, or FAQ markup merely to occupy search features. Validate every emitted JSON-LD document during the build.

## 8. AEO and content provenance

Google's AI surfaces do not require special AI markup; normal indexing eligibility, clear text, internal links, page experience, and accurate structured data remain the foundation. Dudley's answer-engine work therefore focuses on consistency and extractability rather than “AI SEO” tricks.

### 8.1 Answer-first content

- Put the plain answer before background or product promotion.
- Use headings that correspond to meaningful follow-up questions.
- Keep important facts in HTML text, not only images.
- Distinguish known facts, platform documentation, Dudley product behavior, and inference.
- Link to primary documentation where a claim depends on Apple, Google, OpenAI, government, or standards-body policy.
- Show a specific “Last checked” or updated date when behavior can change.
- Name the author; identify Dudley Development as publisher and disclose when an article promotes a Dudley app.

### 8.2 `llms.txt`

`src/pages/llms.txt.ts` must be generated from the same app and article sources as the rendered site. It should contain:

- stable studio identity;
- concise live app facts and canonical landing pages;
- tagged App Store links using the correct registered placement token;
- curated topic hubs and a bounded set of high-value answers;
- privacy/support links;
- no claim that conflicts with the human-readable site.

A build test must compare every app's live/coming-soon state, App Store ID, and canonical URL between rendered HTML and `llms.txt`.

### 8.3 Crawler access

Retain the global allow rule and the explicit crawler entries already present. Add an explicit `OAI-SearchBot` block for ChatGPT search discovery. Keep `GPTBot` separate because training and search controls are distinct. The robots file must continue to list the page and image sitemap indexes.

## 9. Responsive, accessibility, and interaction requirements

### Mobile-first behavior

- Supported verification widths: 320, 390, 430, 844, and 1440 px.
- No horizontal overflow at any supported width, including long app names, URLs, headings, and legal copy.
- Product art must use bounded aspect ratios and deliberate crops; no key content may be hidden by object positioning.
- Primary actions become full-width where space is constrained.
- Touch targets are at least 44 × 44 CSS px with adequate separation.
- Text remains readable at 200% zoom and with larger default browser text.

### Accessibility

- Preserve one logical H1 per page and ordered heading levels.
- Preserve skip navigation, landmarks, accessible navigation names, and visible focus.
- Meet WCAG 2.2 AA contrast for text, controls, status labels, and focus indicators.
- Do not rely on color alone for live/coming-soon state.
- Decorative imagery receives empty alternative text; product artwork has concise functional alt text where it conveys information.
- Mobile navigation works with keyboard, pointer, Escape, and screen-reader semantics without requiring JavaScript for core access.
- Honor `prefers-reduced-motion` and avoid scroll hijacking or parallax.
- Preserve sensible rendering in dark preference even if the site uses one deliberately authored theme; form controls and theme color must not become illegible.

## 10. Performance and asset budgets

The site should stay static and use no homepage hydration.

Release budgets, measured on the production build:

- shared CSS: no more than 45 KB uncompressed and no unexplained increase above baseline;
- shared JavaScript: no new framework/client bundle; inline navigation enhancement under 3 KB uncompressed;
- header logo/mark: SVG preferred and under 5 KB;
- each app icon delivered near rendered dimensions, normally under 100 KB;
- non-hero raster images: normally under 200 KB each;
- above-the-fold responsive poster art: under 350 KB per selected source at common mobile width;
- no layout shift caused by images because width, height, and aspect ratio are declared;
- no more than two font families and no blocking third-party font dependency; prefer system/local fonts;
- target Lighthouse mobile scores on representative local production pages: Performance 90+, Accessibility 95+, Best Practices 95+, SEO 95+.

Use AVIF/WebP where browser support and the Astro/static pipeline make it maintainable. Preserve source artwork; commit optimized derivatives, not destructive overwrites, when the original is still needed.

## 11. Build safeguards and error handling

The build must fail with a clear message when:

- a Dudley-owned app marked `live` lacks an App Store ID, registered campaign-token mapping, landing page, or required visible release facts;
- a live client app lacks an App Store ID, registered campaign-token mapping, `developedFor` attribution, or an explicit public destination even when it intentionally has no Dudley landing page;
- an app marked non-live emits an App Store download CTA;
- the same placement campaign token is reused improperly;
- a first-party App Store URL is bare or paired with the wrong app ID;
- homepage, app page, schema, or `llms.txt` disagree on app status or ID;
- an indexable page lacks a unique title, description, canonical, or H1;
- a canonical uses the wrong slash policy or a different host;
- a `noindex` route appears in the page sitemap;
- a legacy tag route is indexable or appears in the sitemap;
- a structured-data document is invalid JSON or contradicts visible core facts;
- forbidden obsolete copy such as Last Human “coming soon” appears in built public surfaces;
- an internal link resolves to a missing built route.

Warnings, rather than failures, are appropriate for editorial judgments such as a short description, a missing optional social image, or a hub approaching its minimum article count.

## 12. Verification plan

### Automated

1. `npm test` passes with the pre-existing untagged EconByte App Store link corrected.
2. Add focused tests for app-status parity, canonical normalization, metadata presence/uniqueness, schema parsing, sitemap eligibility, robots directives, legacy tag handling, internal links, and stale release language.
3. Build twice and confirm deterministic route counts and sitemap membership.
4. Inspect output sizes against the asset and CSS budgets.
5. Run Lighthouse or equivalent audits against the production build for the homepage, Last Human app page, blog index, representative answer article, topic hub, and support page.

### Visual and interaction QA

Capture and review the same representative routes at 320, 390, 430, 844, and 1440 px. Verify:

- masthead and mobile menu;
- Last Human product band and App Store CTA;
- the longest product name and longest factual label;
- topic hub cards and article prose;
- forms, support accordions/FAQs, footer, and 404 recovery;
- keyboard-only flow and visible focus;
- 200% zoom, reduced motion, high contrast where available, and dark preference;
- no stale copy, cropped critical artwork, overlap, overflow, tiny tap targets, or desktop-only hover dependence.

## 13. Release and live verification

### Branch safety

- Work in `codex/dudley-site-revamp-20260921`, created from current `origin/main` (`6591015` at spec time).
- Do not modify, reset, or incorporate the dirty local `main` checkout unless the user explicitly requests it.
- Keep commits scoped so the design system, SEO architecture, and deployment changes can be reviewed and reverted coherently.

### Publish sequence

1. Run the full production build and automated suite from the isolated branch.
2. Review representative desktop and mobile renders.
3. Commit source changes and push the source branch.
4. Merge or otherwise publish the approved source to `main` without overwriting unrelated user work.
5. Run the repository's existing `npm run deploy` flow to update `gh-pages` while preserving `CNAME` and current deployment conventions.
6. Verify both source and deployment commit IDs.
7. Load cache-busted live URLs and compare visible output, metadata, canonical, schema, robots, `llms.txt`, and sitemaps to the production build.
8. Confirm Last Human is first, live, and linked to the verified App Store ID with the correct placement token.
9. Confirm every eligible configured hub is indexable, every ineligible/legacy taxonomy route is not, and the obsolete Powell Prowl compatibility route is absent from the sitemap.
10. If available, request indexing for the homepage, Last Human page, and hub pages in Search Console. Treat IndexNow as a separate, explicitly verified action rather than evidence that Google indexing occurred.

### Rollback

If live verification fails, stop promotion and redeploy the last known-good `gh-pages` commit. Source history should be reverted with a normal revert commit rather than rewriting shared history. Cache state must be checked separately; seeing an old page does not by itself prove the deploy failed.

## 14. Measurement after release

Record a post-release baseline and compare it to the figures in section 2:

- number of sitemap URLs;
- number of indexable topic/taxonomy pages;
- canonical mismatches and duplicate title/description counts;
- pages below 120 and 180 words, interpreted by page purpose rather than as a standalone quality score;
- build size and largest transferred assets;
- Lighthouse results at the representative routes;
- Google Search Console coverage, crawl, rich-result, query, and page data when accessible;
- Bing Webmaster/IndexNow status separately when used;
- App Store campaign-token clicks by placement where Apple reporting supports it.

The initial success criteria are technical and experiential: zero known canonical conflicts, zero live-status drift, zero indexable legacy tag pages, all tests passing, mobile QA passing at 320 px, and production output within the stated budgets. Search visibility and answer-engine citations are longer-term outcomes to monitor, not guarantees.

## 15. Final acceptance criteria

The revamp is ready to publish only when all of the following are true:

- The homepage matches the approved App Poster Wall direction and contains none of the identified generic AI-design tells.
- Last Human is the first live product, accurately described, and linked to its verified App Store listing.
- Every route family uses the shared visual language without sacrificing its task-specific purpose.
- Only configured hubs that meet the eligibility threshold are indexable editorial taxonomy; freeform and legacy tags are not.
- Human-visible pages, metadata, structured data, `llms.txt`, sitemap, and App Store links agree on current app facts.
- Canonical URLs use the chosen trailing-slash policy and no `noindex` URL appears in a sitemap.
- Mobile, keyboard, zoom, reduced-motion, contrast, and overflow checks pass.
- Performance budgets and representative Lighthouse thresholds pass or any exception is documented and approved before release.
- The full test suite passes, including the currently failing bare-link check.
- Source and `gh-pages` revisions are published and the cache-busted live site is inspected directly.

## 16. Primary implementation references

- [Google Search: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [Google Search: Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [OpenAI crawler overview](https://platform.openai.com/docs/bots)
- [Schema.org SoftwareApplication](https://schema.org/SoftwareApplication)
- [Schema.org BlogPosting](https://schema.org/BlogPosting)
