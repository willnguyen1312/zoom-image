import { component$, useSignal, useComputed$, useVisibleTask$ } from "@builder.io/qwik"
import { createZoomImageHover, createZoomImageWheel } from "@zoom-image/core"

type Tab = {
  name: string
  current: boolean
  href: string
  value: "wheel" | "hover"
}

export default component$(() => {
  const tabs = useSignal<Tab[]>([
    { name: "Zoom Image Wheel", href: "#", current: true, value: "wheel" },
    { name: "Zoom Image Hover", href: "#", current: false, value: "hover" },
  ])
  const imageWheelContainerRef = useSignal<HTMLDivElement>()
  const imageHoverContainerRef = useSignal<HTMLDivElement>()
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
        zoomImageSource: "/large.webp",
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
                "rounded-md px-3 py-2 text-sm font-medium decoration-none cursor-pointer " +
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
        <div ref={imageWheelContainerRef} id="image-wheel-container" class="w-[300px] h-[300px] cursor-crosshair">
          <img class="w-full h-full" alt="Large Pic" src="/large.webp" />
        </div>
      )}

      {zoomType.value === "hover" && (
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
})
