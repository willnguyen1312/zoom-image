// eslint-disable-next-line import/no-unresolved
import UnoCSS from "unocss/vite"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [UnoCSS()],
  server: {
    port: 1312,
    host: true,
    open: true,
  },
})
