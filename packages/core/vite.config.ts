/// <reference types="vitest" />

// Configure Vitest (https://vitest.dev/config/)

import { defineConfig } from "vite"
import Vue from "@vitejs/plugin-vue"

export default defineConfig({
  plugins: [Vue()],
  test: {
    setupFiles: ["./vite.setup.ts"],
    /* for example, use global to avoid globals imports (describe, test, expect): */
    globals: true,
    environment: "happy-dom",
  },
})
