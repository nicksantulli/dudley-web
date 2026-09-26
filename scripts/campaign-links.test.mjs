import test from 'node:test';
import assert from 'node:assert/strict';
import * as campaignLinks from '../src/lib/campaignLinks.mjs';

const {
  appStoreCampaignUrl,
  blogCampaignToken,
  tableTalkBlogCampaignToken,
  TABLE_TALK_ASC_TOKENS,
  LAST_HUMAN_ASC_TOKENS,
  ECONBYTE_ASC_TOKENS,
} = campaignLinks;

const TABLE_TALK_APP_ID = '6780714565';
const LAST_HUMAN_APP_ID = '6808782611';
const ECONBYTE_APP_ID = '6780714383';
const LAST_HUMAN_X_MEMO_20260925_CT = 'lh_x_memo_20260925';
const LAST_HUMAN_X_OFFLINE_20260925_CT = 'lh_x_offline_20260925';
const LAST_HUMAN_X_PROMO_FLOOR_20260928_CT = 'lh_promo_floor_x_20260928';
const LAST_HUMAN_X_PROMO_BOTS_20260929_CT = 'lh_promo_bots_x_20260929';
const LAST_HUMAN_X_PROMO_HR_20260930_CT = 'lh_promo_hr_x_20260930';
const LAST_HUMAN_TT_PROMO_FLOOR_20260928_CT = 'lh_promo_floor_tt_20260928';
const LAST_HUMAN_TT_PROMO_BOTS_20260929_CT = 'lh_promo_bots_tt_20260929';
const LAST_HUMAN_TT_PROMO_HR_20260930_CT = 'lh_promo_hr_tt_20260930';
const LAST_HUMAN_IG_PROMO_FLOOR_20260928_CT = 'lh_promo_floor_ig_20260928';
const LAST_HUMAN_IG_PROMO_BOTS_20260929_CT = 'lh_promo_bots_ig_20260929';
const LAST_HUMAN_IG_PROMO_HR_20260930_CT = 'lh_promo_hr_ig_20260930';
const LAST_HUMAN_OUTREACH_TOUCHARCADE_20260925_CT = 'lh_outreach_toucharcade_20260925';
const LAST_HUMAN_OUTREACH_POCKETGAMER_20260925_CT = 'lh_outreach_pocketgamer_20260925';
const LAST_HUMAN_OUTREACH_148APPS_20260925_CT = 'lh_outreach_148apps_20260925';
const ECONBYTE_OUTREACH_ECONEDLINK_20260925_CT = 'eb_outreach_econedlink_20260925';
const TABLE_TALK_OUTREACH_PARTYPRO_20260925_CT = 'tt_outreach_partypro_20260925';
const LAST_HUMAN_OUTREACH_INDIEDEVMONDAY_20260925_CT = 'da_outreach_indiedevmonday_lh_20260925';
const TABLE_TALK_OUTREACH_INDIEDEVMONDAY_20260925_CT = 'da_outreach_indiedevmonday_tt_20260925';
const TABLE_TALK_OUTREACH_TIDBITS_20260925_CT = 'tt_outreach_tidbits_20260925';
const TABLE_TALK_OUTREACH_MACSTORIES_20260925_CT = 'tt_outreach_macstories_20260925';
const LAST_HUMAN_OUTREACH_GAMEZEBO_20260925_CT = 'lh_outreach_gamezebo_20260925';
const LAST_HUMAN_OUTREACH_APPSPY_20260925_CT = 'lh_outreach_appspy_20260925';
const TABLE_TALK_OUTREACH_FAMILYDINNERPROJECT_20260925_CT = 'tt_outreach_familydinnerproject_20260925';
const TABLE_TALK_OUTREACH_SIXCOLORS_20260925_CT = 'tt_outreach_sixcolors_20260925';
const TABLE_TALK_OUTREACH_9TO5MAC_20260925_CT = 'da_outreach_9to5mac_tt_20260925';
const ECONBYTE_OUTREACH_9TO5MAC_20260925_CT = 'da_outreach_9to5mac_eb_20260925';
const SHARED_INDIEDEVMONDAY_CT = 'da_outreach_indiedevmonday_20260925';
const LAST_HUMAN_OUTREACH_CULTOFMAC_20260925_CT = 'lh_outreach_cultofmac_20260925';
const ECONBYTE_OUTREACH_MONEYGIRL_20260925_CT = 'eb_outreach_moneygirl_20260925';
const LAST_HUMAN_OUTREACH_INDIETOOLS_20260925_CT = 'lh_outreach_indietools_20260925';
const TABLE_TALK_OUTREACH_INDIETOOLS_20260925_CT = 'tt_outreach_indietools_20260925';
const ECONBYTE_OUTREACH_INDIETOOLS_20260925_CT = 'eb_outreach_indietools_20260925';
const STUDIO_OUTREACH_INDIETOOLS_20260925_CT = 'da_outreach_indietools_20260925';
const LAST_HUMAN_OUTREACH_SILICONERA_20260925_CT = 'lh_outreach_siliconera_20260925';
const ECONBYTE_OUTREACH_JUMPSTART_20260925_CT = 'eb_outreach_jumpstart_20260925';
const ECONBYTE_OUTREACH_NGPF_20260925_CT = 'eb_outreach_ngpf_20260925';
const TABLE_TALK_OUTREACH_MSEXTENSION_20260925_CT = 'tt_outreach_msextension_20260925';
const ECONBYTE_OUTREACH_FREDED_20260925_CT = 'eb_outreach_freded_20260925';
const ECONBYTE_OUTREACH_EDSHELF_20260925_CT = 'eb_outreach_edshelf_20260925';
const LAST_HUMAN_OUTREACH_LAUNCHFREE_20260925_CT = 'lh_outreach_launchfree_20260925';
const TABLE_TALK_OUTREACH_LAUNCHFREE_20260925_CT = 'tt_outreach_launchfree_20260925';
const ECONBYTE_OUTREACH_LAUNCHFREE_20260925_CT = 'eb_outreach_launchfree_20260925';
const STUDIO_OUTREACH_LAUNCHFREE_20260925_CT = 'da_outreach_launchfree_20260925';
const ECONBYTE_OUTREACH_LEARNAMIC_20260925_CT = 'eb_outreach_learnamic_20260925';
const TABLE_TALK_OUTREACH_MONEYPRODIGY_20260925_CT = 'tt_outreach_moneyprodigy_20260925';
const LAST_HUMAN_OUTREACH_VIBBLELAUNCH_20260925_CT = 'lh_outreach_vibblelaunch_20260925';
const TABLE_TALK_OUTREACH_VIBBLELAUNCH_20260925_CT = 'tt_outreach_vibblelaunch_20260925';
const ECONBYTE_OUTREACH_VIBBLELAUNCH_20260925_CT = 'eb_outreach_vibblelaunch_20260925';
const STUDIO_OUTREACH_VIBBLELAUNCH_20260925_CT = 'da_outreach_vibblelaunch_20260925';
const TABLE_TALK_OUTREACH_GOURMETHOST_20260925_CT = 'tt_outreach_gourmethost_20260925';
const TABLE_TALK_OUTREACH_BGBARRAGE_20260925_CT = 'tt_outreach_bgbarrage_20260925';
const TABLE_TALK_OUTREACH_DINNERPLAN_20260925_CT = 'tt_outreach_dinnerplan_20260925';
const TABLE_TALK_OUTREACH_BETTYEATZ_20260925_CT = 'tt_outreach_bettyeatz_20260925';
const TABLE_TALK_OUTREACH_COMMONSENSEMEDIA_20260925_CT = 'tt_outreach_commonsensemedia_20260925';
const TABLE_TALK_OUTREACH_APPADDICT_20260925_CT = 'tt_outreach_appaddict_20260925';
const TABLE_TALK_OUTREACH_IDOWNLOADBLOG_20260925_CT = 'tt_outreach_idownloadblog_20260925';
const TABLE_TALK_OUTREACH_WHILEENTERTAINING_20260925_CT = 'tt_outreach_whileentertaining_20260925';
const LAST_HUMAN_OUTREACH_KODECO_20260925_CT = 'lh_outreach_kodeco_20260925';
const LAST_HUMAN_OUTREACH_LAUNCHED_20260925_CT = 'lh_outreach_launched_20260925';
const LAST_HUMAN_PRESS_COMPILESWIFT_20260926_CT = 'lh_press_compileswift_20260926';
const LAST_HUMAN_PRESS_GAMIGION_20260926_CT = 'lh_press_gamigion_20260926';
const TABLE_TALK_PRESS_DICETOWER_20260926_CT = 'tt_press_dicetower_20260926';
const ECONBYTE_OUTREACH_TEACHERMONEY_20260925_CT = 'eb_outreach_teachermoney_20260925';
const PHONE_IN_THE_MIDDLE_SLUG = 'phone-in-the-middle';
const PHONE_IN_THE_MIDDLE_CT = 'tt-web-blog-phone-in-the-middle-sep26-v1';
const TABLE_TALK_TIKTOK_CT = 'tabletalk-tiktok-20260910';
const TABLE_TALK_X_COLLECTOR_CT = 'tabletalk-x-collector-20260914';
const TABLE_TALK_X_COLLECTOR_20260924_CT = 'tabletalk-x-collector-20260924';
const TABLE_TALK_X_PROMO_SQUARE_20261001_CT = 'tt_promo_square_x_20261001';
const TABLE_TALK_TT_PROMO_SQUARE_20261001_CT = 'tt_promo_square_tt_20261001';
const TABLE_TALK_IG_PROMO_SQUARE_20261001_CT = 'tt_promo_square_ig_20261001';
const ECONBYTE_X_PROMO_SQUARE_20261002_CT = 'eb_promo_square_x_20261002';
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
    xMemo20260925: LAST_HUMAN_X_MEMO_20260925_CT,
    xOffline20260925: LAST_HUMAN_X_OFFLINE_20260925_CT,
    xPromoFloor20260928: LAST_HUMAN_X_PROMO_FLOOR_20260928_CT,
    xPromoBots20260929: LAST_HUMAN_X_PROMO_BOTS_20260929_CT,
    xPromoHr20260930: LAST_HUMAN_X_PROMO_HR_20260930_CT,
    ttPromoFloor20260928: LAST_HUMAN_TT_PROMO_FLOOR_20260928_CT,
    ttPromoBots20260929: LAST_HUMAN_TT_PROMO_BOTS_20260929_CT,
    ttPromoHr20260930: LAST_HUMAN_TT_PROMO_HR_20260930_CT,
    igPromoFloor20260928: LAST_HUMAN_IG_PROMO_FLOOR_20260928_CT,
    igPromoBots20260929: LAST_HUMAN_IG_PROMO_BOTS_20260929_CT,
    igPromoHr20260930: LAST_HUMAN_IG_PROMO_HR_20260930_CT,
    outreachToucharcade20260925: LAST_HUMAN_OUTREACH_TOUCHARCADE_20260925_CT,
    outreachIndieDevMonday20260925: LAST_HUMAN_OUTREACH_INDIEDEVMONDAY_20260925_CT,
    outreachPocketgamer20260925: LAST_HUMAN_OUTREACH_POCKETGAMER_20260925_CT,
    outreach148apps20260925: LAST_HUMAN_OUTREACH_148APPS_20260925_CT,
    outreachCultofmac20260925: LAST_HUMAN_OUTREACH_CULTOFMAC_20260925_CT,
    outreachIndietools20260925: LAST_HUMAN_OUTREACH_INDIETOOLS_20260925_CT,
    outreachGamezebo20260925: LAST_HUMAN_OUTREACH_GAMEZEBO_20260925_CT,
    outreachAppspy20260925: LAST_HUMAN_OUTREACH_APPSPY_20260925_CT,
    outreachSiliconera20260925: LAST_HUMAN_OUTREACH_SILICONERA_20260925_CT,
    outreachLaunchfree20260925: LAST_HUMAN_OUTREACH_LAUNCHFREE_20260925_CT,
    outreachVibblelaunch20260925: LAST_HUMAN_OUTREACH_VIBBLELAUNCH_20260925_CT,
    outreachKodeco20260925: LAST_HUMAN_OUTREACH_KODECO_20260925_CT,
    outreachLaunched20260925: LAST_HUMAN_OUTREACH_LAUNCHED_20260925_CT,
    pressCompileswift20260926: LAST_HUMAN_PRESS_COMPILESWIFT_20260926_CT,
    pressGamigion20260926: LAST_HUMAN_PRESS_GAMIGION_20260926_CT,
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

