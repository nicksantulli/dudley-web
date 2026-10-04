// One list of apps that are actually on the App Store. Home, About, and llms.txt
// all read this so a launch cannot update one surface and leave the others stale.
import { HOME_APP_STORE_TOKENS, appStoreCampaignUrl } from './campaignLinks.mjs';

// Newly approved apps go at the top.
export const LIVE_APP_ORDER = [
  'table-talk',
  'econbyte',
  'last-human',
  'packed-yet',
  'monetary-policy-independence-day',
];

// Kept off the home page and every shared app list. Standalone pages stay.
const UNLISTED = new Set([
  'vibe-rater',
  'beat-the-dealer',
]);

const rank = new Map(LIVE_APP_ORDER.map((slug, index) => [slug, index]));

export function isListedApp(app) {
  return !UNLISTED.has(app?.id);
}

export function listedApps(apps) {
  return apps.filter(isListedApp);
}

export function byCatalogOrder(a, b) {
  const ar = rank.get(a.id);
  const br = rank.get(b.id);
  if (ar !== undefined && br !== undefined) return ar - br;
  if (ar !== undefined) return -1;
  if (br !== undefined) return 1;
  return (a.data.order ?? 99) - (b.data.order ?? 99);
}

export function storeUrlForLiveApp(app) {
  const id = app?.data?.appStoreId || '';
  const token = id ? HOME_APP_STORE_TOKENS[id] : '';
  const name = app?.data?.name || app?.id || 'unknown app';
  if (!id || !token) {
    throw new Error(`Live app ${name} has no App Store link`);
  }
  const url = appStoreCampaignUrl(id, token);
  if (!url.includes('pt=128970277') || !url.includes('mt=8') || !url.includes(`ct=${token}`)) {
    throw new Error(`Live app ${name} store link is missing campaign parameters`);
  }
  return url;
}

export function liveApps(apps) {
  const live = listedApps(apps)
    .filter((app) => app.data.status === 'live')
    .sort(byCatalogOrder);
  for (const app of live) storeUrlForLiveApp(app);
  return live;
}

export function comingSoonApps(apps) {
  return listedApps(apps)
    .filter((app) => !app.data.developedFor && app.data.status !== 'live')
    .sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99));
}

export function englishList(items) {
  if (items.length <= 1) return items[0] ?? '';
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

// "Last Human: Dodge the Bots" reads as "Last Human" in a sentence of store links.
export function storeListName(app) {
  return String(app?.data?.name || '').split(':')[0].trim();
}
