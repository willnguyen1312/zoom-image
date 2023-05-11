<script lang="ts">
  import { onDestroy, tick } from "svelte"
  import { createZoomImageHover, createZoomImageWheel, createZoomImageMove } from "@zoom-image/core"

  const tabs: {
    name: string
    href: string
    current: boolean
    value: "wheel" | "hover" | "move"
  }[] = [
    { name: "Zoom Image Wheel", href: "#", current: true, value: "wheel" },
    { name: "Zoom Image Hover", href: "#", current: false, value: "hover" },
    { name: "Zoom Image Move", href: "#", current: false, value: "move" },
  ]
  $: zoomType = tabs.find((tab) => tab.current)?.value

  let imageWheelContainer: HTMLDivElement
  let imageMoveContainer: HTMLDivElement
  let imageHoverContainer: HTMLDivElement
  let zoomTarget: HTMLDivElement
  let cleanup: () => void = () => {}

  async function processZoom(zoomType: string) {
    cleanup()
    await tick()

    if (zoomType === "hover") {
      const result = createZoomImageHover(imageHoverContainer, {
        zoomImageSource: "/large.jpg",
        customZoom: { width: 300, height: 500 },
        zoomTarget,
        scaleFactor: 0.5,
      })
      cleanup = result.cleanup
    }

    if (zoomType === "wheel") {
      const result = createZoomImageWheel(imageWheelContainer)
      cleanup = result.cleanup
    }

    if (zoomType === "move") {
      cleanup = createZoomImageMove(imageMoveContainer, {
        zoomImageSource: "/large.jpg",
      }).cleanup
    }
  }

  $: processZoom(zoomType)

  onDestroy(() => {
    cleanup()
  })
</script>

<div class="font-sans">
  <nav class="flex space-x-4 pb-4" aria-label="Tabs">
    {#each tabs as tab (tab.name)}
      <a
        on:click={() => {
          tabs.forEach((tab) => {
            tab.current = false
          })
          tab.current = true
        }}
        aria-current={tab.current ? "page" : undefined}
        href={tab.href}
        class={`rounded-md px-3 py-2 text-sm font-medium decoration-none ${
          tab.current ? "bg-gray-100 text-gray-700" : "text-gray-500 hover:text-gray-700"
        }`}>{tab.name}</a
      >
    {/each}
  </nav>

  {#if zoomType === "wheel"}
    <p>Scroll inside the image to see zoom in-out effect</p>
    <div bind:this={imageWheelContainer} class="w-[300px] h-[300px] cursor-crosshair">
      <img class="w-full h-full" alt="Large Pic" src="/large.jpg" />
    </div>
  {/if}

  {#if zoomType === "hover"}
    <div bind:this={imageHoverContainer} class="relative flex items-start w-[250px] h-[250px]">
      <img class="w-full h-full" alt="Small Pic" src="/small.jpg" />
      <div bind:this={zoomTarget} class="absolute left-[300px]" />
    </div>
  {/if}

  {#if zoomType === "move"}
    <div bind:this={imageMoveContainer} class="w-[300px] h-[300px] cursor-crosshair relative overflow-hidden">
      <img class="w-full h-full" alt="Large Pic" src="/small.jpg" />
    </div>
  {/if}
</div>
