import { getEntry } from 'astro:content';

// Resolve a content-collection app slug to an App Store id for Safari Smart App
// Banners. Only live apps qualify so a banner never points at an unreleased page.
export async function appBannerIdFor(slug: string | undefined): Promise<string | undefined> {
  if (!slug) return undefined;
  const app = await getEntry('apps', slug);
  if (!app) return undefined;
  const { appStoreId, status } = app.data;
  return status === 'live' && appStoreId ? appStoreId : undefined;
}
