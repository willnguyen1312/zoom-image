import "./style.css"
import { createZoomImage } from "@zoom-image/core"

const imageContainer = document.getElementById("image-container")

if (!imageContainer) {
  throw new Error("Image container not found")
}

createZoomImage(imageContainer)
