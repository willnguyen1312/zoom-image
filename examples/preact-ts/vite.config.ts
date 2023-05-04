import { defineConfig } from "vite"
import preact from "@preact/preset-vite"
// eslint-disable-next-line import/no-unresolved
import UnoCSS from "unocss/vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), UnoCSS()],
})
