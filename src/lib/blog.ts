import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

// Posts per page on /blog/, /blog/2/, etc. Shared so index.astro and [page].astro
// (and the JSON-LD blogPost list) always agree on where a page boundary falls.
export const POSTS_PER_PAGE = 24;

// A post's full tag set = its category plus any explicit tags, de-duplicated.
export function postTags(post: Post): string[] {
  const all = [post.data.category, ...post.data.tags];
  return [...new Set(all.map((t) => t.trim()).filter(Boolean))];
}

// Turn a human tag ("Outfit Explainer", "archetype-deep-dive") into a URL slug.
// Case-insensitive by construction, so "Privacy" and "privacy" (or "AI photo
// apps" / "ai photo apps") collapse to the same slug — see getAllTags below.
export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Known acronyms/proper nouns that naive title-casing mangles ("Ai" instead of
// "AI", "Iphone" instead of "iPhone"). Keyed by lowercase word so lookup is
// case-insensitive regardless of how a writer capitalized it in frontmatter.
const NICE_CASE: Record<string, string> = {
  ai: 'AI',
  iphone: 'iPhone',
  ios: 'iOS',
  chatgpt: 'ChatGPT',
  tiktok: 'TikTok',
  exif: 'EXIF',
  c2pa: 'C2PA',
  gdpr: 'GDPR',
  synthid: 'SynthID',
  viberater: 'VibeRater', // the flagship app's own name, not a generic tag — appears as one word in frontmatter
};

// Turn a tag or category into a readable label ("archetype-deep-dive" -> "Archetype Deep Dive",
// "ai photo apps" / "AI photo apps" -> "AI Photo Apps"). Word-level normalization means this
// is idempotent and case-insensitive: every raw variant of a tag converges on the same label,
// which is what lets getAllTags() merge duplicate tags into one chip.
// Whole-tag overrides for brand names that must not be split into words.
const WHOLE_TAG: Record<string, string> = { 'vibe rater': 'VibeRater', 'viberater': 'VibeRater', 'viberater social': 'VibeRater Social' };

export function tagLabel(tag: string): string {
  const flat = tag.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
  if (WHOLE_TAG[flat]) return WHOLE_TAG[flat];
  return tag
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((word) => {
      const lower = word.toLowerCase();
      if (NICE_CASE[lower]) return NICE_CASE[lower];
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
}

// Published posts (drafts excluded), newest first. The single source of truth for
// what's live — index, RSS, sitemap (via pages), and llms.txt all build from this.
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => data.draft !== true);
  return posts.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
}

// The post to feature at the top of /blog/: the most recently published post
// marked `featured: true`, falling back to the newest post overall so the
// section always has something to show.
export function getFeaturedPost(posts: Post[]): Post | undefined {
  return posts.find((p) => p.data.featured) ?? posts[0];
}

// All distinct tags across published posts, with their post counts, sorted by count
// (ties broken alphabetically). Tags are merged by slug — "Privacy" and "privacy",
// or "AI photo apps" and "ai photo apps", become one entry with a combined count and
// a single nicely-cased label, so the tag cloud never shows two chips for one topic.
export async function getAllTags(): Promise<{ tag: string; slug: string; count: number }[]> {
  const posts = await getPublishedPosts();
  const counts = new Map<string, number>();
  const labels = new Map<string, string>();
  for (const post of posts) {
    for (const tag of postTags(post)) {
      const slug = tagSlug(tag);
      if (!slug) continue;
      counts.set(slug, (counts.get(slug) ?? 0) + 1);
      if (!labels.has(slug)) labels.set(slug, tagLabel(tag));
    }
  }
  return [...counts.entries()]
    .map(([slug, count]) => ({ tag: labels.get(slug) ?? slug, slug, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

// The top N tags by post count — used for the compact "Browse" strip on /blog/.
// The long tail still lives in getAllTags() / /blog/tags/.
export async function getTopTags(n: number): Promise<{ tag: string; slug: string; count: number }[]> {
  const tags = await getAllTags();
  return tags.slice(0, n);
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
