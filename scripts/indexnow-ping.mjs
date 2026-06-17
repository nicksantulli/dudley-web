#!/usr/bin/env node
// IndexNow ping script — submits one or more URLs to IndexNow (Bing/Yandex/etc.)
// Usage: node scripts/indexnow-ping.mjs <url> [url...]
// Key file must be live at: https://dudleyapps.com/f6225bfd34b9bfaf4d5f00d578fb4824.txt

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const KEY = 'f6225bfd34b9bfaf4d5f00d578fb4824';
const HOST = 'dudleyapps.com';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

const urls = process.argv.slice(2);
if (!urls.length) {
  console.error('Usage: node scripts/indexnow-ping.mjs <url> [url...]');
  process.exit(1);
}

const body = JSON.stringify({
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: urls,
});

console.log(`IndexNow: submitting ${urls.length} URL(s)...`);
urls.forEach(u => console.log(`  ${u}`));

const res = await fetch(INDEXNOW_ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body,
});

console.log(`IndexNow: HTTP ${res.status} ${res.statusText}`);
if (res.status === 200 || res.status === 202) {
  console.log('IndexNow: submitted successfully.');
} else {
  const text = await res.text().catch(() => '');
  console.error('IndexNow: unexpected response:', text);
  process.exit(1);
}
