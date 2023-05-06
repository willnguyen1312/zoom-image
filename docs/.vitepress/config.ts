import Unocss from "unocss/vite"
import { defineConfig } from "vitepress"
const pkg = require("../../packages/core/package.json")

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Zoom Image",
  description: "A little yet powerful library to zoom image on wheel / hover / pinch actions",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {
        text: pkg.version,
        items: [
          {
            text: "Changelog",
            link: "https://github.com/willnguyen1312/zoom-image/blob/main/packages/core/CHANGELOG.md",
          },
        ],
      },
    ],

    sidebar: [
      {
        text: "Guide",
        items: [{ text: "Get started", link: "/guide" }],
      },
      {
        text: "Examples",
        items: [
          {
            text: "Vanilla JS",
            link: "/examples/vanilla",
          },
          {
            text: "Vue",
            link: "/examples/vue",
          },
          {
            text: "React",
            link: "/examples/react",
          },
          {
            text: "Preact",
            link: "/examples/preact",
          },
          {
            text: "Svelte",
            link: "/examples/svelte",
          },
          {
            text: "Solid",
            link: "/examples/solid",
          },
          {
            text: "Qwik",
            link: "/examples/qwik",
          },
        ],
      },
      {
        text: "API",
        link: "/api/",
        items: [
          { text: "createZoomImageHover", link: "/api/createZoomImageHover" },
          { text: "createZoomImageWheel", link: "/api/createZoomImageWheel" },
          { text: "makeCalculateZoom", link: "/api/makeCalculateZoom" },
          { text: "makeCalculatePercentage", link: "/api/makeCalculatePercentage" },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/willnguyen1312/zoom-image" }],

    search: {
      provider: "algolia",
      options: {
        appId: "KBKA7LOEM6",
        apiKey: "5c0bc869b542428154f42183a7145aa5",
        indexName: "zoom-images",
      },
    },
  },
  vite: {
    plugins: [Unocss()],
  },
})
