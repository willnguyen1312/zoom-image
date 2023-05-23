import type { Component } from "solid-js"
import { createSignal, createMemo, createEffect, For } from "solid-js"
import { useZoomImageWheel, useZoomImageHover, useZoomImageMove, useZoomImageClick } from "@zoom-image/solid"
import { cropImage } from "@zoom-image/core"

type Tab = {
  name: string
  href: string
  current: boolean
  value: "wheel" | "hover" | "move" | "click"
}

const App: Component = () => {
  const [tabs, setTabs] = createSignal<Tab[]>([
    { name: "Wheel", href: "#", current: true, value: "wheel" },
    { name: "Hover", href: "#", current: false, value: "hover" },
    { name: "Move", href: "#", current: false, value: "move" },
    { name: "Click", href: "#", current: false, value: "click" },
  ])

  const zoomType = createMemo(() => tabs().find((tab) => tab.current).value)
  const [croppedImage, setCroppedImage] = createSignal<string>("")
  let imageWheelContainer: HTMLDivElement
  let imageHoverContainer: HTMLDivElement
  let imageMoveContainer: HTMLDivElement
  let imageClickContainer: HTMLDivElement
  let zoomTarget: HTMLDivElement

  const {
    createZoomImage: createZoomImageWheel,
    zoomImageState: zoomImageWheelState,
    setZoomImageState: setZoomImageWheelState,
  } = useZoomImageWheel()
  const { createZoomImage: createZoomImageHover } = useZoomImageHover()
  const { createZoomImage: createZoomImageMove } = useZoomImageMove()
  const { createZoomImage: createZoomImageClick } = useZoomImageClick()

  const makeHandleTabClick = (tab: Tab) => () => {
    setTabs(
      tabs().map((t) => {
        if (t.name === tab.name) {
          return { ...t, current: true }
        } else {
          return { ...t, current: false }
        }
      }),
    )
  }

  function handleCropImage() {
    setCroppedImage(
      cropImage({
        currentZoom: zoomImageWheelState.currentZoom,
        image: imageWheelContainer.querySelector("img") as HTMLImageElement,
        positionX: zoomImageWheelState.currentPositionX,
        positionY: zoomImageWheelState.currentPositionY,
      }),
    )
  }

  createEffect(() => {
    setCroppedImage("")
    if (zoomType() === "hover") {
      createZoomImageHover(imageHoverContainer, {
        zoomImageSource: "https://nam-assets.netlify.app/static/large.webp",
        customZoom: { width: 300, height: 500 },
        zoomTarget,
        scaleFactor: 0.5,
      })
    }

    if (zoomType() === "wheel") {
      createZoomImageWheel(imageWheelContainer)
    }

    if (zoomType() === "move") {
      createZoomImageMove(imageMoveContainer, {
        zoomImageSource: "https://nam-assets.netlify.app/static/large.webp",
      })
    }

    if (zoomType() === "click") {
      createZoomImageClick(imageClickContainer, {
        zoomImageSource: "https://nam-assets.netlify.app/static/large.webp",
      })
    }
  })

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

  return (
    <div class="p-4 font-sans">
      <nav class="flex space-x-4 pb-4" aria-label="Tabs">
        <For each={tabs()}>
          {(tab) => (
            <a
              onClick={makeHandleTabClick(tab)}
              href={tab.href}
              class={
                "decoration-none rounded-md px-3 py-2 text-sm font-medium " +
                (tab.current ? "bg-gray-100 text-gray-700" : "text-gray-500 hover:text-gray-700")
              }
              aria-current={tab.current ? "page" : undefined}
            >
              {tab.name}
            </a>
          )}
        </For>
      </nav>

      {zoomType() === "wheel" && (
        <div class="space-y-4">
          <p>Current zoom: {`${Math.round(zoomImageWheelState.currentZoom * 100)}%`}</p>
          <p>Scroll inside the image to see zoom in-out effect</p>
          <div class="mt-1 flex space-x-2">
            <div ref={imageWheelContainer} class="h-[300px] w-[300px] cursor-crosshair">
              <img class="h-full w-full" alt="Large Pic" src="/large.webp" />
            </div>
            {croppedImage() && <img src={croppedImage()} class="h-[300px] w-[300px]" alt="Cropped placeholder" />}
          </div>

          <div class="flex space-x-2">
            <button onClick={zoomInWheel} class="text-dark-500 rounded bg-gray-100 p-2 text-sm font-medium">
              Zoom in
            </button>
            <button onClick={zoomOutWheel} class="text-dark-500 rounded bg-gray-100 p-2 text-sm font-medium">
              Zoom out
            </button>
            <button class="text-dark-500 rounded bg-gray-100 p-2 text-sm font-medium" onClick={handleCropImage}>
              Crop image
            </button>
          </div>
        </div>
      )}

      {zoomType() === "hover" && (
        <>
          <p>Hover inside the image to see zoom effect</p>
          <div ref={imageHoverContainer} class="relative flex h-[250px] w-[250px] items-start">
            <img class="h-full w-full" alt="Small Pic" src="https://nam-assets.netlify.app/static/small.webp" />
            <div ref={zoomTarget} class="absolute left-[300px]"></div>
          </div>
        </>
      )}

      {zoomType() === "move" && (
        <>
          <p>Move mouse inside the image to see zoom effect</p>
          <div ref={imageMoveContainer} class="relative h-[300px] w-[300px] cursor-crosshair overflow-hidden">
            <img class="h-full w-full" alt="Large Pic" src="https://nam-assets.netlify.app/static/small.webp" />
          </div>
        </>
      )}

      {zoomType() === "click" && (
        <>
          <p>Click inside the image to see zoom effect</p>
          <div ref={imageClickContainer} class="relative h-[300px] w-[300px] cursor-crosshair overflow-hidden">
            <img class="h-full w-full" alt="Large Pic" src="https://nam-assets.netlify.app/static/small.webp" />
          </div>
        </>
      )}
    </div>
  )
}

export default App
