const APP_STORE_SLUGS = Object.freeze({
  '6780704282': 'viberater-social',
});

const TOKEN_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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

export function appStoreCampaignUrl(appStoreId, campaignToken) {
  if (!appStoreId) return '';
  if (!campaignToken || !TOKEN_PATTERN.test(campaignToken)) {
    throw new Error('A lowercase, hyphenated campaign token is required');
  }
  const slug = APP_STORE_SLUGS[appStoreId];
  const path = slug ? `/us/app/${slug}/id${appStoreId}` : `/app/id${appStoreId}`;
  return `https://apps.apple.com${path}?ct=${encodeURIComponent(campaignToken)}&mt=8`;
}
