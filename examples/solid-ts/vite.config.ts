import { defineConfig } from "vite"
import solidPlugin from "vite-plugin-solid"
import UnocssPlugin from "@unocss/vite"

export default defineConfig({
  plugins: [solidPlugin(), UnocssPlugin({})],
  build: {
    target: "esnext",
  },
  server: {
    port: 1312,
    host: true,
    open: true,
  },
})
