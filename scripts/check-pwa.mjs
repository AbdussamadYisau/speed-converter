import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const dist = new URL('../dist/', import.meta.url);
const read = (path, encoding = 'utf8') => readFile(new URL(path, dist), encoding);
const manifest = JSON.parse(await read('manifest.webmanifest'));
assert.equal(manifest.display, 'standalone');
assert.equal(manifest.start_url, '/');
assert.equal(manifest.scope, '/');
assert.ok(manifest.name && manifest.short_name);

for (const size of [192, 512]) {
  assert.ok(manifest.icons.some(icon => icon.sizes === `${size}x${size}` && icon.purpose === 'any'));
}
assert.ok(manifest.icons.some(icon => icon.purpose === 'maskable'));
for (const icon of [...manifest.icons, { src: '/icons/apple-touch-icon.png', sizes: '180x180' }]) {
  const png = await read(icon.src.slice(1), null);
  assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  const [width, height] = icon.sizes.split('x').map(Number);
  assert.equal(png.readUInt32BE(16), width);
  assert.equal(png.readUInt32BE(20), height);
}

const html = await read('index.html');
assert.match(html, /rel="manifest"/);
assert.match(html, /rel="apple-touch-icon"/);
const worker = await read('sw.js');
assert.match(worker, /precacheAndRoute/);
assert.ok(worker.includes('index.html'));
for (const file of await readdir(new URL('assets/', dist))) {
  if (/\.(js|css|woff2)$/.test(file)) assert.ok(worker.includes(`assets/${file}`), `${file} is missing from the offline precache`);
}
for (const icon of manifest.icons) assert.ok(worker.includes(icon.src.slice(1)), `${icon.src} is missing from the offline precache`);
assert.match(worker, /cleanupOutdatedCaches/);
console.log('PWA build checks passed: standalone manifest, correctly sized PNG icons, Apple icon, app-shell precache, and cache cleanup.');
