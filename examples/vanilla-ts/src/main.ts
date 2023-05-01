import { createZoomImage } from "@zoom-image/core"

const imageContainer = document.getElementById("image-container")
const zoomTarget = document.getElementById("zoom-target")

if (!imageContainer) {
  throw new Error("Image container not found")
}

if (!zoomTarget) {
  throw new Error("Zoom target not found")
}

createZoomImage(imageContainer, {
  zoomImageSource: "/large.webp",
  customZoom: { width: 820, height: 820 },
  zoomTarget,
  scaleFactor: 0.5,
})
