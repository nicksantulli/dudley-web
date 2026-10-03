import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

// Point a poster or app icon at its WebP sibling when that file exists.
export function webpSibling(assetPath) {
  const candidate = String(assetPath).replace(/\.(png|svg)$/i, '.webp');
  if (candidate === assetPath) return assetPath;
  return existsSync(resolve('public', candidate.replace(/^\//, ''))) ? candidate : assetPath;
}

export function normalizePublicPath(path) {
  const value = String(path);
  const match = value.match(/^([^?#]*)([?#].*)?$/);
  const pathname = match?.[1] || '/';
  const suffix = match?.[2] || '';
  if (pathname === '/') return `/${suffix}`;
  if (/\.[a-z0-9]+$/i.test(pathname)) return `${pathname}${suffix}`;
  return `${pathname.replace(/\/+$/, '')}/${suffix}`;
}
