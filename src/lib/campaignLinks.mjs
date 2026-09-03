// Campaign-link registry — single source of truth for all public App Store CTAs.
//
// Rules enforced here and in regression tests:
//   1. Every public App Store anchor on dudleyapps.com must be generated through
//      `appStoreCampaignUrl(id, token)` — never a bare `apps.apple.com` link for
//      our own apps.
//   2. Every placement gets a unique, stable `ct`. A token identifies ONE page
//      path + ONE placement slot. Never reuse a token across pages or surfaces.
//      Never change a registered token value (add a new version instead).
//   3. Provider token is always `pt=128970277` (Dudley Development, LLC).
//   4. `mt=8` always included.
//   5. No `ppid` on default product pages. CPP links must use their real assigned
//      ppid from Apple; do not invent one.
//   6. `status: 'active'` = live GTM placement. `status: 'maintenance'` = tagged
//      for attribution hygiene, not a promoted growth surface.

// ---------------------------------------------------------------------------
// Machine-readable registry
// Each row: { ct, appId, surface, path, channel, ppid, activatedAt, status }
//   ct          — the campaign token value (immutable once registered)
//   appId       — Apple App Store app ID
//   surface     — human description of the placement
//   path        — URL path pattern this token represents (exact or glob)
//   channel     — 'web' | 'blog-inline'
//   ppid        — CPP product page ID, null for default product pages
//   activatedAt — ISO date string of first activation
//   status      — 'active' | 'maintenance'
// ---------------------------------------------------------------------------
export const TOKEN_REGISTRY = Object.freeze([
  // ── Table Talk (6780714565) ──────────────────────────────────────────────
  {
    ct: 'tt-web-hero-sep26-v1',
    appId: '6780714565',
    surface: 'Homepage hero primary CTA (new Sep 2026)',
    path: '/',
    channel: 'web',
    ppid: null,
    activatedAt: '2026-09-03',
    status: 'active',
  },
  {
    ct: 'tabletalk-web-home',
    appId: '6780714565',
    surface: 'Homepage app card badge',
    path: '/',
    channel: 'web',
    ppid: null,
    activatedAt: '2026-06-14',
    status: 'active',
  },
  {
    ct: 'tabletalk-web-app',
    appId: '6780714565',
    surface: '/apps/table-talk/ AppCTA',
    path: '/apps/table-talk/',
    channel: 'web',
    ppid: null,
    activatedAt: '2026-06-14',
    status: 'active',
  },

  // ── VibeRater Social (6780704282) ────────────────────────────────────────
  {
    ct: 'vr-web-home-aug26-v1',
    appId: '6780704282',
    surface: 'Homepage app card badge',
    path: '/',
    channel: 'web',
    ppid: null,
    activatedAt: '2026-08-01',
    status: 'maintenance',
  },
  {
    ct: 'vr-web-app-aug26-v1',
    appId: '6780704282',
    surface: '/apps/vibe-rater/ AppCTA',
    path: '/apps/vibe-rater/',
    channel: 'web',
    ppid: null,
    activatedAt: '2026-08-01',
    status: 'maintenance',
  },
  {
    ct: 'vr-web-archetype-aug26-v1',
    appId: '6780704282',
    surface: '/archetypes/[slug]/ AppCTA',
    path: '/archetypes/*/',
    channel: 'web',
    ppid: null,
    activatedAt: '2026-08-01',
    status: 'maintenance',
  },
  {
    ct: 'vr-web-comparison-aug26-v1',
    appId: '6780704282',
    surface: '/compare/[slug]/ AppCTA',
    path: '/compare/*/',
    channel: 'web',
    ppid: null,
    activatedAt: '2026-08-01',
    status: 'maintenance',
  },
  {
    ct: 'vr-web-tool-aug26-v1',
    appId: '6780704282',
    surface: '/tools/[slug]/ AppCTA',
    path: '/tools/*/',
    channel: 'web',
    ppid: null,
    activatedAt: '2026-08-01',
    status: 'maintenance',
  },
  // Blog post CTAs — each post gets its own token via blogCampaignToken(slug).
  // They follow the pattern `vr-web-blog-<slug-fragment>-aug26-v1` and are not
  // individually listed here; they are validated structurally by the test suite.

  // ── Powell Prowl: Rate Chase (6775539250) ────────────────────────────────
  {
    ct: 'pp-web-card-sep26-v1',
    appId: '6775539250',
    surface: 'Homepage app card badge',
    path: '/',
    channel: 'web',
    ppid: null,
    activatedAt: '2026-09-03',
    status: 'maintenance',
  },
  {
    ct: 'pp-web-app-sep26-v1',
    appId: '6775539250',
    surface: '/apps/monetary-policy-independence-day/ AppCTA',
    path: '/apps/monetary-policy-independence-day/',
    channel: 'web',
    ppid: null,
    activatedAt: '2026-09-03',
    status: 'maintenance',
  },
  {
    ct: 'pp-web-blog-fed-opinion-vibe-sep26-v1',
    appId: '6775539250',
    surface: '/blog/fed-opinion-vibe/ inline body link',
    path: '/blog/fed-opinion-vibe/',
    channel: 'blog-inline',
    ppid: null,
    activatedAt: '2026-09-03',
    status: 'maintenance',
  },
  {
    ct: 'pp-web-blog-best-satirical-sep26-v1',
    appId: '6775539250',
    surface: '/blog/best-satirical-ios-games/ inline body link',
    path: '/blog/best-satirical-ios-games/',
    channel: 'blog-inline',
    ppid: null,
    activatedAt: '2026-09-03',
    status: 'maintenance',
  },

  // ── EconByte: Daily Economics (6780714383) ───────────────────────────────
  {
    ct: 'eb-web-card-sep26-v1',
    appId: '6780714383',
    surface: 'Homepage app card badge',
    path: '/',
    channel: 'web',
    ppid: null,
    activatedAt: '2026-09-03',
    status: 'maintenance',
  },
  {
    ct: 'eb-web-app-sep26-v1',
    appId: '6780714383',
    surface: '/apps/econbyte/ AppCTA',
    path: '/apps/econbyte/',
    channel: 'web',
    ppid: null,
    activatedAt: '2026-09-03',
    status: 'maintenance',
  },
  // EconByte blog CTAs follow the pattern `eb-web-blog-<slug>-sep26-v1`.
  // Generated per-post by econbyteBlogCampaignToken(slug) — not individually listed.

  // ── Dude, Where's This House? (6779785617) ───────────────────────────────
  {
    ct: 'dwh-web-card-sep26-v1',
    appId: '6779785617',
    surface: 'Homepage app card badge (client work section)',
    path: '/',
    channel: 'web',
    ppid: null,
    activatedAt: '2026-09-03',
    status: 'maintenance',
  },
]);

