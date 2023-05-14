import { fileURLToPath, URL } from "node:url"

import { defineConfig } from "vite"
import UnoCSS from "unocss/vite"
import vue from "@vitejs/plugin-vue"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), UnoCSS()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 1312,
  },
})