test('Table Talk X square promo 2026-10-01 token is a registered static definition', () => {
  assert.equal(TABLE_TALK_ASC_TOKENS.xPromoSquare20261001, TABLE_TALK_X_PROMO_SQUARE_20261001_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(TABLE_TALK_X_PROMO_SQUARE_20261001_CT));

  const resolved = campaignLinks.resolveTokenDefinition(TABLE_TALK_X_PROMO_SQUARE_20261001_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, TABLE_TALK_APP_ID);
  assert.equal(resolved.ct, TABLE_TALK_X_PROMO_SQUARE_20261001_CT);
  assert.equal(resolved.channel, 'x');
  assert.equal(resolved.path, 'x');
  assert.equal(resolved.surface, 'X original Table Talk square promo 2026-10-01');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
});

test('Table Talk X square promo 2026-10-01 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(TABLE_TALK_APP_ID, TABLE_TALK_ASC_TOKENS.xPromoSquare20261001);
  assert.equal(
    url,
    `https://apps.apple.com/app/id${TABLE_TALK_APP_ID}?pt=128970277&ct=${TABLE_TALK_X_PROMO_SQUARE_20261001_CT}&mt=8`,
  );
});

test('Table Talk TikTok square promo 2026-10-01 token is a registered static definition', () => {
  assert.equal(TABLE_TALK_ASC_TOKENS.ttPromoSquare20261001, TABLE_TALK_TT_PROMO_SQUARE_20261001_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(TABLE_TALK_TT_PROMO_SQUARE_20261001_CT));

  const resolved = campaignLinks.resolveTokenDefinition(TABLE_TALK_TT_PROMO_SQUARE_20261001_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, TABLE_TALK_APP_ID);
  assert.equal(resolved.ct, TABLE_TALK_TT_PROMO_SQUARE_20261001_CT);
  assert.equal(resolved.channel, 'tiktok');
  assert.equal(resolved.path, 'tiktok');
  assert.equal(resolved.surface, 'TikTok Table Talk square promo 2026-10-01');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
});

test('Table Talk TikTok square promo 2026-10-01 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(TABLE_TALK_APP_ID, TABLE_TALK_ASC_TOKENS.ttPromoSquare20261001);
  assert.equal(
    url,
    `https://apps.apple.com/app/id${TABLE_TALK_APP_ID}?pt=128970277&ct=${TABLE_TALK_TT_PROMO_SQUARE_20261001_CT}&mt=8`,
  );
});

test('Table Talk Instagram square promo 2026-10-01 token is a registered static definition', () => {
  assert.equal(TABLE_TALK_ASC_TOKENS.igPromoSquare20261001, TABLE_TALK_IG_PROMO_SQUARE_20261001_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(TABLE_TALK_IG_PROMO_SQUARE_20261001_CT));

  const resolved = campaignLinks.resolveTokenDefinition(TABLE_TALK_IG_PROMO_SQUARE_20261001_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, TABLE_TALK_APP_ID);
  assert.equal(resolved.ct, TABLE_TALK_IG_PROMO_SQUARE_20261001_CT);
  assert.equal(resolved.channel, 'instagram');
  assert.equal(resolved.path, 'instagram');
  assert.equal(resolved.surface, 'Instagram Reel Table Talk square promo 2026-10-01');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
});

test('Table Talk Instagram square promo 2026-10-01 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(TABLE_TALK_APP_ID, TABLE_TALK_ASC_TOKENS.igPromoSquare20261001);
  assert.equal(
    url,
    `https://apps.apple.com/app/id${TABLE_TALK_APP_ID}?pt=128970277&ct=${TABLE_TALK_IG_PROMO_SQUARE_20261001_CT}&mt=8`,
  );
});

test('EconByte X square promo 2026-10-02 token is a registered static definition', () => {
  assert.equal(ECONBYTE_ASC_TOKENS.xPromoSquare20261002, ECONBYTE_X_PROMO_SQUARE_20261002_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(ECONBYTE_X_PROMO_SQUARE_20261002_CT));

  const resolved = campaignLinks.resolveTokenDefinition(ECONBYTE_X_PROMO_SQUARE_20261002_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, ECONBYTE_APP_ID);
  assert.equal(resolved.ct, ECONBYTE_X_PROMO_SQUARE_20261002_CT);
  assert.equal(resolved.channel, 'x');
  assert.equal(resolved.path, 'x');
  assert.equal(resolved.surface, 'X original EconByte square promo 2026-10-02');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
});

test('EconByte X square promo 2026-10-02 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(ECONBYTE_APP_ID, ECONBYTE_ASC_TOKENS.xPromoSquare20261002);
  assert.equal(
    url,
    `https://apps.apple.com/app/id${ECONBYTE_APP_ID}?pt=128970277&ct=${ECONBYTE_X_PROMO_SQUARE_20261002_CT}&mt=8`,
  );
});

test('Last Human X memo 2026-09-25 token is a registered static definition', () => {
  assert.equal(LAST_HUMAN_ASC_TOKENS.xMemo20260925, LAST_HUMAN_X_MEMO_20260925_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(LAST_HUMAN_X_MEMO_20260925_CT));

  const resolved = campaignLinks.resolveTokenDefinition(LAST_HUMAN_X_MEMO_20260925_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, LAST_HUMAN_APP_ID);
  assert.equal(resolved.ct, LAST_HUMAN_X_MEMO_20260925_CT);
  assert.equal(resolved.channel, 'x');
  assert.equal(resolved.path, 'x');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
});

test('Last Human X memo 2026-09-25 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(LAST_HUMAN_APP_ID, LAST_HUMAN_ASC_TOKENS.xMemo20260925);
  assert.equal(
    url,
    `https://apps.apple.com/us/app/last-human-dodge-the-bots/id${LAST_HUMAN_APP_ID}?pt=128970277&ct=${LAST_HUMAN_X_MEMO_20260925_CT}&mt=8`,
  );
});

test('Last Human X offline 2026-09-25 token is a registered static definition', () => {
  assert.equal(LAST_HUMAN_ASC_TOKENS.xOffline20260925, LAST_HUMAN_X_OFFLINE_20260925_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(LAST_HUMAN_X_OFFLINE_20260925_CT));

  const resolved = campaignLinks.resolveTokenDefinition(LAST_HUMAN_X_OFFLINE_20260925_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, LAST_HUMAN_APP_ID);
  assert.equal(resolved.ct, LAST_HUMAN_X_OFFLINE_20260925_CT);
  assert.equal(resolved.channel, 'x');
  assert.equal(resolved.path, 'x');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
});

test('Last Human X offline 2026-09-25 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(LAST_HUMAN_APP_ID, LAST_HUMAN_ASC_TOKENS.xOffline20260925);
  assert.equal(
    url,
    `https://apps.apple.com/us/app/last-human-dodge-the-bots/id${LAST_HUMAN_APP_ID}?pt=128970277&ct=${LAST_HUMAN_X_OFFLINE_20260925_CT}&mt=8`,
  );
});

test('Last Human X floor promo 2026-09-28 token is a registered static definition', () => {
  assert.equal(LAST_HUMAN_ASC_TOKENS.xPromoFloor20260928, LAST_HUMAN_X_PROMO_FLOOR_20260928_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(LAST_HUMAN_X_PROMO_FLOOR_20260928_CT));

  const resolved = campaignLinks.resolveTokenDefinition(LAST_HUMAN_X_PROMO_FLOOR_20260928_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, LAST_HUMAN_APP_ID);
  assert.equal(resolved.ct, LAST_HUMAN_X_PROMO_FLOOR_20260928_CT);
  assert.equal(resolved.channel, 'x');
  assert.equal(resolved.path, 'x');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-28');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
});

test('Last Human X floor promo 2026-09-28 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(LAST_HUMAN_APP_ID, LAST_HUMAN_ASC_TOKENS.xPromoFloor20260928);
  assert.equal(
    url,
    `https://apps.apple.com/us/app/last-human-dodge-the-bots/id${LAST_HUMAN_APP_ID}?pt=128970277&ct=${LAST_HUMAN_X_PROMO_FLOOR_20260928_CT}&mt=8`,
  );
});

test('Last Human X bots promo 2026-09-29 token is a registered static definition', () => {
  assert.equal(LAST_HUMAN_ASC_TOKENS.xPromoBots20260929, LAST_HUMAN_X_PROMO_BOTS_20260929_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(LAST_HUMAN_X_PROMO_BOTS_20260929_CT));

  const resolved = campaignLinks.resolveTokenDefinition(LAST_HUMAN_X_PROMO_BOTS_20260929_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, LAST_HUMAN_APP_ID);
  assert.equal(resolved.ct, LAST_HUMAN_X_PROMO_BOTS_20260929_CT);
  assert.equal(resolved.channel, 'x');
  assert.equal(resolved.path, 'x');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-29');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
});

test('Last Human X bots promo 2026-09-29 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(LAST_HUMAN_APP_ID, LAST_HUMAN_ASC_TOKENS.xPromoBots20260929);
  assert.equal(
    url,
    `https://apps.apple.com/us/app/last-human-dodge-the-bots/id${LAST_HUMAN_APP_ID}?pt=128970277&ct=${LAST_HUMAN_X_PROMO_BOTS_20260929_CT}&mt=8`,
  );
});

test('Last Human X hr promo 2026-09-30 token is a registered static definition', () => {
  assert.equal(LAST_HUMAN_ASC_TOKENS.xPromoHr20260930, LAST_HUMAN_X_PROMO_HR_20260930_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(LAST_HUMAN_X_PROMO_HR_20260930_CT));

  const resolved = campaignLinks.resolveTokenDefinition(LAST_HUMAN_X_PROMO_HR_20260930_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, LAST_HUMAN_APP_ID);
  assert.equal(resolved.ct, LAST_HUMAN_X_PROMO_HR_20260930_CT);
  assert.equal(resolved.channel, 'x');
  assert.equal(resolved.path, 'x');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-30');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
});

test('Last Human X hr promo 2026-09-30 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(LAST_HUMAN_APP_ID, LAST_HUMAN_ASC_TOKENS.xPromoHr20260930);
  assert.equal(
    url,
    `https://apps.apple.com/us/app/last-human-dodge-the-bots/id${LAST_HUMAN_APP_ID}?pt=128970277&ct=${LAST_HUMAN_X_PROMO_HR_20260930_CT}&mt=8`,
  );
});

test('Last Human TikTok floor promo 2026-09-28 token is a registered static definition', () => {
  assert.equal(LAST_HUMAN_ASC_TOKENS.ttPromoFloor20260928, LAST_HUMAN_TT_PROMO_FLOOR_20260928_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(LAST_HUMAN_TT_PROMO_FLOOR_20260928_CT));

  const resolved = campaignLinks.resolveTokenDefinition(LAST_HUMAN_TT_PROMO_FLOOR_20260928_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, LAST_HUMAN_APP_ID);
  assert.equal(resolved.ct, LAST_HUMAN_TT_PROMO_FLOOR_20260928_CT);
  assert.equal(resolved.channel, 'tiktok');
  assert.equal(resolved.path, 'tiktok');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-28');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
});

