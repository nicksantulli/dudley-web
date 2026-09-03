import test from 'node:test';
import assert from 'node:assert/strict';
import * as campaignLinks from '../src/lib/campaignLinks.mjs';

const {
  appStoreCampaignUrl,
  blogCampaignToken,
  tableTalkBlogCampaignToken,
  TABLE_TALK_ASC_TOKENS,
} = campaignLinks;

const TABLE_TALK_APP_ID = '6780714565';
const PHONE_IN_THE_MIDDLE_SLUG = 'phone-in-the-middle';
const PHONE_IN_THE_MIDDLE_CT = 'tt-web-blog-phone-in-the-middle-sep26-v1';
const FORBIDDEN_TABLE_TALK_REUSE = [
  'tabletalk-web-home',
  'tabletalk-web-app',
  'tt-web-hero-sep26-v1',
  'tabletalk-blog-phone-in-the-middle',
];

test('builds a VibeRater campaign link with a stable campaign token', () => {
  assert.equal(
    appStoreCampaignUrl('6780704282', 'vr-web-home-aug26-v1'),
    'https://apps.apple.com/us/app/viberater-social/id6780704282?pt=128970277&ct=vr-web-home-aug26-v1&mt=8',
  );
});

test('uses the Owner-verified numeric VibeRater provider token', () => {
  assert.equal(campaignLinks.VIBERATER_ASC_PROVIDER_TOKEN, '128970277');
  assert.equal(campaignLinks.validateProviderToken('128970277'), '128970277');
});

test('rejects missing or malformed provider tokens', () => {
  for (const providerToken of ['', 'OWNER-VERIFIED-NUMERIC-PT', '12897 0277']) {
    assert.throws(() => campaignLinks.validateProviderToken(providerToken), /provider token/i);
  }
});

test('rejects missing or malformed campaign tokens', () => {
  assert.throws(() => appStoreCampaignUrl('6780704282', ''), /campaign token/i);
  assert.throws(() => appStoreCampaignUrl('6780704282', 'VR Web'), /campaign token/i);
});

