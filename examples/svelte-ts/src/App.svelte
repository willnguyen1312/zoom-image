<script lang="ts">
  import { onDestroy, tick } from "svelte"
  import {
    createZoomImageHover,
    createZoomImageWheel,
    createZoomImageMove,
    createZoomImageClick,
  } from "@zoom-image/core"

  const tabs: {
    name: string
    href: string
    current: boolean
    value: "wheel" | "hover" | "move" | "click"
  }[] = [
    { name: "Wheel", href: "#", current: true, value: "wheel" },
    { name: "Hover", href: "#", current: false, value: "hover" },
    { name: "Move", href: "#", current: false, value: "move" },
    { name: "Click", href: "#", current: false, value: "click" },
  ]
  $: zoomType = tabs.find((tab) => tab.current)?.value as "wheel" | "hover" | "move" | "click"

  let imageWheelContainer: HTMLDivElement
  let imageMoveContainer: HTMLDivElement
  let imageHoverContainer: HTMLDivElement
  let imageClickContainer: HTMLDivElement
  let zoomTarget: HTMLDivElement
  let cleanup: () => void = () => {}

  async function processZoom(zoomType: "wheel" | "hover" | "move" | "click") {
    cleanup()
    await tick()

    if (zoomType === "hover") {
      const result = createZoomImageHover(imageHoverContainer, {
        zoomImageSource: "https://nam-assets.netlify.app/static/large.webp",
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
        zoomImageSource: "https://nam-assets.netlify.app/static/large.webp",
      }).cleanup
    }

    if (zoomType === "click") {
      cleanup = createZoomImageClick(imageClickContainer, {
        zoomImageSource: "https://nam-assets.netlify.app/static/large.webp",
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
        class={`decoration-none rounded-md px-3 py-2 text-sm font-medium ${
          tab.current ? "bg-gray-100 text-gray-700" : "text-gray-500 hover:text-gray-700"
        }`}>{tab.name}</a
      >
    {/each}
  </nav>

  {#if zoomType === "wheel"}
    <p>Scroll inside the image to see zoom in-out effect</p>
    <div bind:this={imageWheelContainer} class="h-[300px] w-[300px] cursor-crosshair">
      <img class="h-full w-full" alt="Large Pic" src="https://nam-assets.netlify.app/static/large.webp" />
    </div>
  {/if}

  {#if zoomType === "hover"}
    <div bind:this={imageHoverContainer} class="relative flex h-[250px] w-[250px] items-start">
      <img class="h-full w-full" alt="Small Pic" src="https://nam-assets.netlify.app/static/small.webp" />
      <div bind:this={zoomTarget} class="absolute left-[300px]" />
    </div>
  {/if}

  {#if zoomType === "move"}
    <div bind:this={imageMoveContainer} class="relative h-[300px] w-[300px] cursor-crosshair overflow-hidden">
      <img class="h-full w-full" alt="Large Pic" src="https://nam-assets.netlify.app/static/small.webp" />
    </div>
  {/if}

  {#if zoomType === "click"}
    <div bind:this={imageClickContainer} class="relative h-[300px] w-[300px] cursor-crosshair overflow-hidden">
      <img class="h-full w-full" alt="Large Pic" src="https://nam-assets.netlify.app/static/small.webp" />
    </div>
  {/if}
</div>
