import test from 'node:test';
import assert from 'node:assert/strict';
import * as campaignLinks from '../src/lib/campaignLinks.mjs';

const { appStoreCampaignUrl, blogCampaignToken } = campaignLinks;

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
