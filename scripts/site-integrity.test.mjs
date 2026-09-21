import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
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
const jsonLd = (html) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  .flatMap((match) => {
    const value = JSON.parse(match[1]);
    return Array.isArray(value) ? value : [value];
  });

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

test('legacy tag pages are noindex and absent from the page sitemap', () => {
  const sitemap = readFileSync(resolve('dist/sitemap-0.xml'), 'utf8');
  assert.doesNotMatch(sitemap, /\/blog\/tags\//);
  const legacy = readFileSync(resolve('dist/blog/tags/privacy/index.html'), 'utf8');
  assert.match(legacy, /<meta name="robots" content="noindex,follow"/);
});

test('an unmapped freeform tag is text, not a dead link', () => {
  const article = readFileSync(resolve('dist/blog/npc-defense/index.html'), 'utf8');
  assert.match(article, />Archetype Deep Dive</);
  assert.doesNotMatch(article, /href="\/blog\/tags\/archetype-deep-dive\//);
});

test('Last Human live facts agree across HTML and llms.txt', () => {
  const outputs = [
    readFileSync(resolve('dist/apps/last-human/index.html'), 'utf8'),
    readFileSync(resolve('dist/index.html'), 'utf8'),
    readFileSync(resolve('dist/llms.txt'), 'utf8'),
  ];
  for (const output of outputs) {
    assert.match(output, /Last Human/);
    assert.match(output, /6808782611|Live on the App Store/);
    assert.doesNotMatch(output, /Last Human[\s\S]{0,180}coming soon/i);
  }
});

test('article schema links a person, publisher, dates, and main entity', () => {
  const html = readFileSync(resolve('dist/blog/can-iphone-apps-see-your-contacts/index.html'), 'utf8');
  assert.match(html, /"@type":"BlogPosting"/);
  assert.match(html, /"author":\{"@type":"Person"/);
  assert.match(html, /"publisher":\{"@id":"https:\/\/dudleyapps\.com\/#organization"\}/);
  assert.match(html, /"dateModified":/);
  assert.match(html, /"mainEntityOfPage":/);
});

test('every JSON-LD block parses', () => {
  for (const page of htmlPages()) {
    const blocks = [...page.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    blocks.forEach((match, index) => assert.doesNotThrow(() => JSON.parse(match[1]), `${page.rel} JSON-LD block ${index}`));
  }
});

test('representative schema facts match visible pages', () => {
  const appHtml = readFileSync(resolve('dist/apps/last-human/index.html'), 'utf8');
  const app = jsonLd(appHtml).find((value) => value['@type'] === 'SoftwareApplication');
  assert.equal(app.name, 'Last Human: Dodge the Bots');
  assert.match(app.downloadUrl, /id6808782611/);
  assert.match(appHtml, new RegExp(app.name));
  assert.match(appHtml, /Live on the App Store/);

  const postHtml = readFileSync(resolve('dist/blog/can-iphone-apps-see-your-contacts/index.html'), 'utf8');
  const post = jsonLd(postHtml).find((value) => value['@type'] === 'BlogPosting');
  assert.match(postHtml, new RegExp(post.headline.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(postHtml, new RegExp(`datetime="${post.datePublished.slice(0, 10)}`));
  assert.match(postHtml, new RegExp(`datetime="${post.dateModified.slice(0, 10)}`));
});

test('shared shell uses the optimized visible mark and avoids rejected copy', () => {
  const home = readFileSync(resolve('dist/index.html'), 'utf8');
  assert.match(home, /src="\/assets\/dudley-mark-header\.webp"/);
  assert.doesNotMatch(home, /Independent iOS studio|small apps with real character/i);
});

test('homepage ships no Astro hydration', () => {
  const home = readFileSync(resolve('dist/index.html'), 'utf8');
  assert.doesNotMatch(home, /astro-island|client:(?:load|idle|visible|media|only)/);
});

test('homepage uses the approved product-first message', () => {
  const home = readFileSync(resolve('dist/index.html'), 'utf8');
  assert.match(home, /Pick an app\. See what happens\./);
  assert.match(home, /Games, conversation starters, and useful things for iPhone\./);
  assert.doesNotMatch(home, /Why Dudley|Polish is the point|feature-icon|class="grad"/);
});

test('client work has attribution and a tagged store action without a broken detail link', () => {
  const home = readFileSync(resolve('dist/index.html'), 'utf8');
  const band = home.match(/<section[^>]+data-app="dude-wheres-this-house"[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.match(band, /Built for HomeLight|Created for HomeLight/);
  assert.match(band, /id6779785617\?pt=128970277&(?:amp;)?ct=/);
  assert.doesNotMatch(band, /href="\/apps\/dude-wheres-this-house\//);
});

test('app pages expose pricing, account, offline, and privacy facts', () => {
  const html = readFileSync(resolve('dist/apps/last-human/index.html'), 'utf8');
  for (const label of ['Pricing', 'Account', 'Offline', 'Privacy']) {
    assert.match(html, new RegExp(`>${label}<`));
  }
  assert.match(html, /Live on the App Store/);
});

test('answer articles lead with a summary and provenance', () => {
  const html = readFileSync(resolve('dist/blog/can-iphone-apps-see-your-contacts/index.html'), 'utf8');
  assert.match(html, /class="answer-summary"/);
  assert.match(html, /Written by Nicholas Santulli/);
  assert.match(html, /<time/);
});

test('discovery pages contain no rejected studio copy', () => {
  const discovery = htmlPages().filter((page) => !page.rel.startsWith('/privacy/'));
  for (const page of discovery) {
    assert.doesNotMatch(page.html, /Independent iOS studio|small apps with real character|Polish is the point/i, page.rel);
  }
});

test('every HTML page has one h1 and a skip-link target', () => {
  for (const page of htmlPages()) {
    assert.equal([...page.html.matchAll(/<h1\b/g)].length, 1, `${page.rel} h1 count`);
    assert.match(page.html, /href="#main"/);
    assert.match(page.html, /id="main"/);
  }
});

test('shared and rendered assets stay within budgets', () => {
  assert.ok(statSync(resolve('public/assets/dudley-mark.svg')).size < 5_000);
  assert.ok(statSync(resolve('public/assets/dudley-mark-header.webp')).size <= 12_000);
  assert.ok(statSync(resolve('public/assets/dudley-mark-logo.png')).size <= 150_000);
  assert.ok(statSync(resolve('public/assets/style.css')).size <= 45_000);
  for (const name of ['last-human-icon', 'table-talk-icon', 'vibe-rater-icon', 'econbyte-icon', 'powell-prowl-icon', 'dude-wheres-this-house-icon']) {
    const files = ['avif', 'webp', 'png'].map((ext) => resolve(`public/assets/${name}.${ext}`)).filter(existsSync);
    assert.ok(files.some((file) => statSync(file).size <= 100_000), `${name} lacks a <=100 KB source`);
  }
});

test('homepage app bands deliver WebP sources without the legacy lockup', () => {
  const home = readFileSync(resolve('dist/index.html'), 'utf8');
  const bands = [...home.matchAll(/<section[^>]+data-app="[^"]+"[\s\S]*?<\/section>/g)].map((match) => match[0]);
  assert.ok(bands.length >= 7);
  bands.forEach((band) => assert.match(band, /<source[^>]+type="image\/webp"/));
  assert.doesNotMatch(home, /dudley-lockup\.png/);
  for (const page of htmlPages()) assert.doesNotMatch(page.html, /dudley-lockup\.png/, page.rel);
});
