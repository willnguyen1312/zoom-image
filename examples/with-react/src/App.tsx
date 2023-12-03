import { useZoomImageHover } from "@zoom-image/react"
import { useEffect, useRef, useState } from "react"

const getMeta = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = (err) => reject(err)
    img.src = url
  })

function App() {
  const imageHoverContainerRef = useRef<HTMLDivElement>(null)
  const zoomTargetRef = useRef<HTMLDivElement>(null)
  const { createZoomImage: createZoomImageHover } = useZoomImageHover()
  const [aspectRatio, setAspectRatio] = useState(0)

  useEffect(() => {
    async function createZoomImage() {
      const image = await getMeta("/sample.avif")
      const { naturalHeight, naturalWidth } = image
      const aspectRatio = naturalWidth / naturalHeight

      const imageContainer = imageHoverContainerRef.current as HTMLDivElement
      const zoomTarget = zoomTargetRef.current as HTMLDivElement
      createZoomImageHover(imageContainer, {
        zoomImageSource: "/sample.avif",
        customZoom: { width: 300, height: 500 },
        zoomTarget,
        scale: 3,
      })

      setAspectRatio(aspectRatio)
    }

    createZoomImage()
  }, [])

  const CONTAINER_WIDTH = 300

  const containerStyle: React.CSSProperties = aspectRatio
    ? {
        height: CONTAINER_WIDTH / aspectRatio,
        width: CONTAINER_WIDTH,
      }
    : {}

  return (
    <div className="p-4 font-sans">
      <p>Hover inside the image to see zoom effect</p>
      <div
        style={containerStyle}
        ref={imageHoverContainerRef}
        className={`relative ${aspectRatio ? "flex" : "hidden"} items-start`}
      >
        <img className="h-full w-full" alt="Small Pic" src="/sample.avif" />
        <div ref={zoomTargetRef} className="absolute left-[350px]"></div>
      </div>
    </div>
  )
}

export default App
