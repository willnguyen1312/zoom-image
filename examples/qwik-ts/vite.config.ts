import { defineConfig } from "vite"
import UnoCSS from "unocss/vite"
import { qwikVite } from "@builder.io/qwik/optimizer"
import { qwikCity } from "@builder.io/qwik-city/vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig(() => {
  return {
    plugins: [qwikCity(), qwikVite(), tsconfigPaths(), UnoCSS()],
    server: {
      port: 1312,
      host: true,
      open: true,
    },
  }
})
