import js from "@eslint/js";
import globals from "globals";
import * as tseslint from "@typescript-eslint/eslint-plugin";
import * as tsParser from "@typescript-eslint/parser";
import * as pluginReact from "eslint-plugin-react";

// If you cannot import { defineConfig } from "eslint/config"
// fallback to exporting the config array directly
const config = [
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser }
  },
  {
    files: ["**/*.{ts,tsx,cts,mts}"],
    plugins: { "@typescript-eslint": tseslint },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
        sourceType: "module",
        ecmaVersion: 2020
      }
    },
    extends: [tseslint.configs.recommended]
  },
  pluginReact.configs.flat.recommended,
];

export default config;