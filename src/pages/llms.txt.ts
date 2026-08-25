import { abs, appStoreUrl, APP_STORE, SUPPORT_EMAIL, CONTACT_EMAIL } from '../consts';
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

- [Monetary Policy: Independence Day](${abs('/apps/monetary-policy-independence-day/')}): A free satirical iPhone economics game — a 100-level Independence Day campaign that turns Fed policy into micro-game chaos with a new cast. Live on the App Store. Requires iOS 16.6+.
- [Dude, Where's This House?](${appStoreUrl(APP_STORE.dudeWheresThisHouse)}): A free iPhone geography game built for HomeLight with 5,000 approved U.S. residential locations. Explore Street View, play five timed rounds, pin each house on the map, and score by distance. Optional player accounts save scores and leaderboard identity. Live on the App Store as version 1.1. Requires iOS 17+.
- [VibeRater Social](${abs('/apps/vibe-rater/')}): A free iPhone social app built around playful photo ratings, Vibes posts, Vibies, VibeChecks, Squad, Radar, Rise, optional SlopGuard, and shareable vibe cards. Choose a photo, get a VibeMeter score, aura-style read, archetype, and vibe anthem, then decide whether to keep it private, post it, or share it. Live on the App Store. Requires iOS 17+.
- [Table Talk: Conversation Cards](${abs('/apps/table-talk/')}): A free iPhone app of beautifully designed conversation-starter cards for date nights, family dinners, friend groups, work teams, deep questions, and light fun. 185 prompts, no account, works offline, free with optional one-time ad-free upgrade. Live on the App Store. Requires iOS 16.6+.
- Last Human: A free satirical top-down arcade game for iPhone — you're the last human in an AI-automated office, dodging AutoBots to reach the time clock before the timer runs out. Free with optional ad-free upgrade (in-app purchase). iOS. Launching on the App Store soon.
- EconByte: A free iPhone app that explains economics in bite-sized daily cards — inflation, interest rates, GDP, trade — like a smart friend, not a textbook. Educational only, not investment advice. Free with optional ad-free upgrade (in-app purchase). iOS. Launching on the App Store soon.

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
