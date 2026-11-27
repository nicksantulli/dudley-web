import rss from '@astrojs/rss';
import { ORIGIN, abs } from '../../consts';
import { getPublishedPosts } from '../../lib/blog';

export async function GET() {
  const posts = await getPublishedPosts();
  return rss({
    title: 'The Dudley Blog',
    description:
      'Technology, App Store operations, app privacy, and software culture from Dudley Development.',
    site: ORIGIN,
    trailingSlash: true,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: abs(`/blog/${post.id}/`),
      categories: [post.data.category, ...post.data.tags],
    })),
    customData: '<language>en-us</language>',
  });
}
