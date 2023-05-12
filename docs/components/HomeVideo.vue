<!-- <template>
  <div class="flex min-h-md justify-center m-x-auto mt-4 px-6 sm:px-12">
    <video class="rounded-4" muted autoplay loop playsinline>
      <source src="/demo.webm" type="video/webm" />
      <source src="/demo.mp4" type="video/mp4" />
    </video>
  </div>
</template> -->

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
        zoomImageSource: "/large.jpg",
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
    }

    if (zoomType.value === "move") {
      const imageContainer = imageMoveContainerRef.value as HTMLDivElement

      const result = createZoomImageMove(imageContainer, {
        zoomImageSource: "/large.jpg",
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
            tab.current ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:text-gray-700',
            'decoration-none rounded-md px-3 py-2 text-sm font-medium',
          ]"
          :aria-current="tab.current ? 'page' : undefined"
          >{{ tab.name }}</a
        >
      </nav>

      <div class="space-y-4" v-if="zoomType === 'wheel'">
        <p>Scroll inside the image to see zoom in-out effect</p>
        <div ref="imageWheelContainerRef" class="mt-1 h-[300px] w-[300px] cursor-crosshair">
          <img class="h-full w-full" alt="Large Pic" src="/large.jpg" />
        </div>
      </div>

      <div class="space-y-4" v-if="zoomType === 'hover'">
        <p>Hover inside the image to see zoom effect</p>
        <div ref="imageHoverContainerRef" class="relative mt-1 flex h-[300px] w-[300px] items-start">
          <img class="h-full w-full" alt="Small Pic" src="/small.jpg" />
          <div ref="zoomTargetRef" class="absolute left-[350px]"></div>
        </div>
      </div>

      <div class="space-y-4" v-if="zoomType === 'move'">
        <p>Move mouse inside the image to see zoom effect</p>
        <div ref="imageMoveContainerRef" class="relative mt-1 h-[300px] w-[300px] cursor-crosshair overflow-hidden">
          <img class="h-full w-full" alt="Large Pic" src="/small.jpg" />
        </div>
      </div>
    </div>
  </div>

  <div class="m-x-auto mt-4 flex justify-center px-6 md:px-12 lg:hidden">
    <video class="rounded-4" muted autoplay loop playsinline>
      <source src="/demo.webm" type="video/webm" />
      <source src="/demo.mp4" type="video/mp4" />
    </video>
  </div>
</template>
