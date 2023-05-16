<script setup lang="ts">
import {
  createZoomImageHover,
  createZoomImageWheel,
  createZoomImageMove,
  createZoomImageClick,
  cropImage,
} from "@zoom-image/core"
import { computed, nextTick, onUnmounted, ref, watch } from "vue"

let cleanup: () => void = () => {}

const tabs = ref<
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

const zoomType = computed(() => {
  const found = tabs.value.find((tab) => tab.current)
  return found?.value as "hover" | "wheel" | "move" | "click"
})

const imageWheelContainerRef = ref<HTMLDivElement>()
const imageMoveContainerRef = ref<HTMLDivElement>()
const imageHoverContainerRef = ref<HTMLDivElement>()
const imageClickContainerRef = ref<HTMLDivElement>()
const zoomTargetRef = ref<HTMLDivElement>()

const handleTabClick = (tab: { name: string; href: string; current: boolean }) => {
  tabs.value.forEach((tab) => {
    tab.current = false
  })
  tab.current = true
}

let handleCropWheelZoomImage = () => {}

watch(
  zoomType,
  async () => {
    cleanup()
    await nextTick()

    if (zoomType.value === "hover") {
      const imageContainer = imageHoverContainerRef.value as HTMLDivElement
      const zoomTarget = zoomTargetRef.value

      const result = createZoomImageHover(imageContainer, {
        zoomImageSource: "https://nam-assets.netlify.app/static/large.webp",
        customZoom: { width: 300, height: 450 },
        zoomTarget,
        scaleFactor: 0.5,
      })
      cleanup = result.cleanup
    }

    if (zoomType.value === "wheel") {
      const imageContainer = imageWheelContainerRef.value as HTMLDivElement

      const result = createZoomImageWheel(imageContainer)
      cleanup = result.cleanup

      handleCropWheelZoomImage = () => {
        const state = result.getState()
        const croppedImage = cropImage({
          container: imageContainer,
          currentZoom: state.currentZoom,
          image: imageContainer.querySelector("img") as HTMLImageElement,
          positionX: state.currentPositionX,
          positionY: state.currentPositionY,
        })
        const cropImageElement = document.getElementById("crop-image") as HTMLImageElement
        cropImageElement.src = croppedImage
        console.log(croppedImage)
      }
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
  },
  { immediate: true },
)

onUnmounted(() => {
  cleanup()
})
</script>

<template>
  <div class="hidden px-12 lg:block">
    <div class="min-h-xl m-x-auto rounded-4 container mt-4 flex flex-col bg-white p-4 font-sans text-black">
      <nav class="mb-4 flex space-x-4" aria-label="Tabs">
        <a
          v-for="tab in tabs"
          @click="handleTabClick(tab)"
          :key="tab.name"
          :href="tab.href"
          :class="[
            tab.current ? 'text-dark-700 bg-gray-100' : 'text-dark-500 hover:text-dark-700',
            'decoration-none rounded-md px-3 py-2 text-sm font-medium',
          ]"
          :aria-current="tab.current ? 'page' : undefined"
          >{{ tab.name }}</a
        >
      </nav>

      <div class="space-y-4" v-if="zoomType === 'wheel'">
        <p>Scroll / Pinch inside the image to see zoom in-out effect</p>
        <div class="mt-1 flex space-x-2">
          <div ref="imageWheelContainerRef" class="h-[300px] w-[300px] cursor-crosshair">
            <img class="h-full w-full" crossorigin="anonymous" alt="Large Pic" src="/large.webp" />
          </div>
          <img class="h-[300px] w-[300px]" id="crop-image" />
        </div>
        <button class="text-dark-500 rounded bg-gray-100 p-2 font-medium" @click="handleCropWheelZoomImage">
          Crop image
        </button>
      </div>

      <div class="space-y-4" v-if="zoomType === 'hover'">
        <p>Hover inside the image to see zoom effect</p>
        <div ref="imageHoverContainerRef" class="relative mt-1 flex h-[300px] w-[300px] items-start">
          <img class="h-full w-full" alt="Small Pic" src="https://nam-assets.netlify.app/static/small.webp" />
          <div ref="zoomTargetRef" class="absolute left-[350px]"></div>
        </div>
      </div>

      <div class="space-y-4" v-if="zoomType === 'move'">
        <p>Move mouse inside the image to see zoom effect</p>
        <div ref="imageMoveContainerRef" class="relative mt-1 h-[300px] w-[300px] cursor-crosshair overflow-hidden">
          <img class="h-full w-full" alt="Large Pic" src="https://nam-assets.netlify.app/static/small.webp" />
        </div>
      </div>

      <div class="space-y-4" v-if="zoomType === 'click'">
        <p>Click inside the image to see zoom effect</p>
        <div ref="imageClickContainerRef" class="relative mt-1 h-[300px] w-[300px] cursor-crosshair overflow-hidden">
          <img class="h-full w-full" alt="Large Pic" src="https://nam-assets.netlify.app/static/small.webp" />
        </div>
      </div>
    </div>
  </div>

  <div class="mt-4 px-6 md:px-12 lg:hidden">
    <video src="/demo.mp4" class="rounded-4" muted autoplay loop playsinline controls preload="auto" />
  </div>
</template>
