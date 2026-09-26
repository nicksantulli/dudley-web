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

test('Last Human privacy policy describes the shipped app, not a pre-launch plan', () => {
  const html = readFileSync(resolve('dist/privacy/last-human/index.html'), 'utf8');
  assert.match(html, /Last Human is available on the App Store/);
  assert.match(html, /version 1\.0 as shipped/);
  assert.match(html, /PostHog/);
  assert.match(html, /Sentry/);
  assert.match(html, /non-personalized/);
  assert.match(html, /optional watch-to-continue ad remains available once per run/);
  assert.doesNotMatch(html, /coming soon|not yet available|planned|before launch/i);
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

test('Table Talk money page uses the search title, snippet, and app schema', () => {
  const html = readFileSync(resolve('dist/apps/table-talk/index.html'), 'utf8');
  assert.match(html, /<title>Table Talk: Conversation Cards for iPhone \| Dudley Development<\/title>/);
  assert.match(html, /<meta name="description" content="Free iPhone conversation starter cards — 420 prompts \+ Would You Rather\. Offline, no account\. Dinner, dates, friends, teams\."/);
  const blocks = jsonLd(html);
  const app = blocks.find((value) => value['@type'] === 'SoftwareApplication');
  assert.equal(app.name, 'Table Talk: Conversation Cards');
  assert.match(app.description, /420 prompts plus a Would You Rather deck/);
  assert.equal(app.operatingSystem, 'iOS 16.6 or later');
  assert.equal(app.applicationCategory, 'EntertainmentApplication');
  assert.equal(app.url, 'https://dudleyapps.com/apps/table-talk/');
  assert.equal(app.offers.price, '0');
  assert.equal(app.offers.priceCurrency, 'USD');
  assert.equal(app.isAccessibleForFree, true);
  assert.equal(app.aggregateRating, undefined);
  assert.equal(app.reviewCount, undefined);
  const faq = blocks.find((value) => value['@type'] === 'FAQPage');
  assert.ok(faq.mainEntity.length >= 1);
  assert.equal(faq.mainEntity[0].name, 'What is Table Talk: Conversation Cards?');
  assert.match(faq.mainEntity[0].acceptedAnswer.text, /free iPhone app/);
});

test('EconByte and Last Human money pages use short search titles and snippets', () => {
  const econ = readFileSync(resolve('dist/apps/econbyte/index.html'), 'utf8');
  const last = readFileSync(resolve('dist/apps/last-human/index.html'), 'utf8');
  const econTitle = capture(econ, /<title>([^<]+)<\/title>/i);
  const lastTitle = capture(last, /<title>([^<]+)<\/title>/i);
  assert.equal(econTitle, 'EconByte: Daily Economics for iPhone | Dudley Development');
  assert.equal(lastTitle, 'Last Human: Dodge the Bots on iPhone | Dudley Development');
  assert.ok(econTitle.length <= 60, `EconByte title is ${econTitle.length}`);
  assert.ok(lastTitle.length <= 60, `Last Human title is ${lastTitle.length}`);
  const econDesc = capture(econ, /<meta name="description" content="([^"]+)"/i);
  const lastDesc = capture(last, /<meta name="description" content="([^"]+)"/i);
  assert.equal(econDesc, 'Plain-language economics cards sourced to Fed/BLS. Five-minute daily sets. Education only — not trading tips.');
  assert.equal(lastDesc, 'Satirical iPhone arcade: dodge office bots across 50 floors before they optimize your desk. Free to play, no account, and playable offline after download.');
  assert.ok(econDesc.length <= 160, `EconByte description is ${econDesc.length}`);
  assert.ok(lastDesc.length <= 160, `Last Human description is ${lastDesc.length}`);
  assert.match(lastDesc, /offline/i);
  assert.match(econDesc, /plain-language|Education only/);
  assert.match(econDesc, /not trading tips/);
  assert.doesNotMatch(`${econTitle} ${econDesc}`, /returns|beat the market|120 cards/i);
  for (const html of [econ, last]) {
    const app = jsonLd(html).find((value) => value['@type'] === 'SoftwareApplication');
    assert.equal(app.aggregateRating, undefined);
    assert.equal(app.reviewCount, undefined);
  }
});

