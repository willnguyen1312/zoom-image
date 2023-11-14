import { component$, useComputed$, useSignal, useVisibleTask$ } from "@builder.io/qwik"
import { cropImage } from "@zoom-image/core"
import { useZoomImageClick, useZoomImageHover, useZoomImageMove, useZoomImageWheel } from "@zoom-image/qwik"

type Tab = {
  name: string
  current: boolean
  href: string
  value: "wheel" | "hover" | "move" | "click"
}

export default component$(() => {
  const tabs = useSignal<Tab[]>([
    { name: "Wheel", href: "#", current: true, value: "wheel" },
    { name: "Hover", href: "#", current: false, value: "hover" },
    { name: "Move", href: "#", current: false, value: "move" },
    { name: "Click", href: "#", current: false, value: "click" },
  ])
  const imageWheelContainerRef = useSignal<HTMLDivElement>()
  const imageHoverContainerRef = useSignal<HTMLDivElement>()
  const imageMoveContainerRef = useSignal<HTMLDivElement>()
  const imageClickContainerRef = useSignal<HTMLDivElement>()
  const zoomTargetRef = useSignal<HTMLDivElement>()
  const croppedImage = useSignal<string>("")

  const {
    createZoomImage: createZoomImageWheel,
    zoomImageState: zoomImageWheelState,
    setZoomImageState: setZoomImageWheelState,
  } = useZoomImageWheel()
  const { createZoomImage: createZoomImageHover } = useZoomImageHover()
  const { createZoomImage: createZoomImageMove } = useZoomImageMove()
  const { createZoomImage: createZoomImageClick } = useZoomImageClick()

  const zoomType = useComputed$(() => {
    return tabs.value.find((tab) => tab.current)?.value || ""
  })

  useVisibleTask$(({ track }) => {
    track(() => zoomType.value)
    croppedImage.value = ""

    if (zoomType.value === "wheel" && imageWheelContainerRef.value) {
      const imageContainer = imageWheelContainerRef.value
      createZoomImageWheel(imageContainer)
    }

    if (zoomType.value === "hover" && imageHoverContainerRef.value) {
      const imageContainer = imageHoverContainerRef.value
      const zoomTarget = zoomTargetRef.value
      createZoomImageHover(imageContainer, {
        zoomImageSource: "/sample.avif",
        customZoom: { width: 300, height: 500 },
        zoomTarget,
        scale: 2,
      })
    }

    if (zoomType.value === "move") {
      const imageContainer = imageMoveContainerRef.value as HTMLDivElement
      createZoomImageMove(imageContainer, {
        zoomImageSource: "/sample.avif",
      })
    }

    if (zoomType.value === "click") {
      const imageContainer = imageClickContainerRef.value as HTMLDivElement
      createZoomImageClick(imageContainer, {
        zoomImageSource: "/sample.avif",
      })
    }
  })

  return (
    <div class="p-4 font-sans">
      <nav class="flex space-x-4 pb-4" aria-label="Tabs">
        {tabs.value.map((tab) => {
          return (
            <a
              key={tab.name}
              preventdefault:click
              href={tab.href}
              onClick$={() => {
                tabs.value = tabs.value.map((t) => {
                  if (t.name === tab.name) {
                    return { ...t, current: true }
                  } else {
                    return { ...t, current: false }
                  }
                })
              }}
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

      {zoomType.value === "wheel" && (
        <div class="space-y-4">
          <p>Current zoom: {`${Math.round(zoomImageWheelState.currentZoom * 100)}%`}</p>
          <p>Scroll inside the image to see zoom in-out effect</p>
          <div class="mt-1 flex space-x-2">
            <div ref={imageWheelContainerRef} class="h-[300px] w-[200px] cursor-crosshair">
              <img class="h-full w-full" alt="Large Pic" src="/sample.avif" />
            </div>
            {croppedImage.value && (
              <img src={croppedImage.value} class="h-[300px] w-[200px]" alt="Cropped placeholder" />
            )}
          </div>

          <div class="flex space-x-2">
            <button
              onClick$={() => {
                setZoomImageWheelState({
                  currentZoom: zoomImageWheelState.currentZoom + 0.5,
                })
              }}
              class="text-dark-500 rounded bg-gray-100 p-2 text-sm font-medium"
            >
              Zoom in
            </button>
            <button
              onClick$={() => {
                setZoomImageWheelState({
                  currentZoom: zoomImageWheelState.currentZoom - 0.5,
                })
              }}
              class="text-dark-500 rounded bg-gray-100 p-2 text-sm font-medium"
            >
              Zoom out
            </button>
            <button
              class="text-dark-500 rounded bg-gray-100 p-2 text-sm font-medium"
              onClick$={() => {
                croppedImage.value = cropImage({
                  currentZoom: zoomImageWheelState.currentZoom,
                  image: imageWheelContainerRef.value?.querySelector("img") as HTMLImageElement,
                  positionX: zoomImageWheelState.currentPositionX,
                  positionY: zoomImageWheelState.currentPositionY,
                })
              }}
            >
              Crop image
            </button>
          </div>
        </div>
      )}

      {zoomType.value === "hover" && (
        <>
          <p>Hover inside the image to see zoom effect</p>
          <div ref={imageHoverContainerRef} class="relative flex h-[250px] w-[250px] items-start">
            <img class="h-full w-full" alt="Small Pic" src="/sample.avif" />
            <div ref={zoomTargetRef} class="absolute left-[300px]"></div>
          </div>
        </>
      )}

      {zoomType.value === "move" && (
        <>
          <p>Move mouse inside the image to see zoom effect</p>
          <div ref={imageMoveContainerRef} class="relative h-[300px] w-[200px] cursor-crosshair overflow-hidden">
            <img class="h-full w-full" alt="Large Pic" src="/sample.avif" />
          </div>
        </>
      )}

      {zoomType.value === "click" && (
        <>
          <p>Click inside the image to see zoom effect</p>
          <div ref={imageClickContainerRef} class="relative h-[300px] w-[200px] cursor-crosshair overflow-hidden">
            <img class="h-full w-full" alt="Large Pic" src="/sample.avif" />
          </div>
        </>
      )}
    </div>
  )
})
