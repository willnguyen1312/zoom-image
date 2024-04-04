import { defineConfig } from "tsup"

export default defineConfig({
  clean: true,
  target: "esnext",
  format: ["esm", "cjs"],
  sourcemap: true,
  minify: false,
  dts: true,
  treeshake: true,
})
