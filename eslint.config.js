const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");

module.exports = defineConfig([
  {
    ignores: [
      "android/**",
      "ios/**",
      "artifacts/**",
      "coverage/**",
      "node_modules/**",
    ],
  },
  expoConfig,
  {
    files: [
      "app/**/*.{js,jsx,ts,tsx}",
      "src/**/*.{js,jsx,ts,tsx}",
      "__tests__/**/*.{js,jsx,ts,tsx}",
      "__mocks__/**/*.{js,jsx,ts,tsx}",
      "data/**/*.{js,jsx,ts,tsx}",
      "plugins/**/*.js",
      "scripts/**/*.{js,mjs,ts}",
    ],
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "import/no-duplicates": "error",
      eqeqeq: ["error", "always", { null: "ignore" }],
      "react-hooks/exhaustive-deps": "error",
      // React Native animation/shared-value refs are intentionally updated by
      // event handlers and effects. The React Compiler rules below currently
      // flag those supported patterns, so the hook ordering/dependency rules
      // remain enforced while these compiler-only diagnostics stay disabled.
      "react-hooks/immutability": "off",
      "react-hooks/purity": "off",
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/use-memo": "off",
    },
  },
  {
    files: ["__tests__/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "import/first": "off",
    },
  },
  {
    files: ["__mocks__/**/*.{js,ts}"],
    languageOptions: {
      globals: {
        jest: "readonly",
      },
    },
  },
  {
    files: ["plugins/**/*.js", "scripts/**/*.{js,mjs,ts}"],
    languageOptions: {
      globals: {
        Buffer: "readonly",
      },
    },
  },
  {
    files: [
      "src/services/kokoroTts.ts",
      "src/services/networkFetch.ts",
      "src/services/providerResilience.ts",
    ],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]);
