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
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    rules: {
      // Indentation
      "indent": ["error", 2, {
        "SwitchCase": 1,
        "VariableDeclarator": 1,
        "outerIIFEBody": 1,
        "MemberExpression": 1,
        "FunctionDeclaration": { "parameters": 1, "body": 1 },
        "FunctionExpression": { "parameters": 1, "body": 1 },
        "CallExpression": { "arguments": 1 },
        "ArrayExpression": 1,
        "ObjectExpression": 1,
        "ImportDeclaration": 1,
        "flatTernaryExpressions": false,
        "ignoreComments": false
      }],
      
      // Spacing
      "quotes": ["error", "single", { "avoidEscape": true, "allowTemplateLiterals": true }],
      "semi": ["error", "always"],
      "comma-spacing": ["error", { "before": false, "after": true }],
      "key-spacing": ["error", { "beforeColon": false, "afterColon": true }],
      "space-before-blocks": ["error", "always"],
      "space-before-function-paren": ["error", {
        "anonymous": "always",
        "named": "never",
        "asyncArrow": "always"
      }],
      "space-in-parens": ["error", "never"],
      "space-infix-ops": "error",
      "space-unary-ops": ["error", {
        "words": true,
        "nonwords": false
      }],
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],
      "computed-property-spacing": ["error", "never"],
      "func-call-spacing": ["error", "never"],
      "block-spacing": ["error", "always"],
      "keyword-spacing": ["error", {
        "before": true,
        "after": true,
        "overrides": {
          "return": { "after": true },
          "throw": { "after": true },
          "case": { "after": true }
        }
      }],
      "arrow-spacing": ["error", { "before": true, "after": true }],
      "comma-dangle": ["error", "never"],
      "no-trailing-spaces": "error",
      "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 0 }],
      "eol-last": ["error", "always"],
      "brace-style": ["error", "1tbs", { "allowSingleLine": true }],
      "curly": ["error", "multi-line"],
      "padded-blocks": ["error", "never"]
    }
  },
  pluginReact.configs.flat.recommended,
];

export default config;