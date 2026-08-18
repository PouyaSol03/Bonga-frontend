# Bonga Performance & SEO Audit

This project intentionally separates **performance testing** from **SEO crawling**. A single crawler score is not treated as the source of truth for both jobs.

## 1. Performance: sitespeed.io

The repository contains a repeatable Docker-based sitespeed.io setup. It does not install a large performance tool into the frontend dependency tree.

### Start the production preview

```powershell
npm run build
npm run preview -- --host 0.0.0.0
```

Keep that terminal open.

### Representative public-route audit

```powershell
npm run audit:perf
```

This tests the permanent public route templates plus up to three generated ads, three agencies and three agents. Advertisement detail subpages are included as separate UI route templates.

### Every generated public URL

```powershell
npm run audit:perf:all
```

Use this only when you deliberately want a long audit. Measuring every database entity is normally less useful than measuring representative route templates.

### Report

The generated sitespeed.io report is written to:

```text
performance-results/
```

It includes page-by-page Web Vitals, transfer sizes, requests, video/filmstrips, CPU data, axe accessibility results, Coach advice and Lighthouse scores. A performance budget is stored in `audit/performance-budget.json`.

### Why the audit seeds a city

Bonga requires a selected city in localStorage before most routes can render. `audit/sitespeed/seed-state.mjs` sets the existing default Mashhad values **before measurement starts**, so the onboarding requirement does not pollute the page timing.

### Authenticated/private pages

Private CRM/account pages must be tested with a real test session; otherwise any tool only measures the login/access-denied screen.

Copy:

```text
audit/auth-session.json.example
```

to:

```text
audit/auth-session.json
```

and insert a valid **test-only** session. The file is gitignored. The sitespeed pre-script will load it automatically. Never commit a real access token.

For role-specific CRM/account audits, pass the relevant private URLs directly to the same sitespeed Docker setup or extend `scripts/generate-performance-urls.mjs` with the desired role profile. Keep public SEO scores separate from authenticated application performance.

## 2. Technical SEO sanity checks

Run:

```powershell
npm run audit:seo
```

This checks the repository-level SEO guarantees that can be validated without a search engine:

- robots.txt, sitemap index and child sitemaps
- localhost/LAN URLs accidentally leaking into production sitemaps
- expected public static routes
- dynamic sitemap population
- llms.txt structure
- SEO metadata/H1 coverage on public route templates
- production SEO environment keys
- Nginx crawl/index directives
- compression and asset caching
- very large public assets

Machine-readable output:

```text
audit/seo-audit-report.json
```

This is a **sanity check**, not a replacement for a rendered production crawl.

## 3. Production SEO crawl

For the deployed site, use Screaming Frog (JavaScript rendering) or another rendered crawler to inspect every canonical public URL for status codes, titles, descriptions, H1s, canonicals, indexability, internal links, rendered HTML and structured data.

Use Google Search Console after deployment as the indexing source of truth. Core Web Vitals from real users should be compared with the synthetic sitespeed.io results.

## 4. Important architecture limitation

The current SPA router requires `bonga-selected-city` in browser storage before allowing public routes to render. A brand-new browser/crawler that opens `/home`, `/search`, `/consultants`, `/ads/:id`, `/agencies/:id` or `/agents/:id` without that state can be redirected to `/`.

That behavior is intentionally **not changed in this pass** because it is application flow, not a head/config-only optimization. For maximum search crawlability, public canonical routes should eventually render without requiring pre-existing localStorage, or the public surface should be prerendered/server-rendered while keeping the authenticated application client-rendered.
