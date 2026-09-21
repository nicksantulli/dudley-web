import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';

const names = [
  'last-human',
  'table-talk',
  'vibe-rater',
  'econbyte',
  'powell-prowl',
  'beat-the-dealer',
  'dude-wheres-this-house',
];

const dudleyMark = resolve('public/assets/dudley-mark.png');
if (existsSync(dudleyMark)) {
  await sharp(dudleyMark)
    .resize({ width: 360, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(resolve('public/assets/dudley-mark-logo.png'));

  await sharp(dudleyMark)
    .resize({ width: 108, withoutEnlargement: true })
    .ensureAlpha()
    .linear([0, 0, 0, 1], [245, 240, 230, 0])
    .webp({ quality: 88, effort: 5 })
    .toFile(resolve('public/assets/dudley-mark-header.webp'));
}

for (const name of names) {
  const icon = resolve(`public/assets/${name}-icon.png`);
  if (existsSync(icon)) {
    await sharp(icon)
      .resize({ width: 256, height: 256, fit: 'cover', withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toFile(resolve(`public/assets/${name}-icon.webp`));
  }

  const art = resolve(`public/assets/${name}-og.png`);
  if (existsSync(art)) {
    await sharp(art)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toFile(resolve(`public/assets/${name}-og.webp`));
  }
}
