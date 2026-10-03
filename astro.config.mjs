// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { satteri } from '@astrojs/markdown-satteri';
import { lastmodForUrl } from './src/lib/gitDates.mjs';
import { stripDuplicateFaq } from './src/lib/stripDuplicateFaq.mjs';

// Live at the custom domain https://dudleyapps.com (served at root, not a project path).
// GitHub Pages serves from the gh-pages branch; the public/CNAME file keeps the domain
// bound on every deploy. Keep `base: '/'` so all asset/nav URLs are root-relative.
export default defineConfig({
  site: 'https://dudleyapps.com',
  base: '/',
  trailingSlash: 'always',
  markdown: {
    processor: satteri({
      mdastPlugins: [stripDuplicateFaq],
    }),
  },
  integrations: [
    mdx(),
    sitemap({
      // Tag archives are noindex. Machine-readable feeds and the Powell redirect
      // stay out. Privacy and support pages are real URLs and belong in the index.
      filter: (page) =>
        !page.includes('/blog/tags') &&
        !page.includes('/apps/powell-prowl') &&
        !page.includes('/rss.xml') &&
        !page.includes('/llms.txt'),
      serialize(item) {
        const lastmod = lastmodForUrl(item.url);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
});
