import { defineConfig } from "vite"

import { svelte } from "@sveltejs/vite-plugin-svelte"

import UnoCSS from "unocss/vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), UnoCSS()],
  server: {
    port: 1312,
    host: true,
    open: true,
  },
})
