<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from "vue"
import { createZoomImageHover, createZoomImageWheel } from "../../src"

let cleanup: () => void = () => {}

const tabs = ref<
  {
    name: string
    href: string
    current: boolean
    value: "wheel" | "hover"
  }[]
>([
  { name: "Wheel", href: "#", current: true, value: "wheel" },
  { name: "Hover", href: "#", current: false, value: "hover" },
])

const zoomType = computed(() => {
  const found = tabs.value.find((tab) => tab.current)
  return found?.value as "hover" | "wheel"
})

const imageWheelContainerRef = ref<HTMLDivElement>()
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
      const zoomTarget = zoomTargetRef.value as HTMLDivElement

      const result = createZoomImageHover(imageContainer, {
        zoomImageSource: "",
        customZoom: { width: 300, height: 500 },
        zoomTarget,
        scale: 2,
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
  <div>
    <nav aria-label="Tabs">
      <a
        v-for="tab in tabs"
        @click="handleTabClick(tab)"
        :key="tab.name"
        :href="tab.href"
        :aria-current="tab.current ? 'page' : undefined"
        >{{ tab.name }}</a
      >
    </nav>

    <div v-if="zoomType === 'wheel'" ref="imageWheelContainerRef"><img alt="Large Pic" src="" /></div>

    <div v-if="zoomType === 'hover'" ref="imageHoverContainerRef">
      <img alt="Small Pic" src="" />
      <div ref="zoomTargetRef" data-testid="zoomTarget"></div>
    </div>
  </div>
</template>