test('keeps generated blog tokens valid when a slug is truncated', () => {
  const token = blogCampaignToken('can-ai-use-your-instagram-photos');
  assert.match(token, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
});

test('Table Talk home card uses preserved live token tabletalk-web-home', () => {
  assert.equal(TABLE_TALK_ASC_TOKENS.homeCard, 'tabletalk-web-home');
});

test('Table Talk app detail uses preserved live token tabletalk-web-app', () => {
  assert.equal(TABLE_TALK_ASC_TOKENS.appDetail, 'tabletalk-web-app');
});

test('builds a Table Talk campaign link with correct pt and mt', () => {
  const url = appStoreCampaignUrl('6780714565', TABLE_TALK_ASC_TOKENS.homeCard);
  assert.ok(url.includes('pt=128970277'), 'missing pt');
  assert.ok(url.includes('ct=tabletalk-web-home'), 'wrong ct');
  assert.ok(url.includes('mt=8'), 'missing mt=8');
});

test('ALL_REGISTERED_TOKENS contains no duplicates', () => {
  const tokens = campaignLinks.ALL_REGISTERED_TOKENS;
  const set = new Set(tokens);
  assert.equal(set.size, tokens.length, `Duplicate tokens found: ${tokens.filter((t, i) => tokens.indexOf(t) !== i).join(', ')}`);
});

test('validateBlogDynamicTokenPlacement accepts exact blog slug token on blog path', () => {
  const slug = 'can-ai-use-your-instagram-photos';
  const ct = blogCampaignToken(slug);
  const result = campaignLinks.validateBlogDynamicTokenPlacement(
    ct,
    `/blog/${slug}/`,
    '6780704282',
  );
  assert.deepEqual(result, { ok: true });
});

test('validateBlogDynamicTokenPlacement rejects blog-dynamic token on homepage', () => {
  const ct = blogCampaignToken('can-ai-use-your-instagram-photos');
  const result = campaignLinks.validateBlogDynamicTokenPlacement(ct, '/', '6780704282');
  assert.equal(result.ok, false);
  assert.match(result.reason, /non-blog path/);
});

test('validateBlogDynamicTokenPlacement rejects blog-dynamic token on app landing page', () => {
  const ct = blogCampaignToken('can-ai-use-your-instagram-photos');
  const result = campaignLinks.validateBlogDynamicTokenPlacement(
    ct,
    '/apps/vibe-rater/',
    '6780704282',
  );
  assert.equal(result.ok, false);
  assert.match(result.reason, /non-blog path/);
});

test('validateBlogDynamicTokenPlacement rejects wrong slug token on blog path', () => {
  const ct = blogCampaignToken('wrong-slug');
  const result = campaignLinks.validateBlogDynamicTokenPlacement(
    ct,
    '/blog/can-ai-use-your-instagram-photos/',
    '6780704282',
  );
  assert.equal(result.ok, false);
  assert.match(result.reason, /does not match expected slug\+app token/);
});

test('validateBlogDynamicTokenPlacement ignores static tokens on any path', () => {
  const result = campaignLinks.validateBlogDynamicTokenPlacement(
    TABLE_TALK_ASC_TOKENS.homeCard,
    '/',
    '6780714565',
  );
  assert.deepEqual(result, { ok: true });
});

test('tableTalkBlogCampaignToken keeps phone-in-the-middle untruncated', () => {
  const token = tableTalkBlogCampaignToken(PHONE_IN_THE_MIDDLE_SLUG);
  assert.equal(token, PHONE_IN_THE_MIDDLE_CT);
  assert.match(token, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.ok(token.includes(PHONE_IN_THE_MIDDLE_SLUG), 'slug was truncated');
});

test('Table Talk blog token is registered to app 6780714565 via the blog pattern', () => {
  const resolved = campaignLinks.resolveTokenDefinition(PHONE_IN_THE_MIDDLE_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'blog-dynamic');
  assert.equal(resolved.appId, TABLE_TALK_APP_ID);
  assert.equal(resolved.ct, PHONE_IN_THE_MIDDLE_CT);
});

test('expectedBlogTokenForPathAndApp binds Table Talk blog path to generated token', () => {
  assert.equal(
    campaignLinks.expectedBlogTokenForPathAndApp(
      `/blog/${PHONE_IN_THE_MIDDLE_SLUG}/`,
      TABLE_TALK_APP_ID,
    ),
    PHONE_IN_THE_MIDDLE_CT,
  );
});

test('Table Talk blog token is not a reused live Table Talk web token', () => {
  const token = tableTalkBlogCampaignToken(PHONE_IN_THE_MIDDLE_SLUG);
  assert.ok(!FORBIDDEN_TABLE_TALK_REUSE.includes(token));
  assert.ok(!campaignLinks.ALL_REGISTERED_TOKENS.includes(token));
});

test('unregistered campaign tokens still fail resolveTokenDefinition', () => {
  assert.equal(campaignLinks.resolveTokenDefinition('tabletalk-blog-phone-in-the-middle'), null);
  assert.equal(campaignLinks.resolveTokenDefinition('not-a-real-campaign-token'), null);
});

test('Table Talk blog token on the wrong app id fails placement validation', () => {
  const result = campaignLinks.validateBlogDynamicTokenPlacement(
    PHONE_IN_THE_MIDDLE_CT,
    `/blog/${PHONE_IN_THE_MIDDLE_SLUG}/`,
    '6780704282',
  );
  assert.equal(result.ok, false);
  assert.match(result.reason, /does not match expected slug\+app token/);
});

test('Table Talk blog App Store URL uses pt, generated ct, and mt=8', () => {
  const url = appStoreCampaignUrl(
    TABLE_TALK_APP_ID,
    tableTalkBlogCampaignToken(PHONE_IN_THE_MIDDLE_SLUG),
  );
  assert.equal(
    url,
    `https://apps.apple.com/app/id${TABLE_TALK_APP_ID}?pt=128970277&ct=${PHONE_IN_THE_MIDDLE_CT}&mt=8`,
  );
});
