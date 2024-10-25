<script lang="ts">
  import { cropImage, type ZoomImageWheelState } from "@zoom-image/core"
  import { useZoomImageClick, useZoomImageHover, useZoomImageMove, useZoomImageWheel } from "@zoom-image/svelte"
  import { onMount, tick } from "svelte"

  let tabs: {
    name: string
    href: string
    current: boolean
    value: "wheel" | "hover" | "move" | "click"
  }[] = $state([
    { name: "Wheel", href: "#", current: true, value: "wheel" },
    { name: "Hover", href: "#", current: false, value: "hover" },
    { name: "Move", href: "#", current: false, value: "move" },
    { name: "Click", href: "#", current: false, value: "click" },
  ])
  let zoomType = $derived(tabs.find((tab) => tab.current)!.value)
  let croppedImage = $state("")

  // svelte-ignore non_reactive_update
  let imageWheelContainer: HTMLDivElement
  // svelte-ignore non_reactive_update
  let imageMoveContainer: HTMLDivElement
  // svelte-ignore non_reactive_update
  let imageHoverContainer: HTMLDivElement
  // svelte-ignore non_reactive_update
  let imageClickContainer: HTMLDivElement
  // svelte-ignore non_reactive_update
  let zoomTarget: HTMLDivElement

  let {
    createZoomImage: createZoomImageWheel,
    zoomImageState: zoomImageWheelState,
    setZoomImageState: setZoomImageWheelState,
  } = useZoomImageWheel()
  let { createZoomImage: createZoomImageHover } = useZoomImageHover()
  let { createZoomImage: createZoomImageMove } = useZoomImageMove()
  let { createZoomImage: createZoomImageClick } = useZoomImageClick()

  let zoomImageWheelStateValue = $state<ZoomImageWheelState>() as ZoomImageWheelState
  let croppedImageClasses = $derived(
    zoomImageWheelStateValue.currentRotation % 180 === 90 ? "h-[200px] w-[300px]" : "h-[300px] w-[200px]",
  )

  zoomImageWheelState.subscribe((value) => {
    zoomImageWheelStateValue = value
  })

  async function processZoom(zoomType: "wheel" | "hover" | "move" | "click") {
    croppedImage = ""
    await tick()

    if (zoomType === "hover") {
      createZoomImageHover(imageHoverContainer, {
        zoomImageSource: "/sample.avif",
        customZoom: { width: 300, height: 500 },
        zoomTarget,
        scale: 2,
      })
    }

    if (zoomType === "wheel") {
      createZoomImageWheel(imageWheelContainer)
    }

    if (zoomType === "move") {
      createZoomImageMove(imageMoveContainer, {
        zoomImageSource: "/sample.avif",
      })
    }

    if (zoomType === "click") {
      createZoomImageClick(imageClickContainer, {
        zoomImageSource: "/sample.avif",
      })
    }
  }

  async function handleCropImage() {
    croppedImage = await cropImage({
      currentZoom: zoomImageWheelStateValue.currentZoom,
      image: imageWheelContainer.querySelector("img") as HTMLImageElement,
      positionX: zoomImageWheelStateValue.currentPositionX,
      positionY: zoomImageWheelStateValue.currentPositionY,
      rotation: zoomImageWheelStateValue.currentRotation,
    })
  }

  function rotate() {
    setZoomImageWheelState({
      currentRotation: zoomImageWheelStateValue.currentRotation + 90,
    })

    if (croppedImage) {
      handleCropImage()
    }
  }

  onMount(() => processZoom(zoomType))
</script>

<div class="p-4 font-sans">
  <nav class="flex space-x-4 pb-4" aria-label="Tabs">
    {#each tabs as tab (tab.name)}
      <a
        onclick={() => {
          tabs.forEach((tab) => {
            tab.current = false
          })
          tab.current = true
          processZoom(tab.value)
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
    <div class="space-y-4">
      <p>Current zoom: {`${Math.round(zoomImageWheelStateValue.currentZoom * 100)}%`}</p>
      <p>Scroll inside the image to see zoom in-out effect</p>
      <div class="flex items-center gap-4">
        <div class="mt-1 grid h-[300px] w-[300px] place-content-center bg-black">
          <div bind:this={imageWheelContainer} class="h-[300px] w-[200px] cursor-crosshair duration-500">
            <img class="h-full w-full" alt="Large Pic" src="/sample.avif" />
          </div>
        </div>

        {#if croppedImage !== ""}
          <img src={croppedImage} class={croppedImageClasses} alt="Cropped placeholder" />
        {/if}
      </div>
      <div class="flex space-x-2">
        <button
          onclick={() => {
            setZoomImageWheelState({
              currentZoom: zoomImageWheelStateValue.currentZoom + 0.5,
            })
          }}
          class="text-dark-500 rounded bg-gray-100 p-2 text-sm font-medium"
        >
          Zoom in
        </button>
        <button
          onclick={() => {
            setZoomImageWheelState({
              currentZoom: zoomImageWheelStateValue.currentZoom - 0.5,
            })
          }}
          class="text-dark-500 rounded bg-gray-100 p-2 text-sm font-medium"
        >
          Zoom out
        </button>
        <button class="text-dark-500 rounded bg-gray-100 p-2 text-sm font-medium" onclick={handleCropImage}>
          Crop image
        </button>
        <button onclick={rotate} class="text-dark-500 rounded bg-gray-100 p-2 text-sm font-medium">Rotate</button>
      </div>
    </div>
  {/if}

  {#if zoomType === "hover"}
    <div bind:this={imageHoverContainer} class="relative flex h-[300px] w-[200px] items-start">
      <img class="h-full w-full" alt="Small Pic" src="/sample.avif" />
      <div bind:this={zoomTarget} class="absolute left-[350px]"></div>
    </div>
  {/if}

  {#if zoomType === "move"}
    <div bind:this={imageMoveContainer} class="relative h-[300px] w-[200px] cursor-crosshair overflow-hidden">
      <img class="h-full w-full" alt="Large Pic" src="/sample.avif" />
    </div>
  {/if}

  {#if zoomType === "click"}
    <div bind:this={imageClickContainer} class="relative h-[300px] w-[200px] cursor-crosshair overflow-hidden">
      <img class="h-full w-full" alt="Large Pic" src="/sample.avif" />
    </div>
  {/if}
</div>
