# Bonga Frontend — Performance & SEO Audit Report

Date: 2026-08-18

## Scope

This pass focused on production performance, technical SEO, and repeatable auditing. It intentionally did **not** redesign the UI or modify feature API/service/hook logic, request payloads, route names, or business rules.

## What changed

### Performance

- Removed the unreliable Unlighthouse workflow from the repository.
- Added a repeatable Docker-based sitespeed.io audit for representative public route templates and an optional all-public-URL mode.
- Added a performance budget covering Core Web Vitals, request count, transfer size, Lighthouse categories, Coach scores, and serious/critical accessibility violations.
- Added pre-measurement browser-state seeding so the synthetic audit can open Bonga routes without measuring onboarding first.
- Optimized oversized static image assets without changing their displayed dimensions or layout.
- Removed confirmed unreferenced duplicate/unused image assets.

### Static asset result

- Original `public/`: **34,499,186 bytes (32.90 MiB)**
- Optimized `public/`: **10,823,586 bytes (10.32 MiB)**
- Reduction: **23,675,600 bytes (68.6% by bytes)**

Notable examples:

- Home business artwork: ~246 KB PNG → ~26 KB WebP.
- Six onboarding images: ~4.35 MiB total → ~0.48 MiB total.
- Five agency-rank badge SVG wrappers containing embedded raster data: multi-megabyte files → small 2x WebP assets.
- Support portraits originally up to ~1.8 MB at 1024×1024 but displayed at 40×40 → appropriately sized 2x WebP assets.
- Removed unreferenced `landing-hero.png` and other confirmed duplicate assets.

No remaining public asset is 500 KB or larger according to the repository audit.

### Technical SEO

- Added/retained canonical metadata through the shared SEO component.
- Added unique entity-aware titles/descriptions to public agency/agent preview pages.
- Added Open Graph image metadata where entity/ad imagery exists.
- Added semantic, visually hidden H1 headings to key public route templates that lacked them.
- Added Person/Organization structured data to public agent/agency pages.
- Added crawler-facing `X-Robots-Tag` rules in Nginx for private, auth, workflow, and non-canonical subroutes.
- Hardened sitemap generation so failed API refreshes do not leave stale localhost/LAN origins in production sitemap files.
- Kept dynamic public sitemap support for ads, agencies, and agents.
- Improved `.env.example` documentation for runtime and build-time SEO origins.

## Audit tooling

### Performance

Run a representative production-preview audit:

```powershell
npm run build
npm run preview -- --host 0.0.0.0
# in another terminal
npm run audit:perf
```

Run every URL currently present in the generated public sitemaps:

```powershell
npm run audit:perf:all
```

Results are written under `performance-results/`.

### Technical SEO

```powershell
npm run audit:seo
```

Current repository result:

```text
31 passed, 0 warnings, 0 failed
```

Machine-readable output: `audit/seo-audit-report.json`.

## Verification performed

- API/service/hook source diff against the supplied project: **no changed API/service/hook files**.
- TypeScript/TSX syntax transpile check: **488 source files, 0 syntax errors**.
- Relative local import resolution: **0 unresolved imports**.
- Literal public asset reference scan: **0 missing referenced assets**.
- SEO repository audit: **31 pass / 0 warning / 0 fail**.
- Production sitemap files: **no localhost, 127.0.0.1, or LAN origins detected**.
- Nginx configuration: syntax validation passed when loaded in its intended `http` include context.

A full `npm run build` could not be completed in the sandbox because its dependency installation was incomplete (missing `vite/client` and Node type definitions). This report does not claim a fabricated post-change Lighthouse score.

## Highest-priority remaining SEO architecture issue

The current app router requires `bonga-selected-city` to already exist in `localStorage` before most public routes are allowed to render. A completely fresh browser can therefore be redirected from a canonical public URL such as `/home`, `/search`, `/consultants`, `/ads/:id`, `/agencies/:id`, or `/agents/:id` to `/` before the public page renders.

This was **not changed automatically** because it is application/user-flow logic. It is the most important remaining structural SEO issue.

Recommended long-term solution, in priority order:

1. Allow canonical public pages to render on a fresh visit without requiring pre-existing city state, using a default/fallback city only where data fetching needs one; or
2. Prerender/server-render the public SEO surface while keeping authenticated CRM/account functionality client-rendered.

## How to judge the result in production

Do not rely on a single synthetic score. Use the sitespeed report for reproducible lab comparison by route template, then validate deployed real-user Core Web Vitals and indexing through Google Search Console/CrUX. Dynamic entity pages should be sampled by route type for performance, while the complete canonical URL set should be crawled for SEO/indexability.
