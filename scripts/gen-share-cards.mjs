#!/usr/bin/env node
// Simple on-brand share cards for each post: paper background, ink type, the
// post title. No stock art. Built before `astro build` so public/ copies them.
import { mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const OUT = 'public/assets/share';
const WIDTH = 1200;
const HEIGHT = 630;

function titleOf(markdown) {
  const match = markdown.match(/^title:\s*"([^"]+)"/m) || markdown.match(/^title:\s*'([^']+)'/m) || markdown.match(/^title:\s*(.+)$/m);
  return (match?.[1] || 'Dudley Development').trim();
}

function xml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wrap(title, max = 28) {
  const words = title.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 6);
}

function cardSvg(title) {
  const lines = wrap(title);
  const startY = 250 - ((lines.length - 1) * 34);
  const tspans = lines
    .map((line, index) => `<tspan x="88" dy="${index === 0 ? 0 : 78}">${xml(line)}</tspan>`)
    .join('');
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#f5f0e6"/>
  <rect width="18" height="${HEIGHT}" fill="#0b0b0a"/>
  <text x="88" y="96" fill="#0b0b0a" font-family="Liberation Sans, DejaVu Sans, sans-serif" font-size="28" font-weight="700" letter-spacing="3">DUDLEY DEVELOPMENT</text>
  <text x="88" y="${startY}" fill="#0b0b0a" font-family="Liberation Sans, DejaVu Sans, sans-serif" font-size="64" font-weight="700">${tspans}</text>
  <text x="88" y="568" fill="#5d574e" font-family="Liberation Sans, DejaVu Sans, sans-serif" font-size="28">dudleyapps.com</text>
</svg>`;
}

mkdirSync(OUT, { recursive: true });
const files = readdirSync('src/content/blog').filter((name) => name.endsWith('.md') || name.endsWith('.mdx'));
for (const file of files) {
  const slug = file.replace(/\.mdx?$/, '');
  const title = titleOf(readFileSync(join('src/content/blog', file), 'utf8'));
  await sharp(Buffer.from(cardSvg(title)))
    .png({ compressionLevel: 9 })
    .toFile(join(OUT, `${slug}.png`));
}
console.log(`share cards: ${files.length} → ${OUT}`);
