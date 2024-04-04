import { defineConfig } from "tsup"

export default defineConfig({
  clean: true,
  target: "esnext",
  format: ["esm", "cjs", "iife"],
  sourcemap: true,
  minify: false,
  globalName: "ZoomImage",
  name: "zoom-image",
  dts: true,
  treeshake: true,
})
