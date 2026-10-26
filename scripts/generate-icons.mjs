import { deflateSync } from "zlib";
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i += 1) {
    c ^= buf[i];
    for (let k = 0; k < 8; k += 1) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const t = Buffer.from(type);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}

function png(size, paint) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y += 1) {
    raw[y * (size * 4 + 1)] = 0;
    for (let x = 0; x < size; x += 1) {
      const [r, g, b, a] = paint(x, y, size);
      const o = y * (size * 4 + 1) + 1 + x * 4;
      raw[o] = r;
      raw[o + 1] = g;
      raw[o + 2] = b;
      raw[o + 3] = a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function circle(x, y, cx, cy, r) {
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
}

function roundedRect(x, y, left, top, w, h, r) {
  if (x < left || y < top || x > left + w || y > top + h) return false;
  const nx = Math.min(Math.max(x, left + r), left + w - r);
  const ny = Math.min(Math.max(y, top + r), top + h - r);
  if (x >= left + r && x <= left + w - r) return true;
  if (y >= top + r && y <= top + h - r) return true;
  return (x - nx) ** 2 + (y - ny) ** 2 <= r * r;
}

function paint(x, y, size) {
  const s = size;
  if (circle(x, y, s * 0.5, s * 0.5, s * 0.49)) {
    if (roundedRect(x, y, s * 0.22, s * 0.18, s * 0.56, s * 0.66, s * 0.08)) {
      if (y < s * 0.28 && x > s * 0.58) return [255, 183, 77, 255];
      if (y > s * 0.4 && y < s * 0.44 && x > s * 0.32 && x < s * 0.7) return [184, 134, 11, 255];
      if (y > s * 0.5 && y < s * 0.54 && x > s * 0.32 && x < s * 0.64) return [184, 134, 11, 255];
      if (y > s * 0.6 && y < s * 0.64 && x > s * 0.32 && x < s * 0.58) return [184, 134, 11, 255];
      return [255, 252, 235, 255];
    }
    return [255, 213, 79, 255];
  }
  return [0, 0, 0, 0];
}

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
writeFileSync(join(dir, "icon-192.png"), png(192, paint));
writeFileSync(join(dir, "icon-512.png"), png(512, paint));
writeFileSync(join(dir, "apple-touch-icon.png"), png(180, paint));
console.log("icons generated");
