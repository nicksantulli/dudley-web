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
  const article = readFileSync(resolve('dist/blog/what-does-not-enough-ratings-mean-app-store/index.html'), 'utf8');
  assert.match(article, />Indie Apps</);
  assert.doesNotMatch(article, /href="\/blog\/tags\/indie-apps\//);
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
  assert.match(html, /version 1\.0\.1/);
  assert.match(html, /PostHog/);
  assert.match(html, /Sentry/);
  assert.match(html, /non-personalized/);
  assert.match(html, /optional rewarded ad can also let you continue a run/);
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
  assert.match(html, /<meta name="description" content="420 free conversation cards for iPhone, plus Would You Rather\. Works offline with no account\. For dinners, dates, friends and teams\."/);
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
  assert.equal(econDesc, 'Plain-language economics cards, each citing an official source and date. Five-minute daily sets. Education only, not financial advice.');
  assert.equal(lastDesc, 'Satirical iPhone arcade: dodge office bots across 100 floors. Free to play, no account, plays offline.');
  assert.ok(econDesc.length <= 160, `EconByte description is ${econDesc.length}`);
  assert.ok(lastDesc.length <= 160, `Last Human description is ${lastDesc.length}`);
  assert.match(lastDesc, /offline/i);
  assert.match(econDesc, /plain-language|Education only/);
  assert.match(econDesc, /not financial advice/);
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
  assert.equal(vibeDesc, 'A playful social app for iPhone. Rate a photo, then keep it private, share it with your Squad, or post it to Vibes.');
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

test('related apps link live money pages', () => {
  const home = readFileSync(resolve('dist/index.html'), 'utf8');
  assert.match(home, /iPhone apps that say what they cost and what they collect\./);
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
  assert.match(last, /100 floors/);
  assert.match(last, /100 escalating office floors/);
  assert.doesNotMatch(last, /180 cards/);
});

test('Table Talk and EconByte money pages carry their moved guides', () => {
  const table = readFileSync(resolve('dist/apps/table-talk/index.html'), 'utf8');
  const tableBody = table.match(/<article class="app-body">[\s\S]*?<\/article>/)?.[0] ?? '';
  assert.match(tableBody, /Using Table Talk at the table/);
  assert.match(tableBody, /Put one phone in the middle/);
  assert.doesNotMatch(tableBody, /href="\/blog\//);
  const econ = readFileSync(resolve('dist/apps/econbyte/index.html'), 'utf8');
  const econBody = econ.match(/<article class="app-body">[\s\S]*?<\/article>/)?.[0] ?? '';
  assert.match(econBody, /Why prices stay high when inflation is down/);
  assert.doesNotMatch(econBody, /href="\/blog\//);
  assert.doesNotMatch(econBody, /returns|beat the market/i);
});

test('homepage head uses the locked studio title', () => {
  const home = readFileSync(resolve('dist/index.html'), 'utf8');
  assert.match(home, /<title>Dudley Development: iPhone games, conversation cards, learning and social apps<\/title>/);
  const description = capture(home, /<meta name="description" content="([^"]+)"/i);
  assert.equal(description, 'Satirical arcade games, conversation cards, economics lessons, a packing checklist and a photo-rating social app. Each app page lists its price, account needs and privacy details.');
  assert.doesNotMatch(home, /iPhone apps, games &amp; conversation cards/);
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
  assert.match(home, /iPhone apps that say what they cost and what they collect\./);
  assert.match(home, /Each app page lists its price, account needs and privacy details\.<\/p>/);
  assert.match(home, /From the blog/);
  assert.doesNotMatch(home, /On deck|In the works|Coming soon/i);
  assert.doesNotMatch(home, /SendBrake|ReplyGate|ActionCard|Beat the Dealer/);
  assert.doesNotMatch(home, /Pick an app\. See what happens\.|LIVE ON THE APP STORE|Straight answers, useful context|Next from Dudley|Games, conversation starters, and useful things for iPhone/);
  assert.doesNotMatch(home, /Why Dudley|Polish is the point|feature-icon|class="grad"/);
  const band = (slug) => home.match(new RegExp(`<section[^>]+data-app="${slug}"[\\s\\S]*?<\\/section>`))?.[0] ?? '';
  assert.match(band('last-human'), /Play free on the App Store/);
  assert.match(band('table-talk'), /Get the deck on the App Store/);
  assert.match(band('econbyte'), /Read a card on the App Store/);
  assert.match(band('monetary-policy-independence-day'), /Chase it on the App Store/);
  assert.match(band('vibe-rater'), /href="https:\/\/apps\.apple\.com\/us\/app\/viberater-social\/id6780704282\?pt=128970277&amp;ct=vr-web-home-aug26-v1&amp;mt=8"/);
  assert.match(band('packed-yet'), /On the App Store/);
  assert.match(band('last-human'), /100 escalating office floors/);
});

test('homepage, About, Contact, and llms.txt do not promote unlisted client work', () => {
  const surfaces = {
    home: readFileSync(resolve('dist/index.html'), 'utf8'),
    about: readFileSync(resolve('dist/about/index.html'), 'utf8'),
    contact: readFileSync(resolve('dist/contact/index.html'), 'utf8'),
    llms: readFileSync(resolve('dist/llms.txt'), 'utf8'),
  };
  for (const [name, text] of Object.entries(surfaces)) {
    assert.doesNotMatch(text, /Where(?:&#39;|')s This House|HomeLight|id6779785617/, name);
  }
  assert.doesNotMatch(surfaces.home, /id="built-for-others"/);
});

test('studio copy makes no absolute or one-person claims', () => {
  const about = readFileSync(resolve('dist/about/index.html'), 'utf8');
  const llms = readFileSync(resolve('dist/llms.txt'), 'utf8');
  assert.match(about, /Every app Dudley has published on the App Store is free to download\./);
  assert.match(about, /Client work/);
  assert.doesNotMatch(about, /Every Dudley app is free|request non-personalized ads and do not request/);
  assert.match(llms, /free to download/);
  assert.doesNotMatch(llms, /All apps are free\.|one human|small team/);
  for (const text of [about, llms]) assert.doesNotMatch(text, /apps on this site are ours/i);
});

test('contact form copy matches where the form actually delivers', () => {
  const contact = readFileSync(resolve('dist/contact/index.html'), 'utf8');
  assert.match(contact, /action="https:\/\/formsubmit\.co\/support@dudleyapps\.com"/);
  assert.match(contact, /FormSubmit\.co delivers this form to support@dudleyapps\.com\./);
  assert.match(contact, /mailto:hello@dudleyapps\.com/);
  assert.doesNotMatch(contact, /within a day or two/);
  const success = contact.match(/<div class="cf-success"[\s\S]*?<\/div>/)?.[0] ?? '';
  const error = contact.match(/<div class="cf-error"[\s\S]*?<\/div>/)?.[0] ?? '';
  for (const block of [success, error]) assert.doesNotMatch(block, /\u2014/);
  assert.match(error, /hello@dudleyapps\.com/);
  assert.match(success, /Replies come from an @dudleyapps\.com address\./);
  assert.doesNotMatch(success, /[Ww]e will reply|we&#39;ll reply|we'll reply/);
  assert.doesNotMatch(contact, /We only use|so we see it first|small amount of client work/);
});

test('form note and privacy page describe the same use of contact messages', () => {
  const use = /we use what you send to answer your request\s+and keep a record of the conversation/i;
  const contact = readFileSync(resolve('dist/contact/index.html'), 'utf8');
  const privacy = readFileSync(resolve('dist/privacy/index.html'), 'utf8');
  const section = privacy.match(/id="website-contact"[\s\S]*?<\/ul>/)?.[0] ?? '';
  assert.match(contact.match(/<p class="cf-privacy"[\s\S]*?<\/p>/)?.[0] ?? '', use);
  assert.match(section, use);
  assert.match(section, /href="https:\/\/formsubmit\.co\/privacy\.pdf"/);
  assert.match(section, /FormSubmit keeps submissions for 30 days/);
  assert.match(section, /Dudley&#39;s contact page sets no cookies|Dudley's contact page sets no cookies/);
  assert.doesNotMatch(section, /as long as we need|reasonable business records|\u2014/);
});

test('privacy page discloses the FormSubmit contact form and has working icons', () => {
  const privacy = readFileSync(resolve('dist/privacy/index.html'), 'utf8');
  assert.match(privacy, /id="website-contact"/);
  assert.match(privacy, /FormSubmit/);
  assert.doesNotMatch(privacy, /-iconpng/);
  for (const match of privacy.matchAll(/src="(\/assets\/[^"]+)"/g)) {
    assert.ok(existsSync(resolve(`public${match[1]}`)), `${match[1]} is missing`);
  }
});

test('the site has no seller or acquisition pages or copy', () => {
  assert.equal(existsSync(resolve('dist/sell/index.html')), false);
  assert.equal(existsSync(resolve('dist/buy/index.html')), false);
  const texts = [...htmlPages().map((page) => page.html), readFileSync(resolve('dist/llms.txt'), 'utf8')];
  for (const text of texts) {
    assert.doesNotMatch(text, /Sell an app|Sell your app|We buy apps|we also buy|looking to buy|sell-an-app/i);
  }
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
  assert.match(html, /class="byline"[^>]*>Nick Santulli</);
  assert.doesNotMatch(html, /Written by|Nicholas/);
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

test('built pages do not link to slashless internal routes', () => {
  const failures = [];
  for (const page of htmlPages()) {
    for (const match of page.html.matchAll(/href="(\/[^"]*)"/g)) {
      const path = match[1].split(/[?#]/)[0];
      if (path === '/' || path.endsWith('/')) continue;
      if (/\.[a-z0-9]+$/i.test(path)) continue;
      failures.push(`${page.rel} → ${match[1]}`);
    }
  }
  assert.deepEqual(failures, []);
});

test('sitemap.xml is the sitemap index and lists privacy and support', () => {
  const index = readFileSync(resolve('dist/sitemap-index.xml'), 'utf8');
  assert.equal(readFileSync(resolve('dist/sitemap.xml'), 'utf8'), index);
  const pages = readFileSync(resolve('dist/sitemap-0.xml'), 'utf8');
  assert.match(pages, /https:\/\/dudleyapps\.com\/privacy\//);
  assert.match(pages, /https:\/\/dudleyapps\.com\/support\//);
});

test('image sitemap omits noindex tag pages', () => {
  const images = readFileSync(resolve('dist/sitemap-images.xml'), 'utf8');
  assert.doesNotMatch(images, /\/blog\/tags\//);
});

test('author page and bylines point at Nick Santulli', () => {
  const author = readFileSync(resolve('dist/about/nick-santulli/index.html'), 'utf8');
  assert.match(author, /Nick Santulli is the founder of Dudley Development\./);
  assert.match(author, /"@type":"Person"/);
  const post = readFileSync(resolve('dist/blog/can-iphone-apps-see-your-contacts/index.html'), 'utf8');
  assert.match(post, /href="\/about\/nick-santulli\/"[^>]*>Nick Santulli<\/a>/);
  assert.match(post, /"author":\{"@type":"Person","name":"Nick Santulli"/);
  assert.match(post, /Nick Santulli<\/a> is the founder of Dudley Development\./);
});

test('blog posts do not repeat the FAQ inside the article body', () => {
  const html = readFileSync(resolve('dist/blog/what-is-ai-slop/index.html'), 'utf8');
  const body = html.match(/<div class="post-body">[\s\S]*?<\/div>/)?.[0] ?? '';
  assert.doesNotMatch(body, /<h2[^>]*>\s*(FAQ|Frequently Asked Questions)\s*<\/h2>/i);
  assert.match(html, /id="faq-heading"/);
});

test('public pages and llms.txt do not use the internal codename Jev', () => {
  for (const page of htmlPages()) assert.doesNotMatch(page.html, /\bJev\b/, page.rel);
  assert.doesNotMatch(readFileSync(resolve('dist/llms.txt'), 'utf8'), /\bJev\b/);
});

test('only the privacy disclosure links the unreleased Pattern Gym waitlist', () => {
  for (const page of htmlPages()) {
    if (page.rel === '/privacy/index.html') continue;
    assert.doesNotMatch(page.html, /waitlist\.dudleyapps\.com|Pattern Gym/, page.rel);
  }
  const privacy = readFileSync(resolve('dist/privacy/index.html'), 'utf8');
  assert.match(privacy, /id="pattern-gym-waitlist"/);
});

test('Packed Yet page has a store link, smart banner, and downloadUrl', () => {
  const html = readFileSync(resolve('dist/apps/packed-yet/index.html'), 'utf8');
  assert.match(html, /name="apple-itunes-app" content="app-id=6814598931"/);
  assert.match(html, /id6814598931\?pt=128970277&(?:amp;)?ct=py-web-app&(?:amp;)?mt=8/);
  const app = jsonLd(html).find((value) => value['@type'] === 'SoftwareApplication');
  assert.match(app.downloadUrl, /id6814598931/);
  assert.match(readFileSync(resolve('dist/llms.txt'), 'utf8'), /Packed Yet/);
  assert.match(readFileSync(resolve('dist/llms.txt'), 'utf8'), /\/about\/nick-santulli\//);
});

test('blog posts use a generated share card', () => {
  const html = readFileSync(resolve('dist/blog/what-is-ai-slop/index.html'), 'utf8');
  assert.match(html, /property="og:image" content="https:\/\/dudleyapps\.com\/assets\/share\/what-is-ai-slop\.png"/);
  assert.ok(existsSync(resolve('dist/assets/share/what-is-ai-slop.png')));
});

test('built campaign tokens stay within 30 characters', () => {
  const texts = [...htmlPages().map((page) => page.html), readFileSync(resolve('dist/llms.txt'), 'utf8')];
  const long = new Set();
  for (const text of texts) {
    for (const match of text.matchAll(/[?&](?:amp;)?ct=([^&"'\s<]+)/g)) {
      const ct = decodeURIComponent(match[1]);
      if (ct.length > 30) long.add(ct);
    }
  }
  assert.deepEqual([...long], []);
});

test('homepage app bands deliver WebP sources without the legacy lockup', () => {
  const home = readFileSync(resolve('dist/index.html'), 'utf8');
  const bands = [...home.matchAll(/<section[^>]+data-app="[^"]+"[\s\S]*?<\/section>/g)].map((match) => match[0]);
  assert.equal(bands.length, 6);
  bands.forEach((band) => assert.match(band, /<source[^>]+type="image\/webp"/));
  assert.doesNotMatch(home, /dudley-lockup\.png/);
  for (const page of htmlPages()) assert.doesNotMatch(page.html, /dudley-lockup\.png/, page.rel);
});

const REMOVED_VIBERATER_URLS = ['/tools/whats-my-vibe/', '/compare/best-photo-rating-apps/', '/compare/vibe-check-apps/'];

test('removed VibeRater quiz and comparison URLs redirect to the VibeRater app page', () => {
  for (const url of REMOVED_VIBERATER_URLS) {
    const html = readFileSync(resolve(`dist${url}index.html`), 'utf8');
    assert.match(html, /<meta http-equiv="refresh" content="0; url=\/apps\/vibe-rater\/"/, url);
    assert.match(html, /<link rel="canonical" href="https:\/\/dudleyapps\.com\/apps\/vibe-rater\/"/, url);
    assert.match(html, /<meta name="robots" content="noindex,follow"/, url);
    assert.match(html, /<a href="\/apps\/vibe-rater\/">VibeRater Social<\/a>/, url);
    assert.doesNotMatch(html, /apps\.apple\.com/, url);
  }
});

test('removed VibeRater URLs are gone from the sitemaps, llms.txt, and internal links', () => {
  const sitemaps = readdirSync(resolve('dist'))
    .filter((name) => name.startsWith('sitemap') && name.endsWith('.xml'))
    .map((name) => readFileSync(resolve('dist', name), 'utf8'))
    .join('\n');
  const llms = readFileSync(resolve('dist/llms.txt'), 'utf8');
  const rss = readFileSync(resolve('dist/blog/rss.xml'), 'utf8');
  for (const url of REMOVED_VIBERATER_URLS) {
    assert.doesNotMatch(sitemaps, new RegExp(url), `sitemap lists ${url}`);
    assert.doesNotMatch(llms, new RegExp(url), `llms.txt lists ${url}`);
    assert.doesNotMatch(rss, new RegExp(url), `RSS lists ${url}`);
    for (const page of htmlPages()) {
      if (page.rel === `${url}index.html`) continue;
      assert.doesNotMatch(page.html, new RegExp(`href="(?:https://dudleyapps\\.com)?${url}"`), `${page.rel} links to ${url}`);
    }
  }
  assert.doesNotMatch(llms, /## Tools|## Comparisons/);
});

const BLOG_CTA_APPS = ['monetary-policy-independence-day', 'vibe-rater', 'table-talk', 'econbyte'];

function blogFrontmatter() {
  const dir = resolve('src/content/blog');
  return readdirSync(dir).filter((name) => /\.mdx?$/.test(name)).map((name) => {
    const fm = readFileSync(join(dir, name), 'utf8').split(/^---$/m)[1] ?? '';
    const list = fm.match(/^relatedApps:\s*(\[[^\]]*\]|(?:\n\s+-[^\n]*)+)/m)?.[1] ?? '';
    return {
      slug: name.replace(/\.mdx?$/, ''),
      relatedApps: list.match(/[a-z0-9-]+/g) ?? [],
      draft: /^draft:\s*true\b/m.test(fm),
    };
  }).filter((post) => !post.draft);
}

test('blog posts with no related app get no App Store box or banner, VibeRater included', () => {
  const posts = blogFrontmatter();
  const unmatched = posts.filter((post) => !post.relatedApps.some((app) => BLOG_CTA_APPS.includes(app)));
  assert.ok(unmatched.length > 0, 'expected at least one blog post with no CTA app');
  for (const { slug } of unmatched) {
    const html = readFileSync(resolve(`dist/blog/${slug}/index.html`), 'utf8');
    assert.doesNotMatch(html, /apple-itunes-app/, `${slug} has an app banner`);
    assert.doesNotMatch(html, /class="cta-block"|app-promotion-disclosure/, `${slug} has an App Store box`);
  }

  const optedIn = posts.filter((post) => post.relatedApps.find((app) => BLOG_CTA_APPS.includes(app)) === 'vibe-rater');
  assert.ok(optedIn.length > 0, 'expected posts that opt in to VibeRater');
  for (const { slug } of optedIn) {
    const html = readFileSync(resolve(`dist/blog/${slug}/index.html`), 'utf8');
    assert.match(html, /<meta name="apple-itunes-app" content="app-id=6780704282/, `${slug} lost its banner`);
    assert.match(html, /class="cta-block"/, `${slug} lost its App Store box`);
  }
});

const UNRELEASED_APP_URLS = [
  '/apps/action-card/',
  '/apps/reply-gate/',
  '/support/action-card/',
  '/support/reply-gate/',
  '/privacy/action-card/',
  '/privacy/reply-gate/',
  '/privacy/beat-the-dealer/',
];

test('unreleased app pages are not built or linked, and every redirect stub stays out of the sitemap', async () => {
  const { MOVED_PATHS } = await import('../src/lib/movedPaths.mjs');
  const pages = htmlPages();
  for (const url of UNRELEASED_APP_URLS) {
    assert.equal(existsSync(resolve(`dist${url}index.html`)), false, `${url} is still built`);
    assert.equal(MOVED_PATHS.includes(url), false, `${url} should 404, not redirect`);
    for (const page of pages) {
      assert.doesNotMatch(page.html, new RegExp(`href="(?:https://dudleyapps\\.com)?${url}"`), `${page.rel} links to ${url}`);
    }
  }
  const sitemaps = readdirSync(DIST)
    .filter((name) => name.startsWith('sitemap') && name.endsWith('.xml'))
    .map((name) => readFileSync(join(DIST, name), 'utf8'))
    .join('\n');
  for (const page of pages) {
    if (!/<meta http-equiv="refresh"/.test(page.html)) continue;
    const url = page.rel.replace(/index\.html$/, '');
    assert.ok(MOVED_PATHS.includes(url), `redirect stub ${url} is missing from MOVED_PATHS`);
    assert.doesNotMatch(sitemaps, new RegExp(`https://dudleyapps\\.com${url}<`), `sitemap lists ${url}`);
  }
});

test('no live page names an unreleased app or teases the unshipped Powell Prowl update', () => {
  const llms = readFileSync(resolve('dist/llms.txt'), 'utf8');
  const rss = readFileSync(resolve('dist/blog/rss.xml'), 'utf8');
  const sources = [
    ...htmlPages().filter((page) => !/<meta http-equiv="refresh"/.test(page.html)),
    { rel: '/llms.txt', html: llms },
    { rel: '/blog/rss.xml', html: rss },
  ];
  for (const page of sources) {
    assert.doesNotMatch(page.html, /ActionCard|ReplyGate|SendBrake|Beat the Dealer/, page.rel);
    assert.doesNotMatch(page.html, /Monetary Policy: Independence Day|100-level|soon to be renamed/i, page.rel);
  }
});
