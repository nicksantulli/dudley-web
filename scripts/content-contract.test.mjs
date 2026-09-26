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

test('topic registry defines the six durable hub slugs', () => {
  const source = readFileSync(resolve('src/lib/topics.ts'), 'utf8');
  for (const slug of ['iphone-privacy', 'ai-media', 'internet-culture', 'economics', 'app-store', 'dudley-guides']) {
    assert.match(source, new RegExp(`['"]${slug}['"]\\s*:`), `missing topic ${slug}`);
  }
});
