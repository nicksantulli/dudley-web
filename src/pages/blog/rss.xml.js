import rss from '@astrojs/rss';
import { ORIGIN, abs } from '../../consts';
import { getPublishedPosts } from '../../lib/blog';

export async function GET() {
  const posts = await getPublishedPosts();
  return rss({
    title: 'The Dudley Blog',
    description:
      'Culture, archetypes, and honest app roundups from Dudley Development — the studio behind Vibe Rater and Monetary Policy: Independence Day.',
    site: ORIGIN,
    trailingSlash: true,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: abs(`/blog/${post.slug}/`),
      categories: [post.data.category, ...post.data.tags],
    })),
    customData: '<language>en-us</language>',
  });
}
