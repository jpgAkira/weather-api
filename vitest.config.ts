/// <reference types="vitest" />

import { defineConfig } from "vitest/config";

import path from "path";
export default defineConfig({
  test: {
    globals: true,
    fileParallelism: false,
    setupFiles: ["vitest.setup.ts"],
    globalSetup: ["vitest.global.setup.ts"],
    include: ["src/**/__test__/**/*.{test,spec}.{ts,tsx,js,jsx}"],
    testTimeout: 10000,
    coverage: {
      reportsDirectory: "./coverage",
      provider: "v8",
      include: ["src/**/*.{ts}"],
      exclude: [
        "**/*.test.{ts}",
        "**/*.spec.{ts}",

        "**/types/**",
        "**/*.d.ts",
        "**/*.type.{ts,ts}",
        "**/*.types.{ts,ts}",
        "**/*.contract.{ts,ts}",
        "**/*.contract.*{ts,ts}",
        "**/*.protocol.{ts,ts}",
        "**/*.interface.{ts,ts}",
        "**/*.mock.{ts,tsx}",
        "**/*.mocks.{ts,tsx}",
        "**/mocks/**",
        "**/__mocks__/**",
        "**/__tests__/**",
        "**/__test-utils__/**",
        "**/*.test-util.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "src"),
      "@test": path.resolve(__dirname, "test"),
    },
  },
});
