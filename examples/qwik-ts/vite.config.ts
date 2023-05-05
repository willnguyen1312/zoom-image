import { defineConfig } from "vite"
// eslint-disable-next-line import/no-unresolved
import UnoCSS from "unocss/vite"
import { qwikVite } from "@builder.io/qwik/optimizer"
// eslint-disable-next-line import/no-unresolved
import { qwikCity } from "@builder.io/qwik-city/vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig(() => {
  return {
    plugins: [qwikCity(), qwikVite(), tsconfigPaths(), UnoCSS()],
    preview: {
      headers: {
        "Cache-Control": "public, max-age=600",
      },
    },
  }
})
