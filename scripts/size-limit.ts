import fs from "fs/promises"
import { getExportsSize } from "export-size"

const packages = ["core", "react", "preact", "qwik", "solid", "svelte", "vue"]

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes"
  const k = 1024,
    dm = decimals || 2,
    sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

async function main() {
  const result = await Promise.all(
    packages.map((pkg) => {
      return Promise.resolve(
        getExportsSize({
          pkg: `./packages/${pkg}`,
          output: false,
          bundler: "esbuild",
          includes: ["@zoom-image/core"],
        }),
      )
    }),
  )

  const data: Record<string, Record<string, string>> = {}

  result.forEach((item) => {
    const { packageJSON, exports } = item
    const bundleInfo: Record<string, string> = {}

    exports.forEach((item) => {
      bundleInfo[item.name] = formatBytes(item.minzipped)
    })

    data[packageJSON.name] = bundleInfo
  })

  await fs.writeFile("size.json", JSON.stringify(data, null, 2) + "\n")
}

main()