test('Last Human TikTok floor promo 2026-09-28 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(LAST_HUMAN_APP_ID, LAST_HUMAN_ASC_TOKENS.ttPromoFloor20260928);
  assert.equal(
    url,
    `https://apps.apple.com/us/app/last-human-dodge-the-bots/id${LAST_HUMAN_APP_ID}?pt=128970277&ct=${LAST_HUMAN_TT_PROMO_FLOOR_20260928_CT}&mt=8`,
  );
});

test('Last Human TikTok bots promo 2026-09-29 token is a registered static definition', () => {
  assert.equal(LAST_HUMAN_ASC_TOKENS.ttPromoBots20260929, LAST_HUMAN_TT_PROMO_BOTS_20260929_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(LAST_HUMAN_TT_PROMO_BOTS_20260929_CT));

  const resolved = campaignLinks.resolveTokenDefinition(LAST_HUMAN_TT_PROMO_BOTS_20260929_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, LAST_HUMAN_APP_ID);
  assert.equal(resolved.ct, LAST_HUMAN_TT_PROMO_BOTS_20260929_CT);
  assert.equal(resolved.channel, 'tiktok');
  assert.equal(resolved.path, 'tiktok');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-29');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
});

test('Last Human TikTok bots promo 2026-09-29 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(LAST_HUMAN_APP_ID, LAST_HUMAN_ASC_TOKENS.ttPromoBots20260929);
  assert.equal(
    url,
    `https://apps.apple.com/us/app/last-human-dodge-the-bots/id${LAST_HUMAN_APP_ID}?pt=128970277&ct=${LAST_HUMAN_TT_PROMO_BOTS_20260929_CT}&mt=8`,
  );
});

test('Last Human TikTok hr promo 2026-09-30 token is a registered static definition', () => {
  assert.equal(LAST_HUMAN_ASC_TOKENS.ttPromoHr20260930, LAST_HUMAN_TT_PROMO_HR_20260930_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(LAST_HUMAN_TT_PROMO_HR_20260930_CT));

  const resolved = campaignLinks.resolveTokenDefinition(LAST_HUMAN_TT_PROMO_HR_20260930_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, LAST_HUMAN_APP_ID);
  assert.equal(resolved.ct, LAST_HUMAN_TT_PROMO_HR_20260930_CT);
  assert.equal(resolved.channel, 'tiktok');
  assert.equal(resolved.path, 'tiktok');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-30');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
});

test('Last Human TikTok hr promo 2026-09-30 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(LAST_HUMAN_APP_ID, LAST_HUMAN_ASC_TOKENS.ttPromoHr20260930);
  assert.equal(
    url,
    `https://apps.apple.com/us/app/last-human-dodge-the-bots/id${LAST_HUMAN_APP_ID}?pt=128970277&ct=${LAST_HUMAN_TT_PROMO_HR_20260930_CT}&mt=8`,
  );
});

test('Last Human Instagram floor promo 2026-09-28 token is a registered static definition', () => {
  assert.equal(LAST_HUMAN_ASC_TOKENS.igPromoFloor20260928, LAST_HUMAN_IG_PROMO_FLOOR_20260928_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(LAST_HUMAN_IG_PROMO_FLOOR_20260928_CT));

  const resolved = campaignLinks.resolveTokenDefinition(LAST_HUMAN_IG_PROMO_FLOOR_20260928_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, LAST_HUMAN_APP_ID);
  assert.equal(resolved.ct, LAST_HUMAN_IG_PROMO_FLOOR_20260928_CT);
  assert.equal(resolved.channel, 'instagram');
  assert.equal(resolved.path, 'instagram');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-28');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
});

test('Last Human Instagram floor promo 2026-09-28 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(LAST_HUMAN_APP_ID, LAST_HUMAN_ASC_TOKENS.igPromoFloor20260928);
  assert.equal(
    url,
    `https://apps.apple.com/us/app/last-human-dodge-the-bots/id${LAST_HUMAN_APP_ID}?pt=128970277&ct=${LAST_HUMAN_IG_PROMO_FLOOR_20260928_CT}&mt=8`,
  );
});

test('Last Human Instagram bots promo 2026-09-29 token is a registered static definition', () => {
  assert.equal(LAST_HUMAN_ASC_TOKENS.igPromoBots20260929, LAST_HUMAN_IG_PROMO_BOTS_20260929_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(LAST_HUMAN_IG_PROMO_BOTS_20260929_CT));

  const resolved = campaignLinks.resolveTokenDefinition(LAST_HUMAN_IG_PROMO_BOTS_20260929_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, LAST_HUMAN_APP_ID);
  assert.equal(resolved.ct, LAST_HUMAN_IG_PROMO_BOTS_20260929_CT);
  assert.equal(resolved.channel, 'instagram');
  assert.equal(resolved.path, 'instagram');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-29');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
});

test('Last Human Instagram bots promo 2026-09-29 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(LAST_HUMAN_APP_ID, LAST_HUMAN_ASC_TOKENS.igPromoBots20260929);
  assert.equal(
    url,
    `https://apps.apple.com/us/app/last-human-dodge-the-bots/id${LAST_HUMAN_APP_ID}?pt=128970277&ct=${LAST_HUMAN_IG_PROMO_BOTS_20260929_CT}&mt=8`,
  );
});

test('Last Human Instagram hr promo 2026-09-30 token is a registered static definition', () => {
  assert.equal(LAST_HUMAN_ASC_TOKENS.igPromoHr20260930, LAST_HUMAN_IG_PROMO_HR_20260930_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(LAST_HUMAN_IG_PROMO_HR_20260930_CT));

  const resolved = campaignLinks.resolveTokenDefinition(LAST_HUMAN_IG_PROMO_HR_20260930_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, LAST_HUMAN_APP_ID);
  assert.equal(resolved.ct, LAST_HUMAN_IG_PROMO_HR_20260930_CT);
  assert.equal(resolved.channel, 'instagram');
  assert.equal(resolved.path, 'instagram');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-30');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
});

test('Last Human Instagram hr promo 2026-09-30 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(LAST_HUMAN_APP_ID, LAST_HUMAN_ASC_TOKENS.igPromoHr20260930);
  assert.equal(
    url,
    `https://apps.apple.com/us/app/last-human-dodge-the-bots/id${LAST_HUMAN_APP_ID}?pt=128970277&ct=${LAST_HUMAN_IG_PROMO_HR_20260930_CT}&mt=8`,
  );
});

test('Last Human TouchArcade outreach 2026-09-25 token is a registered static definition', () => {
  assert.equal(LAST_HUMAN_ASC_TOKENS.outreachToucharcade20260925, LAST_HUMAN_OUTREACH_TOUCHARCADE_20260925_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(LAST_HUMAN_OUTREACH_TOUCHARCADE_20260925_CT));

  const resolved = campaignLinks.resolveTokenDefinition(LAST_HUMAN_OUTREACH_TOUCHARCADE_20260925_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, LAST_HUMAN_APP_ID);
  assert.equal(resolved.ct, LAST_HUMAN_OUTREACH_TOUCHARCADE_20260925_CT);
  assert.equal(resolved.channel, 'email');
  assert.equal(resolved.path, 'email');
  assert.equal(resolved.surface, 'Email outreach TouchArcade tips@ (Last Human)');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
  assert.equal(campaignLinks.CT_TO_APP_ID[LAST_HUMAN_OUTREACH_TOUCHARCADE_20260925_CT], LAST_HUMAN_APP_ID);
});

test('Last Human TouchArcade outreach 2026-09-25 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(LAST_HUMAN_APP_ID, LAST_HUMAN_ASC_TOKENS.outreachToucharcade20260925);
  assert.equal(
    url,
    `https://apps.apple.com/us/app/last-human-dodge-the-bots/id${LAST_HUMAN_APP_ID}?pt=128970277&ct=${LAST_HUMAN_OUTREACH_TOUCHARCADE_20260925_CT}&mt=8`,
  );
});

test('Table Talk party.pro outreach 2026-09-25 token is a registered static definition', () => {
  assert.equal(TABLE_TALK_ASC_TOKENS.outreachPartypro20260925, TABLE_TALK_OUTREACH_PARTYPRO_20260925_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(TABLE_TALK_OUTREACH_PARTYPRO_20260925_CT));

  const resolved = campaignLinks.resolveTokenDefinition(TABLE_TALK_OUTREACH_PARTYPRO_20260925_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, TABLE_TALK_APP_ID);
  assert.equal(resolved.ct, TABLE_TALK_OUTREACH_PARTYPRO_20260925_CT);
  assert.equal(resolved.channel, 'email');
  assert.equal(resolved.path, 'email');
  assert.equal(resolved.surface, 'Email outreach party.pro Nick Gray (Table Talk)');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
  assert.equal(campaignLinks.CT_TO_APP_ID[TABLE_TALK_OUTREACH_PARTYPRO_20260925_CT], TABLE_TALK_APP_ID);
});

test('Table Talk party.pro outreach 2026-09-25 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(TABLE_TALK_APP_ID, TABLE_TALK_ASC_TOKENS.outreachPartypro20260925);
  assert.equal(
    url,
    `https://apps.apple.com/app/id${TABLE_TALK_APP_ID}?pt=128970277&ct=${TABLE_TALK_OUTREACH_PARTYPRO_20260925_CT}&mt=8`,
  );
});

test('Indie Dev Monday Last Human outreach 2026-09-25 token is a registered static definition', () => {
  assert.equal(LAST_HUMAN_ASC_TOKENS.outreachIndieDevMonday20260925, LAST_HUMAN_OUTREACH_INDIEDEVMONDAY_20260925_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(LAST_HUMAN_OUTREACH_INDIEDEVMONDAY_20260925_CT));

  const resolved = campaignLinks.resolveTokenDefinition(LAST_HUMAN_OUTREACH_INDIEDEVMONDAY_20260925_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, LAST_HUMAN_APP_ID);
  assert.equal(resolved.ct, LAST_HUMAN_OUTREACH_INDIEDEVMONDAY_20260925_CT);
  assert.equal(resolved.channel, 'email');
  assert.equal(resolved.path, 'email');
  assert.equal(resolved.surface, 'Email outreach Indie Dev Monday Look At Me (Last Human link in studio pitch)');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
  assert.equal(campaignLinks.CT_TO_APP_ID[LAST_HUMAN_OUTREACH_INDIEDEVMONDAY_20260925_CT], LAST_HUMAN_APP_ID);
});

test('Indie Dev Monday Last Human outreach 2026-09-25 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(LAST_HUMAN_APP_ID, LAST_HUMAN_ASC_TOKENS.outreachIndieDevMonday20260925);
  assert.equal(
    url,
    `https://apps.apple.com/us/app/last-human-dodge-the-bots/id${LAST_HUMAN_APP_ID}?pt=128970277&ct=${LAST_HUMAN_OUTREACH_INDIEDEVMONDAY_20260925_CT}&mt=8`,
  );
});

test('Indie Dev Monday Table Talk outreach 2026-09-25 token is a registered static definition', () => {
  assert.equal(TABLE_TALK_ASC_TOKENS.outreachIndieDevMonday20260925, TABLE_TALK_OUTREACH_INDIEDEVMONDAY_20260925_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(TABLE_TALK_OUTREACH_INDIEDEVMONDAY_20260925_CT));

  const resolved = campaignLinks.resolveTokenDefinition(TABLE_TALK_OUTREACH_INDIEDEVMONDAY_20260925_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, TABLE_TALK_APP_ID);
  assert.equal(resolved.ct, TABLE_TALK_OUTREACH_INDIEDEVMONDAY_20260925_CT);
  assert.equal(resolved.channel, 'email');
  assert.equal(resolved.path, 'email');
  assert.equal(resolved.surface, 'Email outreach Indie Dev Monday Look At Me (Table Talk link in studio pitch)');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
  assert.equal(campaignLinks.CT_TO_APP_ID[TABLE_TALK_OUTREACH_INDIEDEVMONDAY_20260925_CT], TABLE_TALK_APP_ID);
});

