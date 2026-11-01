// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";
import prettierConfig from "eslint-config-prettier";
import importX from "eslint-plugin-import-x";

import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([
    "dist",
    "build",
    "coverage",
    "storybook-static",
    "graphify-out",
    ".freebuff",
    ".eslintcache",
    "eslint.config.ts",
  ]),
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "import-x": importX,
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // 1. File Length Budget (Industry standard warn on 200 lines)
      "max-lines": [
        "warn",
        {
          max: 200,
          skipBlankLines: true,
          skipComments: true,
        },
      ],

      // 2. Strict Dead Code & Unused Identifiers (Standard _ prefix ignore)
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // 3. Component & Icon Props Extensions (Industry standard for UI design systems)
      "@typescript-eslint/no-empty-object-type": [
        "error",
        {
          allowInterfaces: "with-single-extends",
        },
      ],

      // 4. Fast Refresh Compatibility (allow constant exports alongside components)
      "react-refresh/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
        },
      ],

      // 5. Prevent duplicate imports & self-imports
      "import-x/no-duplicates": ["error", { "prefer-inline": true }],
      "import-x/no-self-import": "error",

      // 6. Clean JS / Modern Best Practices
      "no-console": "error",
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: ["error", "always", { null: "ignore" }],

      // React Compiler warnings (deferred for later review)
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  ...storybook.configs["flat/recommended"],
  prettierConfig,
]);