// ---------------------------------------------------------------------------
// Derived lookup objects (built from the registry so they never drift)
// ---------------------------------------------------------------------------

// Flat list of all statically registered ct values — used by regression tests.
export const ALL_REGISTERED_TOKENS = Object.freeze(TOKEN_REGISTRY.map((r) => r.ct));

// Map: ct → appId — asserts every rendered href pairs the right token with the
// right app. A tabletalk-web-home on a VibeRater URL must fail.
export const CT_TO_APP_ID = Object.freeze(
  Object.fromEntries(TOKEN_REGISTRY.map((r) => [r.ct, r.appId]))
);

// Map: ct → path pattern — used to validate cross-page uniqueness.
// Patterns ending in /*/ are globs (one token shared across a template class).
export const CT_TO_PATH = Object.freeze(
  Object.fromEntries(TOKEN_REGISTRY.map((r) => [r.ct, r.path]))
);

// Blog token patterns — generated per-post, not statically listed.
// Each function below produces tokens matching these patterns.
export const BLOG_TOKEN_PATTERNS = Object.freeze([
  { pattern: /^vr-web-blog-.+-aug26-v1$/, appId: '6780704282', pathPrefix: '/blog/' },
  { pattern: /^pp-web-blog-.+-sep26-v1$/, appId: '6775539250', pathPrefix: '/blog/' },
  { pattern: /^eb-web-blog-.+-sep26-v1$/, appId: '6780714383', pathPrefix: '/blog/' },
]);

// First-party App Store IDs — any bare link to these in built output is a bug.
export const FIRST_PARTY_APP_IDS = Object.freeze([
  '6780704282', // VibeRater Social
  '6780714565', // Table Talk: Conversation Cards
  '6775539250', // Powell Prowl: Rate Chase
  '6780714383', // EconByte: Daily Economics
  '6779785617', // Dude, Where's This House?
]);

// ---------------------------------------------------------------------------
// Placement token exports (named constants for call sites)
// ---------------------------------------------------------------------------

// Only include slugs that are verified against the live App Store URL.
// Table Talk uses the plain /app/id... path (no named slug confirmed yet).
const APP_STORE_SLUGS = Object.freeze({
  '6780704282': 'viberater-social',
});

const TOKEN_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PROVIDER_TOKEN_PATTERN = /^\d+$/;

export const PROVIDER_TOKEN = '128970277';

// Legacy named exports kept for back-compat with existing call sites.
export const VIBERATER_ASC_PROVIDER_TOKEN = PROVIDER_TOKEN;
export const TABLE_TALK_ASC_PROVIDER_TOKEN = PROVIDER_TOKEN;

