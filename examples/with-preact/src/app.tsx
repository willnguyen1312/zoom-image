import { cropImage } from "@zoom-image/core"
import { useZoomImageClick, useZoomImageHover, useZoomImageMove, useZoomImageWheel } from "@zoom-image/preact"
import { useEffect, useMemo, useRef, useState } from "preact/hooks"

function App() {
  const [tabs, setTabs] = useState<
    {
      name: string
      href: string
      current: boolean
      value: "wheel" | "hover" | "move" | "click"
    }[]
  >([
    { name: "Wheel", href: "#", current: true, value: "wheel" },
    { name: "Hover", href: "#", current: false, value: "hover" },
    { name: "Move", href: "#", current: false, value: "move" },
    { name: "Click", href: "#", current: false, value: "click" },
  ])

  const zoomType = useMemo(() => tabs.find((tab) => tab.current)?.value, [tabs])
  const imageWheelContainerRef = useRef<HTMLDivElement>(null)
  const imageHoverContainerRef = useRef<HTMLDivElement>(null)
  const imageMoveContainerRef = useRef<HTMLDivElement>(null)
  const imageClickContainerRef = useRef<HTMLDivElement>(null)
  const zoomTargetRef = useRef<HTMLDivElement>(null)
  const [croppedImage, setCroppedImage] = useState<string | null>(null)

  const {
    createZoomImage: createZoomImageWheel,
    zoomImageState: zoomImageWheelState,
    setZoomImageState: setZoomImageWheelState,
  } = useZoomImageWheel()
  const { createZoomImage: createZoomImageHover } = useZoomImageHover()
  const { createZoomImage: createZoomImageMove } = useZoomImageMove()
  const { createZoomImage: createZoomImageClick } = useZoomImageClick()

  async function handleCropWheelZoomImage(currentRotation: number) {
    setCroppedImage(
      await cropImage({
        currentZoom: zoomImageWheelState.currentZoom,
        image: imageWheelContainerRef.current?.querySelector("img") as HTMLImageElement,
        positionX: zoomImageWheelState.currentPositionX,
        positionY: zoomImageWheelState.currentPositionY,
        rotation: currentRotation,
      }),
    )
  }

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

  const croppedImageClasses = useMemo(() => {
    if (zoomImageWheelState.currentRotation % 180 === 90) {
      return "h-[200px] w-[300px]"
    } else {
      return "h-[300px] w-[200px]"
    }
  }, [zoomImageWheelState.currentRotation])

  // We need to wait for Preact to render the image before we can apply zoom effect
  useEffect(() => {
    setCroppedImage("")
    if (zoomType === "wheel") {
      const imageContainer = imageWheelContainerRef.current as HTMLDivElement
      createZoomImageWheel(imageContainer)
    }

    if (zoomType === "hover") {
      const imageContainer = imageHoverContainerRef.current as HTMLDivElement
      const zoomTarget = zoomTargetRef.current as HTMLDivElement
      createZoomImageHover(imageContainer, {
        zoomImageSource: "/sample.avif",
        customZoom: { width: 300, height: 500 },
        zoomTarget,
        scale: 2,
      })
    }

    if (zoomType === "move") {
      const imageContainer = imageMoveContainerRef.current as HTMLDivElement
      createZoomImageMove(imageContainer, {
        zoomImageSource: "/sample.avif",
      })
    }

    if (zoomType === "click") {
      const imageContainer = imageClickContainerRef.current as HTMLDivElement
      createZoomImageClick(imageContainer, {
        zoomImageSource: "/sample.avif",
      })
    }
  }, [zoomType])

  function zoomInWheel() {
    setZoomImageWheelState({
      currentZoom: zoomImageWheelState.currentZoom + 0.5,
    })
  }

  function zoomOutWheel() {
    setZoomImageWheelState({
      currentZoom: zoomImageWheelState.currentZoom - 0.5,
    })
  }

  function rotate() {
    const currentRotation = zoomImageWheelState.currentRotation + 90
    setZoomImageWheelState({
      currentRotation,
    })

    if (croppedImage) {
      handleCropWheelZoomImage(currentRotation)
    }
  }

  return (
    <div class="p-4 font-sans">
      <nav class="flex space-x-4 pb-4" aria-label="Tabs">
        {tabs.map((tab) => {
          return (
            <a
              onClick={makeHandleTabClick(tab)}
              key={tab.name}
              href={tab.href}
              class={
                "decoration-none rounded-md px-3 py-2 text-sm font-medium " +
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
        <div class="space-y-4">
          <p>Current zoom: {`${Math.round(zoomImageWheelState.currentZoom * 100)}%`}</p>
          <p>Scroll inside the image to see zoom in-out effect</p>
          <div class="flex items-center gap-4">
            <div class="mt-1 grid h-[300px] w-[300px] place-content-center bg-black">
              <div ref={imageWheelContainerRef} class="h-[300px] w-[200px] cursor-crosshair duration-500">
                <img class="h-full w-full" alt="Large Pic" src="/sample.avif" />
              </div>
            </div>
            {croppedImage && <img src={croppedImage} class={croppedImageClasses} alt="Cropped placeholder" />}
          </div>

          <div class="flex space-x-2">
            <button onClick={zoomInWheel} class="text-dark-500 rounded bg-gray-100 p-2 text-sm font-medium">
              Zoom in
            </button>
            <button onClick={zoomOutWheel} class="text-dark-500 rounded bg-gray-100 p-2 text-sm font-medium">
              Zoom out
            </button>
            <button
              class="text-dark-500 rounded bg-gray-100 p-2 text-sm font-medium"
              onClick={() => handleCropWheelZoomImage(zoomImageWheelState.currentRotation)}
            >
              Crop image
            </button>

            <button onClick={rotate} class="text-dark-500 rounded bg-gray-100 p-2 text-sm font-medium">
              Rotate
            </button>
          </div>
        </div>
      )}

      {zoomType === "hover" && (
        <>
          <p>Hover inside the image to see zoom effect</p>
          <div ref={imageHoverContainerRef} class="relative flex h-[300px] w-[200px] items-start">
            <img class="h-full w-full" alt="Small Pic" src="/sample.avif" />
            <div ref={zoomTargetRef} class="absolute left-[350px]"></div>
          </div>
        </>
      )}

      {zoomType === "move" && (
        <>
          <p>Move mouse inside the image to see zoom effect</p>
          <div ref={imageMoveContainerRef} class="relative h-[300px] w-[200px] cursor-crosshair overflow-hidden">
            <img class="h-full w-full" alt="Large Pic" src="/sample.avif" />
          </div>
        </>
      )}

      {zoomType === "click" && (
        <>
          <p>Click inside the image to see zoom effect</p>
          <div ref={imageClickContainerRef} class="relative h-[300px] w-[200px] cursor-crosshair overflow-hidden">
            <img class="h-full w-full" alt="Large Pic" src="/sample.avif" />
          </div>
        </>
      )}
    </div>
  )
}

export default App
