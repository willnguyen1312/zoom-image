import { useRef, useEffect, useState, useMemo } from "preact/hooks"
import { createZoomImageHover, createZoomImageWheel } from "@zoom-image/core"

function App() {
  const [tabs, setTabs] = useState<
    {
      name: string
      href: string
      current: boolean
      value: "wheel" | "hover"
    }[]
  >([
    { name: "Zoom Image Wheel", href: "#", current: true, value: "wheel" },
    { name: "Zoom Image Hover", href: "#", current: false, value: "hover" },
  ])
  const zoomType = useMemo(() => tabs.find((tab) => tab.current)?.value, [tabs])
  const imageWheelContainerRef = useRef<HTMLDivElement>(null)
  const imageHoverContainerRef = useRef<HTMLDivElement>(null)
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
    let cleanup: () => void = () => {}

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

    return cleanup
  }, [zoomType])

  return (
    <div class="font-sans">
      <nav class="flex space-x-4 pb-4" aria-label="Tabs">
        {tabs.map((tab) => {
          return (
            <a
              onClick={makeHandleTabClick(tab)}
              key={tab.name}
              href={tab.href}
              class={
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
        <div ref={imageWheelContainerRef} id="image-wheel-container" class="w-[300px] h-[300px] cursor-crosshair">
          <img class="w-full h-full" alt="Large Pic" src="/large.webp" />
        </div>
      )}

      {zoomType === "hover" && (
        <div
          id="image-hover-container"
          ref={imageHoverContainerRef}
          class="relative flex items-start w-[250px] h-[250px]"
        >
          <img class="w-full h-full" alt="Small Pic" src="/small.webp" />
          <div ref={zoomTargetRef} id="zoom-hover-target" class="absolute left-[300px]"></div>
        </div>
      )}
    </div>
  )
}

export default App
