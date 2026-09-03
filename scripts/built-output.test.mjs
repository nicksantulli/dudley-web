/**
 * Built-output regression tests for dudley-web.
 *
 * Run via `npm test` (which first runs `npm run build`):
 *   npm test
 *
 * Or after a manual build:
 *   node --test scripts/built-output.test.mjs
 *
 * Checks:
 *   1.  No bare first-party App Store links in HTML pages.
 *   2a. No duplicate placement tokens (ct) on the same page.
 *   2b. No static ct used on pages outside its registered path pattern.
 *   3.  No ppid parameter on any App Store link.
 *   4.  Table Talk is the first app card on the homepage.
 *   5.  No "no paywall" language in built HTML.
 *   6.  No "36 lessons" Beat the Dealer promises in built HTML.
 *   7.  No Dudley Instagram/TikTok profile links in built HTML.
 *   8.  Archetype pages: any retained App Store CTA must carry pt+ct+mt.
 *   9.  sitemap-index.xml references page sitemap and image sitemap.
 *   10. sitemap-images.xml is well-formed.
 *   11. Every App Store ct in built output is a registered token (static or
 *       matching a registered blog-token pattern); unregistered/improvised
 *       tokens are a hard failure.
 *   12. Every App Store href pairs its ct with the correct Apple app ID
 *       (e.g. tabletalk-web-home on a VibeRater URL must fail).
 *   13. llms.txt App Store links: registered token, correct app ID, pt/mt,
 *       no ppid.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import {
  FIRST_PARTY_APP_IDS,
  resolveTokenDefinition,
  isTemplateClassToken,
  isExactExpectedBlogToken,
} from '../src/lib/campaignLinks.mjs';

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

/** Extract all href="…apps.apple.com…" anchor values from HTML (decoded). */
function extractAppStoreHrefs(html) {
  const re = /href="(https:\/\/apps\.apple\.com[^"]*)"/g;
  const results = [];
  let m;
  while ((m = re.exec(html)) !== null) results.push(decodeEntities(m[1]));
  return results;
}

/** Extract all apps.apple.com URLs from plain text (e.g. llms.txt). */
function extractAppStoreUrlsFromText(text) {
  const re = /https:\/\/apps\.apple\.com[^\s)>"]*/g;
  return [...text.matchAll(re)].map((m) => decodeEntities(m[0]));
}

/** Decode HTML entities so URLs are comparable. */
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

/** Extract the App Store app ID from a URL (handles /app/id<id> and /app/<slug>/id<id>). */
function extractAppId(url) {
  const m = url.match(/\/id(\d{10,})/);
  return m ? m[1] : null;
}

/**
 * Resolve a ct to its registered appId.
 * Returns { appId, isGlob, pathPattern } or null if completely unrecognised.
 *
 * Static tokens: looked up directly in CT_TO_APP_ID.
 * Blog tokens: matched against BLOG_TOKEN_PATTERNS.
 */
// Return true if a built page path matches a registered path pattern.
// Built paths are like /archetypes/main-character/index.html — we strip
// 'index.html' to get the logical path for matching.
// Patterns ending in '*/' are globs matching any single segment below the prefix:
//   '/foo/'          → exact match
//   '/archetypes/*/' → any page under /archetypes/
//   '/blog/*/'       → any page under /blog/
function pathMatchesPattern(pagePath, pattern) {
  // Normalise: /foo/index.html → /foo/  and  /index.html → /
  const logical = pagePath.replace(/index\.html$/, '').replace(/\/$/, '') + '/';
  const logicalNorm = logical === '//' ? '/' : logical;

  if (!pattern.includes('*')) return logicalNorm === pattern;
  const prefix = pattern.replace('*/', '');
  return logicalNorm.startsWith(prefix);
}

// ── Collect all pages once ─────────────────────────────────────────────────

const pages = [...walkHtml(DIST)].map((path) => ({
  path,
  html: readFileSync(path, 'utf-8'),
  rel: path.replace(DIST, ''),
}));

// ── Test 1: No bare first-party App Store links ────────────────────────────

test('no bare first-party App Store links in built output', () => {
  const failures = [];
  for (const { html, rel } of pages) {
    for (const href of extractAppStoreHrefs(html)) {
      if (isFirstParty(href) && !isTagged(href)) {
        failures.push(`${rel} → ${href}`);
      }
    }
  }
  assert.deepEqual(failures, [], `Bare (untagged) first-party App Store links found:\n${failures.join('\n')}`);
});

