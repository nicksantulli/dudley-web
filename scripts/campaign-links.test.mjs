import test from 'node:test';
import assert from 'node:assert/strict';
import * as campaignLinks from '../src/lib/campaignLinks.mjs';

const { appStoreCampaignUrl, blogCampaignToken, TABLE_TALK_ASC_TOKENS } = campaignLinks;

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