test('Indie Dev Monday Table Talk outreach 2026-09-25 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(TABLE_TALK_APP_ID, TABLE_TALK_ASC_TOKENS.outreachIndieDevMonday20260925);
  assert.equal(
    url,
    `https://apps.apple.com/app/id${TABLE_TALK_APP_ID}?pt=128970277&ct=${TABLE_TALK_OUTREACH_INDIEDEVMONDAY_20260925_CT}&mt=8`,
  );
});

test('Last Human Pocket Gamer outreach 2026-09-25 token is a registered static definition', () => {
  assert.equal(LAST_HUMAN_ASC_TOKENS.outreachPocketgamer20260925, LAST_HUMAN_OUTREACH_POCKETGAMER_20260925_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(LAST_HUMAN_OUTREACH_POCKETGAMER_20260925_CT));

  const resolved = campaignLinks.resolveTokenDefinition(LAST_HUMAN_OUTREACH_POCKETGAMER_20260925_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, LAST_HUMAN_APP_ID);
  assert.equal(resolved.ct, LAST_HUMAN_OUTREACH_POCKETGAMER_20260925_CT);
  assert.equal(resolved.channel, 'email');
  assert.equal(resolved.path, 'email');
  assert.equal(resolved.surface, 'Email outreach Pocket Gamer reviews@ (Last Human review tip)');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
  assert.equal(campaignLinks.CT_TO_APP_ID[LAST_HUMAN_OUTREACH_POCKETGAMER_20260925_CT], LAST_HUMAN_APP_ID);
});

test('Last Human Pocket Gamer outreach 2026-09-25 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(LAST_HUMAN_APP_ID, LAST_HUMAN_ASC_TOKENS.outreachPocketgamer20260925);
  assert.equal(
    url,
    `https://apps.apple.com/us/app/last-human-dodge-the-bots/id${LAST_HUMAN_APP_ID}?pt=128970277&ct=${LAST_HUMAN_OUTREACH_POCKETGAMER_20260925_CT}&mt=8`,
  );
});

test('Last Human 148 Apps outreach 2026-09-25 token is a registered static definition', () => {
  assert.equal(LAST_HUMAN_ASC_TOKENS.outreach148apps20260925, LAST_HUMAN_OUTREACH_148APPS_20260925_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(LAST_HUMAN_OUTREACH_148APPS_20260925_CT));

  const resolved = campaignLinks.resolveTokenDefinition(LAST_HUMAN_OUTREACH_148APPS_20260925_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, LAST_HUMAN_APP_ID);
  assert.equal(resolved.ct, LAST_HUMAN_OUTREACH_148APPS_20260925_CT);
  assert.equal(resolved.channel, 'email');
  assert.equal(resolved.path, 'email');
  assert.equal(resolved.surface, 'Email outreach 148 Apps Campbell Bird (Last Human app review submit)');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
  assert.equal(campaignLinks.CT_TO_APP_ID[LAST_HUMAN_OUTREACH_148APPS_20260925_CT], LAST_HUMAN_APP_ID);
});

test('Last Human 148 Apps outreach 2026-09-25 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(LAST_HUMAN_APP_ID, LAST_HUMAN_ASC_TOKENS.outreach148apps20260925);
  assert.equal(
    url,
    `https://apps.apple.com/us/app/last-human-dodge-the-bots/id${LAST_HUMAN_APP_ID}?pt=128970277&ct=${LAST_HUMAN_OUTREACH_148APPS_20260925_CT}&mt=8`,
  );
});

test('EconByte EconEdLink outreach 2026-09-25 token is a registered static definition', () => {
  assert.equal(ECONBYTE_ASC_TOKENS.outreachEconedlink20260925, ECONBYTE_OUTREACH_ECONEDLINK_20260925_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(ECONBYTE_OUTREACH_ECONEDLINK_20260925_CT));

  const resolved = campaignLinks.resolveTokenDefinition(ECONBYTE_OUTREACH_ECONEDLINK_20260925_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, ECONBYTE_APP_ID);
  assert.equal(resolved.ct, ECONBYTE_OUTREACH_ECONEDLINK_20260925_CT);
  assert.equal(resolved.channel, 'email');
  assert.equal(resolved.path, 'email');
  assert.equal(resolved.surface, 'Email outreach EconEdLink / Council for Economic Education press (literacy and classroom framing)');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
  assert.equal(campaignLinks.CT_TO_APP_ID[ECONBYTE_OUTREACH_ECONEDLINK_20260925_CT], ECONBYTE_APP_ID);
});

test('EconByte EconEdLink outreach 2026-09-25 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(ECONBYTE_APP_ID, ECONBYTE_ASC_TOKENS.outreachEconedlink20260925);
  assert.equal(
    url,
    `https://apps.apple.com/app/id${ECONBYTE_APP_ID}?pt=128970277&ct=${ECONBYTE_OUTREACH_ECONEDLINK_20260925_CT}&mt=8`,
  );
});

test('shared Indie Dev Monday ct is not registered', () => {
  assert.equal(campaignLinks.ALL_REGISTERED_TOKENS.includes(SHARED_INDIEDEVMONDAY_CT), false);
  assert.equal(campaignLinks.resolveTokenDefinition(SHARED_INDIEDEVMONDAY_CT), null);
  assert.equal(campaignLinks.CT_TO_APP_ID[SHARED_INDIEDEVMONDAY_CT], undefined);
});

test('Table Talk TidBITS outreach 2026-09-25 token is a registered static definition', () => {
  assert.equal(TABLE_TALK_ASC_TOKENS.outreachTidbits20260925, TABLE_TALK_OUTREACH_TIDBITS_20260925_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(TABLE_TALK_OUTREACH_TIDBITS_20260925_CT));

  const resolved = campaignLinks.resolveTokenDefinition(TABLE_TALK_OUTREACH_TIDBITS_20260925_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, TABLE_TALK_APP_ID);
  assert.equal(resolved.ct, TABLE_TALK_OUTREACH_TIDBITS_20260925_CT);
  assert.equal(resolved.channel, 'email');
  assert.equal(resolved.path, 'email');
  assert.equal(resolved.surface, 'Email outreach TidBITS ace@tidbits.com (Table Talk utility, not a game)');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
  assert.equal(campaignLinks.CT_TO_APP_ID[TABLE_TALK_OUTREACH_TIDBITS_20260925_CT], TABLE_TALK_APP_ID);
});

test('Table Talk TidBITS outreach 2026-09-25 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(TABLE_TALK_APP_ID, TABLE_TALK_ASC_TOKENS.outreachTidbits20260925);
  assert.equal(
    url,
    `https://apps.apple.com/app/id${TABLE_TALK_APP_ID}?pt=128970277&ct=${TABLE_TALK_OUTREACH_TIDBITS_20260925_CT}&mt=8`,
  );
});

test('Table Talk MacStories outreach 2026-09-25 token is a registered static definition', () => {
  assert.equal(TABLE_TALK_ASC_TOKENS.outreachMacstories20260925, TABLE_TALK_OUTREACH_MACSTORIES_20260925_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(TABLE_TALK_OUTREACH_MACSTORIES_20260925_CT));

  const resolved = campaignLinks.resolveTokenDefinition(TABLE_TALK_OUTREACH_MACSTORIES_20260925_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, TABLE_TALK_APP_ID);
  assert.equal(resolved.ct, TABLE_TALK_OUTREACH_MACSTORIES_20260925_CT);
  assert.equal(resolved.channel, 'email');
  assert.equal(resolved.path, 'email');
  assert.equal(resolved.surface, 'Email outreach MacStories voorhees@macstories.net (Table Talk coverage consideration)');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
  assert.equal(campaignLinks.CT_TO_APP_ID[TABLE_TALK_OUTREACH_MACSTORIES_20260925_CT], TABLE_TALK_APP_ID);
});

test('Table Talk MacStories outreach 2026-09-25 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(TABLE_TALK_APP_ID, TABLE_TALK_ASC_TOKENS.outreachMacstories20260925);
  assert.equal(
    url,
    `https://apps.apple.com/app/id${TABLE_TALK_APP_ID}?pt=128970277&ct=${TABLE_TALK_OUTREACH_MACSTORIES_20260925_CT}&mt=8`,
  );
});

test('Last Human Cult of Mac outreach 2026-09-25 token is a registered static definition', () => {
  assert.equal(LAST_HUMAN_ASC_TOKENS.outreachCultofmac20260925, LAST_HUMAN_OUTREACH_CULTOFMAC_20260925_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(LAST_HUMAN_OUTREACH_CULTOFMAC_20260925_CT));

  const resolved = campaignLinks.resolveTokenDefinition(LAST_HUMAN_OUTREACH_CULTOFMAC_20260925_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, LAST_HUMAN_APP_ID);
  assert.equal(resolved.ct, LAST_HUMAN_OUTREACH_CULTOFMAC_20260925_CT);
  assert.equal(resolved.channel, 'email');
  assert.equal(resolved.path, 'email');
  assert.equal(resolved.surface, 'Email outreach Cult of Mac reviews@ (Last Human)');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
  assert.equal(campaignLinks.CT_TO_APP_ID[LAST_HUMAN_OUTREACH_CULTOFMAC_20260925_CT], LAST_HUMAN_APP_ID);
});

test('Last Human Cult of Mac outreach 2026-09-25 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(LAST_HUMAN_APP_ID, LAST_HUMAN_ASC_TOKENS.outreachCultofmac20260925);
  assert.equal(
    url,
    `https://apps.apple.com/us/app/last-human-dodge-the-bots/id${LAST_HUMAN_APP_ID}?pt=128970277&ct=${LAST_HUMAN_OUTREACH_CULTOFMAC_20260925_CT}&mt=8`,
  );
});

test('EconByte Money Girl outreach 2026-09-25 token is a registered static definition', () => {
  assert.equal(ECONBYTE_ASC_TOKENS.outreachMoneygirl20260925, ECONBYTE_OUTREACH_MONEYGIRL_20260925_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(ECONBYTE_OUTREACH_MONEYGIRL_20260925_CT));

  const resolved = campaignLinks.resolveTokenDefinition(ECONBYTE_OUTREACH_MONEYGIRL_20260925_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, ECONBYTE_APP_ID);
  assert.equal(resolved.ct, ECONBYTE_OUTREACH_MONEYGIRL_20260925_CT);
  assert.equal(resolved.channel, 'email');
  assert.equal(resolved.path, 'email');
  assert.equal(resolved.surface, 'Email outreach Laura Adams / Money Girl (EconByte)');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
  assert.equal(campaignLinks.CT_TO_APP_ID[ECONBYTE_OUTREACH_MONEYGIRL_20260925_CT], ECONBYTE_APP_ID);
});

test('EconByte Money Girl outreach 2026-09-25 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(ECONBYTE_APP_ID, ECONBYTE_ASC_TOKENS.outreachMoneygirl20260925);
  assert.equal(
    url,
    `https://apps.apple.com/app/id${ECONBYTE_APP_ID}?pt=128970277&ct=${ECONBYTE_OUTREACH_MONEYGIRL_20260925_CT}&mt=8`,
  );
});

test('Last Human IndieTools outreach 2026-09-25 token is a registered static definition', () => {
  assert.equal(LAST_HUMAN_ASC_TOKENS.outreachIndietools20260925, LAST_HUMAN_OUTREACH_INDIETOOLS_20260925_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(LAST_HUMAN_OUTREACH_INDIETOOLS_20260925_CT));

  const resolved = campaignLinks.resolveTokenDefinition(LAST_HUMAN_OUTREACH_INDIETOOLS_20260925_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, LAST_HUMAN_APP_ID);
  assert.equal(resolved.ct, LAST_HUMAN_OUTREACH_INDIETOOLS_20260925_CT);
  assert.equal(resolved.channel, 'email');
  assert.equal(resolved.path, 'email');
  assert.equal(resolved.surface, 'Email outreach IndieTools free listing Path B (Last Human)');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
  assert.equal(campaignLinks.CT_TO_APP_ID[LAST_HUMAN_OUTREACH_INDIETOOLS_20260925_CT], LAST_HUMAN_APP_ID);
});