// ── Test 2a: No duplicate placement tokens on the same page ───────────────

test('no duplicate placement tokens (ct) on the same page', () => {
  const failures = [];
  for (const { html, rel } of pages) {
    const hrefs = [...new Set(extractAppStoreHrefs(html))];
    const cts = hrefs.map((href) => { try { return new URL(href).searchParams.get('ct'); } catch { return null; } }).filter(Boolean);
    const seen = new Set();
    for (const ct of cts) {
      if (seen.has(ct)) failures.push(`${rel} → duplicate ct="${ct}"`);
      seen.add(ct);
    }
  }
  assert.deepEqual(failures, [], `Duplicate placement tokens on same page:\n${failures.join('\n')}`);
});

// ── Test 2b: Every static ct used only on pages matching its registered path ─
// Tokens registered with a glob path (e.g. /archetypes/*/) may appear on any
// page matching that glob — that is the intentional design for template-class
// tokens. What must not happen is a token appearing on a page outside its
// registered pattern.

test('every ct used only on pages matching its registered path pattern', () => {
  const failures = [];
  // Build ct → Set<rel> across all pages
  const ctToPages = new Map();
  for (const { html, rel } of pages) {
    for (const href of [...new Set(extractAppStoreHrefs(html))]) {
      try {
        const ct = new URL(href).searchParams.get('ct');
        if (!ct) continue;
        if (!ctToPages.has(ct)) ctToPages.set(ct, new Set());
        ctToPages.get(ct).add(rel);
      } catch { /* skip malformed */ }
    }
  }

  for (const [ct, usedOnPages] of ctToPages) {
    const resolved = resolveTokenDefinition(ct);
    if (!resolved) continue; // unregistered — caught by test 11
    if (resolved.kind !== 'static') continue;
    const pathPattern = resolved.path;
    for (const pagePath of usedOnPages) {
      if (!pathMatchesPattern(pagePath, pathPattern)) {
        failures.push(`ct="${ct}" (registered for "${pathPattern}") found on ${pagePath}`);
      }
    }
  }
  assert.deepEqual(failures, [], `Token used outside registered path pattern:\n${failures.join('\n')}`);
});

// ── Test 2c: Non-template ct appears on only one logical path ───────────────
// Non-template tokens are path-unique. The only tokens permitted across many
// pages are explicit template-class tokens exported by campaignLinks.mjs.
test('non-template campaign tokens appear on only one logical path', () => {
  const ctToLogicalPaths = new Map();
  for (const { html, rel } of pages) {
    const logical = rel.replace(/index\.html$/, '') || '/';
    for (const href of [...new Set(extractAppStoreHrefs(html))]) {
      try {
        const ct = new URL(href).searchParams.get('ct');
        if (!ct) continue;
        if (!ctToLogicalPaths.has(ct)) ctToLogicalPaths.set(ct, new Set());
        ctToLogicalPaths.get(ct).add(logical);
      } catch { /* skip malformed */ }
    }
  }
  const llmsPath = join(DIST, 'llms.txt');
  if (existsSync(llmsPath)) {
    const txt = readFileSync(llmsPath, 'utf-8');
    for (const url of [...new Set(extractAppStoreUrlsFromText(txt))]) {
      try {
        const ct = new URL(url).searchParams.get('ct');
        if (!ct) continue;
        if (!ctToLogicalPaths.has(ct)) ctToLogicalPaths.set(ct, new Set());
        ctToLogicalPaths.get(ct).add('/llms.txt');
      } catch { /* skip malformed */ }
    }
  }

  const failures = [];
  for (const [ct, paths] of ctToLogicalPaths) {
    if (isTemplateClassToken(ct)) continue;
    if (paths.size > 1) {
      failures.push(`ct="${ct}" used on multiple logical paths: ${[...paths].join(', ')}`);
    }
  }
  assert.deepEqual(failures, [], `Non-template ct reused across paths:\n${failures.join('\n')}`);
});

// ── Test 3: No ppid on any App Store link ─────────────────────────────────

test('no ppid parameter on any App Store link', () => {
  const failures = [];
  for (const { html, rel } of pages) {
    for (const href of extractAppStoreHrefs(html)) {
      try {
        if (new URL(href).searchParams.has('ppid')) failures.push(`${rel} → ${href}`);
      } catch { /* skip */ }
    }
  }
  assert.deepEqual(failures, [], `Unexpected ppid on App Store links:\n${failures.join('\n')}`);
});

