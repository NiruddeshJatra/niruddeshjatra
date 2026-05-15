import sharp from 'sharp';
import { createWriteStream } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '..', 'public');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#0a0e0a" rx="64"/>
  <text x="256" y="330" text-anchor="middle" font-family="monospace" font-size="240" font-weight="bold" fill="#00d26a">nj</text>
</svg>`;

const svgBuffer = Buffer.from(svg);

const sizes = [
  { file: 'favicon-16x16.png', size: 16 },
  { file: 'favicon-32x32.png', size: 32 },
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'android-chrome-192x192.png', size: 192 },
  { file: 'android-chrome-512x512.png', size: 512 },
];

for (const { file, size } of sizes) {
  const outPath = join(publicDir, file);
  await sharp(svgBuffer).resize(size, size).png().toFile(outPath);
  console.log(`Generated ${file} (${size}x${size})`);
}

// Generate favicon.ico from 16x16 and 32x32 PNGs
const png16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
const png32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();

const pngToIco = (await import('png-to-ico')).default;
const ico = await pngToIco([png16, png32]);
const icoPath = join(publicDir, 'favicon.ico');
createWriteStream(icoPath).write(ico);
console.log(`Generated favicon.ico`);

console.log('All favicons generated.');
