import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import unicorn from "eslint-plugin-unicorn";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ["dist/**", "node_modules/**", "build.js"] },
  pluginJs.configs.recommended,
  unicorn.configs.recommended,
  {
    rules: {
      "unicorn/prefer-top-level-await": "off",
      "unicorn/prefer-global-this": "off",
      "unicorn/prevent-abbreviations": [
        2,
        {
          replacements: {
            ref: false,
          },
        },
      ],
    },
  },
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
];