test('Last Human IndieTools outreach 2026-09-25 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(LAST_HUMAN_APP_ID, LAST_HUMAN_ASC_TOKENS.outreachIndietools20260925);
  assert.equal(
    url,
    `https://apps.apple.com/us/app/last-human-dodge-the-bots/id${LAST_HUMAN_APP_ID}?pt=128970277&ct=${LAST_HUMAN_OUTREACH_INDIETOOLS_20260925_CT}&mt=8`,
  );
});

test('Table Talk IndieTools outreach 2026-09-25 token is a registered static definition', () => {
  assert.equal(TABLE_TALK_ASC_TOKENS.outreachIndietools20260925, TABLE_TALK_OUTREACH_INDIETOOLS_20260925_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(TABLE_TALK_OUTREACH_INDIETOOLS_20260925_CT));

  const resolved = campaignLinks.resolveTokenDefinition(TABLE_TALK_OUTREACH_INDIETOOLS_20260925_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, TABLE_TALK_APP_ID);
  assert.equal(resolved.ct, TABLE_TALK_OUTREACH_INDIETOOLS_20260925_CT);
  assert.equal(resolved.channel, 'email');
  assert.equal(resolved.path, 'email');
  assert.equal(resolved.surface, 'Email outreach IndieTools free listing (Table Talk)');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
  assert.equal(campaignLinks.CT_TO_APP_ID[TABLE_TALK_OUTREACH_INDIETOOLS_20260925_CT], TABLE_TALK_APP_ID);
});

test('Table Talk IndieTools outreach 2026-09-25 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(TABLE_TALK_APP_ID, TABLE_TALK_ASC_TOKENS.outreachIndietools20260925);
  assert.equal(
    url,
    `https://apps.apple.com/app/id${TABLE_TALK_APP_ID}?pt=128970277&ct=${TABLE_TALK_OUTREACH_INDIETOOLS_20260925_CT}&mt=8`,
  );
});

test('EconByte IndieTools outreach 2026-09-25 token is a registered static definition', () => {
  assert.equal(ECONBYTE_ASC_TOKENS.outreachIndietools20260925, ECONBYTE_OUTREACH_INDIETOOLS_20260925_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(ECONBYTE_OUTREACH_INDIETOOLS_20260925_CT));

  const resolved = campaignLinks.resolveTokenDefinition(ECONBYTE_OUTREACH_INDIETOOLS_20260925_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, ECONBYTE_APP_ID);
  assert.equal(resolved.ct, ECONBYTE_OUTREACH_INDIETOOLS_20260925_CT);
  assert.equal(resolved.channel, 'email');
  assert.equal(resolved.path, 'email');
  assert.equal(resolved.surface, 'Email outreach IndieTools free listing (EconByte)');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
  assert.equal(campaignLinks.CT_TO_APP_ID[ECONBYTE_OUTREACH_INDIETOOLS_20260925_CT], ECONBYTE_APP_ID);
});

test('EconByte IndieTools outreach 2026-09-25 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(ECONBYTE_APP_ID, ECONBYTE_ASC_TOKENS.outreachIndietools20260925);
  assert.equal(
    url,
    `https://apps.apple.com/app/id${ECONBYTE_APP_ID}?pt=128970277&ct=${ECONBYTE_OUTREACH_INDIETOOLS_20260925_CT}&mt=8`,
  );
});

test('IndieTools studio outreach 2026-09-25 token is a registered static definition on Table Talk', () => {
  assert.equal(TABLE_TALK_ASC_TOKENS.outreachIndietoolsStudio20260925, STUDIO_OUTREACH_INDIETOOLS_20260925_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(STUDIO_OUTREACH_INDIETOOLS_20260925_CT));

  const resolved = campaignLinks.resolveTokenDefinition(STUDIO_OUTREACH_INDIETOOLS_20260925_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, TABLE_TALK_APP_ID);
  assert.equal(resolved.ct, STUDIO_OUTREACH_INDIETOOLS_20260925_CT);
  assert.equal(resolved.channel, 'email');
  assert.equal(resolved.path, 'email');
  assert.equal(resolved.surface, 'Email outreach IndieTools studio listing Path B (Table Talk studio utility exemplar)');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
  assert.equal(campaignLinks.CT_TO_APP_ID[STUDIO_OUTREACH_INDIETOOLS_20260925_CT], TABLE_TALK_APP_ID);
});

test('IndieTools studio outreach 2026-09-25 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(TABLE_TALK_APP_ID, TABLE_TALK_ASC_TOKENS.outreachIndietoolsStudio20260925);
  assert.equal(
    url,
    `https://apps.apple.com/app/id${TABLE_TALK_APP_ID}?pt=128970277&ct=${STUDIO_OUTREACH_INDIETOOLS_20260925_CT}&mt=8`,
  );
});

test('Last Human Gamezebo outreach 2026-09-25 token is a registered static definition', () => {
  assert.equal(LAST_HUMAN_ASC_TOKENS.outreachGamezebo20260925, LAST_HUMAN_OUTREACH_GAMEZEBO_20260925_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(LAST_HUMAN_OUTREACH_GAMEZEBO_20260925_CT));

  const resolved = campaignLinks.resolveTokenDefinition(LAST_HUMAN_OUTREACH_GAMEZEBO_20260925_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, LAST_HUMAN_APP_ID);
  assert.equal(resolved.ct, LAST_HUMAN_OUTREACH_GAMEZEBO_20260925_CT);
  assert.equal(resolved.channel, 'email');
  assert.equal(resolved.path, 'email');
  assert.equal(resolved.surface, 'Email outreach Gamezebo editor@ (Last Human review tip)');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
  assert.equal(campaignLinks.CT_TO_APP_ID[LAST_HUMAN_OUTREACH_GAMEZEBO_20260925_CT], LAST_HUMAN_APP_ID);
});

test('Last Human Gamezebo outreach 2026-09-25 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(LAST_HUMAN_APP_ID, LAST_HUMAN_ASC_TOKENS.outreachGamezebo20260925);
  assert.equal(
    url,
    `https://apps.apple.com/us/app/last-human-dodge-the-bots/id${LAST_HUMAN_APP_ID}?pt=128970277&ct=${LAST_HUMAN_OUTREACH_GAMEZEBO_20260925_CT}&mt=8`,
  );
});

test('Last Human AppSpy outreach 2026-09-25 token is a registered static definition', () => {
  assert.equal(LAST_HUMAN_ASC_TOKENS.outreachAppspy20260925, LAST_HUMAN_OUTREACH_APPSPY_20260925_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(LAST_HUMAN_OUTREACH_APPSPY_20260925_CT));

  const resolved = campaignLinks.resolveTokenDefinition(LAST_HUMAN_OUTREACH_APPSPY_20260925_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, LAST_HUMAN_APP_ID);
  assert.equal(resolved.ct, LAST_HUMAN_OUTREACH_APPSPY_20260925_CT);
  assert.equal(resolved.channel, 'email');
  assert.equal(resolved.path, 'email');
  assert.equal(resolved.surface, 'Email outreach AppSpy reviews@ (Last Human tip)');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
  assert.equal(campaignLinks.CT_TO_APP_ID[LAST_HUMAN_OUTREACH_APPSPY_20260925_CT], LAST_HUMAN_APP_ID);
});

test('Last Human AppSpy outreach 2026-09-25 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(LAST_HUMAN_APP_ID, LAST_HUMAN_ASC_TOKENS.outreachAppspy20260925);
  assert.equal(
    url,
    `https://apps.apple.com/us/app/last-human-dodge-the-bots/id${LAST_HUMAN_APP_ID}?pt=128970277&ct=${LAST_HUMAN_OUTREACH_APPSPY_20260925_CT}&mt=8`,
  );
});

test('Table Talk Family Dinner Project outreach 2026-09-25 token is a registered static definition', () => {
  assert.equal(TABLE_TALK_ASC_TOKENS.outreachFamilydinnerproject20260925, TABLE_TALK_OUTREACH_FAMILYDINNERPROJECT_20260925_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(TABLE_TALK_OUTREACH_FAMILYDINNERPROJECT_20260925_CT));

  const resolved = campaignLinks.resolveTokenDefinition(TABLE_TALK_OUTREACH_FAMILYDINNERPROJECT_20260925_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, TABLE_TALK_APP_ID);
  assert.equal(resolved.ct, TABLE_TALK_OUTREACH_FAMILYDINNERPROJECT_20260925_CT);
  assert.equal(resolved.channel, 'email');
  assert.equal(resolved.path, 'email');
  assert.equal(resolved.surface, 'Email outreach Family Dinner Project contact form (Table Talk)');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
  assert.equal(campaignLinks.CT_TO_APP_ID[TABLE_TALK_OUTREACH_FAMILYDINNERPROJECT_20260925_CT], TABLE_TALK_APP_ID);
});

test('Table Talk Family Dinner Project outreach 2026-09-25 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(TABLE_TALK_APP_ID, TABLE_TALK_ASC_TOKENS.outreachFamilydinnerproject20260925);
  assert.equal(
    url,
    `https://apps.apple.com/app/id${TABLE_TALK_APP_ID}?pt=128970277&ct=${TABLE_TALK_OUTREACH_FAMILYDINNERPROJECT_20260925_CT}&mt=8`,
  );
});

test('Table Talk Six Colors outreach 2026-09-25 token is a registered static definition', () => {
  assert.equal(TABLE_TALK_ASC_TOKENS.outreachSixcolors20260925, TABLE_TALK_OUTREACH_SIXCOLORS_20260925_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(TABLE_TALK_OUTREACH_SIXCOLORS_20260925_CT));

  const resolved = campaignLinks.resolveTokenDefinition(TABLE_TALK_OUTREACH_SIXCOLORS_20260925_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, TABLE_TALK_APP_ID);
  assert.equal(resolved.ct, TABLE_TALK_OUTREACH_SIXCOLORS_20260925_CT);
  assert.equal(resolved.channel, 'email');
  assert.equal(resolved.path, 'email');
  assert.equal(resolved.surface, 'Email outreach Six Colors apps@ (Table Talk App Report tip)');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
  assert.equal(campaignLinks.CT_TO_APP_ID[TABLE_TALK_OUTREACH_SIXCOLORS_20260925_CT], TABLE_TALK_APP_ID);
});

test('Table Talk Six Colors outreach 2026-09-25 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(TABLE_TALK_APP_ID, TABLE_TALK_ASC_TOKENS.outreachSixcolors20260925);
  assert.equal(
    url,
    `https://apps.apple.com/app/id${TABLE_TALK_APP_ID}?pt=128970277&ct=${TABLE_TALK_OUTREACH_SIXCOLORS_20260925_CT}&mt=8`,
  );
});

test('9to5Mac Table Talk outreach 2026-09-25 token is a registered static definition', () => {
  assert.equal(TABLE_TALK_ASC_TOKENS.outreach9to5mac20260925, TABLE_TALK_OUTREACH_9TO5MAC_20260925_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(TABLE_TALK_OUTREACH_9TO5MAC_20260925_CT));

  const resolved = campaignLinks.resolveTokenDefinition(TABLE_TALK_OUTREACH_9TO5MAC_20260925_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, TABLE_TALK_APP_ID);
  assert.equal(resolved.ct, TABLE_TALK_OUTREACH_9TO5MAC_20260925_CT);
  assert.equal(resolved.channel, 'email');
  assert.equal(resolved.path, 'email');
  assert.equal(resolved.surface, 'Email outreach 9to5Mac Indie App Spotlight (Table Talk link)');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
  assert.equal(campaignLinks.CT_TO_APP_ID[TABLE_TALK_OUTREACH_9TO5MAC_20260925_CT], TABLE_TALK_APP_ID);
});

