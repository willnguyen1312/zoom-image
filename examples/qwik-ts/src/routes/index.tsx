import { component$, useSignal, useComputed$, useVisibleTask$ } from "@builder.io/qwik"
import { createZoomImageClick, createZoomImageHover, createZoomImageMove, createZoomImageWheel } from "@zoom-image/core"

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

  const zoomType = useComputed$(() => {
    return tabs.value.find((tab) => tab.current)?.value || ""
  })

  useVisibleTask$(({ track, cleanup }) => {
    track(() => zoomType.value)

    if (zoomType.value === "hover" && imageHoverContainerRef.value) {
      const imageContainer = imageHoverContainerRef.value
      const zoomTarget = zoomTargetRef.value
      const result = createZoomImageHover(imageContainer, {
        zoomImageSource: "https://nam-assets.netlify.app/static/large.webp",
        customZoom: { width: 300, height: 500 },
        zoomTarget,
        scaleFactor: 0.5,
      })
      cleanup(result.cleanup)
    }

    if (zoomType.value === "wheel" && imageWheelContainerRef.value) {
      const imageContainer = imageWheelContainerRef.value
      const result = createZoomImageWheel(imageContainer)
      cleanup(result.cleanup)
    }

    if (zoomType.value === "move") {
      const imageContainer = imageMoveContainerRef.value as HTMLDivElement
      const result = createZoomImageMove(imageContainer, {
        zoomImageSource: "https://nam-assets.netlify.app/static/large.webp",
      })
      cleanup = result.cleanup
    }

    if (zoomType.value === "click") {
      const imageContainer = imageClickContainerRef.value as HTMLDivElement
      const result = createZoomImageClick(imageContainer, {
        zoomImageSource: "https://nam-assets.netlify.app/static/large.webp",
      })
      cleanup = result.cleanup
    }
  })

  return (
    <div class="font-sans">
      <nav class="flex space-x-4 pb-4" aria-label="Tabs">
        {tabs.value.map((tab) => {
          return (
            <a
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
                "decoration-none cursor-pointer rounded-md px-3 py-2 text-sm font-medium " +
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
        <>
          <p>Scroll inside the image to see zoom in-out effect</p>
          <div ref={imageWheelContainerRef} class="h-[300px] w-[300px] cursor-crosshair">
            <img class="h-full w-full" alt="Large Pic" src="https://nam-assets.netlify.app/static/large.webp" />
          </div>
        </>
      )}

      {zoomType.value === "hover" && (
        <div ref={imageHoverContainerRef} class="relative flex h-[250px] w-[250px] items-start">
          <img class="h-full w-full" alt="Small Pic" src="https://nam-assets.netlify.app/static/small.webp" />
          <div ref={zoomTargetRef} class="absolute left-[300px]"></div>
        </div>
      )}

      {zoomType.value === "move" && (
        <div ref={imageMoveContainerRef} class="relative h-[300px] w-[300px] cursor-crosshair overflow-hidden">
          <img class="h-full w-full" alt="Large Pic" src="https://nam-assets.netlify.app/static/small.webp" />
        </div>
      )}

      {zoomType.value === "click" && (
        <div ref={imageClickContainerRef} class="relative h-[300px] w-[300px] cursor-crosshair overflow-hidden">
          <img class="h-full w-full" alt="Large Pic" src="https://nam-assets.netlify.app/static/small.webp" />
        </div>
      )}
    </div>
  )
})
