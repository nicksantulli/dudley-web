import { abs, SUPPORT_EMAIL, CONTACT_EMAIL } from '../consts';
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

> Dudley Development is an independent iOS app studio. We build small, polished, playful apps for iPhone — mostly funny, sometimes useful. Every app is free, runs without an account, and keeps your data on your device. Founded and run by Nicholas Santulli.

## Apps

- [Powell Prowl: Rate Chase](${abs('/apps/powell-prowl/')}): A free satirical iPhone arcade game — a 60-level whack-and-chase romp through a parody of Federal Reserve interest-rate drama. Live on the App Store. Requires iOS 16.6+.
- [Vibe Rater](${abs('/apps/vibe-rater/')}): A free iPhone entertainment app that rates your vibe from a photo. Get your archetype (Main Character, Final Boss, Quiet Luxury, Cottagecore, and more), an aura color, and a six-dimension scorecard. The phone vibrates while it reads you. Photos are sent to the rating service, rated in memory, and never stored. Free with optional ad-free upgrade (in-app purchase). Launching on the App Store soon.
- Table Talk: A free iPhone app of beautifully designed conversation-starter cards for date nights, family dinners, and friend groups. No account, works offline. Free with optional ad-free upgrade (in-app purchase). iOS. Launching on the App Store soon.
- Last Human: A free satirical top-down arcade game for iPhone — you're the last human in an AI-automated office, dodging AutoBots to reach the time clock before the timer runs out. Free with optional ad-free upgrade (in-app purchase). iOS. Launching on the App Store soon.
- EconByte: A free iPhone app that explains economics in bite-sized daily cards — inflation, interest rates, GDP, trade — like a smart friend, not a textbook. Educational only, not investment advice. Free with optional ad-free upgrade (in-app purchase). iOS. Launching on the App Store soon.

## Archetypes (Vibe Rater)

Vibe Rater assigns one of several vibe archetypes based on your photo:

- [Main Character Energy](${abs('/archetypes/main-character/')}): The protagonist of every room. Confident, intentional presence.
- [Final Boss](${abs('/archetypes/final-boss/')}): Peak power. Effortless authority; maxed Main-Character, Rizz, and Serve.
- [Quiet Luxury](${abs('/archetypes/quiet-luxury/')}): Understated, expensive elegance with no loud logos.
- [Clean Girl](${abs('/archetypes/clean-girl/')}): Minimal, polished, effortless — glowy skin and gold hoops.
- [Dark Academia](${abs('/archetypes/dark-academia/')}): Old libraries, tweed, candlelight, intellectual mood.
- [Cottagecore](${abs('/archetypes/cottagecore/')}): Soft, rural, slow living. High Aura, peaceful energy.
- [Cozy Goblin](${abs('/archetypes/cozy-goblin/')}): Maximally comfortable, endearingly chaotic. Zero Serve, infinite Aura.
- [Rizz](${abs('/archetypes/rizz/')}): Natural charisma and social magnetism.

## Tools

- [What's My Vibe? Quiz](${abs('/tools/whats-my-vibe/')}): A free 5-question quiz that reveals your vibe archetype. Powered by Vibe Rater logic.

## Comparisons

- [Best Photo Rating Apps for iPhone (2026)](${abs('/compare/best-photo-rating-apps/')}): An honest comparison of photo, vibe, and aura rating apps on iPhone.
- [Best Vibe Check Apps for iPhone (2026)](${abs('/compare/vibe-check-apps/')}): An honest comparison of vibe check and aura apps on iPhone.

## Blog

The Dudley Blog covers internet culture, vibe archetypes, and honest app roundups. Full index: ${abs('/blog/')} (RSS: ${abs('/blog/rss.xml')}).

${blogLines}

## About

Dudley Development is run by a small team and one human (Nicholas Santulli). All apps are free with Google AdMob ads. No accounts required. No first-party analytics or trackers. Ads are non-personalized — no user tracking, no tracking prompt.

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
