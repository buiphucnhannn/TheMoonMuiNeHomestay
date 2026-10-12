// Tạo toàn bộ ảnh/asset cho web từ ảnh gốc trong assets/source/.
// Chạy lại khi thay ảnh gốc:  npm run assets
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(root, 'assets/source');
const OUT = join(root, 'public/images');
const APP = join(root, 'app');
const PUB = join(root, 'public');
for (const d of ['hero', 'about', 'rooms', 'gallery', 'branches', 'banner', 'brand']) {
  mkdirSync(join(OUT, d), { recursive: true });
}

const MAX_W = 1600;
const jpg = (p) => sharp(p, { failOn: 'none' }).rotate();

async function saveJpg(pipeline, rel, width = MAX_W) {
  const info = await pipeline
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(join(OUT, rel));
  console.log('✓', rel, `${info.width}x${info.height}`, Math.round(info.size / 1024) + 'KB');
}
const crop = (file, left, top, width, height) => jpg(join(SRC, file)).extract({ left, top, width, height });

// ---------- 1. Ảnh chụp: bản đầy đủ ----------
const PHOTOS = [
  ['arches-pool.jpg', 'hero/arches-pool.jpg'],
  ['twin-room.jpg', 'rooms/twin-1.jpg'],
  ['bbq-night.jpg', 'banner/bbq-night.jpg'],
  ['pool-courtyard.jpg', 'gallery/pool-courtyard.jpg'],
  ['poster-chill.jpg', 'about/poster-chill.jpg'],
  ['muine-exterior.jpg', 'branches/muine.jpg'],
];
for (const [src, dst] of PHOTOS) await saveJpg(jpg(join(SRC, src)), dst);

// ---------- 2. Các góc cắt để đa dạng ảnh phòng / gallery ----------
const CROPS = [
  // Phòng Pool View: cửa sổ vòm có cây + ghế, vòm giữa nhìn ra hồ, hồ bơi qua khung cửa
  ['arches-pool.jpg', 'rooms/pool-view-2.jpg', 205, 235, 532, 994],
  ['arches-pool.jpg', 'rooms/pool-view-3.jpg', 840, 113, 553, 1253],
  ['arches-pool.jpg', 'gallery/pool-detail.jpg', 881, 881, 491, 450],
  // Phòng Twin: giường + mây tre, giường + bàn, mảng decor mây tre
  ['twin-room.jpg', 'rooms/twin-2.jpg', 1075, 236, 973, 1130],
  ['twin-room.jpg', 'rooms/twin-3.jpg', 0, 307, 1106, 1059],
  ['twin-room.jpg', 'gallery/rattan-decor.jpg', 1270, 297, 676, 440],
  // Tối BBQ: bàn tiệc, neon + hồ bơi
  ['bbq-night.jpg', 'gallery/bbq-table.jpg', 655, 778, 1188, 588],
  ['bbq-night.jpg', 'gallery/neon-pool.jpg', 0, 430, 1126, 936],
  // Sân hồ bơi: ghế dưới đèn, dãy cửa vòm
  ['pool-courtyard.jpg', 'gallery/pool-chair.jpg', 1372, 338, 676, 788],
  ['pool-courtyard.jpg', 'rooms/arched-doors.jpg', 123, 389, 952, 635],
  // Poster: phao bơi (bỏ phần chữ)
  ['poster-chill.jpg', 'gallery/floaties.jpg', 520, 600, 882, 420],
  // Mũi Né: hoa giấy + bảng hiệu
  ['muine-exterior.jpg', 'gallery/bougainvillea.jpg', 110, 130, 790, 690],
];
for (const [src, dst, l, t, w, h] of CROPS) await saveJpg(crop(src, l, t, w, h), dst);

// ---------- 3. Logo: cắt sát chữ + tách nền kem thành trong suốt ----------
const BG = [248, 243, 240];
async function keyOut(input) {
  const { data, info } = await input.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const d = Math.hypot(data[i] - BG[0], data[i + 1] - BG[1], data[i + 2] - BG[2]);
    const a = Math.max(0, Math.min(1, (d - 8) / 40)); // mép chữ mờ dần tự nhiên
    data[i + 3] = Math.round(a * 255);
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } });
}
const trimmed = jpg(join(SRC, 'logo.jpg')).trim({ threshold: 25 });
const wordmark = await keyOut(trimmed);
await wordmark.clone().png({ compressionLevel: 9 }).toFile(join(OUT, 'brand/wordmark.png'));
await sharp(join(OUT, 'brand/wordmark.png')).resize({ width: 640 }).png().toFile(join(OUT, 'brand/wordmark-640.png'));
await jpg(join(SRC, 'logo.jpg')).resize(1024, 1024).jpeg({ quality: 85 }).toFile(join(OUT, 'brand/logo-square.jpg'));
console.log('✓ brand/wordmark.png, wordmark-640.png, logo-square.jpg');

// ---------- 4. Icon web (favicon / apple / android) từ public/images/brand/logo-square.jpg ----------
const LOGO_ICON = join(OUT, 'brand/logo-square.jpg');
const icon = (size) => sharp(LOGO_ICON).resize(size, size, { fit: 'cover' }).png();
await icon(512).toFile(join(APP, 'icon.png'));
await icon(180).toFile(join(APP, 'apple-icon.png'));
await icon(192).toFile(join(PUB, 'android-chrome-192x192.png'));
await icon(512).toFile(join(PUB, 'android-chrome-512x512.png'));