test('Powell Prowl and VibeRater use short search titles', () => {
  const powell = readFileSync(resolve('dist/apps/monetary-policy-independence-day/index.html'), 'utf8');
  const vibe = readFileSync(resolve('dist/apps/vibe-rater/index.html'), 'utf8');
  const powellTitle = capture(powell, /<title>([^<]+)<\/title>/i);
  const vibeTitle = capture(vibe, /<title>([^<]+)<\/title>/i);
  assert.equal(powellTitle, 'Powell Prowl: Rate Chase for iPhone | Dudley Development');
  assert.equal(vibeTitle, 'VibeRater Social for iPhone | Dudley Development');
  assert.ok(powellTitle.length <= 60, `Powell title is ${powellTitle.length}`);
  assert.ok(vibeTitle.length <= 60, `VibeRater title is ${vibeTitle.length}`);
  const powellDesc = capture(powell, /<meta name="description" content="([^"]+)"/i);
  const vibeDesc = capture(vibe, /<meta name="description" content="([^"]+)"/i);
  assert.equal(powellDesc, 'Free satirical iPhone mini-game collection. El Pres chases Le Chair across 60 levels for a rate-cut memo. Parody only, no Dudley account.');
  assert.equal(vibeDesc, 'A social app that stays playful on purpose. Rate a photo, share it with people you chose, and leave the infinite feed out of it.');
  assert.ok(powellDesc.length <= 160, `Powell description is ${powellDesc.length}`);
  assert.ok(vibeDesc.length <= 160, `VibeRater description is ${vibeDesc.length}`);
  assert.doesNotMatch(powellTitle, /tag, sniper|canoe|whack/i);
  assert.match(powell, /<h1>Powell Prowl: Rate Chase<\/h1>/);
  assert.match(vibe, /<h1>VibeRater Social<\/h1>/);
  assert.match(powell, /Chase the rate cut through sixty rounds of paper-cutout chaos\./);
  assert.match(vibe, /Rate the moment\. Keep your people close\./);
  const powellApp = jsonLd(powell).find((value) => value['@type'] === 'SoftwareApplication');
  assert.equal(powellApp.aggregateRating, undefined);
  assert.equal(powellApp.name, 'Powell Prowl: Rate Chase');
});

