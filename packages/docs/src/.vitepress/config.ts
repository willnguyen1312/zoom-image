import Unocss from "unocss/vite"
import { defineConfig } from "vitepress"
import pkg from "@zoom-image/core/package.json"

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Zoom Image",
  description: "A little yet powerful framework agnostic library to zoom image on the web",
  base: "/zoom-image/",
  head: [["link", { rel: "shortcut icon", href: "/zoom-image/favicon.ico", type: "image/x-icon" }]],
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
        text: "Core API",
        link: "/api/",
        items: [
          { text: "createZoomImageClick", link: "/api/createZoomImageClick" },
          { text: "createZoomImageHover", link: "/api/createZoomImageHover" },
          { text: "createZoomImageMove", link: "/api/createZoomImageMove" },
          { text: "createZoomImageWheel", link: "/api/createZoomImageWheel" },
          { text: "cropImage", link: "/api/cropImage" },
          { text: "makeCalculateZoom", link: "/api/makeCalculateZoom" },
          {
            text: "makeCalculatePercentage",
            link: "/api/makeCalculatePercentage",
          },
        ],
      },
      {
        text: "Vue Adapter",
        link: "/api/adapters/vue",
      },
      {
        text: "React Adapter",
        link: "/api/adapters/react",
      },
      {
        text: "Preact Adapter",
        link: "/api/adapters/preact",
      },
      {
        text: "Svelte Adapter",
        link: "/api/adapters/svelte",
      },
      {
        text: "Solid Adapter",
        link: "/api/adapters/solid",
      },
      {
        text: "Qwik Adapter",
        link: "/api/adapters/qwik",
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
    plugins: [
      Unocss({
        theme: {
          breakpoints: {
            xs: "320px",
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
          },
        },
      }),
    ],
  },
})
