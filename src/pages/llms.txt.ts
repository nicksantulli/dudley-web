import { getCollection } from 'astro:content';
import { abs, SUPPORT_EMAIL, CONTACT_EMAIL } from '../consts';
import { appStoreCampaignUrl, LLMS_APP_STORE_TOKENS } from '../lib/campaignLinks.mjs';
import { englishList, liveApps } from '../lib/liveApps.mjs';
import { getPublishedPosts } from '../lib/blog';
import { eligibleTopicHubs } from '../lib/topics';

export async function GET() {
  const posts = await getPublishedPosts();
  const apps = liveApps(await getCollection('apps'));

  const appLines = apps.map((app) => {
    const data = app.data;
    const ownedPage = !data.developedFor && data.landingPage !== false ? abs(`/apps/${app.id}/`) : '';
    const name = ownedPage ? `[${data.name}](${ownedPage})` : data.name;
    const token = LLMS_APP_STORE_TOKENS[data.appStoreId];
    if (!token) throw new Error(`Missing llms.txt campaign token for ${data.name} (${data.appStoreId})`);
    const store = ` [Download on the App Store](${appStoreCampaignUrl(data.appStoreId, token)}).`;
    return `- ${name}: ${data.description} Live on the App Store. ${data.operatingSystem}. ${data.accountSummary} ${data.offlineSummary} ${data.pricingSummary}${store}`;
  }).join('\n');

  const liveCatalog = englishList(
    apps
      .filter((app) => !app.data.developedFor && app.data.landingPage !== false)
      .map((app) => app.data.name),
  );

  const topicLines = eligibleTopicHubs(posts)
    .map((hub) => `- [${hub.title}](${abs(`/blog/topics/${hub.slug}/`)}): ${hub.description} ${hub.posts.length} published answers.`)
    .join('\n');

  const blogLines = posts
    .slice(0, 12)
    .map((p) => `- [${p.data.title}](${abs(`/blog/${p.id}/`)}): ${p.data.description}`)
    .join('\n');

  const body = `# Dudley Development

> Dudley Development, LLC builds and publishes iPhone games, conversation cards, plain-language learning apps, and everyday utilities. The live catalog includes ${liveCatalog}. Each app page states its release status, price model, account requirement, offline behavior, and privacy boundary.

## Apps

${appLines}

## Maintained Blog Topics

${topicLines}

## Recent Answers

The Dudley Blog publishes direct, sourced answers about iPhone privacy, AI media, internet culture, economics, the App Store, and Dudley products. Full index: ${abs('/blog/')} (RSS: ${abs('/blog/rss.xml')}).

${blogLines}

## About

Dudley Development is the public-facing studio name of Dudley Development, LLC. [Nick Santulli](${abs('/about/nick-santulli/')}) is the founder of Dudley Development. Every app Dudley has published on the App Store is free to download; optional purchases are described on each app page. Client work built for other brands is identified as client work and is not part of the Dudley catalog. Account needs, cloud storage, analytics, advertising, and tracking behavior vary by app and are disclosed in each app's privacy policy. Dudley Development does not sell personal information.

## Contact

- Support: ${SUPPORT_EMAIL}
- General: ${CONTACT_EMAIL}
- Privacy policies: ${abs('/privacy/')}
- Website: ${abs('/')}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
