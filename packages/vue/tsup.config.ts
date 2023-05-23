import { defineConfig } from "tsup"

export default defineConfig({
  clean: true,
  target: "esnext",
  format: ["esm", "cjs"],
  sourcemap: true,
  minify: true,
  dts: true,
  treeshake: true,
})