test('9to5Mac Table Talk outreach 2026-09-25 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(TABLE_TALK_APP_ID, TABLE_TALK_ASC_TOKENS.outreach9to5mac20260925);
  assert.equal(
    url,
    `https://apps.apple.com/app/id${TABLE_TALK_APP_ID}?pt=128970277&ct=${TABLE_TALK_OUTREACH_9TO5MAC_20260925_CT}&mt=8`,
  );
});

test('9to5Mac EconByte outreach 2026-09-25 token is a registered static definition', () => {
  assert.equal(ECONBYTE_ASC_TOKENS.outreach9to5mac20260925, ECONBYTE_OUTREACH_9TO5MAC_20260925_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(ECONBYTE_OUTREACH_9TO5MAC_20260925_CT));

  const resolved = campaignLinks.resolveTokenDefinition(ECONBYTE_OUTREACH_9TO5MAC_20260925_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, ECONBYTE_APP_ID);
  assert.equal(resolved.ct, ECONBYTE_OUTREACH_9TO5MAC_20260925_CT);
  assert.equal(resolved.channel, 'email');
  assert.equal(resolved.path, 'email');
  assert.equal(resolved.surface, 'Email outreach 9to5Mac Indie App Spotlight (EconByte link)');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
  assert.equal(campaignLinks.CT_TO_APP_ID[ECONBYTE_OUTREACH_9TO5MAC_20260925_CT], ECONBYTE_APP_ID);
});

test('9to5Mac EconByte outreach 2026-09-25 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(ECONBYTE_APP_ID, ECONBYTE_ASC_TOKENS.outreach9to5mac20260925);
  assert.equal(
    url,
    `https://apps.apple.com/app/id${ECONBYTE_APP_ID}?pt=128970277&ct=${ECONBYTE_OUTREACH_9TO5MAC_20260925_CT}&mt=8`,
  );
});

test('Last Human Siliconera outreach 2026-09-25 token is a registered static definition', () => {
  assert.equal(LAST_HUMAN_ASC_TOKENS.outreachSiliconera20260925, LAST_HUMAN_OUTREACH_SILICONERA_20260925_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(LAST_HUMAN_OUTREACH_SILICONERA_20260925_CT));

  const resolved = campaignLinks.resolveTokenDefinition(LAST_HUMAN_OUTREACH_SILICONERA_20260925_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, LAST_HUMAN_APP_ID);
  assert.equal(resolved.ct, LAST_HUMAN_OUTREACH_SILICONERA_20260925_CT);
  assert.equal(resolved.channel, 'email');
  assert.equal(resolved.path, 'email');
  assert.equal(resolved.surface, 'Email outreach Siliconera tips@ (Last Human soft tip)');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
  assert.equal(campaignLinks.CT_TO_APP_ID[LAST_HUMAN_OUTREACH_SILICONERA_20260925_CT], LAST_HUMAN_APP_ID);
});

test('Last Human Siliconera outreach 2026-09-25 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(LAST_HUMAN_APP_ID, LAST_HUMAN_ASC_TOKENS.outreachSiliconera20260925);
  assert.equal(
    url,
    `https://apps.apple.com/us/app/last-human-dodge-the-bots/id${LAST_HUMAN_APP_ID}?pt=128970277&ct=${LAST_HUMAN_OUTREACH_SILICONERA_20260925_CT}&mt=8`,
  );
});

test('EconByte Jump$tart outreach 2026-09-25 token is a registered static definition', () => {
  assert.equal(ECONBYTE_ASC_TOKENS.outreachJumpstart20260925, ECONBYTE_OUTREACH_JUMPSTART_20260925_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(ECONBYTE_OUTREACH_JUMPSTART_20260925_CT));

  const resolved = campaignLinks.resolveTokenDefinition(ECONBYTE_OUTREACH_JUMPSTART_20260925_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, ECONBYTE_APP_ID);
  assert.equal(resolved.ct, ECONBYTE_OUTREACH_JUMPSTART_20260925_CT);
  assert.equal(resolved.channel, 'email');
  assert.equal(resolved.path, 'email');
  assert.equal(resolved.surface, 'Email outreach Jump$tart Clearinghouse (EconByte listing-process ask)');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
  assert.equal(campaignLinks.CT_TO_APP_ID[ECONBYTE_OUTREACH_JUMPSTART_20260925_CT], ECONBYTE_APP_ID);
});

test('EconByte Jump$tart outreach 2026-09-25 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(ECONBYTE_APP_ID, ECONBYTE_ASC_TOKENS.outreachJumpstart20260925);
  assert.equal(
    url,
    `https://apps.apple.com/app/id${ECONBYTE_APP_ID}?pt=128970277&ct=${ECONBYTE_OUTREACH_JUMPSTART_20260925_CT}&mt=8`,
  );
});

test('EconByte NGPF outreach 2026-09-25 token is a registered static definition', () => {
  assert.equal(ECONBYTE_ASC_TOKENS.outreachNgpf20260925, ECONBYTE_OUTREACH_NGPF_20260925_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(ECONBYTE_OUTREACH_NGPF_20260925_CT));

  const resolved = campaignLinks.resolveTokenDefinition(ECONBYTE_OUTREACH_NGPF_20260925_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, ECONBYTE_APP_ID);
  assert.equal(resolved.ct, ECONBYTE_OUTREACH_NGPF_20260925_CT);
  assert.equal(resolved.channel, 'email');
  assert.equal(resolved.path, 'email');
  assert.equal(resolved.surface, 'Email outreach NGPF info@ (EconByte soft classroom intro)');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
  assert.equal(campaignLinks.CT_TO_APP_ID[ECONBYTE_OUTREACH_NGPF_20260925_CT], ECONBYTE_APP_ID);
});

test('EconByte NGPF outreach 2026-09-25 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(ECONBYTE_APP_ID, ECONBYTE_ASC_TOKENS.outreachNgpf20260925);
  assert.equal(
    url,
    `https://apps.apple.com/app/id${ECONBYTE_APP_ID}?pt=128970277&ct=${ECONBYTE_OUTREACH_NGPF_20260925_CT}&mt=8`,
  );
});

test('Table Talk MS Extension outreach 2026-09-25 token is a registered static definition', () => {
  assert.equal(TABLE_TALK_ASC_TOKENS.outreachMsextension20260925, TABLE_TALK_OUTREACH_MSEXTENSION_20260925_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(TABLE_TALK_OUTREACH_MSEXTENSION_20260925_CT));

  const resolved = campaignLinks.resolveTokenDefinition(TABLE_TALK_OUTREACH_MSEXTENSION_20260925_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, TABLE_TALK_APP_ID);
  assert.equal(resolved.ct, TABLE_TALK_OUTREACH_MSEXTENSION_20260925_CT);
  assert.equal(resolved.channel, 'email');
  assert.equal(resolved.path, 'email');
  assert.equal(resolved.surface, 'Email outreach MS Extension webteam (Table Talk resource-adjacency note)');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
  assert.equal(campaignLinks.CT_TO_APP_ID[TABLE_TALK_OUTREACH_MSEXTENSION_20260925_CT], TABLE_TALK_APP_ID);
});

test('Table Talk MS Extension outreach 2026-09-25 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(TABLE_TALK_APP_ID, TABLE_TALK_ASC_TOKENS.outreachMsextension20260925);
  assert.equal(
    url,
    `https://apps.apple.com/app/id${TABLE_TALK_APP_ID}?pt=128970277&ct=${TABLE_TALK_OUTREACH_MSEXTENSION_20260925_CT}&mt=8`,
  );
});

test('EconByte Federal Reserve Education outreach 2026-09-25 token is a registered static definition', () => {
  assert.equal(ECONBYTE_ASC_TOKENS.outreachFreded20260925, ECONBYTE_OUTREACH_FREDED_20260925_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(ECONBYTE_OUTREACH_FREDED_20260925_CT));

  const resolved = campaignLinks.resolveTokenDefinition(ECONBYTE_OUTREACH_FREDED_20260925_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, ECONBYTE_APP_ID);
  assert.equal(resolved.ct, ECONBYTE_OUTREACH_FREDED_20260925_CT);
  assert.equal(resolved.channel, 'email');
  assert.equal(resolved.path, 'email');
  assert.equal(resolved.surface, 'Email outreach Federal Reserve Education amanda.geiger@ (EconByte soft classroom note)');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
  assert.equal(campaignLinks.CT_TO_APP_ID[ECONBYTE_OUTREACH_FREDED_20260925_CT], ECONBYTE_APP_ID);
});

test('EconByte Federal Reserve Education outreach 2026-09-25 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(ECONBYTE_APP_ID, ECONBYTE_ASC_TOKENS.outreachFreded20260925);
  assert.equal(
    url,
    `https://apps.apple.com/app/id${ECONBYTE_APP_ID}?pt=128970277&ct=${ECONBYTE_OUTREACH_FREDED_20260925_CT}&mt=8`,
  );
});

test('edshelf, LaunchFree, Learnamic, Money Prodigy, and VibbleLaunch outreach tokens are registered static definitions', () => {
  const rows = [
    {
      tokens: ECONBYTE_ASC_TOKENS,
      key: 'outreachEdshelf20260925',
      ct: ECONBYTE_OUTREACH_EDSHELF_20260925_CT,
      appId: ECONBYTE_APP_ID,
      surface: 'Email outreach edshelf tool-submissions@ (EconByte listing ask)',
    },
    {
      tokens: LAST_HUMAN_ASC_TOKENS,
      key: 'outreachLaunchfree20260925',
      ct: LAST_HUMAN_OUTREACH_LAUNCHFREE_20260925_CT,
      appId: LAST_HUMAN_APP_ID,
      surface: 'Email outreach LaunchFree free listing (Last Human)',
    },
    {
      tokens: TABLE_TALK_ASC_TOKENS,
      key: 'outreachLaunchfree20260925',
      ct: TABLE_TALK_OUTREACH_LAUNCHFREE_20260925_CT,
      appId: TABLE_TALK_APP_ID,
      surface: 'Email outreach LaunchFree free listing (Table Talk)',
    },
    {
      tokens: ECONBYTE_ASC_TOKENS,
      key: 'outreachLaunchfree20260925',
      ct: ECONBYTE_OUTREACH_LAUNCHFREE_20260925_CT,
      appId: ECONBYTE_APP_ID,
      surface: 'Email outreach LaunchFree free listing (EconByte)',
    },
    {
      tokens: TABLE_TALK_ASC_TOKENS,
      key: 'outreachLaunchfreeStudio20260925',
      ct: STUDIO_OUTREACH_LAUNCHFREE_20260925_CT,
      appId: TABLE_TALK_APP_ID,
      surface: 'Email outreach LaunchFree studio hub (Table Talk studio utility exemplar)',
    },
    {
      tokens: ECONBYTE_ASC_TOKENS,
      key: 'outreachLearnamic20260925',
      ct: ECONBYTE_OUTREACH_LEARNAMIC_20260925_CT,
      appId: ECONBYTE_APP_ID,
      surface: 'Email outreach Learnamic Standard process ask (EconByte)',
    },
    {
      tokens: TABLE_TALK_ASC_TOKENS,
      key: 'outreachMoneyprodigy20260925',
      ct: TABLE_TALK_OUTREACH_MONEYPRODIGY_20260925_CT,
      appId: TABLE_TALK_APP_ID,
      surface: 'Email outreach Money Prodigy resource adjacency (Table Talk)',
    },
    {
      tokens: LAST_HUMAN_ASC_TOKENS,
      key: 'outreachVibblelaunch20260925',
      ct: LAST_HUMAN_OUTREACH_VIBBLELAUNCH_20260925_CT,
      appId: LAST_HUMAN_APP_ID,
      surface: 'Email outreach VibbleLaunch free listing (Last Human)',
    },
    {
      tokens: TABLE_TALK_ASC_TOKENS,
      key: 'outreachVibblelaunch20260925',
      ct: TABLE_TALK_OUTREACH_VIBBLELAUNCH_20260925_CT,
      appId: TABLE_TALK_APP_ID,
      surface: 'Email outreach VibbleLaunch free listing (Table Talk)',
    },
    {
      tokens: ECONBYTE_ASC_TOKENS,
      key: 'outreachVibblelaunch20260925',
      ct: ECONBYTE_OUTREACH_VIBBLELAUNCH_20260925_CT,
      appId: ECONBYTE_APP_ID,
      surface: 'Email outreach VibbleLaunch free listing (EconByte)',
    },
    {
      tokens: TABLE_TALK_ASC_TOKENS,
      key: 'outreachVibblelaunchStudio20260925',
      ct: STUDIO_OUTREACH_VIBBLELAUNCH_20260925_CT,
      appId: TABLE_TALK_APP_ID,
      surface: 'Email outreach VibbleLaunch studio hub (Table Talk studio utility exemplar)',
    },
  ];

  assert.equal(rows.length, 11);
  const cts = rows.map((row) => row.ct);
  assert.equal(new Set(cts).size, cts.length);

  for (const row of rows) {
    assert.equal(row.tokens[row.key], row.ct);
    assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(row.ct));

    const resolved = campaignLinks.resolveTokenDefinition(row.ct);
    assert.ok(resolved, 'resolveTokenDefinition returned null');
    assert.equal(resolved.kind, 'static');
    assert.equal(resolved.appId, row.appId);
    assert.equal(resolved.ct, row.ct);
    assert.equal(resolved.channel, 'email');
    assert.equal(resolved.path, 'email');
    assert.equal(resolved.surface, row.surface);
    assert.equal(resolved.ppid, null);
    assert.equal(resolved.status, 'proposed');
    assert.equal(resolved.registeredAt, '2026-09-25');
    assert.equal(resolved.activatedAt, null);
    assert.equal(resolved.firstVerifiedAt, null);
    assert.equal(campaignLinks.CT_TO_APP_ID[row.ct], row.appId);
  }
});

