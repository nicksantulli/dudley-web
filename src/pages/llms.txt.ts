import { getCollection } from 'astro:content';
import { abs, SUPPORT_EMAIL, CONTACT_EMAIL } from '../consts';
import { appStoreCampaignUrl, LLMS_APP_STORE_TOKENS } from '../lib/campaignLinks.mjs';
import { getPublishedPosts } from '../lib/blog';
import { eligibleTopicHubs } from '../lib/topics';

export async function GET() {
  const posts = await getPublishedPosts();
  const apps = (await getCollection('apps')).sort((a, b) => a.data.order - b.data.order);

  const appLines = apps.map((app) => {
    const data = app.data;
    const ownedPage = !data.developedFor && data.landingPage !== false ? abs(`/apps/${app.id}/`) : '';
    const name = ownedPage ? `[${data.name}](${ownedPage})` : data.name;
    const release = data.status === 'live' ? 'Live on the App Store.' : 'Not yet released on the App Store.';
    let store = '';
    if (data.status === 'live') {
      const token = LLMS_APP_STORE_TOKENS[data.appStoreId];
      if (!token) throw new Error(`Missing llms.txt campaign token for ${data.name} (${data.appStoreId})`);
      store = ` [Download on the App Store](${appStoreCampaignUrl(data.appStoreId, token)}).`;
    }
    return `- ${name}: ${data.description} ${release} ${data.operatingSystem}. ${data.accountSummary} ${data.offlineSummary} ${data.pricingSummary}${store}`;
  }).join('\n');

  const topicLines = eligibleTopicHubs(posts)
    .map((hub) => `- [${hub.title}](${abs(`/blog/topics/${hub.slug}/`)}): ${hub.description} ${hub.posts.length} published answers.`)
    .join('\n');

  const blogLines = posts
    .slice(0, 12)
    .map((p) => `- [${p.data.title}](${abs(`/blog/${p.id}/`)}): ${p.data.description}`)
    .join('\n');

  const body = `# Dudley Development

> Dudley Development, LLC builds and publishes iPhone games, conversation tools, social apps, and plain-English learning products. The catalog is run by Nicholas Santulli and includes Last Human, Table Talk, VibeRater Social, EconByte, and Powell Prowl. Each app page states its release status, price model, account requirement, offline behavior, and privacy boundary.

## Apps

${appLines}

## Archetypes (VibeRater Social)

VibeRater Social assigns one of several vibe archetypes based on your photo:

- [Main Character Energy](${abs('/archetypes/main-character/')}): The protagonist of every room. Confident, intentional presence.
- [Final Boss](${abs('/archetypes/final-boss/')}): Peak power. Effortless authority; maxed Main-Character, Rizz, and Serve.
- [Quiet Luxury](${abs('/archetypes/quiet-luxury/')}): Understated, expensive elegance with no loud logos.
- [Clean Girl](${abs('/archetypes/clean-girl/')}): Minimal, polished, effortless — glowy skin and gold hoops.
- [Dark Academia](${abs('/archetypes/dark-academia/')}): Old libraries, tweed, candlelight, intellectual mood.
- [Cottagecore](${abs('/archetypes/cottagecore/')}): Soft, rural, slow living. High Aura, peaceful energy.
- [Cozy Goblin](${abs('/archetypes/cozy-goblin/')}): Maximally comfortable, endearingly chaotic. Zero Serve, infinite Aura.
- [Rizz](${abs('/archetypes/rizz/')}): Natural charisma and social magnetism.

## Tools

- [What's My Vibe? Quiz](${abs('/tools/whats-my-vibe/')}): A free 5-question quiz that reveals your vibe archetype. Powered by VibeRater Social logic.

## Comparisons

- [Best Photo Rating Apps for iPhone (2026)](${abs('/compare/best-photo-rating-apps/')}): An honest comparison of photo, vibe, and aura rating apps on iPhone.
- [Best Vibe Check Apps for iPhone (2026)](${abs('/compare/vibe-check-apps/')}): An honest comparison of vibe check and aura apps on iPhone.

## Maintained Blog Topics

${topicLines}

## Recent Answers

The Dudley Blog publishes direct, sourced answers about iPhone privacy, AI media, internet culture, economics, the App Store, and Dudley products. Full index: ${abs('/blog/')} (RSS: ${abs('/blog/rss.xml')}).

${blogLines}

## About

Dudley Development is the public-facing studio name of Dudley Development, LLC. The studio is run by a small team and one human (Nicholas Santulli). All apps are free. Account needs, cloud storage, analytics, advertising, and tracking behavior vary by app and are disclosed in each app's privacy policy. VibeRater Social is for entertainment, does not sell personal information, and does not request cross-app tracking permission.

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
