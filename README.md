# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

## Tests

Tests use Vitest with the existing Vite configuration and jsdom; no browser download or running server is required. Supported Node versions: `^22.22.2 || ^24.15.0 || >=26.0.0` (required by jsdom).

- `npm test` — run the complete suite once.
- `npm run test:watch` — watch changed tests.
- `npm run test:ad` — advertisement logic tests.
- `npm run test:storybook` — Storybook configuration and assigned-ad component smoke tests.
- `npm run test:typecheck` — type-check tests, source, and test configuration.

Tests live in `tests/unit`. The deleted assigned-ad model test now exercises the actual component's seven states and actions. The former browser smoke test renders the published story's component/args in jsdom; it does not verify browser layout or the served Storybook iframe. Network access is stubbed; storage, URL, mocks, and timers are isolated between tests.

Historical plans under `docs/superpowers` retain their original commands; use the commands above for the current test setup.

## Performance and SEO audits

- `npm run audit:perf` — repeatable sitespeed.io audit of representative public route templates (Docker Desktop required).
- `npm run audit:perf:all` — sitespeed.io audit of every generated public sitemap URL.
- `npm run audit:seo` — repository-level technical SEO sanity checks.

See [`PERFORMANCE_SEO_AUDIT.md`](./PERFORMANCE_SEO_AUDIT.md) for setup, authenticated-route testing and interpretation guidance.
