import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');
const issues = [];
const warnings = [];
const passed = [];

function pass(message) { passed.push(message); }
function fail(message) { issues.push(message); }
function warn(message) { warnings.push(message); }

async function exists(rel) {
  try { await fs.access(path.join(root, rel)); return true; } catch { return false; }
}

async function read(rel) {
  return fs.readFile(path.join(root, rel), 'utf8');
}

function extractLocs(xml) {
  return [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((match) => match[1].trim());
}

const requiredFiles = ['public/robots.txt', 'public/sitemap.xml', 'public/sitemap-pages.xml', 'public/llms.txt'];
for (const rel of requiredFiles) {
  (await exists(rel)) ? pass(`${rel} exists`) : fail(`${rel} is missing`);
}

const envExample = await read('.env.example');
for (const key of ['VITE_API_BASE_URL', 'VITE_WEBSOCKET_BASE_URL', 'VITE_SITE_URL', 'SEO_API_BASE_URL', 'SEO_SITE_URL']) {
  envExample.includes(`${key}=`) ? pass(`.env.example contains ${key}`) : fail(`.env.example is missing ${key}`);
}

const robots = await read('public/robots.txt');
const robotsSitemap = robots.match(/^Sitemap:\s*(\S+)/mi)?.[1];
if (robotsSitemap) pass(`robots.txt declares sitemap: ${robotsSitemap}`);
else fail('robots.txt does not declare a Sitemap URL');

const sitemapIndex = await read('public/sitemap.xml');
const sitemapIndexUrls = extractLocs(sitemapIndex);
if (sitemapIndexUrls.length >= 4) pass(`sitemap.xml references ${sitemapIndexUrls.length} sitemap files`);
else fail(`sitemap.xml references only ${sitemapIndexUrls.length} sitemap file(s)`);

const localhostSitemapUrls = sitemapIndexUrls.filter((url) => /localhost|127\.0\.0\.1|192\.168\./i.test(url));
if (localhostSitemapUrls.length) fail(`Production sitemap index contains local URLs: ${localhostSitemapUrls.join(', ')}`);
else pass('sitemap.xml contains no localhost/LAN origins');

const staticSitemap = await read('public/sitemap-pages.xml');
const staticPaths = extractLocs(staticSitemap).map((url) => {
  try { return new URL(url).pathname; } catch { return url; }
});
for (const expected of ['/home', '/search', '/consultants']) {
  staticPaths.includes(expected) ? pass(`Static sitemap contains ${expected}`) : fail(`Static sitemap is missing ${expected}`);
}

let dynamicUrlCount = 0;
const dynamicFiles = (await fs.readdir(publicDir)).filter((name) => /^sitemap-(ads|agencies|agents)(?:-\d+)?\.xml$/i.test(name));
for (const fileName of dynamicFiles) {
  const locs = extractLocs(await fs.readFile(path.join(publicDir, fileName), 'utf8'));
  dynamicUrlCount += locs.length;
  if (locs.some((url) => /localhost|127\.0\.0\.1|192\.168\./i.test(url))) {
    fail(`${fileName} contains localhost/LAN URLs`);
  }
}
if (dynamicUrlCount > 0) pass(`Dynamic sitemaps currently contain ${dynamicUrlCount} public entity URLs`);
else warn('Dynamic sitemaps are empty. Run npm run seo:generate while the public API is reachable before production deployment.');

const llms = await read('public/llms.txt');
if (/^#\s+.+/m.test(llms) && /^##\s+.+/m.test(llms)) pass('llms.txt has structured H1/H2 sections');
else warn('llms.txt does not have the expected heading structure');

const publicSources = [
  ['src/features/home/HomePage.tsx', true],
  ['src/features/search/SearchMapPage.tsx', true],
  ['src/features/consultants/ConsultantsDirectoryPage.tsx', true],
  ['src/features/advertisements/view/ViewAdPage.tsx', true],
  ['src/features/dashboard/AgencyPreviewPage.tsx', true],
];
for (const [rel, requireH1] of publicSources) {
  const source = await read(rel);
  source.includes('<SEO') ? pass(`${rel} renders SEO metadata`) : fail(`${rel} does not render the shared SEO component`);
  if (requireH1) {
    /<h1\b/.test(source) ? pass(`${rel} contains an H1`) : fail(`${rel} has no H1`);
  }
}

const nginx = await read('nginx.conf');
nginx.includes('X-Robots-Tag') ? pass('Nginx emits route-level X-Robots-Tag directives') : warn('Nginx has no route-level X-Robots-Tag protection');
nginx.includes('expires 1y') ? pass('Fingerprinted Vite assets have long-term cache headers') : warn('No one-year cache rule detected for fingerprinted assets');
nginx.includes('gzip on') ? pass('Nginx gzip compression is enabled') : warn('Nginx gzip compression is not enabled');

const largeAssets = [];
async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else {
      const stat = await fs.stat(full);
      if (stat.size >= 500_000) largeAssets.push({ file: path.relative(root, full).replaceAll('\\', '/'), bytes: stat.size });
    }
  }
}
await walk(publicDir);
largeAssets.sort((a, b) => b.bytes - a.bytes);
if (largeAssets.length) {
  warn(`${largeAssets.length} public assets are >= 500 KB; largest: ${largeAssets.slice(0, 5).map((item) => `${item.file} (${Math.round(item.bytes / 1024)} KB)`).join(', ')}`);
} else {
  pass('No public asset is >= 500 KB');
}

const report = {
  generatedAt: new Date().toISOString(),
  summary: { passed: passed.length, warnings: warnings.length, failed: issues.length, dynamicSitemapUrls: dynamicUrlCount },
  passed,
  warnings,
  failed: issues,
  largestPublicAssets: largeAssets.slice(0, 20),
};

await fs.mkdir(path.join(root, 'audit'), { recursive: true });
await fs.writeFile(path.join(root, 'audit', 'seo-audit-report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');

console.log(`\nBonga technical SEO audit: ${passed.length} passed, ${warnings.length} warning(s), ${issues.length} failed.`);
for (const message of issues) console.error(`  FAIL  ${message}`);
for (const message of warnings) console.warn(`  WARN  ${message}`);
console.log('  Report: audit/seo-audit-report.json\n');

if (issues.length) process.exitCode = 1;
