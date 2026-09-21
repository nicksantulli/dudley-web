export function normalizePublicPath(path) {
  const value = String(path);
  const match = value.match(/^([^?#]*)([?#].*)?$/);
  const pathname = match?.[1] || '/';
  const suffix = match?.[2] || '';
  if (pathname === '/') return `/${suffix}`;
  if (/\.[a-z0-9]+$/i.test(pathname)) return `${pathname}${suffix}`;
  return `${pathname.replace(/\/+$/, '')}/${suffix}`;
}
