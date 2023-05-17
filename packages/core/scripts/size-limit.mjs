import Zoom from "@zoom-image/core"
import sizeLimit from "size-limit"
import presetSmallLib from "@size-limit/preset-small-lib"
import fs from "fs"
import path from "path"
import url from "url"

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

/**
 * Formats a given number of bytes into a human-readable string.
 * @param {number} bytes - The number of bytes to format.
 * @param {number} [decimals=2] - The number of decimal places to include in the formatted string.
 * @returns {string} A human-readable string representing the given number of bytes.
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes"
  var k = 1024,
    dm = decimals || 2,
    sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

async function main() {
  /**
   * @type {string[]}
   */
  const listOfFunction = []

  for (const func in Zoom) {
    listOfFunction.push(func)
  }

  listOfFunction.sort()

  /**
   * @type {{[key: string]: string}}
   */
  const data = {}

  const bundleInfos = await Promise.all(
    listOfFunction.map((funcName) => {
      return sizeLimit(
        [presetSmallLib],
        [path.join(__dirname, `/../dist/${funcName}.global.js`)],
      ).then((result) => {
        return formatBytes(result[0].size)
      })
    }),
  )

  for (let index = 0; index < listOfFunction.length; index++) {
    const funcName = listOfFunction[index]
    const size = bundleInfos[index]
    data[funcName] = size
  }

  fs.writeFileSync("size.json", JSON.stringify(data, null, 2) + "\n")
}

main()
