import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const outputPath = join(__dirname, '..', 'public', 'og-image.png');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0a0e0a"/>
  <g opacity="0.05">
    <line x1="0" y1="100" x2="1200" y2="100" stroke="#00d26a" stroke-width="1"/>
    <line x1="0" y1="200" x2="1200" y2="200" stroke="#00d26a" stroke-width="1"/>
    <line x1="0" y1="300" x2="1200" y2="300" stroke="#00d26a" stroke-width="1"/>
    <line x1="0" y1="400" x2="1200" y2="400" stroke="#00d26a" stroke-width="1"/>
    <line x1="0" y1="500" x2="1200" y2="500" stroke="#00d26a" stroke-width="1"/>
  </g>
  <text x="600" y="290" text-anchor="middle" font-family="monospace" font-size="120" font-weight="bold" fill="#00d26a" letter-spacing="-2">niruddeshjatra</text>
  <text x="600" y="370" text-anchor="middle" font-family="monospace" font-size="42" fill="#9ab09a" letter-spacing="6">tutor · runner · maker</text>
  <text x="600" y="540" text-anchor="middle" font-family="monospace" font-size="24" fill="#9ab09a" letter-spacing="2">a quiet corner of the internet</text>
  <text x="600" y="600" text-anchor="middle" font-family="monospace" font-size="20" fill="#00d26a">&gt; _</text>
</svg>`;

await sharp(Buffer.from(svg))
  .png()
  .toFile(outputPath);

console.log(`og-image.png generated at ${outputPath}`);
