// One list of apps that are actually on the App Store. Home, About, and llms.txt
// all read this so a launch cannot update one surface and leave the others stale.
import { HOME_APP_STORE_TOKENS, appStoreCampaignUrl } from './campaignLinks.mjs';

const LIVE_RANK = [
  'last-human',
  'table-talk',
  'vibe-rater',
  'econbyte',
  'monetary-policy-independence-day',
  'packed-yet',
  'dude-wheres-this-house',
];

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
  const rank = new Map(LIVE_RANK.map((slug, index) => [slug, index]));
  const live = apps
    .filter((app) => app.data.status === 'live')
    .sort((a, b) => (rank.get(a.id) ?? 99) - (rank.get(b.id) ?? 99) || a.data.order - b.data.order);
  for (const app of live) storeUrlForLiveApp(app);
  return live;
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
