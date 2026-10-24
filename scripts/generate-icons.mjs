// Rasterize Stride's simple arrow mark without adding an image-build dependency.
import { mkdir, writeFile } from 'node:fs/promises';
import { deflateSync } from 'node:zlib';

const folder = new URL('../public/', import.meta.url);
await mkdir(new URL('icons/', folder), { recursive: true });
const points = [[169,340],[141,312],[285,168],[185,168],[185,128],[357,128],[357,300],[317,300],[317,200]];
const background = [45,83,59], foreground = [222,237,172];
function inside(x, y) {
  let hit = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [a,b] = points[i], [c,d] = points[j];
    if ((b > y) !== (d > y) && x < (c-a) * (y-b) / (d-b) + a) hit = !hit;
  }
  return hit;
}
function crc32(data) {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const tag = Buffer.from(type), size = Buffer.alloc(4), crc = Buffer.alloc(4);
  size.writeUInt32BE(data.length);
  crc.writeUInt32BE(crc32(Buffer.concat([tag, data])));
  return Buffer.concat([size, tag, data, crc]);
}
function png(size) {
  const rows = Buffer.alloc(size * (1 + size * 3));
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    let covered = 0;
    for (let sy = 0; sy < 4; sy++) for (let sx = 0; sx < 4; sx++) {
      if (inside((x + (sx + .5) / 4) * 512 / size, (y + (sy + .5) / 4) * 512 / size)) covered++;
    }
    for (let c = 0; c < 3; c++) rows[y * (1 + size * 3) + 1 + x * 3 + c] = Math.round(background[c] + (foreground[c] - background[c]) * covered / 16);
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size); header.writeUInt32BE(size, 4); header[8] = 8; header[9] = 2;
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), chunk('IHDR', header), chunk('IDAT', deflateSync(rows)), chunk('IEND', Buffer.alloc(0))]);
}
for (const [name, size] of [['icon-192',192],['icon-512',512],['icon-maskable-512',512],['apple-touch-icon',180]]) {
  await writeFile(new URL(`icons/${name}.png`, folder), png(size));
}
await writeFile(new URL('favicon.svg', folder), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="110" fill="#2d533b"/><polygon points="${points.map(p => p.join(',')).join(' ')}" fill="#deedac"/></svg>\n`);
console.log('Generated app icons, maskable icon, Apple touch icon, and favicon.');
