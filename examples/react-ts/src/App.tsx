import React from "react"
import { createZoomImageHover } from "@zoom-image/core"

function App() {
  const imageContainerRef = React.useRef<HTMLDivElement>(null)
  const zoomTargetRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
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
    <div className="wrapper">
      <h1>Zoom Image Hover</h1>
      <div className="demo-image-hover">
        <div ref={imageContainerRef} id="image-hover-container" className="image-hover-container">
          <img className="image-hover" alt="Small Pic" src="/small.webp" />
        </div>
        <div ref={zoomTargetRef} id="zoom-hover-target" className="zoom-hover-target"></div>
      </div>
    </div>
  )
}

export default App
