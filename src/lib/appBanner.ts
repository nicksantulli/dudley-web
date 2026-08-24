import { getEntry } from 'astro:content';

// Resolve a content-collection app slug (e.g. "vibe-rater") to the App Store id
// for a Safari Smart App Banner. Only live apps qualify — a banner pointing at
// an unreleased store page would dead-end the tap.
export async function appBannerIdFor(slug: string | undefined): Promise<string | undefined> {
  if (!slug) return undefined;
  const app = await getEntry('apps', slug);
  if (!app) return undefined;
  const { appStoreId, status } = app.data;
  return status === 'live' && appStoreId ? appStoreId : undefined;
}
