// Single source of truth for site identity + URL building.
// Live at the custom domain https://dudleyapps.com, served at root.
// ORIGIN_HOST/BASE here must stay in sync with `site`/`base` in astro.config.mjs.

export const ORIGIN_HOST = 'https://dudleyapps.com';
export const BASE = ''; // root domain — no project sub-path
export const ORIGIN = ORIGIN_HOST + BASE; // canonical origin for the deployed site

export const STUDIO = 'Dudley Development';

// Bing Webmaster Tools site verification. Paste the `content` value from the
// <meta name="msvalidate.01" ...> tag Bing gives you after adding the site
// (Owner-gated: signing in to Bing Webmaster needs a Microsoft account). When
// non-empty, Base.astro renders the verification meta tag site-wide. Leave ''
// until verified — IndexNow (see public/<key>.txt) already feeds Bing's index
// independent of this. See vault/growth/dud-209-indexnow-bing-image-sitemap.md.
export const BING_VERIFICATION = '';
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
