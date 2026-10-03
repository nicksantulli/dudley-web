import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const cache = new Map();

export function gitCommitIso(filePath) {
  if (!filePath) return '';
  if (cache.has(filePath)) return cache.get(filePath);
  let iso = '';
  if (existsSync(filePath)) {
    try {
      iso = execFileSync('git', ['log', '-1', '--format=%cI', '--', filePath], {
        encoding: 'utf8',
      }).trim();
    } catch {
      iso = '';
    }
  }
  cache.set(filePath, iso);
  return iso;
}

export function sourceFileForUrl(url) {
  let pathname = '';
  try {
    pathname = new URL(url, 'https://dudleyapps.com').pathname;
  } catch {
    return '';
  }
  const path = pathname.replace(/\/$/, '');
  const candidates = [];
  const blog = path.match(/^\/blog\/([^/]+)$/);
  if (blog && !['tags', 'topics'].includes(blog[1]) && !/^\d+$/.test(blog[1])) {
    candidates.push(`src/content/blog/${blog[1]}.md`, `src/content/blog/${blog[1]}.mdx`);
  }
  const app = path.match(/^\/apps\/([^/]+)$/);
  if (app) candidates.push(`src/content/apps/${app[1]}.mdx`);
  const archetype = path.match(/^\/archetypes\/([^/]+)$/);
  if (archetype) candidates.push(`src/content/archetypes/${archetype[1]}.mdx`);
  const comparison = path.match(/^\/compare\/([^/]+)$/);
  if (comparison) candidates.push(`src/content/comparisons/${comparison[1]}.mdx`);
  const tool = path.match(/^\/tools\/([^/]+)$/);
  if (tool) candidates.push(`src/content/tools/${tool[1]}.mdx`);
  if (path === '') candidates.push('src/pages/index.astro');
  else {
    candidates.push(
      `src/pages${path}.astro`,
      `src/pages${path}/index.astro`,
    );
  }
  return candidates.find((file) => existsSync(file)) || '';
}

export function lastmodForUrl(url) {
  const iso = gitCommitIso(sourceFileForUrl(url));
  return iso ? iso.slice(0, 10) : '';
}
