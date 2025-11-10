import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  ...tseslint.configs.recommended,
  {
    ignores: ["dist/**", "node_modules/**"],
    files: ["**/*.{ts,js}"],
    extends: compat.extends(
      "eslint:recommended",
      "plugin:@typescript-eslint/eslint-recommended",
      "plugin:@typescript-eslint/recommended"
    ),

    languageOptions: {
      globals: {
        ...globals.commonjs,
        ...globals.es2019,
        ...globals.node,
      },
      parser: tsParser,
    },
  },
]);
