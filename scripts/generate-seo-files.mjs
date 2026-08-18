import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(rootDir, 'public');
const tempDir = path.join(rootDir, '.seo-sitemap-tmp');
const MAX_URLS_PER_SITEMAP = 50_000;
const PAGE_SIZE = 100;
const REQUEST_TIMEOUT_MS = 12_000;
const MAX_PAGES_SAFETY_GUARD = 100_000;

async function loadEnvFile(fileName) {
  const filePath = path.join(rootDir, fileName);

  try {
    const contents = await fs.readFile(filePath, 'utf8');

    for (const rawLine of contents.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;

      const separatorIndex = line.indexOf('=');
      if (separatorIndex <= 0) continue;

      const key = line.slice(0, separatorIndex).trim();
      let value = line.slice(separatorIndex + 1).trim();

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
}

await loadEnvFile('.env');
await loadEnvFile('.env.local');
await loadEnvFile('.env.production');
await loadEnvFile('.env.production.local');

function trimTrailingSlash(value) {
  return String(value ?? '').trim().replace(/\/+$/, '');
}

function normalizeSiteUrl(value) {
  const normalized = trimTrailingSlash(value);
  return normalized || 'https://bonga.exirfirm.com';
}

function normalizeApiBaseUrl(value, siteUrl) {
  const normalized = trimTrailingSlash(value || siteUrl);
  if (/\/api$/i.test(normalized)) return normalized;
  return `${normalized}/api`;
}

const siteUrl = normalizeSiteUrl(
  process.env.SEO_SITE_URL || process.env.VITE_SITE_URL || 'https://bonga.exirfirm.com',
);
const apiBaseUrl = normalizeApiBaseUrl(
  process.env.SEO_API_BASE_URL || process.env.VITE_API_BASE_URL,
  siteUrl,
);

const staticPublicPages = ['/home', '/consultants', '/search'];

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function toAbsoluteUrl(pathname) {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${siteUrl}${normalizedPath}`;
}

function normalizeLastModified(value) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

function readItemId(item, candidateKeys) {
  if (!item || typeof item !== 'object') return '';

  for (const key of candidateKeys) {
    const id = String(item[key] ?? '').trim();
    if (id) return id;
  }

  return '';
}

function readItemLastModified(item) {
  if (!item || typeof item !== 'object') return undefined;

  for (const key of [
    'updated_at',
    'updatedAt',
    'modified_at',
    'modifiedAt',
    'published_at',
    'publishedAt',
  ]) {
    const normalized = normalizeLastModified(item[key]);
    if (normalized) return normalized;
  }

  return undefined;
}

function createUrlSet(entries) {
  const body = entries
    .map(({ loc, lastmod }) => {
      const lastmodLine = lastmod ? `\n    <lastmod>${escapeXml(lastmod)}</lastmod>` : '';
      return `  <url>\n    <loc>${escapeXml(loc)}</loc>${lastmodLine}\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body ? `\n${body}\n` : '\n'}</urlset>\n`;
}

function createSitemapIndex(fileNames) {
  const body = fileNames
    .map((fileName) => `  <sitemap>\n    <loc>${escapeXml(toAbsoluteUrl(`/${fileName}`))}</loc>\n  </sitemap>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>\n`;
}

function extractCollection(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];

  for (const key of ['data', 'items', 'results', 'list']) {
    if (Array.isArray(payload[key])) return payload[key];
  }

  return [];
}

function getPaginationInfo(payload, page, perPage, itemCount) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { hasNextPage: itemCount >= perPage, nextPage: page + 1 };
  }

  const meta =
    (payload.meta && typeof payload.meta === 'object' ? payload.meta : undefined) ||
    (payload.pagination && typeof payload.pagination === 'object' ? payload.pagination : undefined) ||
    payload;

  const currentPage = Number(meta.current_page ?? meta.page ?? page);
  const lastPage = Number(meta.last_page ?? meta.total_pages);
  const total = Number(meta.total);
  const resolvedPerPage = Number(meta.per_page ?? perPage);

  if (Number.isFinite(lastPage) && lastPage > 0) {
    return { hasNextPage: currentPage < lastPage, nextPage: currentPage + 1 };
  }

  if (Number.isFinite(total) && Number.isFinite(resolvedPerPage) && resolvedPerPage > 0) {
    return {
      hasNextPage: currentPage * resolvedPerPage < total,
      nextPage: currentPage + 1,
    };
  }

  return { hasNextPage: itemCount >= perPage, nextPage: page + 1 };
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'BongaSitemapGenerator/1.0',
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type')?.toLowerCase() ?? '';
  if (!contentType.includes('json')) {
    throw new Error(`Expected JSON but received ${contentType || 'unknown content type'}`);
  }

  return response.json();
}

async function* fetchPaginatedItems(endpoint) {
  let page = 1;

  while (page <= MAX_PAGES_SAFETY_GUARD) {
    const url = new URL(`${apiBaseUrl}/${endpoint.replace(/^\/+/, '')}`);
    url.searchParams.set('page', String(page));
    url.searchParams.set('per_page', String(PAGE_SIZE));

    const payload = await fetchJson(url);
    const items = extractCollection(payload);

    for (const item of items) yield item;

    if (items.length === 0) return;

    const pagination = getPaginationInfo(payload, page, PAGE_SIZE, items.length);
    if (!pagination.hasNextPage || pagination.nextPage <= page) return;

    page = pagination.nextPage;
  }

  throw new Error(`Pagination exceeded the ${MAX_PAGES_SAFETY_GUARD}-page safety guard`);
}

function getShardFileName(baseFileName, shardNumber) {
  if (shardNumber === 1) return baseFileName;
  return baseFileName.replace(/\.xml$/i, `-${shardNumber}.xml`);
}

function getShardFilePattern(baseFileName) {
  const escapedStem = baseFileName
    .replace(/\.xml$/i, '')
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^${escapedStem}(?:-\\d+)?\\.xml$`, 'i');
}

