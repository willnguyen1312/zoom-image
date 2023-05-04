<script setup lang="ts">
import { createZoomImageHover, createZoomImageWheel } from "@zoom-image/core"
import { nextTick, onUnmounted, ref, watch } from "vue"

let cleanup: () => void = () => {}

const tabs = ref([
  { name: "Zoom Image Wheel", href: "#", current: true },
  { name: "Zoom Image Hover", href: "#", current: false },
])

const zoomType = ref<"hover" | "wheel">("wheel")

const imageWheelContainerRef = ref<HTMLElement>()
const imageHoverContainerRef = ref<HTMLElement>()
const zoomTargetRef = ref<HTMLElement>()

const handleTabClick = (tab: { name: string; href: string; current: boolean }) => {
  tabs.value.forEach((tab) => {
    tab.current = false
  })
  tab.current = true
  zoomType.value = tab.name === "Zoom Image Wheel" ? "wheel" : "hover"
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

    <div
      v-if="zoomType === 'wheel'"
      ref="imageWheelContainerRef"
      id="image-wheel-container"
      class="w-[300px] h-[300px] cursor-crosshair"
    >
      <img class="w-full h-full" alt="Large Pic" src="/large.webp" />
    </div>

    <div
      v-if="zoomType === 'hover'"
      id="image-hover-container"
      ref="imageHoverContainerRef"
      class="relative flex items-start w-[250px] h-[250px]"
    >
      <img class="w-full h-full" alt="Small Pic" src="/small.webp" />
      <div ref="zoomTargetRef" id="zoom-hover-target" class="absolute left-[300px]"></div>
    </div>
  </div>
</template>
