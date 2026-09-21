import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { normalizePublicPath } from '../src/lib/urls.mjs';

const DIST = resolve('dist');

function* walkHtml(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walkHtml(full);
    else if (entry.isFile() && entry.name.endsWith('.html')) yield full;
  }
}

function htmlPages() {
  return [...walkHtml(DIST)].map((path) => ({
    path,
    rel: path.replace(DIST, '') || '/',
    html: readFileSync(path, 'utf8'),
  }));
}

const capture = (html, pattern) => html.match(pattern)?.[1]?.trim() ?? '';

test('site integrity suite is wired', () => {});

test('normalizePublicPath adds slashes only to HTML routes', () => {
  assert.equal(normalizePublicPath('/about'), '/about/');
  assert.equal(normalizePublicPath('/about/'), '/about/');
  assert.equal(normalizePublicPath('/'), '/');
  assert.equal(normalizePublicPath('/llms.txt'), '/llms.txt');
  assert.equal(normalizePublicPath('/blog/rss.xml'), '/blog/rss.xml');
});

test('every indexable HTML page has one slash-normalized canonical', () => {
  for (const page of htmlPages()) {
    if (/<meta name="robots" content="[^"]*noindex/i.test(page.html)) continue;
    const links = [...page.html.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(links.length, 1, `${page.rel} canonical count`);
    assert.match(links[0], /^https:\/\/dudleyapps\.com\/(?:$|.*\/$)/, `${page.rel} canonical slash`);
  }
});

test('robots explicitly allows OAI-SearchBot and names both sitemaps', () => {
  const robots = readFileSync(resolve('dist/robots.txt'), 'utf8');
  assert.match(robots, /User-agent: OAI-SearchBot\nAllow: \//);
  assert.match(robots, /sitemap-index\.xml/);
  assert.match(robots, /sitemap-images\.xml/);
});

test('indexable titles and descriptions are present and unique', () => {
  const seen = new Map();
  for (const page of htmlPages()) {
    if (/<meta name="robots" content="[^"]*noindex/i.test(page.html)) continue;
    const title = capture(page.html, /<title>([^<]+)<\/title>/i);
    const description = capture(page.html, /<meta name="description" content="([^"]+)"/i);
    assert.ok(title && description, `${page.rel} needs title and description`);
    const key = `${title}\n${description}`;
    assert.ok(!seen.has(key), `${page.rel} duplicates ${seen.get(key)}`);
    seen.set(key, page.rel);
  }
});

test('root-relative HTML links resolve to built routes', () => {
  for (const page of htmlPages()) {
    for (const match of page.html.matchAll(/href="(\/[^"]*)"/g)) {
      const pathname = match[1].split(/[?#]/)[0];
      if (!pathname || /\.[a-z0-9]+$/i.test(pathname)) continue;
      const target = pathname === '/'
        ? resolve('dist/index.html')
        : resolve('dist', pathname.replace(/^\//, ''), 'index.html');
      assert.ok(existsSync(target), `${page.rel} links to missing ${pathname}`);
    }
  }
});
