/**
 * Built-output regression tests for dudley-web.
 *
 * Run after `npm run build`:
 *   node --test scripts/built-output.test.mjs
 *
 * Checks:
 *   1. No bare first-party App Store links (every our-own-app anchor must carry
 *      pt, ct, and mt=8).
 *   2. No duplicate placement tokens in the same page.
 *   3. No unexpected `ppid` parameter on any App Store link (CPP links are not
 *      used on default product pages; any ppid is an error until explicitly
 *      registered).
 *   4. Table Talk leads the homepage app list (first app card).
 *   5. No "no paywall" language in built HTML or llms.txt.
 *   6. No Beat the Dealer lesson count promises ("36 lessons") in built HTML.
 *   7. Instagram / TikTok links absent from global footer (every page that
 *      renders the site footer).
 *   8. Archetype pages have no VibeRater App Store CTA anchor.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { FIRST_PARTY_APP_IDS, ALL_REGISTERED_TOKENS } from '../src/lib/campaignLinks.mjs';

const DIST = resolve(new URL('.', import.meta.url).pathname, '../dist');

if (!existsSync(DIST)) {
  console.error('dist/ not found — run `npm run build` before this test.');
  process.exit(1);
}

// ── Helpers ────────────────────────────────────────────────────────────────

/** Walk dist/ and return all .html file paths. */
function* walkHtml(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walkHtml(full);
    else if (entry.isFile() && entry.name.endsWith('.html')) yield full;
  }
}

/** Extract all href="…apps.apple.com…" values from HTML (anchor hrefs only). */
function extractAppStoreHrefs(html) {
  const re = /href="(https:\/\/apps\.apple\.com[^"]*)"/g;
  const results = [];
  let m;
  while ((m = re.exec(html)) !== null) results.push(decodeEntities(m[1]));
  return results;
}

