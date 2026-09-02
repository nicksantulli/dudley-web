const APP_STORE_SLUGS = Object.freeze({
  '6780704282': 'viberater-social',
});

const TOKEN_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PROVIDER_TOKEN_PATTERN = /^\d+$/;

// One account-wide Apple provider token; only the campaign token varies per placement.
export const VIBERATER_ASC_PROVIDER_TOKEN = '128970277';
export const ASC_PROVIDER_TOKEN = VIBERATER_ASC_PROVIDER_TOKEN;

const APP_STORE_PROVIDER_TOKENS = Object.freeze({
  '6780704282': ASC_PROVIDER_TOKEN,
  '6780714565': ASC_PROVIDER_TOKEN,
});

// Table Talk owned-surface tokens. One token per placement, never reused: a consumed
// ct cannot be re-minted, and two placements sharing a token make the rows unreadable.
// Deliberately carries no ppid — these are general CTAs, so a ppid would force every
// visitor onto one custom product page.
export const TABLE_TALK_ASC_TOKENS = Object.freeze({
  home: 'tabletalk-web-home',
  appDetail: 'tabletalk-web-app',
});

export const VIBERATER_ASC_TOKENS = Object.freeze({
  home: 'vr-web-home-aug26-v1',
  appDetail: 'vr-web-app-aug26-v1',
  archetype: 'vr-web-archetype-aug26-v1',
  comparison: 'vr-web-comparison-aug26-v1',
  tool: 'vr-web-tool-aug26-v1',
});

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
  // Apple's Campaign Link generator emits the /app/apple-store/ form; keep the older
  // slugged path for links already in the wild so their tokens stay comparable.
  const path = slug ? `/us/app/${slug}/id${appStoreId}` : `/app/apple-store/id${appStoreId}`;
  return `https://apps.apple.com${path}?pt=${providerToken}&ct=${encodeURIComponent(campaignToken)}&mt=8`;
}
