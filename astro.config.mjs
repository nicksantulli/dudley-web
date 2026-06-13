// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// Live at the custom domain https://dudleyapps.com (served at root, not a project path).
// GitHub Pages serves from the gh-pages branch; the public/CNAME file keeps the domain
// bound on every deploy. Keep `base: '/'` so all asset/nav URLs are root-relative.
export default defineConfig({
  site: 'https://dudleyapps.com',
  base: '/',
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
