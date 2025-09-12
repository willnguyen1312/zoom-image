<script setup lang="ts">
import { cropImage } from "@zoom-image/core"
import { useZoomImageClick, useZoomImageHover, useZoomImageMove, useZoomImageWheel } from "@zoom-image/vue"
import { computed, nextTick, ref, onMounted } from "vue"

type TabValue = "wheel" | "hover" | "move" | "click"
type Tab = { name: string; href: string; current: boolean; value: TabValue }
const tabs = ref<Tab[]>([
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

const handleTabClick = (tab: Tab) => {
  tabs.value.forEach((tab) => {
    tab.current = false
  })
  tab.current = true
  processZoom(tab.value)
}

const handleCropWheelZoomImage = async () => {
  croppedImage.value = await cropImage({
    currentZoom: zoomImageWheelState.currentZoom,
    image: (imageWheelContainerRef.value as HTMLDivElement).querySelector("img") as HTMLImageElement,
    positionX: zoomImageWheelState.currentPositionX,
    positionY: zoomImageWheelState.currentPositionY,
    rotation: zoomImageWheelState.currentRotation,
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

const rotate = () => {
  setZoomImageWheelState({
    currentRotation: zoomImageWheelState.currentRotation + 90,
  })

  if (croppedImage.value) {
    handleCropWheelZoomImage()
  }
}

const croppedImageClasses = computed(() => {
  if (zoomImageWheelState.currentRotation % 180 === 90) {
    return "h-[200px] w-[300px]"
  } else {
    return "h-[300px] w-[200px]"
  }
})

const processZoom = async (zoomType: TabValue) => {
  croppedImage.value = ""
  await nextTick()

  if (zoomType === "hover") {
    createZoomImageHover(imageHoverContainerRef.value as HTMLDivElement, {
      zoomImageSource: "/sample.avif",
      customZoom: { width: 300, height: 500 },
      zoomTarget: zoomTargetRef.value as HTMLDivElement,
      scale: 2,
    })
  }

  if (zoomType === "wheel") {
    createZoomImageWheel(imageWheelContainerRef.value as HTMLDivElement)
  }

  if (zoomType === "move") {
    createZoomImageMove(imageMoveContainerRef.value as HTMLDivElement, {
      zoomImageSource: "/sample.avif",
    })
  }

  if (zoomType === "click") {
    createZoomImageClick(imageClickContainerRef.value as HTMLDivElement, {
      zoomImageSource: "/sample.avif",
    })
  }
}

onMounted(() => processZoom(zoomType.value))
</script>

<template>
  <div class="p-4 font-sans">
    <nav class="flex space-x-4 pb-4" aria-label="Tabs">
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

      <p>Current zoom: {{ `${Math.round(zoomImageWheelState.currentZoom * 100)}%` }}</p>

      <div class="flex items-center gap-4">
        <div class="mt-1 grid h-[300px] w-[300px] place-content-center bg-black">
          <div ref="imageWheelContainerRef" class="h-[300px] w-[200px] cursor-crosshair duration-500">
            <img class="h-full w-full" alt="Large Pic" src="/sample.avif" />
          </div>
        </div>
        <img :src="croppedImage" v-if="!!croppedImage" :class="croppedImageClasses" alt="Cropped placeholder" />
      </div>

      <div class="flex space-x-2">
        <button @click="zoomIn" class="text-dark-500 rounded bg-gray-100 p-2 text-sm font-medium">Zoom in</button>
        <button @click="zoomOut" class="text-dark-500 rounded bg-gray-100 p-2 text-sm font-medium">Zoom out</button>
        <button class="text-dark-500 rounded bg-gray-100 p-2 text-sm font-medium" @click="handleCropWheelZoomImage">
          Crop image
        </button>
        <button @click="rotate" class="text-dark-500 rounded bg-gray-100 p-2 text-sm font-medium">Rotate</button>
      </div>
    </div>

    <div class="space-y-4" v-if="zoomType === 'hover'">
      <p>Hover inside the image to see zoom effect</p>

      <div ref="imageHoverContainerRef" class="relative mt-1 flex h-[300px] w-[200px] items-start">
        <img class="h-full w-full" alt="Small Pic" src="/sample.avif" />
        <div ref="zoomTargetRef" class="absolute left-[350px]"></div>
      </div>
    </div>

    <div class="space-y-4" v-if="zoomType === 'move'">
      <p>Move mouse inside the image to see zoom effect</p>

      <div ref="imageMoveContainerRef" class="relative mt-1 h-[300px] w-[200px] cursor-crosshair overflow-hidden">
        <img class="h-full w-full" alt="Large Pic" src="/sample.avif" />
      </div>
    </div>

    <div class="space-y-4" v-if="zoomType === 'click'">
      <p>Click inside the image to see zoom effect</p>

      <div ref="imageClickContainerRef" class="relative mt-1 h-[300px] w-[200px] cursor-crosshair overflow-hidden">
        <img class="h-full w-full" alt="Large Pic" src="/sample.avif" />
      </div>
    </div>
  </div>
</template>
