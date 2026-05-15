import puppeteer from 'puppeteer-core';
import { createServer } from 'http';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import handler from 'serve-handler';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');

const ROUTES = [
  '/',
  '/about',
  '/writing',
  '/writing/essays/on-running-for-nothing',
  '/writing/essays/on-running-for-nothing-bn',
  '/writing/essays/on-staying-small',
  '/writing/essays/on-staying-small-bn',
  '/writing/essays/on-forgetting',
  '/writing/essays/on-forgetting-bn',
  '/journey',
  '/journey-running',
  '/journey-hiking',
  '/games',
  '/field-notes',
  '/now',
  '/contact',
];

const CHROME_PATH = process.env.CHROME_PATH ||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const PORT = 5050;

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
  executablePath: CHROME_PATH,
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
