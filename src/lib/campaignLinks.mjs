// Campaign-link registry — single source of truth for all public App Store CTAs.
//
// Rules enforced here and in regression tests:
//   1. Every public App Store anchor on dudleyapps.com must be generated through
//      `appStoreCampaignUrl(id, token)` — never a bare `apps.apple.com` link for
//      our own apps.
//   2. Every placement gets a unique, stable `ct`. Never reuse a token across
//      surfaces. Never change a registered token (add a new version instead).
//   3. Provider token is always `pt=128970277` (Dudley Development, LLC).
//   4. `mt=8` always included.
//   5. No `ppid` on default product pages. CPP links must use their real assigned
//      ppid from Apple; do not invent one.
//   6. Only apps with `activatedAt` date are in active GTM. Others are attribution-
//      hygiene only (links tagged but not promoted as primary CTAs).
//
// TOKEN REGISTRY
// ┌────────────────────────────────┬──────────────────────────────────────────┬────────────┬─────────────┐
// │ token                          │ surface / placement                      │ app id     │ activated   │
// ├────────────────────────────────┼──────────────────────────────────────────┼────────────┼─────────────┤
// │ tt-web-hero-sep26-v1           │ Homepage hero primary CTA (new Sep 2026) │ 6780714565 │ 2026-09-03  │
// │ tabletalk-web-home             │ Homepage app card badge (live, deployed) │ 6780714565 │ pre-Sep-26  │
// │ tabletalk-web-app              │ /apps/table-talk/ AppCTA (live, deployed)│ 6780714565 │ pre-Sep-26  │
// │ vr-web-home-aug26-v1           │ Homepage app card badge                  │ 6780704282 │ 2026-08-01  │
// │ vr-web-app-aug26-v1            │ /apps/vibe-rater/ AppCTA                 │ 6780704282 │ 2026-08-01  │
// │ vr-web-archetype-aug26-v1      │ /archetypes/[slug]/ (REMOVED from CTA)   │ 6780704282 │ 2026-08-01  │
// │ vr-web-comparison-aug26-v1     │ /compare/[slug]/ AppCTA                  │ 6780704282 │ 2026-08-01  │
// │ vr-web-tool-aug26-v1           │ /tools/[slug]/ AppCTA                    │ 6780704282 │ 2026-08-01  │
// │ vr-web-blog-<slug>-aug26-v1    │ /blog/[slug]/ AppCTA (VR-linked posts)   │ 6780704282 │ 2026-08-01  │
// │ pp-web-card-sep26-v1           │ Homepage app card badge                  │ 6775539250 │ 2026-09-03  │
// │ pp-web-app-sep26-v1            │ /apps/monetary-policy-independence-day/  │ 6775539250 │ 2026-09-03  │
// │ pp-web-blog-sep26-v1           │ Blog post inline links (markdown)        │ 6775539250 │ 2026-09-03  │
// │ eb-web-card-sep26-v1           │ Homepage app card badge                  │ 6780714383 │ 2026-09-03  │
// │ eb-web-app-sep26-v1            │ /apps/econbyte/ AppCTA                   │ 6780714383 │ 2026-09-03  │
// │ dwh-web-card-sep26-v1          │ Homepage app card badge                  │ 6779785617 │ 2026-09-03  │
// └────────────────────────────────┴──────────────────────────────────────────┴────────────┴─────────────┘

// Only include slugs that are verified against the live App Store URL.
// Table Talk uses the plain /app/id... path (no named slug on this build).
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
// Do NOT reuse a token value across two different rows.

export const TABLE_TALK_ASC_TOKENS = Object.freeze({
  // Preserve exact live-deployed token values — do not rename or reassign.
  homeCard:  'tabletalk-web-home',    // homepage app card badge (live, deployed)
  appDetail: 'tabletalk-web-app',     // /apps/table-talk/ page CTA (live, deployed)
  // Hero is a new placement added Sep 2026 (was not on the previous homepage).
  homeHero:  'tt-web-hero-sep26-v1',  // homepage hero primary CTA (new)
});

export const VIBERATER_ASC_TOKENS = Object.freeze({
  home:       'vr-web-home-aug26-v1',       // homepage app card badge
  appDetail:  'vr-web-app-aug26-v1',        // /apps/vibe-rater/ page CTA
  archetype:  'vr-web-archetype-aug26-v1',  // archived — CTA removed from archetypes
  comparison: 'vr-web-comparison-aug26-v1', // /compare/[slug]/ CTA
  tool:       'vr-web-tool-aug26-v1',       // /tools/[slug]/ CTA
});

export const POWELL_PROWL_ASC_TOKENS = Object.freeze({
  homeCard:  'pp-web-card-sep26-v1',  // homepage app card badge
  appDetail: 'pp-web-app-sep26-v1',   // /apps/monetary-policy-independence-day/ CTA
  blog:      'pp-web-blog-sep26-v1',  // blog post inline links
});

export const ECONBYTE_ASC_TOKENS = Object.freeze({
  homeCard:  'eb-web-card-sep26-v1',  // homepage app card badge
  appDetail: 'eb-web-app-sep26-v1',   // /apps/econbyte/ CTA
});

export const DUDE_WHERES_ASC_TOKENS = Object.freeze({
  homeCard: 'dwh-web-card-sep26-v1',  // homepage app card badge
});

// All registered first-party tokens in one flat list — used by regression tests
// to detect bare links (any first-party App Store URL lacking one of these) and
// token reuse (same ct value on two different placements).
export const ALL_REGISTERED_TOKENS = Object.freeze([
  ...Object.values(TABLE_TALK_ASC_TOKENS),
  ...Object.values(VIBERATER_ASC_TOKENS),
  ...Object.values(POWELL_PROWL_ASC_TOKENS),
  ...Object.values(ECONBYTE_ASC_TOKENS),
  ...Object.values(DUDE_WHERES_ASC_TOKENS),
]);

// First-party App Store IDs — any bare link to these in built output is a bug.
export const FIRST_PARTY_APP_IDS = Object.freeze(Object.keys(APP_STORE_PROVIDER_TOKENS));

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
