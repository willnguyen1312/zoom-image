import { defineConfig } from "vitepress"

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Zoom Image",
  description: "A little yet powerful library to zoom image on wheel / hover / pinch actions",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-configp

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
            items: [
              { text: "Zoom on hover", link: "/examples/vanilla/zoomOnHover" },
              { text: "Zoom on wheel", link: "/examples/vanilla/zoomOnWheel" },
            ],
            collapsed: true,
          },
          {
            text: "Vue",
            items: [
              { text: "Zoom on hover", link: "/examples/vue/zoomOnHover" },
              { text: "Zoom on wheel", link: "/examples/vue/zoomOnWheel" },
            ],
            collapsed: true,
          },
          {
            text: "React",
            items: [
              { text: "Zoom on hover", link: "/examples/react/zoomOnHover" },
              { text: "Zoom on wheel", link: "/examples/react/zoomOnWheel" },
            ],
            collapsed: true,
          },
          {
            text: "Preact",
            items: [
              { text: "Zoom on hover", link: "/examples/preact/zoomOnHover" },
              { text: "Zoom on wheel", link: "/examples/preact/zoomOnWheel" },
            ],
            collapsed: true,
          },
          {
            text: "Svelte",
            items: [
              { text: "Zoom on hover", link: "/examples/svelte/zoomOnHover" },
              { text: "Zoom on wheel", link: "/examples/svelte/zoomOnWheel" },
            ],
            collapsed: true,
          },
        ],
      },
      {
        text: "API",
        items: [
          { text: "createZoomImageHover", link: "/api/zoomOnHover" },
          { text: "createZoomImageWheel", link: "/api/zoomOnWheel" },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/willnguyen1312/zoom-image" }],

    search: {
      provider: "local",
    },
  },
})