async function listExistingShardFiles(baseFileName) {
  const pattern = getShardFilePattern(baseFileName);
  const files = await fs.readdir(publicDir);

  return files
    .filter((fileName) => pattern.test(fileName))
    .sort((left, right) => {
      if (left === baseFileName) return -1;
      if (right === baseFileName) return 1;
      const leftNumber = Number(left.match(/-(\d+)\.xml$/i)?.[1] ?? 1);
      const rightNumber = Number(right.match(/-(\d+)\.xml$/i)?.[1] ?? 1);
      return leftNumber - rightNumber;
    });
}

async function replaceShardFiles(baseFileName, newFileNames) {
  const oldFileNames = await listExistingShardFiles(baseFileName);

  for (const fileName of oldFileNames) {
    await fs.rm(path.join(publicDir, fileName), { force: true });
  }

  for (const fileName of newFileNames) {
    await fs.rename(path.join(tempDir, fileName), path.join(publicDir, fileName));
  }
}

async function normalizeExistingShardOrigins(fileNames) {
  for (const fileName of fileNames) {
    const filePath = path.join(publicDir, fileName);
    const xml = await fs.readFile(filePath, 'utf8');
    const normalizedXml = xml.replace(
      /<loc>\s*([^<]+?)\s*<\/loc>/gi,
      (_match, rawUrl) => {
        try {
          const parsed = new URL(String(rawUrl).trim());
          return `<loc>${escapeXml(toAbsoluteUrl(`${parsed.pathname}${parsed.search}`))}</loc>`;
        } catch {
          return _match;
        }
      },
    );

    if (normalizedXml !== xml) {
      await fs.writeFile(filePath, normalizedXml, 'utf8');
    }
  }
}

async function writeDynamicSitemapGroup({ baseFileName, endpoint, pathPrefix, idKeys }) {
  const seenUrls = new Set();
  const writtenFileNames = [];
  let shardEntries = [];
  let shardNumber = 1;
  let totalEntries = 0;

  async function flushShard() {
    if (shardEntries.length === 0 && writtenFileNames.length > 0) return;

    const fileName = getShardFileName(baseFileName, shardNumber);
    await fs.writeFile(path.join(tempDir, fileName), createUrlSet(shardEntries), 'utf8');
    writtenFileNames.push(fileName);
    totalEntries += shardEntries.length;
    shardEntries = [];
    shardNumber += 1;
  }

  try {
    for await (const item of fetchPaginatedItems(endpoint)) {
      const id = readItemId(item, idKeys);
      if (!id) continue;

      const loc = toAbsoluteUrl(`${pathPrefix}/${encodeURIComponent(id)}`);
      if (seenUrls.has(loc)) continue;
      seenUrls.add(loc);

      shardEntries.push({ loc, lastmod: readItemLastModified(item) });

      if (shardEntries.length >= MAX_URLS_PER_SITEMAP) {
        await flushShard();
      }
    }

    if (shardEntries.length > 0 || writtenFileNames.length === 0) {
      await flushShard();
    }

    await replaceShardFiles(baseFileName, writtenFileNames);
    console.log(`[seo] ${baseFileName}: ${totalEntries} URLs across ${writtenFileNames.length} sitemap file(s)`);
    return writtenFileNames;
  } catch (error) {
    console.warn(
      `[seo] ${baseFileName}: API refresh skipped (${error instanceof Error ? error.message : String(error)}).`,
    );

    const existingFileNames = await listExistingShardFiles(baseFileName);
    if (existingFileNames.length > 0) {
      await normalizeExistingShardOrigins(existingFileNames);
      return existingFileNames;
    }

    const fallbackPath = path.join(publicDir, baseFileName);
    await fs.writeFile(fallbackPath, createUrlSet([]), 'utf8');
    return [baseFileName];
  }
}

await fs.mkdir(publicDir, { recursive: true });
await fs.rm(tempDir, { recursive: true, force: true });
await fs.mkdir(tempDir, { recursive: true });

try {
  await fs.writeFile(
    path.join(publicDir, 'sitemap-pages.xml'),
    createUrlSet(staticPublicPages.map((pathname) => ({ loc: toAbsoluteUrl(pathname) }))),
    'utf8',
  );

  const sitemapFiles = ['sitemap-pages.xml'];

  sitemapFiles.push(
    ...(await writeDynamicSitemapGroup({
      baseFileName: 'sitemap-ads.xml',
      endpoint: 'public/advertise',
      pathPrefix: '/ads',
      idKeys: ['id', '_id', 'advertise_id', 'advertisement_id'],
    })),
  );

  sitemapFiles.push(
    ...(await writeDynamicSitemapGroup({
      baseFileName: 'sitemap-agencies.xml',
      endpoint: 'public/agencies',
      pathPrefix: '/agencies',
      idKeys: ['id', '_id', 'agency_id'],
    })),
  );

  sitemapFiles.push(
    ...(await writeDynamicSitemapGroup({
      baseFileName: 'sitemap-agents.xml',
      endpoint: 'public/agents',
      pathPrefix: '/agents',
      idKeys: ['id', '_id', 'agent_id', 'user_id'],
    })),
  );

  await fs.writeFile(
    path.join(publicDir, 'sitemap.xml'),
    createSitemapIndex(sitemapFiles),
    'utf8',
  );

  console.log(`[seo] sitemap index generated for ${siteUrl}`);
} finally {
  await fs.rm(tempDir, { recursive: true, force: true });
}
