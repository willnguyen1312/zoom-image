<script setup lang="ts">
import { createZoomImageHover, createZoomImageWheel, createZoomImageMove } from "@zoom-image/core"
import { computed, nextTick, onUnmounted, ref, watch } from "vue"

let cleanup: () => void = () => {}

const tabs = ref<
  {
    name: string
    href: string
    current: boolean
    value: "wheel" | "hover" | "move"
  }[]
>([
  { name: "Zoom Image Wheel", href: "#", current: true, value: "wheel" },
  { name: "Zoom Image Hover", href: "#", current: false, value: "hover" },
  { name: "Zoom Image Move", href: "#", current: false, value: "move" },
])

const zoomType = computed(() => {
  const found = tabs.value.find((tab) => tab.current)
  return found?.value as "hover" | "wheel" | "move"
})

const imageWheelContainerRef = ref<HTMLDivElement>()
const imageMoveContainerRef = ref<HTMLDivElement>()
const imageHoverContainerRef = ref<HTMLDivElement>()
const zoomTargetRef = ref<HTMLDivElement>()

const handleTabClick = (tab: { name: string; href: string; current: boolean }) => {
  tabs.value.forEach((tab) => {
    tab.current = false
  })
  tab.current = true
}

watch(
  zoomType,
  async () => {
    cleanup()
    await nextTick()

    if (zoomType.value === "hover") {
      const imageContainer = imageHoverContainerRef.value as HTMLDivElement
      const zoomTarget = zoomTargetRef.value

      const result = createZoomImageHover(imageContainer, {
        zoomImageSource: "/large.webp",
        customZoom: { width: 300, height: 500 },
        zoomTarget,
        scaleFactor: 0.5,
      })
      cleanup = result.cleanup
    }

    if (zoomType.value === "wheel") {
      const imageContainer = imageWheelContainerRef.value as HTMLDivElement

      const result = createZoomImageWheel(imageContainer)
      cleanup = result.cleanup
    }

    if (zoomType.value === "move") {
      const imageContainer = imageMoveContainerRef.value as HTMLDivElement

      const result = createZoomImageMove(imageContainer, {
        zoomImageSource: "/large.webp",
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
  <div class="font-sans">
    <nav class="flex space-x-4 pb-4" aria-label="Tabs">
      <a
        v-for="tab in tabs"
        @click="handleTabClick(tab)"
        :key="tab.name"
        :href="tab.href"
        :class="[
          tab.current ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:text-gray-700',
          'rounded-md px-3 py-2 text-sm font-medium decoration-none',
        ]"
        :aria-current="tab.current ? 'page' : undefined"
        >{{ tab.name }}</a
      >
    </nav>

    <template v-if="zoomType === 'wheel'">
      <p>Scroll inside the image to see zoom in-out effect</p>
      <div ref="imageWheelContainerRef" class="w-[300px] h-[300px] cursor-crosshair">
        <img class="w-full h-full" alt="Large Pic" src="/large.webp" />
      </div>
    </template>

    <div v-if="zoomType === 'hover'" ref="imageHoverContainerRef" class="relative flex items-start w-[250px] h-[250px]">
      <img class="w-full h-full" alt="Small Pic" src="/small.webp" />
      <div ref="zoomTargetRef" class="absolute left-[300px]"></div>
    </div>

    <div
      v-if="zoomType === 'move'"
      ref="imageMoveContainerRef"
      class="w-[300px] h-[300px] cursor-crosshair relative overflow-hidden"
    >
      <img class="w-full h-full" alt="Large Pic" src="/small.webp" />
    </div>
  </div>
</template>
