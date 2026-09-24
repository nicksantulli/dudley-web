import test from 'node:test';
import assert from 'node:assert/strict';
import * as campaignLinks from '../src/lib/campaignLinks.mjs';

const {
  appStoreCampaignUrl,
  blogCampaignToken,
  tableTalkBlogCampaignToken,
  TABLE_TALK_ASC_TOKENS,
  LAST_HUMAN_ASC_TOKENS,
} = campaignLinks;

const TABLE_TALK_APP_ID = '6780714565';
const LAST_HUMAN_APP_ID = '6808782611';
const PHONE_IN_THE_MIDDLE_SLUG = 'phone-in-the-middle';
const PHONE_IN_THE_MIDDLE_CT = 'tt-web-blog-phone-in-the-middle-sep26-v1';
const TABLE_TALK_TIKTOK_CT = 'tabletalk-tiktok-20260910';
const TABLE_TALK_X_COLLECTOR_CT = 'tabletalk-x-collector-20260914';
const TABLE_TALK_X_COLLECTOR_20260924_CT = 'tabletalk-x-collector-20260924';
const FORBIDDEN_TABLE_TALK_REUSE = [
  'tabletalk-web-home',
  'tabletalk-web-app',
  'tt-web-hero-sep26-v1',
  TABLE_TALK_TIKTOK_CT,
  TABLE_TALK_X_COLLECTOR_CT,
  TABLE_TALK_X_COLLECTOR_20260924_CT,
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

test('builds the verified Last Human App Store URL for the homepage card', () => {
  assert.equal(
    appStoreCampaignUrl(LAST_HUMAN_APP_ID, LAST_HUMAN_ASC_TOKENS.homeCard),
    'https://apps.apple.com/us/app/last-human-dodge-the-bots/id6808782611?pt=128970277&ct=lh-web-card-sep26-v1&mt=8',
  );
});

test('registers unique Last Human tokens for each launch surface', () => {
  assert.deepEqual(LAST_HUMAN_ASC_TOKENS, {
    homeCard: 'lh-web-card-sep26-v1',
    appDetail: 'lh-web-app-sep26-v1',
    llms: 'lh-web-llms-sep26-v1',
    privacy: 'lh-web-privacy-sep26-v1',
  });

  for (const token of Object.values(LAST_HUMAN_ASC_TOKENS)) {
    const resolved = campaignLinks.resolveTokenDefinition(token);
    assert.equal(resolved?.appId, LAST_HUMAN_APP_ID);
  }
});

test('llms.txt has one registered token for every live App Store app', () => {
  assert.deepEqual(campaignLinks.LLMS_APP_STORE_TOKENS, {
    '6780704282': 'vr-web-llms-sep26-v1',
    '6780714565': 'tt-web-llms-sep26-v1',
    '6775539250': 'pp-web-llms-sep26-v1',
    '6780714383': 'eb-web-llms-sep26-v1',
    '6779785617': 'dwh-web-llms-sep26-v1',
    '6808782611': 'lh-web-llms-sep26-v1',
  });
  for (const [appId, token] of Object.entries(campaignLinks.LLMS_APP_STORE_TOKENS)) {
    assert.equal(campaignLinks.resolveTokenDefinition(token)?.appId, appId);
  }
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

test('Table Talk TikTok token is a registered static definition', () => {
  assert.equal(TABLE_TALK_ASC_TOKENS.tiktok, TABLE_TALK_TIKTOK_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(TABLE_TALK_TIKTOK_CT));

  const resolved = campaignLinks.resolveTokenDefinition(TABLE_TALK_TIKTOK_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, TABLE_TALK_APP_ID);
  assert.equal(resolved.ct, TABLE_TALK_TIKTOK_CT);
  assert.equal(resolved.channel, 'tiktok');
  assert.equal(resolved.ppid, null);
});

test('Table Talk TikTok App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(TABLE_TALK_APP_ID, TABLE_TALK_ASC_TOKENS.tiktok);
  assert.equal(
    url,
    `https://apps.apple.com/app/id${TABLE_TALK_APP_ID}?pt=128970277&ct=${TABLE_TALK_TIKTOK_CT}&mt=8`,
  );
});

test('Table Talk X collector token is a registered static definition', () => {
  assert.equal(TABLE_TALK_ASC_TOKENS.xCollector, TABLE_TALK_X_COLLECTOR_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(TABLE_TALK_X_COLLECTOR_CT));

  const resolved = campaignLinks.resolveTokenDefinition(TABLE_TALK_X_COLLECTOR_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, TABLE_TALK_APP_ID);
  assert.equal(resolved.ct, TABLE_TALK_X_COLLECTOR_CT);
  assert.equal(resolved.channel, 'x');
  assert.equal(resolved.ppid, null);
});

test('Table Talk X collector App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(TABLE_TALK_APP_ID, TABLE_TALK_ASC_TOKENS.xCollector);
  assert.equal(
    url,
    `https://apps.apple.com/app/id${TABLE_TALK_APP_ID}?pt=128970277&ct=${TABLE_TALK_X_COLLECTOR_CT}&mt=8`,
  );
});

test('Table Talk X collector 2026-09-24 token is a registered static definition', () => {
  assert.equal(TABLE_TALK_ASC_TOKENS.xCollector20260924, TABLE_TALK_X_COLLECTOR_20260924_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(TABLE_TALK_X_COLLECTOR_20260924_CT));

  const resolved = campaignLinks.resolveTokenDefinition(TABLE_TALK_X_COLLECTOR_20260924_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, TABLE_TALK_APP_ID);
  assert.equal(resolved.ct, TABLE_TALK_X_COLLECTOR_20260924_CT);
  assert.equal(resolved.channel, 'x');
  assert.equal(resolved.path, 'x');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-24');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
});

test('Table Talk X collector 2026-09-24 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(TABLE_TALK_APP_ID, TABLE_TALK_ASC_TOKENS.xCollector20260924);
  assert.equal(
    url,
    `https://apps.apple.com/app/id${TABLE_TALK_APP_ID}?pt=128970277&ct=${TABLE_TALK_X_COLLECTOR_20260924_CT}&mt=8`,
  );
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