test('edshelf, LaunchFree, Learnamic, Money Prodigy, and VibbleLaunch outreach App Store URLs use pt, registered ct, and mt=8', () => {
  const lastHuman = (ct) =>
    `https://apps.apple.com/us/app/last-human-dodge-the-bots/id${LAST_HUMAN_APP_ID}?pt=128970277&ct=${ct}&mt=8`;
  const plain = (appId, ct) =>
    `https://apps.apple.com/app/id${appId}?pt=128970277&ct=${ct}&mt=8`;

  assert.equal(
    appStoreCampaignUrl(ECONBYTE_APP_ID, ECONBYTE_ASC_TOKENS.outreachEdshelf20260925),
    plain(ECONBYTE_APP_ID, ECONBYTE_OUTREACH_EDSHELF_20260925_CT),
  );
  assert.equal(
    appStoreCampaignUrl(LAST_HUMAN_APP_ID, LAST_HUMAN_ASC_TOKENS.outreachLaunchfree20260925),
    lastHuman(LAST_HUMAN_OUTREACH_LAUNCHFREE_20260925_CT),
  );
  assert.equal(
    appStoreCampaignUrl(TABLE_TALK_APP_ID, TABLE_TALK_ASC_TOKENS.outreachLaunchfree20260925),
    plain(TABLE_TALK_APP_ID, TABLE_TALK_OUTREACH_LAUNCHFREE_20260925_CT),
  );
  assert.equal(
    appStoreCampaignUrl(ECONBYTE_APP_ID, ECONBYTE_ASC_TOKENS.outreachLaunchfree20260925),
    plain(ECONBYTE_APP_ID, ECONBYTE_OUTREACH_LAUNCHFREE_20260925_CT),
  );
  assert.equal(
    appStoreCampaignUrl(TABLE_TALK_APP_ID, TABLE_TALK_ASC_TOKENS.outreachLaunchfreeStudio20260925),
    plain(TABLE_TALK_APP_ID, STUDIO_OUTREACH_LAUNCHFREE_20260925_CT),
  );
  assert.equal(
    appStoreCampaignUrl(ECONBYTE_APP_ID, ECONBYTE_ASC_TOKENS.outreachLearnamic20260925),
    plain(ECONBYTE_APP_ID, ECONBYTE_OUTREACH_LEARNAMIC_20260925_CT),
  );
  assert.equal(
    appStoreCampaignUrl(TABLE_TALK_APP_ID, TABLE_TALK_ASC_TOKENS.outreachMoneyprodigy20260925),
    plain(TABLE_TALK_APP_ID, TABLE_TALK_OUTREACH_MONEYPRODIGY_20260925_CT),
  );
  assert.equal(
    appStoreCampaignUrl(LAST_HUMAN_APP_ID, LAST_HUMAN_ASC_TOKENS.outreachVibblelaunch20260925),
    lastHuman(LAST_HUMAN_OUTREACH_VIBBLELAUNCH_20260925_CT),
  );
  assert.equal(
    appStoreCampaignUrl(TABLE_TALK_APP_ID, TABLE_TALK_ASC_TOKENS.outreachVibblelaunch20260925),
    plain(TABLE_TALK_APP_ID, TABLE_TALK_OUTREACH_VIBBLELAUNCH_20260925_CT),
  );
  assert.equal(
    appStoreCampaignUrl(ECONBYTE_APP_ID, ECONBYTE_ASC_TOKENS.outreachVibblelaunch20260925),
    plain(ECONBYTE_APP_ID, ECONBYTE_OUTREACH_VIBBLELAUNCH_20260925_CT),
  );
  assert.equal(
    appStoreCampaignUrl(TABLE_TALK_APP_ID, TABLE_TALK_ASC_TOKENS.outreachVibblelaunchStudio20260925),
    plain(TABLE_TALK_APP_ID, STUDIO_OUTREACH_VIBBLELAUNCH_20260925_CT),
  );
});

test('Table Talk Gourmet Host outreach 2026-09-25 token is a registered static definition', () => {
  assert.equal(TABLE_TALK_ASC_TOKENS.outreachGourmethost20260925, TABLE_TALK_OUTREACH_GOURMETHOST_20260925_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(TABLE_TALK_OUTREACH_GOURMETHOST_20260925_CT));

  const resolved = campaignLinks.resolveTokenDefinition(TABLE_TALK_OUTREACH_GOURMETHOST_20260925_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, TABLE_TALK_APP_ID);
  assert.equal(resolved.ct, TABLE_TALK_OUTREACH_GOURMETHOST_20260925_CT);
  assert.equal(resolved.channel, 'email');
  assert.equal(resolved.path, 'email');
  assert.equal(resolved.surface, 'Email outreach Gourmet Host (Table Talk soft tip)');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
  assert.equal(campaignLinks.CT_TO_APP_ID[TABLE_TALK_OUTREACH_GOURMETHOST_20260925_CT], TABLE_TALK_APP_ID);
});

test('Table Talk Gourmet Host outreach 2026-09-25 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(TABLE_TALK_APP_ID, TABLE_TALK_ASC_TOKENS.outreachGourmethost20260925);
  assert.equal(
    url,
    `https://apps.apple.com/app/id${TABLE_TALK_APP_ID}?pt=128970277&ct=${TABLE_TALK_OUTREACH_GOURMETHOST_20260925_CT}&mt=8`,
  );
});

test('Table Talk Board Game Barrage outreach 2026-09-25 token is a registered static definition', () => {
  assert.equal(TABLE_TALK_ASC_TOKENS.outreachBgbarrage20260925, TABLE_TALK_OUTREACH_BGBARRAGE_20260925_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(TABLE_TALK_OUTREACH_BGBARRAGE_20260925_CT));

  const resolved = campaignLinks.resolveTokenDefinition(TABLE_TALK_OUTREACH_BGBARRAGE_20260925_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, TABLE_TALK_APP_ID);
  assert.equal(resolved.ct, TABLE_TALK_OUTREACH_BGBARRAGE_20260925_CT);
  assert.equal(resolved.channel, 'email');
  assert.equal(resolved.path, 'email');
  assert.equal(resolved.surface, 'Email outreach Board Game Barrage (Table Talk soft tip)');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
  assert.equal(campaignLinks.CT_TO_APP_ID[TABLE_TALK_OUTREACH_BGBARRAGE_20260925_CT], TABLE_TALK_APP_ID);
});

test('Table Talk Board Game Barrage outreach 2026-09-25 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(TABLE_TALK_APP_ID, TABLE_TALK_ASC_TOKENS.outreachBgbarrage20260925);
  assert.equal(
    url,
    `https://apps.apple.com/app/id${TABLE_TALK_APP_ID}?pt=128970277&ct=${TABLE_TALK_OUTREACH_BGBARRAGE_20260925_CT}&mt=8`,
  );
});

test('Table Talk The Dinner Plan outreach 2026-09-25 token is a registered static definition', () => {
  assert.equal(TABLE_TALK_ASC_TOKENS.outreachDinnerplan20260925, TABLE_TALK_OUTREACH_DINNERPLAN_20260925_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(TABLE_TALK_OUTREACH_DINNERPLAN_20260925_CT));

  const resolved = campaignLinks.resolveTokenDefinition(TABLE_TALK_OUTREACH_DINNERPLAN_20260925_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, TABLE_TALK_APP_ID);
  assert.equal(resolved.ct, TABLE_TALK_OUTREACH_DINNERPLAN_20260925_CT);
  assert.equal(resolved.channel, 'email');
  assert.equal(resolved.path, 'email');
  assert.equal(resolved.surface, 'Email outreach The Dinner Plan Maggie Hoffman (Table Talk press tip)');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
  assert.equal(campaignLinks.CT_TO_APP_ID[TABLE_TALK_OUTREACH_DINNERPLAN_20260925_CT], TABLE_TALK_APP_ID);
});

test('Table Talk The Dinner Plan outreach 2026-09-25 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(TABLE_TALK_APP_ID, TABLE_TALK_ASC_TOKENS.outreachDinnerplan20260925);
  assert.equal(
    url,
    `https://apps.apple.com/app/id${TABLE_TALK_APP_ID}?pt=128970277&ct=${TABLE_TALK_OUTREACH_DINNERPLAN_20260925_CT}&mt=8`,
  );
});

test('Table Talk Betty Eatz outreach 2026-09-25 token is a registered static definition', () => {
  assert.equal(TABLE_TALK_ASC_TOKENS.outreachBettyeatz20260925, TABLE_TALK_OUTREACH_BETTYEATZ_20260925_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(TABLE_TALK_OUTREACH_BETTYEATZ_20260925_CT));

  const resolved = campaignLinks.resolveTokenDefinition(TABLE_TALK_OUTREACH_BETTYEATZ_20260925_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, TABLE_TALK_APP_ID);
  assert.equal(resolved.ct, TABLE_TALK_OUTREACH_BETTYEATZ_20260925_CT);
  assert.equal(resolved.channel, 'email');
  assert.equal(resolved.path, 'email');
  assert.equal(resolved.surface, 'Email outreach Betty Eatz (Table Talk press tip)');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
  assert.equal(campaignLinks.CT_TO_APP_ID[TABLE_TALK_OUTREACH_BETTYEATZ_20260925_CT], TABLE_TALK_APP_ID);
});

test('Table Talk Betty Eatz outreach 2026-09-25 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(TABLE_TALK_APP_ID, TABLE_TALK_ASC_TOKENS.outreachBettyeatz20260925);
  assert.equal(
    url,
    `https://apps.apple.com/app/id${TABLE_TALK_APP_ID}?pt=128970277&ct=${TABLE_TALK_OUTREACH_BETTYEATZ_20260925_CT}&mt=8`,
  );
});

