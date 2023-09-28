<script setup lang="ts">
import { cropImage } from "@zoom-image/core"
import { useZoomImageClick, useZoomImageHover, useZoomImageMove, useZoomImageWheel } from "@zoom-image/vue"
import { computed, nextTick, ref, watch } from "vue"

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

const croppedImage = ref<string>()
const {
  createZoomImage: createZoomImageWheel,
  zoomImageState: zoomImageWheelState,
  setZoomImageState: setZoomImageWheelState,
} = useZoomImageWheel()
const { createZoomImage: createZoomImageHover } = useZoomImageHover()
const { createZoomImage: createZoomImageMove } = useZoomImageMove()
const { createZoomImage: createZoomImageClick } = useZoomImageClick()

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

const handleCropWheelZoomImage = () => {
  croppedImage.value = cropImage({
    currentZoom: zoomImageWheelState.currentZoom,
    image: (imageWheelContainerRef.value as HTMLDivElement).querySelector("img") as HTMLImageElement,
    positionX: zoomImageWheelState.currentPositionX,
    positionY: zoomImageWheelState.currentPositionY,
  })
}
const zoomIn = () => {
  setZoomImageWheelState({
    currentZoom: zoomImageWheelState.currentZoom + 0.5,
  })
}
const zoomOut = () => {
  setZoomImageWheelState({
    currentZoom: zoomImageWheelState.currentZoom - 0.5,
  })
}

watch(
  zoomType,
  async () => {
    croppedImage.value = ""
    await nextTick()

    if (zoomType.value === "hover") {
      const isMobile = window.innerWidth < 768
      createZoomImageHover(imageHoverContainerRef.value as HTMLDivElement, {
        zoomImageSource: "https://nam-assets.netlify.app/static/large.webp",
        customZoom: isMobile ? { width: 100, height: 150 } : { width: 300, height: 450 },
        zoomTarget: zoomTargetRef.value as HTMLDivElement,
        scaleFactor: 0.5,
      })
    }

    if (zoomType.value === "wheel") {
      createZoomImageWheel(imageWheelContainerRef.value as HTMLDivElement)
    }

    if (zoomType.value === "move") {
      createZoomImageMove(imageMoveContainerRef.value as HTMLDivElement, {
        zoomImageSource: "https://nam-assets.netlify.app/static/large.webp",
      })
    }

    if (zoomType.value === "click") {
      createZoomImageClick(imageClickContainerRef.value as HTMLDivElement, {
        zoomImageSource: "https://nam-assets.netlify.app/static/large.webp",
      })
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="min-h-xl m-x-auto rounded-4 mt-4 flex flex-col bg-white p-4 font-sans text-black sm:container sm:px-12">
    <nav class="mb-4 flex space-x-4" aria-label="Tabs">
      <p
        v-for="tab in tabs"
        @click="handleTabClick(tab)"
        :key="tab.name"
        :class="[
          tab.current ? 'text-dark-700 bg-gray-100' : 'text-dark-500 hover:text-dark-700',
          'decoration-none cursor-pointer rounded-md px-3 py-2 text-sm font-medium',
        ]"
        :aria-current="tab.current ? 'page' : undefined"
      >
        {{ tab.name }}
      </p>
    </nav>

    <div class="space-y-4" v-if="zoomType === 'wheel'">
      <p>Scroll / Pinch inside the image to see zoom in-out effect</p>
      <p>Current zoom: {{ `${Math.round(zoomImageWheelState.currentZoom * 100)}%` }}</p>
      <div class="mt-1 flex w-[300px] flex-col gap-2 sm:w-auto sm:flex-row">
        <div ref="imageWheelContainerRef" class="h-[300px] w-[300px] cursor-crosshair">
          <img class="h-full w-full" crossorigin="anonymous" alt="Large Pic" src="/large.webp" />
        </div>
        <img :src="croppedImage" v-if="!!croppedImage" class="h-[300px] w-[300px]" alt="Cropped placeholder" />
      </div>
      <div class="flex space-x-2">
        <button @click="zoomIn" class="text-dark-500 rounded bg-gray-100 p-2 text-sm font-medium">Zoom in</button>
        <button @click="zoomOut" class="text-dark-500 rounded bg-gray-100 p-2 text-sm font-medium">Zoom out</button>
        <button class="text-dark-500 rounded bg-gray-100 p-2 text-sm font-medium" @click="handleCropWheelZoomImage">
          Crop image
        </button>
      </div>
    </div>

    <div class="space-y-4" v-if="zoomType === 'hover'">
      <p>Hover inside the image to see zoom effect</p>
      <div
        ref="imageHoverContainerRef"
        class="relative mt-1 flex h-[200px] w-[200px] items-start lg:h-[300px] lg:w-[300px]"
      >
        <img class="h-full w-full" alt="Small Pic" src="https://nam-assets.netlify.app/static/small.webp" />
        <div ref="zoomTargetRef" class="absolute left-[220px] lg:left-[350px]"></div>
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
</template>