const APP_STORE_PROVIDER_TOKENS = Object.freeze({
  '6780704282': PROVIDER_TOKEN, // VibeRater Social
  '6780714565': PROVIDER_TOKEN, // Table Talk: Conversation Cards
  '6775539250': PROVIDER_TOKEN, // Powell Prowl: Rate Chase
  '6780714383': PROVIDER_TOKEN, // EconByte: Daily Economics
  '6779785617': PROVIDER_TOKEN, // Dude, Where's This House?
});

// Placement token sets — keyed by app, grouped by surface.
// Every value maps 1-to-1 to a row in TOKEN_REGISTRY above.

export const TABLE_TALK_ASC_TOKENS = Object.freeze({
  // Preserve exact live-deployed token values — do not rename or reassign.
  homeCard:  'tabletalk-web-home',   // homepage app card badge (live, deployed)
  appDetail: 'tabletalk-web-app',    // /apps/table-talk/ page CTA (live, deployed)
  // Hero is a new placement added Sep 2026 (was not on the previous homepage).
  homeHero:  'tt-web-hero-sep26-v1', // homepage hero primary CTA (new)
});

export const VIBERATER_ASC_TOKENS = Object.freeze({
  home:       'vr-web-home-aug26-v1',       // homepage app card badge
  appDetail:  'vr-web-app-aug26-v1',        // /apps/vibe-rater/ page CTA
  archetype:  'vr-web-archetype-aug26-v1',  // /archetypes/[slug]/ CTA
  comparison: 'vr-web-comparison-aug26-v1', // /compare/[slug]/ CTA
  tool:       'vr-web-tool-aug26-v1',       // /tools/[slug]/ CTA
});

export const POWELL_PROWL_ASC_TOKENS = Object.freeze({
  homeCard:         'pp-web-card-sep26-v1',                     // homepage app card badge
  appDetail:        'pp-web-app-sep26-v1',                      // /apps/monetary-policy-independence-day/ CTA
  blogFedOpinion:   'pp-web-blog-fed-opinion-vibe-sep26-v1',    // /blog/fed-opinion-vibe/ inline link
  blogBestSatirical:'pp-web-blog-best-satirical-sep26-v1',      // /blog/best-satirical-ios-games/ inline link
});

export const ECONBYTE_ASC_TOKENS = Object.freeze({
  homeCard:  'eb-web-card-sep26-v1', // homepage app card badge
  appDetail: 'eb-web-app-sep26-v1',  // /apps/econbyte/ CTA
});

export const DUDE_WHERES_ASC_TOKENS = Object.freeze({
  homeCard: 'dwh-web-card-sep26-v1', // homepage app card badge (client work section)
});

// ---------------------------------------------------------------------------
// Token generators for blog post CTAs
// ---------------------------------------------------------------------------

/** Per-post VibeRater blog CTA token. Pattern: vr-web-blog-<slug>-aug26-v1 */
export function blogCampaignToken(slug) {
  const safeSlug = String(slug ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 26)
    .replace(/-+$/, '');
  if (!safeSlug) throw new Error('Blog slug is required for a campaign token');
  return `vr-web-blog-${safeSlug}-aug26-v1`;
}

/** Per-post Powell Prowl blog CTA token. Pattern: pp-web-blog-<slug>-sep26-v1 */
export function powellProwlBlogCampaignToken(slug) {
  const safeSlug = String(slug ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 24)
    .replace(/-+$/, '');
  if (!safeSlug) throw new Error('Blog slug is required for a campaign token');
  return `pp-web-blog-${safeSlug}-sep26-v1`;
}

/** Per-post EconByte blog CTA token. Pattern: eb-web-blog-<slug>-sep26-v1 */
export function econbyteBlogCampaignToken(slug) {
  const safeSlug = String(slug ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 24)
    .replace(/-+$/, '');
  if (!safeSlug) throw new Error('Blog slug is required for a campaign token');
  return `eb-web-blog-${safeSlug}-sep26-v1`;
}

// ---------------------------------------------------------------------------
// Core URL builder
// ---------------------------------------------------------------------------

export function validateProviderToken(providerToken) {
  if (!providerToken || !PROVIDER_TOKEN_PATTERN.test(providerToken)) {
    throw new Error('A numeric provider token is required');
  }
  return providerToken;
}

export function appStoreCampaignUrl(appStoreId, campaignToken) {
  if (!appStoreId) return '';
  if (!campaignToken || !TOKEN_PATTERN.test(campaignToken)) {
    throw new Error('A lowercase, hyphenated campaign token is required');
  }
  const providerToken = validateProviderToken(APP_STORE_PROVIDER_TOKENS[appStoreId]);
  const slug = APP_STORE_SLUGS[appStoreId];
  const path = slug ? `/us/app/${slug}/id${appStoreId}` : `/app/id${appStoreId}`;
  return `https://apps.apple.com${path}?pt=${providerToken}&ct=${encodeURIComponent(campaignToken)}&mt=8`;
}