test('Table Talk Common Sense Media, AppAddict, iDownloadBlog, and While Entertaining outreach 2026-09-25 tokens are registered static definitions', () => {
  const rows = [
    {
      key: 'outreachCommonsensemedia20260925',
      ct: TABLE_TALK_OUTREACH_COMMONSENSEMEDIA_20260925_CT,
      surface: 'Email outreach Common Sense Media Request a review form (Table Talk soft tip)',
    },
    {
      key: 'outreachAppaddict20260925',
      ct: TABLE_TALK_OUTREACH_APPADDICT_20260925_CT,
      surface: 'Email outreach AppAddict (Table Talk soft tip)',
    },
    {
      key: 'outreachIdownloadblog20260925',
      ct: TABLE_TALK_OUTREACH_IDOWNLOADBLOG_20260925_CT,
      surface: 'Email outreach iDownloadBlog (Table Talk soft tip)',
    },
    {
      key: 'outreachWhileentertaining20260925',
      ct: TABLE_TALK_OUTREACH_WHILEENTERTAINING_20260925_CT,
      surface: 'Email outreach While Entertaining Amber Mayfield (Table Talk soft tip)',
    },
  ];

  assert.equal(rows.length, 4);
  const cts = rows.map((row) => row.ct);
  assert.equal(new Set(cts).size, cts.length);

  for (const row of rows) {
    assert.equal(TABLE_TALK_ASC_TOKENS[row.key], row.ct);
    assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(row.ct));

    const resolved = campaignLinks.resolveTokenDefinition(row.ct);
    assert.ok(resolved, 'resolveTokenDefinition returned null');
    assert.equal(resolved.kind, 'static');
    assert.equal(resolved.appId, TABLE_TALK_APP_ID);
    assert.equal(resolved.ct, row.ct);
    assert.equal(resolved.channel, 'email');
    assert.equal(resolved.path, 'email');
    assert.equal(resolved.surface, row.surface);
    assert.equal(resolved.ppid, null);
    assert.equal(resolved.status, 'proposed');
    assert.equal(resolved.registeredAt, '2026-09-25');
    assert.equal(resolved.activatedAt, null);
    assert.equal(resolved.firstVerifiedAt, null);
    assert.equal(campaignLinks.CT_TO_APP_ID[row.ct], TABLE_TALK_APP_ID);
  }
});

test('Table Talk Common Sense Media, AppAddict, iDownloadBlog, and While Entertaining outreach 2026-09-25 App Store URLs use pt, registered ct, and mt=8', () => {
  const rows = [
    ['outreachCommonsensemedia20260925', TABLE_TALK_OUTREACH_COMMONSENSEMEDIA_20260925_CT],
    ['outreachAppaddict20260925', TABLE_TALK_OUTREACH_APPADDICT_20260925_CT],
    ['outreachIdownloadblog20260925', TABLE_TALK_OUTREACH_IDOWNLOADBLOG_20260925_CT],
    ['outreachWhileentertaining20260925', TABLE_TALK_OUTREACH_WHILEENTERTAINING_20260925_CT],
  ];

  for (const [key, ct] of rows) {
    assert.equal(
      appStoreCampaignUrl(TABLE_TALK_APP_ID, TABLE_TALK_ASC_TOKENS[key]),
      `https://apps.apple.com/app/id${TABLE_TALK_APP_ID}?pt=128970277&ct=${ct}&mt=8`,
    );
  }
});

test('Table Talk Dice Tower press 2026-09-26 token is a registered static definition', () => {
  assert.equal(TABLE_TALK_ASC_TOKENS.pressDicetower20260926, TABLE_TALK_PRESS_DICETOWER_20260926_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(TABLE_TALK_PRESS_DICETOWER_20260926_CT));

  const resolved = campaignLinks.resolveTokenDefinition(TABLE_TALK_PRESS_DICETOWER_20260926_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, TABLE_TALK_APP_ID);
  assert.equal(resolved.ct, TABLE_TALK_PRESS_DICETOWER_20260926_CT);
  assert.equal(resolved.channel, 'email');
  assert.equal(resolved.path, 'email');
  assert.equal(resolved.surface, 'Email Dice Tower free-review soft tip (Table Talk) 2026-09-26');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-26');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
  assert.equal(campaignLinks.CT_TO_APP_ID[TABLE_TALK_PRESS_DICETOWER_20260926_CT], TABLE_TALK_APP_ID);
});

test('Table Talk Dice Tower press 2026-09-26 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(TABLE_TALK_APP_ID, TABLE_TALK_ASC_TOKENS.pressDicetower20260926);
  assert.equal(
    url,
    `https://apps.apple.com/app/id${TABLE_TALK_APP_ID}?pt=128970277&ct=${TABLE_TALK_PRESS_DICETOWER_20260926_CT}&mt=8`,
  );
});

test('Last Human Kodeco Podcast outreach 2026-09-25 token is a registered static definition', () => {
  assert.equal(LAST_HUMAN_ASC_TOKENS.outreachKodeco20260925, LAST_HUMAN_OUTREACH_KODECO_20260925_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(LAST_HUMAN_OUTREACH_KODECO_20260925_CT));

  const resolved = campaignLinks.resolveTokenDefinition(LAST_HUMAN_OUTREACH_KODECO_20260925_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, LAST_HUMAN_APP_ID);
  assert.equal(resolved.ct, LAST_HUMAN_OUTREACH_KODECO_20260925_CT);
  assert.equal(resolved.channel, 'email');
  assert.equal(resolved.path, 'email');
  assert.equal(resolved.surface, 'Email outreach Kodeco Podcast (Last Human soft guest/tip)');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
  assert.equal(campaignLinks.CT_TO_APP_ID[LAST_HUMAN_OUTREACH_KODECO_20260925_CT], LAST_HUMAN_APP_ID);
});

test('Last Human Kodeco Podcast outreach 2026-09-25 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(LAST_HUMAN_APP_ID, LAST_HUMAN_ASC_TOKENS.outreachKodeco20260925);
  assert.equal(
    url,
    `https://apps.apple.com/us/app/last-human-dodge-the-bots/id${LAST_HUMAN_APP_ID}?pt=128970277&ct=${LAST_HUMAN_OUTREACH_KODECO_20260925_CT}&mt=8`,
  );
});

test('Last Human Launched outreach 2026-09-25 token is a registered static definition', () => {
  assert.equal(LAST_HUMAN_ASC_TOKENS.outreachLaunched20260925, LAST_HUMAN_OUTREACH_LAUNCHED_20260925_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(LAST_HUMAN_OUTREACH_LAUNCHED_20260925_CT));

  const resolved = campaignLinks.resolveTokenDefinition(LAST_HUMAN_OUTREACH_LAUNCHED_20260925_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, LAST_HUMAN_APP_ID);
  assert.equal(resolved.ct, LAST_HUMAN_OUTREACH_LAUNCHED_20260925_CT);
  assert.equal(resolved.channel, 'email');
  assert.equal(resolved.path, 'email');
  assert.equal(resolved.surface, 'Email outreach Launched Charlie Chapman (Last Human soft guest ask)');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
  assert.equal(campaignLinks.CT_TO_APP_ID[LAST_HUMAN_OUTREACH_LAUNCHED_20260925_CT], LAST_HUMAN_APP_ID);
});

test('Last Human Launched outreach 2026-09-25 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(LAST_HUMAN_APP_ID, LAST_HUMAN_ASC_TOKENS.outreachLaunched20260925);
  assert.equal(
    url,
    `https://apps.apple.com/us/app/last-human-dodge-the-bots/id${LAST_HUMAN_APP_ID}?pt=128970277&ct=${LAST_HUMAN_OUTREACH_LAUNCHED_20260925_CT}&mt=8`,
  );
});

test('Last Human Compile Swift and Gamigion press 2026-09-26 tokens are registered static definitions', () => {
  const rows = [
    {
      key: 'pressCompileswift20260926',
      ct: LAST_HUMAN_PRESS_COMPILESWIFT_20260926_CT,
      surface: 'Compile Swift guest form soft tip (Last Human) 2026-09-26',
      path: 'form',
      channel: 'form',
    },
    {
      key: 'pressGamigion20260926',
      ct: LAST_HUMAN_PRESS_GAMIGION_20260926_CT,
      surface: 'Email Gamigion quiet release soft tip (Last Human) 2026-09-26',
      path: 'email',
      channel: 'email',
    },
  ];

  assert.equal(rows.length, 2);
  const cts = rows.map((row) => row.ct);
  assert.equal(new Set(cts).size, cts.length);

  for (const row of rows) {
    assert.equal(LAST_HUMAN_ASC_TOKENS[row.key], row.ct);
    assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(row.ct));

    const resolved = campaignLinks.resolveTokenDefinition(row.ct);
    assert.ok(resolved, 'resolveTokenDefinition returned null');
    assert.equal(resolved.kind, 'static');
    assert.equal(resolved.appId, LAST_HUMAN_APP_ID);
    assert.equal(resolved.ct, row.ct);
    assert.equal(resolved.channel, row.channel);
    assert.equal(resolved.path, row.path);
    assert.equal(resolved.surface, row.surface);
    assert.equal(resolved.ppid, null);
    assert.equal(resolved.status, 'proposed');
    assert.equal(resolved.registeredAt, '2026-09-26');
    assert.equal(resolved.activatedAt, null);
    assert.equal(resolved.firstVerifiedAt, null);
    assert.equal(campaignLinks.CT_TO_APP_ID[row.ct], LAST_HUMAN_APP_ID);
  }
});

test('Last Human Compile Swift and Gamigion press 2026-09-26 App Store URLs use pt, registered ct, and mt=8', () => {
  const rows = [
    ['pressCompileswift20260926', LAST_HUMAN_PRESS_COMPILESWIFT_20260926_CT],
    ['pressGamigion20260926', LAST_HUMAN_PRESS_GAMIGION_20260926_CT],
  ];

  for (const [key, ct] of rows) {
    assert.equal(
      appStoreCampaignUrl(LAST_HUMAN_APP_ID, LAST_HUMAN_ASC_TOKENS[key]),
      `https://apps.apple.com/us/app/last-human-dodge-the-bots/id${LAST_HUMAN_APP_ID}?pt=128970277&ct=${ct}&mt=8`,
    );
  }
});

test('EconByte Teacher Money Show outreach 2026-09-25 token is a registered static definition', () => {
  assert.equal(ECONBYTE_ASC_TOKENS.outreachTeachermoney20260925, ECONBYTE_OUTREACH_TEACHERMONEY_20260925_CT);
  assert.ok(campaignLinks.ALL_REGISTERED_TOKENS.includes(ECONBYTE_OUTREACH_TEACHERMONEY_20260925_CT));

  const resolved = campaignLinks.resolveTokenDefinition(ECONBYTE_OUTREACH_TEACHERMONEY_20260925_CT);
  assert.ok(resolved, 'resolveTokenDefinition returned null');
  assert.equal(resolved.kind, 'static');
  assert.equal(resolved.appId, ECONBYTE_APP_ID);
  assert.equal(resolved.ct, ECONBYTE_OUTREACH_TEACHERMONEY_20260925_CT);
  assert.equal(resolved.channel, 'email');
  assert.equal(resolved.path, 'email');
  assert.equal(resolved.surface, 'Email outreach Teacher Money Show (EconByte soft literacy intro)');
  assert.equal(resolved.ppid, null);
  assert.equal(resolved.status, 'proposed');
  assert.equal(resolved.registeredAt, '2026-09-25');
  assert.equal(resolved.activatedAt, null);
  assert.equal(resolved.firstVerifiedAt, null);
  assert.equal(campaignLinks.CT_TO_APP_ID[ECONBYTE_OUTREACH_TEACHERMONEY_20260925_CT], ECONBYTE_APP_ID);
});

test('EconByte Teacher Money Show outreach 2026-09-25 App Store URL uses pt, registered ct, and mt=8', () => {
  const url = appStoreCampaignUrl(ECONBYTE_APP_ID, ECONBYTE_ASC_TOKENS.outreachTeachermoney20260925);
  assert.equal(
    url,
    `https://apps.apple.com/app/id${ECONBYTE_APP_ID}?pt=128970277&ct=${ECONBYTE_OUTREACH_TEACHERMONEY_20260925_CT}&mt=8`,
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
