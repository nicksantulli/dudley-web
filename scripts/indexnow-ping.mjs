#!/usr/bin/env node
// Ping the IndexNow API with the URLs that changed in a gh-pages deploy so Bing
// (and other IndexNow engines: Yandex, Seznam, Naver) index them in minutes
// instead of waiting to be crawled. Called by scripts/deploy-gh-pages.mjs after
// a successful push. DUD-209.
//
// The IndexNow key is the stem of the key file we serve at the domain root:
// public/<key>.txt (its contents == the stem). This module auto-discovers it,
// so there is no second place to update.

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ORIGIN = 'https://dudleyapps.com';
const HOST = 'dudleyapps.com';
const ENDPOINT = 'https://api.indexnow.com/IndexNow';

// Find the IndexNow key file in public/ (32-hex stem, content == stem).
export function findKey(publicDir = 'public') {
  const file = readdirSync(publicDir).find((f) => /^[0-9a-f]{16,128}\.txt$/.test(f));
  if (!file) return null;
  const stem = file.replace(/\.txt$/, '');
  const content = readFileSync(join(publicDir, file), 'utf8').trim();
  return content === stem ? { key: stem, keyLocation: `${ORIGIN}/${file}` } : null;
}

// Map a gh-pages worktree path (e.g. "apps/vibe-rater/index.html") to its URL.
export function pathToUrl(p) {
  let rel = p.replace(/^\.?\//, '');
  if (rel === 'index.html') return `${ORIGIN}/`;
  rel = rel.replace(/index\.html$/, '').replace(/\.html$/, '/');
  return `${ORIGIN}/${rel}`.replace(/([^:])\/{2,}/g, '$1/');
}

// Submit a list of URLs. No-op (returns a reason) when key or URLs are missing.
export async function pingIndexNow(urls) {
  const unique = [...new Set(urls)].filter(Boolean);
  if (unique.length === 0) return { ok: false, skipped: 'no changed URLs' };
  const key = findKey();
  if (!key) return { ok: false, skipped: 'no IndexNow key file in public/' };

  const payload = { host: HOST, key: key.key, keyLocation: key.keyLocation, urlList: unique };
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });
    // IndexNow returns 200 (accepted) or 202 (accepted, validation pending).
    return { ok: res.status === 200 || res.status === 202, status: res.status, count: unique.length };
  } catch (err) {
    return { ok: false, error: String(err), count: unique.length };
  }
}

// CLI: `node scripts/indexnow-ping.mjs <url> [url...]` for manual re-submits.
if (import.meta.url === `file://${process.argv[1]}`) {
  const urls = process.argv.slice(2);
  if (urls.length === 0) {
    console.error('usage: node scripts/indexnow-ping.mjs <url> [url...]');
    process.exit(1);
  }
  const r = await pingIndexNow(urls);
  console.log('IndexNow:', JSON.stringify(r));
  process.exit(r.ok ? 0 : 1);
}