test('On deck and related apps link live money pages', () => {
  const home = readFileSync(resolve('dist/index.html'), 'utf8');
  const onDeck = home.match(/id="next-from-dudley"[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.match(onDeck, /Already on the App Store/);
  assert.match(onDeck, /href="\/apps\/last-human\/">Last Human</);
  assert.match(onDeck, /href="\/apps\/table-talk\/">Table Talk</);
  assert.match(onDeck, /href="\/apps\/econbyte\/">EconByte</);
  assert.match(home, /Apps that work before they ask who you are\./);
  const moreFrom = (slug) => {
    const html = readFileSync(resolve(`dist/apps/${slug}/index.html`), 'utf8');
    return html.match(/<h2>More from Dudley Development<\/h2>[\s\S]*?<\/nav>/)?.[0] ?? '';
  };
  const powell = moreFrom('monetary-policy-independence-day');
  assert.match(powell, /href="\/apps\/last-human\/"/);
  assert.match(powell, /href="\/apps\/econbyte\/"/);
  assert.match(powell, /href="\/apps\/vibe-rater\/"/);
  const vibe = moreFrom('vibe-rater');
  assert.match(vibe, /href="\/apps\/table-talk\/"/);
  assert.match(vibe, /href="\/apps\/monetary-policy-independence-day\/"/);
});

test('money-page app schema images reuse the page OG png', () => {
  for (const slug of ['last-human', 'table-talk', 'econbyte']) {
    const html = readFileSync(resolve(`dist/apps/${slug}/index.html`), 'utf8');
    const app = jsonLd(html).find((value) => value['@type'] === 'SoftwareApplication');
    const og = capture(html, /<meta property="og:image" content="([^"]+)"/i);
    assert.equal(app.image, og);
    assert.match(app.image, new RegExp(`/assets/${slug}-og\\.png$`));
    assert.equal(app.aggregateRating, undefined);
  }
});

test('Last Human, Table Talk, and EconByte cross-link without dropping existing cards', () => {
  const moreFrom = (slug) => {
    const html = readFileSync(resolve(`dist/apps/${slug}/index.html`), 'utf8');
    return html.match(/<h2>More from Dudley Development<\/h2>[\s\S]*?<\/nav>/)?.[0] ?? '';
  };
  const last = moreFrom('last-human');
  const table = moreFrom('table-talk');
  const econ = moreFrom('econbyte');
  assert.match(last, /href="\/apps\/table-talk\/"/);
  assert.match(last, /href="\/apps\/econbyte\/"/);
  assert.match(last, /href="\/apps\/monetary-policy-independence-day\/"/);
  assert.match(table, /href="\/apps\/last-human\/"/);
  assert.match(table, /href="\/apps\/econbyte\/"/);
  assert.match(table, /href="\/apps\/monetary-policy-independence-day\/"/);
  assert.match(econ, /href="\/apps\/last-human\/"/);
  assert.match(econ, /href="\/apps\/table-talk\/"/);
  assert.match(econ, /href="\/apps\/monetary-policy-independence-day\/"/);
  assert.match(econ, /href="\/apps\/vibe-rater\/"/);
});

test('EconByte built pages use the 180-card listing, not the old 120-card prices', () => {
  const econ = readFileSync(resolve('dist/apps/econbyte/index.html'), 'utf8');
  const support = readFileSync(resolve('dist/support/econbyte/index.html'), 'utf8');
  const home = readFileSync(resolve('dist/index.html'), 'utf8');
  const band = home.match(/data-app="econbyte"[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.match(band, /180 cards across 15 topics, 12 each/);
  assert.match(band, /Eight-card daily sessions/);
  assert.doesNotMatch(band, /120 cards|120 sourced|\$0\.99/);
  assert.match(econ, /180 cards/);
  assert.match(econ, /12 cards each/);
  assert.match(econ, /topic packs/i);
  assert.match(econ, /EconByte Pro/);
  assert.match(econ, /not financial or investment advice/);
  assert.doesNotMatch(econ, /120 cards|120 sourced|\$0\.99|eight cards per topic|eight cards each/);
  assert.doesNotMatch(support, /120 cards|\$0\.99/);
  const app = jsonLd(econ).find((value) => value['@type'] === 'SoftwareApplication');
  assert.match(app.featureList.join('\n'), /180 sourced cards across 15 core topics, 12 cards per topic/);
  assert.equal(app.aggregateRating, undefined);
  const last = readFileSync(resolve('dist/apps/last-human/index.html'), 'utf8');
  assert.match(last, /50 floors/);
  assert.match(last, /50 escalating office floors/);
  assert.doesNotMatch(last, /180 cards/);
});

test('Table Talk and EconByte money pages link their posts in the body', () => {
  const table = readFileSync(resolve('dist/apps/table-talk/index.html'), 'utf8');
  const tableBody = table.match(/<article class="app-body">[\s\S]*?<\/article>/)?.[0] ?? '';
  assert.match(tableBody, /href="\/blog\/phone-in-the-middle\/"/);
  assert.match(tableBody, /href="\/blog\/openers-not-interviews\/"/);
  const econ = readFileSync(resolve('dist/apps/econbyte/index.html'), 'utf8');
  const econBody = econ.match(/<article class="app-body">[\s\S]*?<\/article>/)?.[0] ?? '';
  assert.match(econBody, /href="\/blog\/why-are-prices-still-high-if-inflation-is-down\/"/);
  assert.doesNotMatch(econBody, /returns|beat the market/i);
});

test('homepage head uses the locked studio title', () => {
  const home = readFileSync(resolve('dist/index.html'), 'utf8');
  assert.match(home, /<title>Dudley Development — apps that earn the tap<\/title>/);
  const description = capture(home, /<meta name="description" content="([^"]+)"/i);
  assert.equal(description, 'Arcade satire, dinner-table cards, and plain-language tools. No signup as a cover charge.');
  assert.doesNotMatch(home, /iPhone apps, games &amp; conversation cards/);
});

test('phone-in-the-middle links to Table Talk with a descriptive anchor', () => {
  const html = readFileSync(resolve('dist/blog/phone-in-the-middle/index.html'), 'utf8');
  assert.match(html, /<a href="\/apps\/table-talk\/">Table Talk conversation cards<\/a>/);
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
  assert.match(home, /Apps that work before they ask who you are\./);
  assert.match(home, /Arcade satire, dinner-table cards, and plain-language tools\. No signup as a cover charge\./);
  assert.match(home, /Notes from the shop/);
  assert.match(home, /On deck/);
  assert.doesNotMatch(home, /In the works/);
  assert.match(home, /Arcade satire, dinner-table cards, and plain-language tools\.<\/p>/);
  assert.match(home, /Rate the moment\. Keep your people close\./);
  assert.match(home, /SendBrake: Message Check/);
  assert.match(home, /One more look before it leaves\./);
  assert.match(home, /ReplyGate: Reply or Skip/);
  assert.doesNotMatch(home, /Pick an app\. See what happens\.|LIVE ON THE APP STORE|Straight answers, useful context|Next from Dudley|Games, conversation starters, and useful things for iPhone/);
  assert.doesNotMatch(home, /Why Dudley|Polish is the point|feature-icon|class="grad"/);
  const band = (slug) => home.match(new RegExp(`<section[^>]+data-app="${slug}"[\\s\\S]*?<\\/section>`))?.[0] ?? '';
  assert.match(band('last-human'), /Play free on the App Store/);
  assert.match(band('table-talk'), /Get the deck on the App Store/);
  assert.match(band('econbyte'), /Read a card on the App Store/);
  assert.match(band('monetary-policy-independence-day'), /Chase it on the App Store/);
  assert.match(band('vibe-rater'), /Try it on the App Store/);
  assert.doesNotMatch(band('vibe-rater'), /VibeMeter|VibeRodeo|VibeShop|Radar|Rise/);
  assert.match(band('last-human'), /50 escalating office floors/);
  assert.match(band('send-brake'), /One more look before it leaves\./);
  assert.match(band('send-brake'), /Paste a draft you&#39;re about to send\. Get three next steps\./);
  assert.match(band('send-brake'), /One draft, three possible next steps/);
  assert.match(band('send-brake'), /Coming soon/);
  assert.doesNotMatch(band('send-brake'), /href="\/apps\/send-brake\//);
  assert.match(band('reply-gate'), /ReplyGate: Reply or Skip/);
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
