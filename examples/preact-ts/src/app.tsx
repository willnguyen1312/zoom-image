import { useRef, useEffect } from "preact/hooks"
import { createZoomImageHover } from "@zoom-image/core"

function App() {
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const zoomTargetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const imageContainer = imageContainerRef.current
    const zoomTarget = zoomTargetRef.current

    if (!imageContainer) {
      throw new Error("Image container not found")
    }

    if (!zoomTarget) {
      throw new Error("Zoom target not found")
    }

    const { cleanup } = createZoomImageHover(imageContainer, {
      zoomImageSource: "/large.webp",
      customZoom: { width: 820, height: 820 },
      zoomTarget,
      scaleFactor: 0.5,
    })

    return cleanup
  }, [])

  return (
    <div class="wrapper">
      <h1>Zoom Image Hover</h1>
      <div class="demo-image-hover">
        <div ref={imageContainerRef} id="image-hover-container" class="image-hover-container">
          <img class="image-hover" alt="Small Pic" src="/small.webp" />
        </div>
        <div ref={zoomTargetRef} id="zoom-hover-target" class="zoom-hover-target"></div>
      </div>
    </div>
  )
}

export default App
