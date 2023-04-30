import "./style.css"
import { createZoomImage } from "@zoom-image/core"

const imageContainer = document.getElementById("image-container")

if (!imageContainer) {
  throw new Error("Image container not found")
}

createZoomImage(imageContainer, {
  zoomImageSource: "/large.webp",
  offset: { x: 20 },
  customZoom: { width: 300, height: 600 },
})
