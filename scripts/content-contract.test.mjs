import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const APPS = resolve('src/content/apps');
const files = readdirSync(APPS).filter((name) => name.endsWith('.mdx'));

const frontmatter = (name) => {
  const source = readFileSync(join(APPS, name), 'utf8');
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(match, `${name} is missing frontmatter`);
  return match[1];
};

test('every app defines poster and disclosure facts', () => {
  for (const file of files) {
    const data = frontmatter(file);
    for (const key of ['posterHeadline', 'posterFacts', 'pricingSummary', 'accountSummary', 'offlineSummary', 'privacySummary']) {
      assert.match(data, new RegExp(`^${key}:`, 'm'), `${file} is missing ${key}`);
    }
    assert.match(data, /^posterFacts:\n(?:  - .+\n?){2,3}/m, `${file} needs two or three posterFacts`);
  }
});

test('live client work may omit a landing page only with partner attribution', () => {
  const client = frontmatter('dude-wheres-this-house.mdx');
  assert.match(client, /^status: "live"$/m);
  assert.match(client, /^landingPage: false$/m);
  assert.match(client, /^developedFor: "HomeLight"$/m);
  assert.match(client, /^appStoreId: "6779785617"$/m);
});

test('Last Human source facts are live', () => {
  const data = frontmatter('last-human.mdx');
  assert.match(data, /^status: "live"$/m);
  assert.match(data, /^appStoreId: "6808782611"$/m);
  assert.match(data, /50 escalating office floors/);
  assert.doesNotMatch(data, /coming soon/i);
  assert.doesNotMatch(data, /180 cards/);
});

test('EconByte source matches the public App Store 1.1.5 listing', () => {
  const source = readFileSync(join(APPS, 'econbyte.mdx'), 'utf8');
  assert.match(source, /180 cards across 15 topics, 12 each/);
  assert.match(source, /12 cards each, for 180 cards/);
  assert.match(source, /180 sourced cards across 15 core topics, 12 cards per topic/);
  assert.match(source, /topic packs/i);
  assert.match(source, /EconByte Pro/);
  assert.match(source, /not trading tips/);
  assert.match(source, /not financial or investment advice/);
  assert.match(source, /Daily set: 8 cards a day/);
  assert.doesNotMatch(source, /120 sourced|120 cards|\$0\.99|eight cards per topic|eight cards each|each with 8 cards/);
});

test('Packed Yet source facts are live', () => {
  const data = frontmatter('packed-yet.mdx');
  assert.match(data, /^status: "live"$/m);
  assert.match(data, /^appStoreId: "6814598931"$/m);
  assert.match(data, /^lastUpdated: 2026-10-02$/m);
});

const APPROVED_LIVE_ORDER = [
  'table-talk',
  'econbyte',
  'last-human',
  'packed-yet',
  'monetary-policy-independence-day',
];

test('live App Store apps stay in the approved order', async () => {
  const source = readFileSync(resolve('src/lib/liveApps.mjs'), 'utf8');
  assert.match(source, /Newly approved apps go at the top\./);
  const { LIVE_APP_ORDER, comingSoonApps, liveApps } = await import('../src/lib/liveApps.mjs');
  assert.deepEqual(LIVE_APP_ORDER, APPROVED_LIVE_ORDER);

  const live = (id, appStoreId, order, extra = {}) => ({
    id,
    data: { status: 'live', name: id, appStoreId, order, landingPage: true, ...extra },
  });
  const soon = (id, order) => ({
    id,
    data: { status: 'coming_soon', name: id, appStoreId: '', order, landingPage: true },
  });
  const fixtures = [
    live('packed-yet', '6814598931', 7),
    live('vibe-rater', '6780704282', 2),
    live('monetary-policy-independence-day', '6775539250', 4),
    soon('beat-the-dealer', 6),
    live('last-human', '6808782611', 4),
    live('dude-wheres-this-house', '6779785617', 1, { developedFor: 'HomeLight', landingPage: false }),
    live('econbyte', '6780714383', 3),
    soon('action-card', 8),
    live('table-talk', '6780714565', 1),
    soon('reply-gate', 9),
    soon('send-brake', 10),
  ];

  const listed = liveApps(fixtures).filter((app) => !app.data.developedFor && app.data.landingPage !== false);
  assert.deepEqual(listed.map((app) => app.id), APPROVED_LIVE_ORDER);
  assert.deepEqual(
    comingSoonApps(fixtures).map((app) => app.id),
    ['action-card', 'reply-gate', 'send-brake'],
  );
});

test('VibeRater stays out of the shared app lists', async () => {
  const { listedApps, liveApps } = await import('../src/lib/liveApps.mjs');
  const vibe = {
    id: 'vibe-rater',
    data: { status: 'live', name: 'VibeRater Social', appStoreId: '6780704282', order: 2, landingPage: true },
  };
  const neighbors = APPROVED_LIVE_ORDER.map((id, order) => ({
    id,
    data: { status: 'live', name: id, appStoreId: '6780714565', order, landingPage: true },
  }));
  neighbors[1].data.appStoreId = '6780714383';
  neighbors[2].data.appStoreId = '6808782611';
  neighbors[3].data.appStoreId = '6814598931';
  neighbors[4].data.appStoreId = '6775539250';
  const apps = [vibe, ...neighbors];
  assert.equal(liveApps(apps).some((app) => app.id === 'vibe-rater'), false);
  assert.equal(listedApps(apps).some((app) => app.id === 'vibe-rater'), false);
  assert.equal(listedApps([{ id: 'beat-the-dealer', data: { status: 'coming_soon', order: 6 } }]).length, 0);
});

test('topic registry defines the six durable hub slugs', () => {
  const source = readFileSync(resolve('src/lib/topics.ts'), 'utf8');
  for (const slug of ['iphone-privacy', 'ai-media', 'internet-culture', 'economics', 'app-store', 'dudley-guides']) {
    assert.match(source, new RegExp(`['"]${slug}['"]\\s*:`), `missing topic ${slug}`);
  }
});
