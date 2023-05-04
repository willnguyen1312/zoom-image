import { defineConfig } from "vite"
// eslint-disable-next-line import/no-unresolved
import { svelte } from "@sveltejs/vite-plugin-svelte"
// eslint-disable-next-line import/no-unresolved
import UnoCSS from "unocss/vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), UnoCSS()],
})
