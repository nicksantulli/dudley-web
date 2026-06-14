// Single source of truth for site identity + URL building.
// Live at the custom domain https://dudleyapps.com, served at root.
// ORIGIN_HOST/BASE here must stay in sync with `site`/`base` in astro.config.mjs.

export const ORIGIN_HOST = 'https://dudleyapps.com';
export const BASE = ''; // root domain — no project sub-path
export const ORIGIN = ORIGIN_HOST + BASE; // canonical origin for the deployed site

export const STUDIO = 'Dudley Development';
export const SUPPORT_EMAIL = 'support@dudleyapps.com';
export const CONTACT_EMAIL = 'hello@dudleyapps.com'; // general / say-hi contact (Cloudflare Email Routing → Owner inbox)
// Follow-us socials — the single source of truth for the footer + schema sameAs.
// Add/remove a platform here and both the footer icons and JSON-LD update.
// `icon` keys into the SVG map in Base.astro. (Reddit intentionally excluded —
// promotion happens in subreddits, not via a profile link.)
export interface Social { name: string; label: string; url: string; icon: string; }
export const SOCIALS: Social[] = [
  { name: 'X', label: 'Follow Dudley Development on X', url: 'https://x.com/DudleyAppDev', icon: 'x' },
  { name: 'Instagram', label: 'Follow Dudley Development on Instagram', url: 'https://instagram.com/dudleyappdev', icon: 'instagram' },
  { name: 'TikTok', label: 'Follow Dudley Development on TikTok', url: 'https://tiktok.com/@dudley_apps', icon: 'tiktok' },
];

// Schema sameAs derives from the same list, so it never drifts.
export const SOCIAL_LINKS: string[] = SOCIALS.map((s) => s.url);

// Build a site-relative href that respects the GitHub Pages base path.
export function rel(path: string): string {
  const p = path.startsWith('/') ? path : '/' + path;
  return (BASE + p).replace(/([^:])\/{2,}/g, '$1/');
}

// Build an absolute URL (for canonical, OG, JSON-LD).
export function abs(path: string): string {
  return ORIGIN_HOST + rel(path);
}

// App Store IDs (single source of truth — update Vibe Rater when it ships).
export const APP_STORE = {
  powellProwl: '6775539250',
  vibeRater: '', // set when Vibe Rater is approved
};

export function appStoreUrl(id: string): string {
  return id ? `https://apps.apple.com/app/id${id}` : '';
}
