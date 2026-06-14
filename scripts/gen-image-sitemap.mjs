#!/usr/bin/env node
// Generate a Google image sitemap (sitemap-images.xml) from the built site and
// wire it into the existing sitemap index — runs automatically as `postbuild`,
// so `npm run build` / `npm run deploy` always emit a fresh one.
//
// Why a separate script instead of @astrojs/sitemap's image support: the plugin
// only knows page URLs, not which <img> live on each page. We crawl the built
// HTML in dist/ for real, on-page images (plus the og:image), which is exactly
// what Google's image sitemap wants — and it auto-grows as content is added.
//
// Output: dist/sitemap-images.xml, and a patched dist/sitemap-index.xml that
// references both the page sitemap and the image sitemap. robots.txt lists the
// image sitemap too (static, see public/robots.txt). DUD-209.

import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';
const ORIGIN = 'https://dudleyapps.com';
const xmlEscape = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

if (!existsSync(DIST)) throw new Error('dist/ not found — run `astro build` first');

// Recursively collect every .html file under dist/.
function htmlFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...htmlFiles(p));
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}

// Map a built HTML file path to its canonical site URL (trailing slash).
function pageUrl(file) {
  let rel = relative(DIST, file).replace(/\\/g, '/');
  if (rel === 'index.html') return `${ORIGIN}/`;
  rel = rel.replace(/index\.html$/, '').replace(/\.html$/, '/');
  return `${ORIGIN}/${rel}`.replace(/([^:])\/{2,}/g, '$1/');
}

// Resolve an image src (possibly relative) to an absolute on-site URL. Skips
// external/data URIs — an image sitemap should only list images we host.
function absImage(src) {
  if (!src) return null;
  if (src.startsWith('data:')) return null;
  if (/^https?:\/\//.test(src)) return src.startsWith(ORIGIN) ? src : null;
  if (src.startsWith('//')) return null;
  const path = src.startsWith('/') ? src : `/${src}`;
  return `${ORIGIN}${path}`.replace(/([^:])\/{2,}/g, '$1/');
}

// Extract on-page image URLs from one HTML string: <img src>, <source srcset>,
// and the og:image meta. De-duped, host-only.
function imagesIn(html) {
  const found = new Set();
  for (const m of html.matchAll(/<img\b[^>]*?\bsrc=["']([^"']+)["']/gi)) {
    const u = absImage(m[1]);
    if (u) found.add(u);
  }
  for (const m of html.matchAll(/<meta\b[^>]*?property=["']og:image["'][^>]*?content=["']([^"']+)["']/gi)) {
    const u = absImage(m[1]);
    if (u) found.add(u);
  }
  return [...found];
}

// Keep the image sitemap aligned with the page sitemap: skip the same
// non-discovery pages @astrojs/sitemap filters out (privacy/support/404).
const SKIP = /\/(privacy|support|404)(\/|$)/;

const pages = htmlFiles(DIST)
  .map((file) => ({ url: pageUrl(file), images: imagesIn(readFileSync(file, 'utf8')) }))
  .filter((p) => p.images.length > 0 && !SKIP.test(p.url))
  .sort((a, b) => a.url.localeCompare(b.url));

const imageCount = pages.reduce((n, p) => n + p.images.length, 0);

// Build sitemap-images.xml
const body = pages
  .map((p) => {
    const imgs = p.images
      .map((u) => `\n    <image:image><image:loc>${xmlEscape(u)}</image:loc></image:image>`)
      .join('');
    return `  <url>\n    <loc>${xmlEscape(p.url)}</loc>${imgs}\n  </url>`;
  })
  .join('\n');

const imageSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${body}
</urlset>
`;
writeFileSync(join(DIST, 'sitemap-images.xml'), imageSitemap);

// Patch sitemap-index.xml to also list the image sitemap (idempotent).
const indexPath = join(DIST, 'sitemap-index.xml');
if (existsSync(indexPath)) {
  let idx = readFileSync(indexPath, 'utf8');
  const imageLoc = `${ORIGIN}/sitemap-images.xml`;
  if (!idx.includes(imageLoc)) {
    idx = idx.replace(
      '</sitemapindex>',
      `<sitemap><loc>${imageLoc}</loc></sitemap></sitemapindex>`,
    );
    writeFileSync(indexPath, idx);
  }
} else {
  console.warn('sitemap-index.xml not found — image sitemap written but not referenced from index.');
}

console.log(`image sitemap: ${imageCount} images across ${pages.length} pages → dist/sitemap-images.xml`);
