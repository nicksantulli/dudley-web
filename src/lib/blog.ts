import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

// A post's full tag set = its category plus any explicit tags, de-duplicated.
export function postTags(post: Post): string[] {
  const all = [post.data.category, ...post.data.tags];
  return [...new Set(all.map((t) => t.trim()).filter(Boolean))];
}

// Turn a human tag ("Outfit Explainer", "archetype-deep-dive") into a URL slug.
export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Turn a tag or category into a readable label ("archetype-deep-dive" -> "Archetype Deep Dive").
export function tagLabel(tag: string): string {
  return tag
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Published posts (drafts excluded), newest first. The single source of truth for
// what's live — index, RSS, sitemap (via pages), and llms.txt all build from this.
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => data.draft !== true);
  return posts.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
}

// All distinct tags across published posts, with their post counts, sorted by count.
export async function getAllTags(): Promise<{ tag: string; slug: string; count: number }[]> {
  const posts = await getPublishedPosts();
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of postTags(post)) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, slug: tagSlug(tag), count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

// Format a date for display, e.g. "June 13, 2026".
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
