import { createZoomImageHover, createZoomImageWheel } from "@zoom-image/core"

// Start handling the zoom image on hover
const imageHoverContainer = document.getElementById("image-hover-container")
const zoomHoverTarget = document.getElementById("zoom-hover-target")

if (!imageHoverContainer) {
  throw new Error("Image wheel container not found")
}

if (!zoomHoverTarget) {
  throw new Error("Zoom wheel target not found")
}

createZoomImageHover(imageHoverContainer, {
  zoomImageSource: "/large.webp",
  customZoom: { width: 820, height: 820 },
  zoomTarget: zoomHoverTarget,
  scaleFactor: 0.5,
})
// End handling the zoom image on hover

// Start handling the zoom image on wheel
const imageWheelContainer = document.getElementById("image-wheel-container")

if (!imageWheelContainer) {
  throw new Error("Image wheel container not found")
}

createZoomImageWheel(imageWheelContainer)
// End handling the zoom image on wheel
