import { abs, APP_STORE, SUPPORT_EMAIL, CONTACT_EMAIL } from '../consts';
import { appStoreCampaignUrl, DUDE_WHERES_ASC_TOKENS } from '../lib/campaignLinks.mjs';
import { getPublishedPosts } from '../lib/blog';

// llms.txt is generated so the Blog section stays current automatically — the Content
// Writer drops a markdown file and the next build lists it here for answer engines.
// The Apps / Archetypes / Tools / Comparisons sections are stable hand-written prose
// (curated for AEO); only the Blog section is generated from the content collection.
export async function GET() {
  const posts = await getPublishedPosts();

  const blogLines = posts
    .map((p) => `- [${p.data.title}](${abs(`/blog/${p.slug}/`)}): ${p.data.description}`)
    .join('\n');

  const body = `# Dudley Development

> Dudley Development is an independent iOS app studio. We build small, polished, playful apps for iPhone — mostly funny, sometimes useful. Every app is free, and every app explains its account, cloud-data, analytics, advertising, and tracking behavior in a dedicated privacy policy. Founded and run by Nicholas Santulli.

## Apps

- [Table Talk: Conversation Cards](${abs('/apps/table-talk/')}): A free iPhone app of hand-written conversation-starter cards for dinner tables, first dates, friend groups, and work teams. 420 prompts across 6 categories plus an 80-card Would You Rather deck. No account needed, works offline. Ad-supported with a one-time Remove Ads purchase. Live on the App Store. Requires iOS 16.6+.
- [VibeRater Social](${abs('/apps/vibe-rater/')}): A free iPhone social app built around playful photo ratings, VibeRodeo video/photo posts, a customizable Repli avatar and room, VibeShop, one-way Following, Squad, Radar, Rise, and optional SlopGuard. For entertainment only. Live on the App Store. Requires iOS 17+.
- [Powell Prowl: Rate Chase](${abs('/apps/monetary-policy-independence-day/')}): A free satirical iPhone mini-game collection — 60 hand-tuned levels across 15 game types. Live on the App Store. Requires iOS 16.6+.
- [EconByte: Daily Economics](${abs('/apps/econbyte/')}): A free iPhone app that explains economics in bite-sized daily cards — inflation, interest rates, GDP, trade — sourced to named institutions. Two topics free; 13 more unlock with a one-time $0.99 purchase. Educational only. Live on the App Store. Requires iOS 16.6+.
- [Dude, Where's This House?](${appStoreCampaignUrl(APP_STORE.dudeWheresThisHouse, DUDE_WHERES_ASC_TOKENS.homeCard)}): A free iPhone geography game built for HomeLight with 5,000 approved U.S. residential locations. Live on the App Store. Requires iOS 17+.
- Last Human: A free satirical top-down arcade game for iPhone. Coming soon to the App Store.
- Beat the Dealer: Card Counting: An offline blackjack trainer for adults 18+. Coming soon to the App Store.

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

## Blog

The Dudley Blog covers internet culture, vibe archetypes, and honest app roundups. Full index: ${abs('/blog/')} (RSS: ${abs('/blog/rss.xml')}).

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