// ── Test 4: Table Talk is first app card on homepage ──────────────────────

test('Table Talk is the first app card on the homepage', () => {
  const home = pages.find((p) => p.rel === '/index.html');
  assert.ok(home, 'dist/index.html not found');
  const firstCardMatch = home.html.match(/<li class="app-card"[\s\S]*?<h3>([\s\S]*?)<\/h3>/);
  assert.ok(firstCardMatch, 'No app card found on homepage');
  const cardName = firstCardMatch[1].trim();
  assert.ok(cardName.includes('Table Talk'), `Expected first app card to be "Table Talk…", got "${cardName}"`);
});

// ── Test 5: No "no paywall" language ──────────────────────────────────────

test('no "no paywall" language in built HTML output', () => {
  const failures = [];
  for (const { html, rel } of pages) {
    if (/no paywall/i.test(html)) failures.push(rel);
  }
  assert.deepEqual(failures, [], `"no paywall" found in:\n${failures.join('\n')}`);
});

// ── Test 6: No "36 lessons" Beat the Dealer promises ─────────────────────

test('no "36 lessons" Beat the Dealer promises in built HTML', () => {
  const failures = [];
  for (const { html, rel } of pages) {
    if (/36 lessons/i.test(html)) failures.push(rel);
  }
  assert.deepEqual(failures, [], `"36 lessons" found in:\n${failures.join('\n')}`);
});

// ── Test 7: No Dudley Instagram/TikTok profile links ─────────────────────

test('no Dudley Instagram/TikTok profile links in built HTML', () => {
  const failures = [];
  const forbidden = ['instagram.com/dudleyappdev', 'tiktok.com/@dudley'];
  // What must not appear are the studio's own profile hrefs (removed from consts.ts SOCIALS).
  for (const { html, rel } of pages) {
    for (const f of forbidden) {
      if (html.toLowerCase().includes(f.toLowerCase())) failures.push(`${rel} → "${f}"`);
    }
  }
  assert.deepEqual(failures, [], `Dudley Instagram/TikTok profile links found:\n${failures.join('\n')}`);
});

// ── Test 8: Archetype page App Store CTAs are tagged ──────────────────────
// Archetype pages retain their existing VibeRater CTA with token
// vr-web-archetype-aug26-v1. This test verifies the CTA is correctly tagged
// (pt + ct + mt=8) and catches any future regression where a bare link is
// introduced on these pages.

test('archetype page App Store links are all tagged (pt+ct+mt)', () => {
  const failures = [];
  for (const { html, rel } of pages) {
    if (!rel.startsWith('/archetypes/')) continue;
    for (const href of extractAppStoreHrefs(html)) {
      if (isFirstParty(href) && !isTagged(href)) failures.push(`${rel} → ${href}`);
    }
  }
  assert.deepEqual(failures, [], `Untagged App Store links on archetype pages:\n${failures.join('\n')}`);
});

// ── Test 9: sitemap-index.xml integrity ───────────────────────────────────

test('sitemap-index.xml references page sitemap and image sitemap', () => {
  const indexPath = join(DIST, 'sitemap-index.xml');
  assert.ok(existsSync(indexPath), 'dist/sitemap-index.xml does not exist');
  const idx = readFileSync(indexPath, 'utf-8');
  assert.ok(idx.includes('<sitemapindex') && idx.includes('</sitemapindex>'), 'not a valid sitemapindex document');
  assert.ok(idx.includes('sitemap-0.xml') || idx.includes('/sitemap-'), 'does not reference a page sitemap');
  assert.ok(idx.includes('sitemap-images.xml'), 'does not reference sitemap-images.xml (postbuild may have failed)');
});

// ── Test 10: sitemap-images.xml integrity ────────────────────────────────

test('sitemap-images.xml exists and is well-formed', () => {
  const imgPath = join(DIST, 'sitemap-images.xml');
  assert.ok(existsSync(imgPath), 'dist/sitemap-images.xml does not exist');
  const xml = readFileSync(imgPath, 'utf-8');
  assert.ok(xml.includes('<urlset') && xml.includes('</urlset>'), 'not a valid urlset document');
  assert.ok(xml.includes('image:image'), 'contains no image entries');
});

