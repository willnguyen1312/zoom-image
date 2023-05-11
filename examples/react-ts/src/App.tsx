import { useRef, useEffect, useState, useMemo } from "react"
import { createZoomImageHover, createZoomImageMove, createZoomImageWheel } from "@zoom-image/core"

function App() {
  const [tabs, setTabs] = useState<
    {
      name: string
      href: string
      current: boolean
      value: "wheel" | "hover" | "move"
    }[]
  >([
    { name: "Zoom Image Wheel", href: "#", current: true, value: "wheel" },
    { name: "Zoom Image Hover", href: "#", current: false, value: "hover" },
    { name: "Zoom Image Move", href: "#", current: false, value: "move" },
  ])
  const zoomType = useMemo(() => tabs.find((tab) => tab.current)?.value, [tabs])
  const imageWheelContainerRef = useRef<HTMLDivElement>(null)
  const imageHoverContainerRef = useRef<HTMLDivElement>(null)
  const imageMoveContainerRef = useRef<HTMLDivElement>(null)
  const zoomTargetRef = useRef<HTMLDivElement>(null)

  const makeHandleTabClick = (tab: (typeof tabs)[0]) => () => {
    setTabs(
      tabs.map((t) => {
        if (t.name === tab.name) {
          return { ...t, current: true }
        } else {
          return { ...t, current: false }
        }
      }),
    )
  }

  useEffect(() => {
    let cleanup: () => void = () => {
      // noop
    }

    if (zoomType === "hover") {
      const imageContainer = imageHoverContainerRef.current as HTMLDivElement
      const zoomTarget = zoomTargetRef.current as HTMLDivElement
      const result = createZoomImageHover(imageContainer, {
        zoomImageSource: "/large.webp",
        customZoom: { width: 300, height: 500 },
        zoomTarget,
        scaleFactor: 0.5,
      })
      cleanup = result.cleanup
    }

    if (zoomType === "wheel") {
      const imageContainer = imageWheelContainerRef.current as HTMLDivElement
      const result = createZoomImageWheel(imageContainer)
      cleanup = result.cleanup
    }

    if (zoomType === "move") {
      const imageContainer = imageMoveContainerRef.current as HTMLDivElement
      const result = createZoomImageMove(imageContainer, {
        zoomImageSource: "/large.webp",
      })
      cleanup = result.cleanup
    }

    return cleanup
  }, [zoomType])

  return (
    <div className="font-sans">
      <nav className="flex space-x-4 pb-4" aria-label="Tabs">
        {tabs.map((tab) => {
          return (
            <a
              onClick={makeHandleTabClick(tab)}
              key={tab.name}
              href={tab.href}
              className={
                "rounded-md px-3 py-2 text-sm font-medium decoration-none " +
                (tab.current ? "bg-gray-100 text-gray-700" : "text-gray-500 hover:text-gray-700")
              }
              aria-current={tab.current ? "page" : undefined}
            >
              {tab.name}
            </a>
          )
        })}
      </nav>

      {zoomType === "wheel" && (
        <>
          <p>Scroll inside the image to see zoom in-out effect</p>
          <div ref={imageWheelContainerRef} className="w-[300px] h-[300px] cursor-crosshair">
            <img className="w-full h-full" alt="Large Pic" src="/large.webp" />
          </div>
        </>
      )}

      {zoomType === "hover" && (
        <div ref={imageHoverContainerRef} className="relative flex items-start w-[250px] h-[250px]">
          <img className="w-full h-full" alt="Small Pic" src="/small.webp" />
          <div ref={zoomTargetRef} className="absolute left-[300px]"></div>
        </div>
      )}

      {zoomType === "move" && (
        <div ref={imageMoveContainerRef} className="w-[300px] h-[300px] cursor-crosshair relative overflow-hidden">
          <img className="w-full h-full" alt="Large Pic" src="/small.webp" />
        </div>
      )}
    </div>
  )
}

export default App
