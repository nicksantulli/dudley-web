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
  assert.doesNotMatch(data, /coming soon/i);
});
