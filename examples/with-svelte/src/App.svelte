<script lang="ts">
  import { cropImage, type ZoomImageWheelState } from "@zoom-image/core"
  import { useZoomImageClick, useZoomImageHover, useZoomImageMove, useZoomImageWheel } from "@zoom-image/svelte"
  import { tick } from "svelte"

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
  let croppedImage: string = ""

  let imageWheelContainer: HTMLDivElement
  let imageMoveContainer: HTMLDivElement
  let imageHoverContainer: HTMLDivElement
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

  let zoomImageWheelState_value: ZoomImageWheelState

  zoomImageWheelState.subscribe((value) => {
    zoomImageWheelState_value = value
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

  $: processZoom(zoomType)

  $: croppedImageClasses =
    zoomImageWheelState_value.currentRotation === 90 || zoomImageWheelState_value.currentRotation === 270
      ? "h-[200px] w-[300px]"
      : "h-[300px] w-[200px]"

  async function handleCropImage() {
    croppedImage = await cropImage({
      currentZoom: zoomImageWheelState_value.currentZoom,
      image: imageWheelContainer.querySelector("img"),
      positionX: zoomImageWheelState_value.currentPositionX,
      positionY: zoomImageWheelState_value.currentPositionY,
      rotation: zoomImageWheelState_value.currentRotation,
    })
  }

  function rotate() {
    setZoomImageWheelState({
      currentRotation: zoomImageWheelState_value.currentRotation + 90,
    })

    if (croppedImage) {
      handleCropImage()
    }
  }
</script>

<div class="p-4 font-sans">
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
    <div class="space-y-4">
      <p>Current zoom: {`${Math.round(zoomImageWheelState_value.currentZoom * 100)}%`}</p>
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
          on:click={() => {
            setZoomImageWheelState({
              currentZoom: zoomImageWheelState_value.currentZoom + 0.5,
            })
          }}
          class="text-dark-500 rounded bg-gray-100 p-2 text-sm font-medium"
        >
          Zoom in
        </button>
        <button
          on:click={() => {
            setZoomImageWheelState({
              currentZoom: zoomImageWheelState_value.currentZoom - 0.5,
            })
          }}
          class="text-dark-500 rounded bg-gray-100 p-2 text-sm font-medium"
        >
          Zoom out
        </button>
        <button class="text-dark-500 rounded bg-gray-100 p-2 text-sm font-medium" on:click={handleCropImage}>
          Crop image
        </button>
        <button on:click={rotate} class="text-dark-500 rounded bg-gray-100 p-2 text-sm font-medium">Rotate</button>
      </div>
    </div>
  {/if}

  {#if zoomType === "hover"}
    <div bind:this={imageHoverContainer} class="relative flex h-[300px] w-[200px] items-start">
      <img class="h-full w-full" alt="Small Pic" src="/sample.avif" />
      <div bind:this={zoomTarget} class="absolute left-[350px]" />
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
