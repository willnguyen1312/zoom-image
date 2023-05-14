import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
// eslint-disable-next-line import/no-unresolved
import UnoCSS from "unocss/vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), UnoCSS()],
  server: {
    port: 1312,
  },
})
