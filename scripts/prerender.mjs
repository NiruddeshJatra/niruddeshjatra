import puppeteer from 'puppeteer-core';
import { createServer } from 'http';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import handler from 'serve-handler';
import { ROUTES } from './routes.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');

const PORT = 5050;

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;

  const candidates = {
    win32: [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
    ],
    darwin: [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
    ],
    linux: [
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable',
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
      '/snap/bin/chromium',
    ],
  };

  const paths = candidates[process.platform] ?? candidates.linux;
  return paths.find(p => existsSync(p)) ?? null;
}

const chromePath = findChrome();

if (!chromePath) {
  console.warn(
    'Pre-render skipped: Chrome/Chromium not found.\n' +
    'Set CHROME_PATH env var to enable pre-rendering in this environment.'
  );
  process.exit(0);
}

// Serve dist as SPA (all routes → index.html)
const server = createServer((req, res) => {
  return handler(req, res, {
    public: distDir,
    rewrites: [{ source: '**', destination: '/index.html' }],
  });
});

await new Promise((resolve) => server.listen(PORT, resolve));
console.log(`Static server on http://localhost:${PORT}`);

const browser = await puppeteer.launch({
  executablePath: chromePath,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  headless: true,
});

for (const route of ROUTES) {
  const page = await browser.newPage();
  await page.goto(`http://localhost:${PORT}${route}`, {
    waitUntil: 'networkidle0',
    timeout: 30000,
  });

  // Wait for react-helmet-async to flush meta tags
  await new Promise(r => setTimeout(r, 800));

  const html = await page.content();
  await page.close();

  const outDir = route === '/'
    ? distDir
    : join(distDir, ...route.split('/').filter(Boolean));

  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), html, 'utf8');
  console.log(`✅ pre-rendered ${route}`);
}

await browser.close();
server.close();
console.log('Pre-rendering complete.');
