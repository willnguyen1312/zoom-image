/// <reference types="vitest" />

import { defineConfig } from "vite"
import Vue from "@vitejs/plugin-vue"

export default defineConfig({
  plugins: [Vue()],
  test: {
    setupFiles: ["./vite.setup.ts"],
    globals: true,
    environment: "happy-dom",
  },
})
