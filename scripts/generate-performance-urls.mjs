import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');
const outputPath = path.join(root, 'audit', 'performance-urls.txt');

function readArg(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

const mode = readArg('--mode', 'representative');
const site = String(readArg('--site', 'http://host.docker.internal:4173')).replace(/\/+$/, '');
const representativePerEntity = 3;

const publicRouteTemplates = ['/home', '/search', '/consultants'];
const sitemapGroups = [
  { pattern: /^sitemap-ads(?:-\d+)?\.xml$/i, prefix: '/ads/', includeAdSubpages: true },
  { pattern: /^sitemap-agencies(?:-\d+)?\.xml$/i, prefix: '/agencies/' },
  { pattern: /^sitemap-agents(?:-\d+)?\.xml$/i, prefix: '/agents/' },
];

async function readPathsForGroup(group) {
  const files = (await fs.readdir(publicDir)).filter((name) => group.pattern.test(name));
  const paths = new Set();

  for (const fileName of files) {
    const xml = await fs.readFile(path.join(publicDir, fileName), 'utf8');
    for (const match of xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)) {
      try {
        const pathname = new URL(match[1]).pathname.replace(/\/+$/, '') || '/';
        if (!pathname.startsWith(group.prefix)) continue;
        paths.add(pathname);
      } catch {
        // Ignore malformed sitemap entries; seo:generate/audit:seo will report them separately.
      }
    }
  }

  const sorted = [...paths].sort();
  const selected = mode === 'all-public' ? sorted : sorted.slice(0, representativePerEntity);

  if (group.includeAdSubpages) {
    return selected.flatMap((pathname) => [
      pathname,
      `${pathname}/property-info`,
      `${pathname}/equipment-facilities`,
    ]);
  }

  return selected;
}

const paths = new Set(publicRouteTemplates);
for (const group of sitemapGroups) {
  for (const pathname of await readPathsForGroup(group)) paths.add(pathname);
}

const urls = [...paths].map((pathname) => `${site}${pathname}`);
await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, `${urls.join('\n')}\n`, 'utf8');

console.log(`[audit] ${urls.length} performance URLs written to ${path.relative(root, outputPath)} (${mode}).`);
if (urls.length === publicRouteTemplates.length) {
  console.warn('[audit] No dynamic sitemap URLs were found. Run npm run seo:generate with a reachable API if you want ad/agency/agent samples.');
}
