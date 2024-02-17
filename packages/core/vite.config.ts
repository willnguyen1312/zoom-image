/// <reference types="vitest" />

import { defineConfig } from "vitest/config"
import Vue from "@vitejs/plugin-vue"

export default defineConfig({
  plugins: [Vue()],
  test: {
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    environment: "happy-dom",
  },
})
