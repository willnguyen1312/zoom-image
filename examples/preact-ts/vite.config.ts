import { defineConfig } from "vite"
import preact from "@preact/preset-vite"
import UnoCSS from "unocss/vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), UnoCSS()],
  server: {
    port: 1312,
    host: true,
    open: true,
  },
})
