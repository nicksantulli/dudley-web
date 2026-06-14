// Single source of truth for site identity + URL building.
// When the Owner buys a domain, change ORIGIN_HOST -> 'https://dudleydevelopment.com'
// and BASE -> '' here, and `site`/`base` in astro.config.mjs, and everything follows.

export const ORIGIN_HOST = 'https://nicksantulli.github.io';
export const BASE = '/dudley-web'; // '' once a root domain is live
export const ORIGIN = ORIGIN_HOST + BASE; // canonical origin for the deployed site

export const STUDIO = 'Dudley Development';
export const SUPPORT_EMAIL = 'support@dudleyapps.com';
export const CONTACT_EMAIL = 'hello@dudleyapps.com'; // general / say-hi contact (Cloudflare Email Routing → Owner inbox)
export const SOCIAL_LINKS: string[] = []; // add Bluesky/X URLs to populate schema sameAs

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