function buildIco(frames) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(frames.length, 4);
  const parts = [header];
  const datas = [];
  let offset = 6 + 16 * frames.length;
  for (const { size, data } of frames) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    parts.push(e);
    datas.push(data);
    offset += data.length;
  }
  return Buffer.concat([...parts, ...datas]);
}
const frames = [];
for (const size of [16, 32, 48]) frames.push({ size, data: await icon(size).toBuffer() });
const icoBuffer = buildIco(frames);
writeFileSync(join(APP, 'favicon.ico'), icoBuffer);
writeFileSync(join(PUB, 'favicon.ico'), icoBuffer);
console.log('✓ app/favicon.ico, public/favicon.ico, icon.png, apple-icon.png');

// ---------- 5. Ảnh chia sẻ Facebook/Zalo (Open Graph 1200x630) ----------
const og = await jpg(join(SRC, 'arches-pool.jpg')).resize(1200, 630, { fit: 'cover', position: 'centre' }).toBuffer();
const wm = await sharp(join(OUT, 'brand/wordmark.png')).resize({ width: 470, height: 190, fit: 'inside' }).png().toBuffer();
const card = await sharp({ create: { width: 560, height: 230, channels: 4, background: { r: 248, g: 243, b: 238, alpha: 1 } } })
  .composite([{ input: wm, gravity: 'centre' }])
  .png()
  .toBuffer();
const roundMask = Buffer.from('<svg width="560" height="230"><rect width="560" height="230" rx="36" fill="#000"/></svg>');
const rounded = await sharp(card).composite([{ input: roundMask, blend: 'dest-in' }]).png().toBuffer();
const shade = Buffer.from(
  '<svg width="1200" height="630"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1b24" stop-opacity="0"/><stop offset="1" stop-color="#0d1b24" stop-opacity="0.6"/></linearGradient></defs><rect width="1200" height="630" fill="url(#g)"/></svg>'
);
await sharp(og)
  .composite([{ input: shade }, { input: rounded, left: 60, top: 340 }])
  .jpeg({ quality: 86 })
  .toFile(join(APP, 'opengraph-image.jpg'));
console.log('✓ app/opengraph-image.jpg');

// ---------- 6. Mặt nạ mép ảnh hero (cạnh trái lượn sóng sin đều, mép mờ mảnh, mờ nhẹ ở đáy) ----------
{
  const W = 1200, H = 1200;
  // Vẽ trên khung rộng hơn rồi cắt lại: nếu không, nét mờ bị cắt ở mép canvas → mép trên/phải ảnh mờ ngoài ý muốn
  const PAD = 0.2 * W;
  // Thông số giống mẫu 4ChanHomestay: sóng sin đều 1.5 chu kỳ, mép mờ mảnh, chỉ mờ nhẹ ở đáy
  const amp = 3.6; // biên độ sóng (% chiều rộng)
  const periods = 1.5;
  const inset = 7; // vị trí mép trái (% chiều rộng)
  const blur = 0.9; // độ mờ mép (% kích thước)
  const bottomFade = 20; // % chiều cao tan dần ở đáy (đường cong ease, không phải tuyến tính → không lộ vệt cắt)
  const pts = [];
  for (let i = 0; i <= 240; i++) {
    const t = i / 240; // 0 = đáy, 1 = đỉnh
    const x = inset + amp * Math.sin(2 * Math.PI * periods * t + Math.PI / 2);
    pts.push(`${((x * W) / 100 + PAD).toFixed(1)},${(((110 - t * 120) * H) / 100 + PAD).toFixed(1)}`);
  }
  const d = `M${1.3 * W + PAD},${-0.3 * H + PAD} L${1.3 * W + PAD},${1.3 * H + PAD} L${pts.join(' L')} Z`;
  const fadeStart = (100 - bottomFade) / 100;
  // Nhiều nấc theo smoothstep đảo: đầu vùng giảm rất chậm, giữa nhanh, cuối lại chậm → tan êm vào nền
  const fadeStops = Array.from({ length: 11 }, (_, i) => {
    const k = i / 10;
    const a = 1 - k * k * (3 - 2 * k);
    return `<stop offset="${(fadeStart + k * (1 - fadeStart)).toFixed(3)}" stop-color="#fff" stop-opacity="${a.toFixed(3)}"/>`;
  }).join('');
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W + 2 * PAD}" height="${H + 2 * PAD}">` +
    `<defs>` +
    `<linearGradient id="g" gradientUnits="userSpaceOnUse" x1="0" y1="${PAD}" x2="0" y2="${H + PAD}">` +
    `<stop offset="0" stop-color="#fff"/>` +
    fadeStops +
    `</linearGradient>` +
    `<filter id="b" x="-20%" y="-20%" width="140%" height="140%">` +
    `<feGaussianBlur stdDeviation="${((blur * W) / 100).toFixed(1)}"/>` +
    `</filter>` +
    `</defs>` +
    `<path d="${d}" fill="url(#g)" filter="url(#b)"/>` +
    `</svg>`;
  mkdirSync(join(PUB, 'masks'), { recursive: true });
  await sharp(Buffer.from(svg))
    .extract({ left: PAD, top: PAD, width: W, height: H })
    .png({ compressionLevel: 9 })
    .toFile(join(PUB, 'masks/hero-feather.png'));
  console.log('✓ masks/hero-feather.png (sóng sin đều, mép mờ mảnh)');
}

console.log('\nXong. Ảnh nằm trong public/images/, icon + ảnh OG trong app/.');
