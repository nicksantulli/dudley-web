import type { Post } from './blog';
import { postTags, tagLabel, tagSlug } from './blog';

export const TOPIC_HUBS = {
  'iphone-privacy': {
    title: 'iPhone Privacy',
    description: 'Plain-English answers about photo access, contacts, location, screenshots, metadata, and app permissions.',
  },
  'ai-media': {
    title: 'AI Images & Media',
    description: 'How AI-generated media, labels, training controls, watermarks, provenance, and authenticity signals work.',
  },
  'internet-culture': {
    title: 'Internet Culture',
    description: 'Clear explanations of vibe language, social trends, group-chat behavior, and the internet’s stranger corners.',
  },
  'economics': {
    title: 'Economics in Plain English',
    description: 'Inflation, prices, interest rates, central banks, and economic headlines without textbook fog.',
  },
  'app-store': {
    title: 'The App Store Explained',
    description: 'Practical answers about iPhone app releases, privacy disclosures, age checks, downloads, and updates.',
  },
  'dudley-guides': {
    title: 'Dudley App Guides',
    description: 'How Dudley apps work, what they cost, and what to expect before downloading.',
  },
} as const;

export type TopicSlug = keyof typeof TOPIC_HUBS;

const TAG_TO_TOPIC: Record<string, TopicSlug> = {
  privacy: 'iphone-privacy',
  'iphone-privacy': 'iphone-privacy',
  'iphone-photo-privacy': 'iphone-privacy',
  'photo-privacy': 'iphone-privacy',
  'app-privacy': 'iphone-privacy',
  'app-permissions': 'iphone-privacy',
  'photo-permissions': 'iphone-privacy',
  'location-privacy': 'iphone-privacy',
  'social-media-privacy': 'iphone-privacy',
  'ai-photos': 'ai-media',
  'ai-photo-apps': 'ai-media',
  'ai-photo-labels': 'ai-media',
  'ai-content-labels': 'ai-media',
  'ai-training': 'ai-media',
  'ai-slop': 'ai-media',
  c2pa: 'ai-media',
  synthid: 'ai-media',
  'content-credentials': 'ai-media',
  culture: 'internet-culture',
  'ai-culture': 'internet-culture',
  'gen-z-slang': 'internet-culture',
  'vibe-check': 'internet-culture',
  'vibe-meaning': 'internet-culture',
  'aura-slang': 'internet-culture',
  'aura-points': 'internet-culture',
  'social-media': 'internet-culture',
  'group-chat': 'internet-culture',
  inflation: 'economics',
  economics: 'economics',
  cpi: 'economics',
  disinflation: 'economics',
  'grocery-prices': 'economics',
  'price-level': 'economics',
  'app-store': 'app-store',
  'age-assurance': 'app-store',
  viberater: 'dudley-guides',
  'vibe-rater': 'dudley-guides',
  'table-talk': 'dudley-guides',
  econbyte: 'dudley-guides',
  'photo-games': 'dudley-guides',
  'conversation-starter': 'dudley-guides',
};

export const topicForLabel = (label: string): TopicSlug | undefined => TAG_TO_TOPIC[tagSlug(label)];

export function postsForTopic(posts: Post[], slug: TopicSlug): Post[] {
  return posts.filter((post) => postTags(post).some((label) => topicForLabel(label) === slug));
}

export function eligibleTopicHubs(posts: Post[], minimum = 3) {
  return Object.entries(TOPIC_HUBS)
    .map(([slug, meta]) => ({ slug: slug as TopicSlug, ...meta, posts: postsForTopic(posts, slug as TopicSlug) }))
    .filter((hub) => hub.posts.length >= minimum);
}

export function topicsForPost(post: Post, eligibleSlugs?: ReadonlySet<TopicSlug>) {
  const slugs = [...new Set(postTags(post).map(topicForLabel).filter((slug): slug is TopicSlug => Boolean(slug)))];
  return slugs
    .filter((slug) => !eligibleSlugs || eligibleSlugs.has(slug))
    .map((slug) => ({ slug, ...TOPIC_HUBS[slug] }));
}

export function unmappedLabelsForPost(post: Post) {
  return [...new Set(postTags(post).filter((label) => !topicForLabel(label)).map(tagLabel))];
}
