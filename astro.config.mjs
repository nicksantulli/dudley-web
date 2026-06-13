// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// Live now: GitHub Pages project site at https://nicksantulli.github.io/dudley-web/
// When the Owner buys a domain, this becomes a one-file change:
//   site: 'https://dudleydevelopment.com', base: '/'  (and update src/consts.ts to match)
export default defineConfig({
  site: 'https://nicksantulli.github.io',
  base: '/dudley-web',
  trailingSlash: 'ignore',
  integrations: [
    mdx(),
    sitemap({
      // Legal/support pages exist for App Review, not discovery — keep them out of the
      // sitemap, along with machine-readable feeds (RSS / llms.txt).
      filter: (page) =>
        !page.includes('/privacy') &&
        !page.includes('/support') &&
        !page.includes('/rss.xml') &&
        !page.includes('/llms.txt'),
    }),
  ],
});
