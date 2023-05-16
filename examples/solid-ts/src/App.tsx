import type { Component } from "solid-js"
import { createSignal, createMemo, createEffect, For } from "solid-js"
import {
  createZoomImageHover,
  createZoomImageWheel,
  createZoomImageMove,
  createZoomImageClick,
} from "@zoom-image/core"

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
  let imageWheelContainer: HTMLDivElement
  let imageHoverContainer: HTMLDivElement
  let imageMoveContainer: HTMLDivElement
  let imageClickContainer: HTMLDivElement
  let zoomTarget: HTMLDivElement

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

  let cleanup: () => void = () => {}
  createEffect(() => {
    cleanup()

    if (zoomType() === "hover") {
      const imageContainer = imageHoverContainer
      const result = createZoomImageHover(imageContainer, {
        zoomImageSource: "https://nam-assets.netlify.app/static/large.webp",
        customZoom: { width: 300, height: 500 },
        zoomTarget,
        scaleFactor: 0.5,
      })
      cleanup = result.cleanup
    }

    if (zoomType() === "wheel") {
      const imageContainer = imageWheelContainer
      const result = createZoomImageWheel(imageContainer)
      cleanup = result.cleanup
    }

    if (zoomType() === "move") {
      const imageContainer = imageMoveContainer
      const result = createZoomImageMove(imageContainer, {
        zoomImageSource: "https://nam-assets.netlify.app/static/large.webp",
      })
      cleanup = result.cleanup
    }

    if (zoomType() === "click") {
      const imageContainer = imageClickContainer
      const result = createZoomImageClick(imageContainer, {
        zoomImageSource: "https://nam-assets.netlify.app/static/large.webp",
      })
      cleanup = result.cleanup
    }
  })

  return (
    <div class="font-sans">
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
        <>
          <p>Scroll inside the image to see zoom in-out effect</p>
          <div ref={imageWheelContainer} class="h-[300px] w-[300px] cursor-crosshair">
            <img
              class="h-full w-full"
              alt="Large Pic"
              src="https://nam-assets.netlify.app/static/large.webp"
              elementtiming=""
              fetchpriority="high"
            />
          </div>
        </>
      )}

      {zoomType() === "hover" && (
        <div ref={imageHoverContainer} class="relative flex h-[250px] w-[250px] items-start">
          <img
            class="h-full w-full"
            alt="Small Pic"
            src="https://nam-assets.netlify.app/static/small.webp"
            elementtiming=""
            fetchpriority="high"
          />
          <div ref={zoomTarget} class="absolute left-[300px]"></div>
        </div>
      )}

      {zoomType() === "move" && (
        <div
          ref={imageMoveContainer}
          class="relative h-[300px] w-[300px] cursor-crosshair overflow-hidden"
        >
          <img
            class="h-full w-full"
            alt="Large Pic"
            src="https://nam-assets.netlify.app/static/small.webp"
            elementtiming=""
            fetchpriority="high"
          />
        </div>
      )}

      {zoomType() === "click" && (
        <div
          ref={imageClickContainer}
          class="relative h-[300px] w-[300px] cursor-crosshair overflow-hidden"
        >
          <img
            class="h-full w-full"
            alt="Large Pic"
            src="https://nam-assets.netlify.app/static/small.webp"
          />
        </div>
      )}
    </div>
  )
}

export default App