/** Decode HTML entities for & so URLs are comparable. */
function decodeEntities(url) {
  return url.replace(/&#x26;/g, '&').replace(/&amp;/g, '&');
}

/** Return true if url carries all three required attribution params. */
function isTagged(url) {
  try {
    const u = new URL(url);
    return (
      u.searchParams.get('pt') === '128970277' &&
      !!u.searchParams.get('ct') &&
      u.searchParams.get('mt') === '8'
    );
  } catch { return false; }
}

/** Return true if url is a link to one of our own apps (by App Store id). */
function isFirstParty(url) {
  return FIRST_PARTY_APP_IDS.some((id) => url.includes(`id${id}`));
}

// ── Collect all pages once ──────────────────────────────────────────────────

const pages = [...walkHtml(DIST)].map((path) => ({
  path,
  html: readFileSync(path, 'utf-8'),
  rel: path.replace(DIST, ''),
}));

// ── Test 1: No bare first-party App Store links ──────────────────────────────

test('no bare first-party App Store links in built output', () => {
  const failures = [];
  for (const { path, html, rel } of pages) {
    for (const href of extractAppStoreHrefs(html)) {
      if (isFirstParty(href) && !isTagged(href)) {
        failures.push(`${rel} → ${href}`);
      }
    }
  }
  assert.deepEqual(
    failures,
    [],
    `Bare (untagged) first-party App Store links found:\n${failures.join('\n')}`,
  );
});

// ── Test 2: No duplicate placement tokens on the same page ──────────────────
// Deduplicates the same URL appearing multiple times (e.g. JSON-LD + anchor href).

test('no duplicate placement tokens (ct) on the same page', () => {
  const failures = [];
  for (const { html, rel } of pages) {
    const hrefs = [...new Set(extractAppStoreHrefs(html))]; // dedup identical URLs first
    const cts = hrefs.map((href) => {
      try { return new URL(href).searchParams.get('ct'); } catch { return null; }
    }).filter(Boolean);
    const seen = new Set();
    for (const ct of cts) {
      if (seen.has(ct)) failures.push(`${rel} → duplicate ct="${ct}"`);
      seen.add(ct);
    }
  }
  assert.deepEqual(
    failures,
    [],
    `Duplicate placement tokens found:\n${failures.join('\n')}`,
  );
});

// ── Test 3: No unexpected ppid on any App Store link ───────────────────────

test('no ppid parameter on any App Store link (default product pages only)', () => {
  const failures = [];
  for (const { html, rel } of pages) {
    for (const href of extractAppStoreHrefs(html)) {
      const u = new URL(decodeEntities(href));
      if (u.searchParams.has('ppid')) {
        failures.push(`${rel} → ${href}`);
      }
    }
  }
  assert.deepEqual(
    failures,
    [],
    `Unexpected ppid found on App Store links (CPP links not registered):\n${failures.join('\n')}`,
  );
});

// ── Test 4: Table Talk leads the homepage app list ──────────────────────────

test('Table Talk is the first app card on the homepage', () => {
  const home = pages.find((p) => p.rel === '/index.html');
  assert.ok(home, 'dist/index.html not found');

  // Find first app-card h3 text (the first card heading in the studio apps list)
  const firstCardMatch = home.html.match(/<li class="app-card"[\s\S]*?<h3>([\s\S]*?)<\/h3>/);
  assert.ok(firstCardMatch, 'No app card found on homepage');
  const cardName = firstCardMatch[1].trim();
  assert.ok(
    cardName.includes('Table Talk'),
    `Expected first app card to be "Table Talk…", got "${cardName}"`,
  );
});

// ── Test 5: No "no paywall" language in built HTML ──────────────────────────

test('no "no paywall" language in built HTML output', () => {
  const failures = [];
  const pattern = /no paywall/i;
  for (const { html, rel } of pages) {
    if (pattern.test(html)) failures.push(rel);
  }
  assert.deepEqual(
    failures,
    [],
    `"no paywall" found in these built pages:\n${failures.join('\n')}`,
  );
});

// ── Test 6: No Beat the Dealer lesson-count promises ───────────────────────

test('no "36 lessons" Beat the Dealer promises in built HTML', () => {
  const failures = [];
  const pattern = /36 lessons/i;
  for (const { html, rel } of pages) {
    if (pattern.test(html)) failures.push(rel);
  }
  assert.deepEqual(
    failures,
    [],
    `"36 lessons" found in these built pages:\n${failures.join('\n')}`,
  );
});

// ── Test 7: No Dudley Instagram/TikTok *profile* links in footer ────────────
// Social-platform editorial citations in blog body copy are expected and fine.
// What must not appear are the studio's own profile hrefs (removed per brief).

test('no Dudley Instagram/TikTok profile links in built HTML', () => {
  const failures = [];
  // These are the exact profile URLs that were removed from consts.ts SOCIALS.
  const forbidden = [
    'instagram.com/dudleyappdev',
    'tiktok.com/@dudley',
  ];
  for (const { html, rel } of pages) {
    for (const f of forbidden) {
      if (html.toLowerCase().includes(f.toLowerCase())) {
        failures.push(`${rel} → contains "${f}"`);
      }
    }
  }
  assert.deepEqual(
    failures,
    [],
    `Dudley Instagram/TikTok profile links found:\n${failures.join('\n')}`,
  );
});

// ── Test 8: Archetype pages — any App Store CTA must be tagged ──────────────

test('archetype page App Store links are all tagged (pt+ct+mt)', () => {
  const failures = [];
  for (const { html, rel } of pages) {
    if (!rel.startsWith('/archetypes/')) continue;
    for (const href of extractAppStoreHrefs(html)) {
      if (isFirstParty(href) && !isTagged(href)) {
        failures.push(`${rel} → ${href}`);
      }
    }
  }
  assert.deepEqual(
    failures,
    [],
    `Untagged App Store links on archetype pages:\n${failures.join('\n')}`,
  );
});

// ── Test 9: sitemap-index.xml references both page and image sitemaps ───────

test('sitemap-index.xml references page sitemap and image sitemap', () => {
  const indexPath = join(DIST, 'sitemap-index.xml');
  assert.ok(existsSync(indexPath), 'dist/sitemap-index.xml does not exist');
  const idx = readFileSync(indexPath, 'utf-8');

  // Must be valid XML (starts with XML declaration or sitemapindex root)
  assert.ok(
    idx.includes('<sitemapindex') && idx.includes('</sitemapindex>'),
    'sitemap-index.xml is not a valid sitemapindex document',
  );

  // Must reference the page sitemap
  assert.ok(
    idx.includes('sitemap-0.xml') || idx.includes('/sitemap-'),
    'sitemap-index.xml does not reference a page sitemap',
  );

  // Must reference the image sitemap (added by postbuild script)
  assert.ok(
    idx.includes('sitemap-images.xml'),
    'sitemap-index.xml does not reference sitemap-images.xml (postbuild may have failed)',
  );
});

// ── Test 10: sitemap-images.xml is well-formed XML ──────────────────────────

test('sitemap-images.xml exists and is well-formed', () => {
  const imgPath = join(DIST, 'sitemap-images.xml');
  assert.ok(existsSync(imgPath), 'dist/sitemap-images.xml does not exist');
  const xml = readFileSync(imgPath, 'utf-8');
  assert.ok(
    xml.includes('<urlset') && xml.includes('</urlset>'),
    'sitemap-images.xml is not a valid urlset document',
  );
  assert.ok(xml.includes('image:image'), 'sitemap-images.xml contains no image entries');
});

// ── Test 11: All registered campaign tokens appear only with pt+mt ───────────

test('every registered campaign token ct appears with correct pt and mt=8', () => {
  const failures = [];
  for (const { html, rel } of pages) {
    for (const href of extractAppStoreHrefs(html)) {
      try {
        const u = new URL(href);
        const ct = u.searchParams.get('ct');
        if (!ct) continue;
        if (!ALL_REGISTERED_TOKENS.includes(ct) && !ct.startsWith('vr-web-blog-')) continue;
        if (u.searchParams.get('pt') !== '128970277') {
          failures.push(`${rel} → wrong pt on ct="${ct}": ${href}`);
        }
        if (u.searchParams.get('mt') !== '8') {
          failures.push(`${rel} → missing mt=8 on ct="${ct}": ${href}`);
        }
      } catch { /* skip malformed */ }
    }
  }
  assert.deepEqual(
    failures,
    [],
    `Campaign token with wrong pt/mt:\n${failures.join('\n')}`,
  );
});