// ── Test 11: Every ct in built output is a registered token ──────────────
// No improvised or unregistered tokens are permitted. A ct must either be
// in ALL_REGISTERED_TOKENS (static registry) or match a registered blog-token
// pattern (per-post generators). Any other value is a hard failure.

test('every App Store ct in built output is a registered token', () => {
  const failures = [];
  for (const { html, rel } of pages) {
    for (const href of [...new Set(extractAppStoreHrefs(html))]) {
      try {
        const ct = new URL(href).searchParams.get('ct');
        if (!ct) continue;
        if (resolveTokenDefinition(ct) === null) {
          failures.push(`${rel} → unregistered ct="${ct}": ${href}`);
        }
      } catch { /* skip malformed */ }
    }
  }
  assert.deepEqual(failures, [], `Unregistered/improvised campaign tokens found:\n${failures.join('\n')}`);
});

// ── Test 11b: Blog page CTA tokens are exact deterministic slug tokens ──────
// For blog pages, any dynamic blog token must exactly equal the token generated
// for that page slug + app pair (no broad regex loophole).
test('blog page dynamic tokens match exact expected slug+app token', () => {
  const failures = [];
  for (const { html, rel } of pages) {
    if (!rel.startsWith('/blog/')) continue;
    for (const href of [...new Set(extractAppStoreHrefs(html))]) {
      const appId = extractAppId(href);
      if (!appId) continue;
      try {
        const ct = new URL(href).searchParams.get('ct');
        if (!ct) continue;
        const def = resolveTokenDefinition(ct);
        if (!def || def.kind !== 'blog-dynamic') continue;
        if (!isExactExpectedBlogToken(ct, rel, appId)) {
          failures.push(`${rel} → dynamic ct="${ct}" does not match expected slug+app token for app ${appId}`);
        }
      } catch { /* skip malformed */ }
    }
  }
  assert.deepEqual(failures, [], `Blog dynamic token mismatch:\n${failures.join('\n')}`);
});

// ── Test 12: Every ct paired with correct Apple app ID ───────────────────
// e.g. tabletalk-web-home on a VibeRater URL must fail.

test('every App Store ct is paired with the correct app ID', () => {
  const failures = [];
  for (const { html, rel } of pages) {
    for (const href of [...new Set(extractAppStoreHrefs(html))]) {
      try {
        const u = new URL(href);
        const ct = u.searchParams.get('ct');
        if (!ct) continue;
        const resolved = resolveTokenDefinition(ct);
        if (!resolved) continue; // caught by test 11
        const hrefAppId = extractAppId(href);
        if (hrefAppId && resolved.appId !== hrefAppId) {
          failures.push(`${rel} → ct="${ct}" registered for app ${resolved.appId} but href targets app ${hrefAppId}: ${href}`);
        }
      } catch { /* skip malformed */ }
    }
  }
  assert.deepEqual(failures, [], `ct/appId mismatch:\n${failures.join('\n')}`);
});

// ── Test 13: llms.txt App Store links ────────────────────────────────────
// Machine-readable output must also carry registered tokens, correct app IDs,
// pt=128970277, mt=8, and no ppid.

test('llms.txt App Store links are tagged, registered, and correctly paired', () => {
  const llmsPath = join(DIST, 'llms.txt');
  assert.ok(existsSync(llmsPath), 'dist/llms.txt does not exist');
  const text = readFileSync(llmsPath, 'utf-8');
  const failures = [];

  for (const url of extractAppStoreUrlsFromText(text)) {
    if (!isFirstParty(url)) continue;

    if (!isTagged(url)) {
      failures.push(`llms.txt → bare (untagged): ${url}`);
      continue;
    }

    let ct, u;
    try { u = new URL(url); ct = u.searchParams.get('ct'); } catch { continue; }

    if (u.searchParams.has('ppid')) {
      failures.push(`llms.txt → ppid on: ${url}`);
    }

    const resolved = resolveTokenDefinition(ct);
    if (!resolved) {
      failures.push(`llms.txt → unregistered ct="${ct}": ${url}`);
      continue;
    }

    const hrefAppId = extractAppId(url);
    if (hrefAppId && resolved.appId !== hrefAppId) {
      failures.push(`llms.txt → ct="${ct}" registered for app ${resolved.appId} but targets app ${hrefAppId}: ${url}`);
    }
  }

  assert.deepEqual(failures, [], `llms.txt attribution failures:\n${failures.join('\n')}`);
});
