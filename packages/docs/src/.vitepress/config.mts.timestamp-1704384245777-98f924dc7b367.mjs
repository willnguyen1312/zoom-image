// src/.vitepress/config.mts
import { createRequire } from "node:module";
import Unocss from "file:///Users/namnguyen/vn/personal/zoom-image/node_modules/.pnpm/unocss@0.58.3_postcss@8.4.32_vite@5.0.10/node_modules/unocss/dist/vite.mjs";
import { defineConfig } from "file:///Users/namnguyen/vn/personal/zoom-image/node_modules/.pnpm/vitepress@1.0.0-rc.35_@algolia+client-search@4.20.0_postcss@8.4.32_search-insights@2.6.0_typescript@5.3.3/node_modules/vitepress/dist/node/index.js";
var __vite_injected_original_import_meta_url = "file:///Users/namnguyen/vn/personal/zoom-image/packages/docs/src/.vitepress/config.mts";
var require2 = createRequire(__vite_injected_original_import_meta_url);
var pkg = require2("@zoom-image/core/package.json");
var config_default = defineConfig({
  title: "Zoom Image",
  description: "A little yet powerful framework agnostic headless library to zoom images on the web",
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
            link: "https://github.com/willnguyen1312/zoom-image/blob/main/packages/core/CHANGELOG.md"
          }
        ]
      }
    ],
    sidebar: [
      {
        text: "Guide",
        items: [{ text: "Get started", link: "/guide" }]
      },
      {
        text: "Examples",
        items: [
          {
            text: "Vanilla JS",
            link: "/examples/vanilla"
          },
          {
            text: "Angular",
            link: "/examples/angular"
          },
          {
            text: "Vue",
            link: "/examples/vue"
          },
          {
            text: "React",
            link: "/examples/react"
          },
          {
            text: "Next",
            link: "/examples/next"
          },
          {
            text: "Remix",
            link: "/examples/remix"
          },
          {
            text: "Preact",
            link: "/examples/preact"
          },
          {
            text: "Svelte",
            link: "/examples/svelte"
          },
          {
            text: "Solid",
            link: "/examples/solid"
          },
          {
            text: "Qwik",
            link: "/examples/qwik"
          }
        ]
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
            link: "/api/makeCalculatePercentage"
          }
        ]
      },
      {
        text: "Vue Adapter",
        link: "/api/adapters/vue"
      },
      {
        text: "Angular Adapter",
        link: "/api/adapters/angular"
      },
      {
        text: "React Adapter",
        link: "/api/adapters/react"
      },
      {
        text: "Preact Adapter",
        link: "/api/adapters/preact"
      },
      {
        text: "Svelte Adapter",
        link: "/api/adapters/svelte"
      },
      {
        text: "Solid Adapter",
        link: "/api/adapters/solid"
      },
      {
        text: "Qwik Adapter",
        link: "/api/adapters/qwik"
      }
    ],
    socialLinks: [{ icon: "github", link: "https://github.com/willnguyen1312/zoom-image" }],
    search: {
      provider: "algolia",
      options: {
        appId: "FKWOWYBGDZ",
        apiKey: "e8482e2e60315de80cf25a96471b9dfa",
        indexName: "zoom-image"
      }
    }
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
            xl: "1280px"
          }
        }
      })
    ]
  }
});
export {
  config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjLy52aXRlcHJlc3MvY29uZmlnLm10cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9uYW1uZ3V5ZW4vdm4vcGVyc29uYWwvem9vbS1pbWFnZS9wYWNrYWdlcy9kb2NzL3NyYy8udml0ZXByZXNzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbmFtbmd1eWVuL3ZuL3BlcnNvbmFsL3pvb20taW1hZ2UvcGFja2FnZXMvZG9jcy9zcmMvLnZpdGVwcmVzcy9jb25maWcubXRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9uYW1uZ3V5ZW4vdm4vcGVyc29uYWwvem9vbS1pbWFnZS9wYWNrYWdlcy9kb2NzL3NyYy8udml0ZXByZXNzL2NvbmZpZy5tdHNcIjtpbXBvcnQgeyBjcmVhdGVSZXF1aXJlIH0gZnJvbSBcIm5vZGU6bW9kdWxlXCJcbmltcG9ydCBVbm9jc3MgZnJvbSBcInVub2Nzcy92aXRlXCJcbmltcG9ydCB7IFBsdWdpbk9wdGlvbiB9IGZyb20gXCJ2aXRlXCJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlcHJlc3NcIlxuY29uc3QgcmVxdWlyZSA9IGNyZWF0ZVJlcXVpcmUoaW1wb3J0Lm1ldGEudXJsKVxuY29uc3QgcGtnID0gcmVxdWlyZShcIkB6b29tLWltYWdlL2NvcmUvcGFja2FnZS5qc29uXCIpXG5cbi8vIGh0dHBzOi8vdml0ZXByZXNzLmRldi9yZWZlcmVuY2Uvc2l0ZS1jb25maWdcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHRpdGxlOiBcIlpvb20gSW1hZ2VcIixcbiAgZGVzY3JpcHRpb246IFwiQSBsaXR0bGUgeWV0IHBvd2VyZnVsIGZyYW1ld29yayBhZ25vc3RpYyBoZWFkbGVzcyBsaWJyYXJ5IHRvIHpvb20gaW1hZ2VzIG9uIHRoZSB3ZWJcIixcbiAgYmFzZTogXCIvem9vbS1pbWFnZS9cIixcbiAgaGVhZDogW1tcImxpbmtcIiwgeyByZWw6IFwic2hvcnRjdXQgaWNvblwiLCBocmVmOiBcIi96b29tLWltYWdlL2Zhdmljb24uaWNvXCIsIHR5cGU6IFwiaW1hZ2UveC1pY29uXCIgfV1dLFxuICB0aGVtZUNvbmZpZzoge1xuICAgIC8vIGh0dHBzOi8vdml0ZXByZXNzLmRldi9yZWZlcmVuY2UvZGVmYXVsdC10aGVtZS1jb25maWdcbiAgICBuYXY6IFtcbiAgICAgIHtcbiAgICAgICAgdGV4dDogcGtnLnZlcnNpb24sXG4gICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogXCJDaGFuZ2Vsb2dcIixcbiAgICAgICAgICAgIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL3dpbGxuZ3V5ZW4xMzEyL3pvb20taW1hZ2UvYmxvYi9tYWluL3BhY2thZ2VzL2NvcmUvQ0hBTkdFTE9HLm1kXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgXSxcblxuICAgIHNpZGViYXI6IFtcbiAgICAgIHtcbiAgICAgICAgdGV4dDogXCJHdWlkZVwiLFxuICAgICAgICBpdGVtczogW3sgdGV4dDogXCJHZXQgc3RhcnRlZFwiLCBsaW5rOiBcIi9ndWlkZVwiIH1dLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdGV4dDogXCJFeGFtcGxlc1wiLFxuICAgICAgICBpdGVtczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6IFwiVmFuaWxsYSBKU1wiLFxuICAgICAgICAgICAgbGluazogXCIvZXhhbXBsZXMvdmFuaWxsYVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogXCJBbmd1bGFyXCIsXG4gICAgICAgICAgICBsaW5rOiBcIi9leGFtcGxlcy9hbmd1bGFyXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiBcIlZ1ZVwiLFxuICAgICAgICAgICAgbGluazogXCIvZXhhbXBsZXMvdnVlXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiBcIlJlYWN0XCIsXG4gICAgICAgICAgICBsaW5rOiBcIi9leGFtcGxlcy9yZWFjdFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogXCJOZXh0XCIsXG4gICAgICAgICAgICBsaW5rOiBcIi9leGFtcGxlcy9uZXh0XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiBcIlJlbWl4XCIsXG4gICAgICAgICAgICBsaW5rOiBcIi9leGFtcGxlcy9yZW1peFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogXCJQcmVhY3RcIixcbiAgICAgICAgICAgIGxpbms6IFwiL2V4YW1wbGVzL3ByZWFjdFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogXCJTdmVsdGVcIixcbiAgICAgICAgICAgIGxpbms6IFwiL2V4YW1wbGVzL3N2ZWx0ZVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogXCJTb2xpZFwiLFxuICAgICAgICAgICAgbGluazogXCIvZXhhbXBsZXMvc29saWRcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6IFwiUXdpa1wiLFxuICAgICAgICAgICAgbGluazogXCIvZXhhbXBsZXMvcXdpa1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0ZXh0OiBcIkNvcmUgQVBJXCIsXG4gICAgICAgIGxpbms6IFwiL2FwaS9cIixcbiAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICB7IHRleHQ6IFwiY3JlYXRlWm9vbUltYWdlQ2xpY2tcIiwgbGluazogXCIvYXBpL2NyZWF0ZVpvb21JbWFnZUNsaWNrXCIgfSxcbiAgICAgICAgICB7IHRleHQ6IFwiY3JlYXRlWm9vbUltYWdlSG92ZXJcIiwgbGluazogXCIvYXBpL2NyZWF0ZVpvb21JbWFnZUhvdmVyXCIgfSxcbiAgICAgICAgICB7IHRleHQ6IFwiY3JlYXRlWm9vbUltYWdlTW92ZVwiLCBsaW5rOiBcIi9hcGkvY3JlYXRlWm9vbUltYWdlTW92ZVwiIH0sXG4gICAgICAgICAgeyB0ZXh0OiBcImNyZWF0ZVpvb21JbWFnZVdoZWVsXCIsIGxpbms6IFwiL2FwaS9jcmVhdGVab29tSW1hZ2VXaGVlbFwiIH0sXG4gICAgICAgICAgeyB0ZXh0OiBcImNyb3BJbWFnZVwiLCBsaW5rOiBcIi9hcGkvY3JvcEltYWdlXCIgfSxcbiAgICAgICAgICB7IHRleHQ6IFwibWFrZUNhbGN1bGF0ZVpvb21cIiwgbGluazogXCIvYXBpL21ha2VDYWxjdWxhdGVab29tXCIgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiBcIm1ha2VDYWxjdWxhdGVQZXJjZW50YWdlXCIsXG4gICAgICAgICAgICBsaW5rOiBcIi9hcGkvbWFrZUNhbGN1bGF0ZVBlcmNlbnRhZ2VcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdGV4dDogXCJWdWUgQWRhcHRlclwiLFxuICAgICAgICBsaW5rOiBcIi9hcGkvYWRhcHRlcnMvdnVlXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0ZXh0OiBcIkFuZ3VsYXIgQWRhcHRlclwiLFxuICAgICAgICBsaW5rOiBcIi9hcGkvYWRhcHRlcnMvYW5ndWxhclwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdGV4dDogXCJSZWFjdCBBZGFwdGVyXCIsXG4gICAgICAgIGxpbms6IFwiL2FwaS9hZGFwdGVycy9yZWFjdFwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdGV4dDogXCJQcmVhY3QgQWRhcHRlclwiLFxuICAgICAgICBsaW5rOiBcIi9hcGkvYWRhcHRlcnMvcHJlYWN0XCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0ZXh0OiBcIlN2ZWx0ZSBBZGFwdGVyXCIsXG4gICAgICAgIGxpbms6IFwiL2FwaS9hZGFwdGVycy9zdmVsdGVcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRleHQ6IFwiU29saWQgQWRhcHRlclwiLFxuICAgICAgICBsaW5rOiBcIi9hcGkvYWRhcHRlcnMvc29saWRcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRleHQ6IFwiUXdpayBBZGFwdGVyXCIsXG4gICAgICAgIGxpbms6IFwiL2FwaS9hZGFwdGVycy9xd2lrXCIsXG4gICAgICB9LFxuICAgIF0sXG5cbiAgICBzb2NpYWxMaW5rczogW3sgaWNvbjogXCJnaXRodWJcIiwgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vd2lsbG5ndXllbjEzMTIvem9vbS1pbWFnZVwiIH1dLFxuXG4gICAgc2VhcmNoOiB7XG4gICAgICBwcm92aWRlcjogXCJhbGdvbGlhXCIsXG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIGFwcElkOiBcIkZLV09XWUJHRFpcIixcbiAgICAgICAgYXBpS2V5OiBcImU4NDgyZTJlNjAzMTVkZTgwY2YyNWE5NjQ3MWI5ZGZhXCIsXG4gICAgICAgIGluZGV4TmFtZTogXCJ6b29tLWltYWdlXCIsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHZpdGU6IHtcbiAgICBwbHVnaW5zOiBbXG4gICAgICBVbm9jc3Moe1xuICAgICAgICB0aGVtZToge1xuICAgICAgICAgIGJyZWFrcG9pbnRzOiB7XG4gICAgICAgICAgICB4czogXCIzMjBweFwiLFxuICAgICAgICAgICAgc206IFwiNjQwcHhcIixcbiAgICAgICAgICAgIG1kOiBcIjc2OHB4XCIsXG4gICAgICAgICAgICBsZzogXCIxMDI0cHhcIixcbiAgICAgICAgICAgIHhsOiBcIjEyODBweFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICBdIGFzIFBsdWdpbk9wdGlvbltdLFxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBc1gsU0FBUyxxQkFBcUI7QUFDcFosT0FBTyxZQUFZO0FBRW5CLFNBQVMsb0JBQW9CO0FBSCtNLElBQU0sMkNBQTJDO0FBSTdSLElBQU1BLFdBQVUsY0FBYyx3Q0FBZTtBQUM3QyxJQUFNLE1BQU1BLFNBQVEsK0JBQStCO0FBR25ELElBQU8saUJBQVEsYUFBYTtBQUFBLEVBQzFCLE9BQU87QUFBQSxFQUNQLGFBQWE7QUFBQSxFQUNiLE1BQU07QUFBQSxFQUNOLE1BQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxLQUFLLGlCQUFpQixNQUFNLDJCQUEyQixNQUFNLGVBQWUsQ0FBQyxDQUFDO0FBQUEsRUFDaEcsYUFBYTtBQUFBO0FBQUEsSUFFWCxLQUFLO0FBQUEsTUFDSDtBQUFBLFFBQ0UsTUFBTSxJQUFJO0FBQUEsUUFDVixPQUFPO0FBQUEsVUFDTDtBQUFBLFlBQ0UsTUFBTTtBQUFBLFlBQ04sTUFBTTtBQUFBLFVBQ1I7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUVBLFNBQVM7QUFBQSxNQUNQO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixPQUFPLENBQUMsRUFBRSxNQUFNLGVBQWUsTUFBTSxTQUFTLENBQUM7QUFBQSxNQUNqRDtBQUFBLE1BQ0E7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLE9BQU87QUFBQSxVQUNMO0FBQUEsWUFDRSxNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsVUFDUjtBQUFBLFVBQ0E7QUFBQSxZQUNFLE1BQU07QUFBQSxZQUNOLE1BQU07QUFBQSxVQUNSO0FBQUEsVUFDQTtBQUFBLFlBQ0UsTUFBTTtBQUFBLFlBQ04sTUFBTTtBQUFBLFVBQ1I7QUFBQSxVQUNBO0FBQUEsWUFDRSxNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsVUFDUjtBQUFBLFVBQ0E7QUFBQSxZQUNFLE1BQU07QUFBQSxZQUNOLE1BQU07QUFBQSxVQUNSO0FBQUEsVUFDQTtBQUFBLFlBQ0UsTUFBTTtBQUFBLFlBQ04sTUFBTTtBQUFBLFVBQ1I7QUFBQSxVQUNBO0FBQUEsWUFDRSxNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsVUFDUjtBQUFBLFVBQ0E7QUFBQSxZQUNFLE1BQU07QUFBQSxZQUNOLE1BQU07QUFBQSxVQUNSO0FBQUEsVUFDQTtBQUFBLFlBQ0UsTUFBTTtBQUFBLFlBQ04sTUFBTTtBQUFBLFVBQ1I7QUFBQSxVQUNBO0FBQUEsWUFDRSxNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsVUFDUjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLFFBQ04sT0FBTztBQUFBLFVBQ0wsRUFBRSxNQUFNLHdCQUF3QixNQUFNLDRCQUE0QjtBQUFBLFVBQ2xFLEVBQUUsTUFBTSx3QkFBd0IsTUFBTSw0QkFBNEI7QUFBQSxVQUNsRSxFQUFFLE1BQU0sdUJBQXVCLE1BQU0sMkJBQTJCO0FBQUEsVUFDaEUsRUFBRSxNQUFNLHdCQUF3QixNQUFNLDRCQUE0QjtBQUFBLFVBQ2xFLEVBQUUsTUFBTSxhQUFhLE1BQU0saUJBQWlCO0FBQUEsVUFDNUMsRUFBRSxNQUFNLHFCQUFxQixNQUFNLHlCQUF5QjtBQUFBLFVBQzVEO0FBQUEsWUFDRSxNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsVUFDUjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLE1BQ1I7QUFBQSxNQUNBO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixNQUFNO0FBQUEsTUFDUjtBQUFBLE1BQ0E7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLE1BQU07QUFBQSxNQUNSO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLE1BQ1I7QUFBQSxNQUNBO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixNQUFNO0FBQUEsTUFDUjtBQUFBLE1BQ0E7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLE1BQU07QUFBQSxNQUNSO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLE1BQ1I7QUFBQSxJQUNGO0FBQUEsSUFFQSxhQUFhLENBQUMsRUFBRSxNQUFNLFVBQVUsTUFBTSwrQ0FBK0MsQ0FBQztBQUFBLElBRXRGLFFBQVE7QUFBQSxNQUNOLFVBQVU7QUFBQSxNQUNWLFNBQVM7QUFBQSxRQUNQLE9BQU87QUFBQSxRQUNQLFFBQVE7QUFBQSxRQUNSLFdBQVc7QUFBQSxNQUNiO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE1BQU07QUFBQSxJQUNKLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLE9BQU87QUFBQSxVQUNMLGFBQWE7QUFBQSxZQUNYLElBQUk7QUFBQSxZQUNKLElBQUk7QUFBQSxZQUNKLElBQUk7QUFBQSxZQUNKLElBQUk7QUFBQSxZQUNKLElBQUk7QUFBQSxVQUNOO0FBQUEsUUFDRjtBQUFBLE1BQ0YsQ0FBQztBQUFBLElBQ0g7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsicmVxdWlyZSJdCn0K
