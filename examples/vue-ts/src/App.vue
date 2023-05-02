<script setup lang="ts">
import { createZoomImageHover } from "@zoom-image/core"
import { onMounted, onUnmounted, ref } from "vue"

const imageContainerRef = ref<HTMLElement>()
const zoomTargetRef = ref<HTMLElement>()

let cleanup: (() => void) | undefined

onMounted(() => {
  if (imageContainerRef.value) {
    const imageContainer = imageContainerRef.value
    const zoomTarget = zoomTargetRef.value

    cleanup = createZoomImageHover(imageContainer, {
      zoomImageSource: "/large.webp",
      customZoom: { width: 820, height: 820 },
      zoomTarget,
      scaleFactor: 0.5,
    })
  }
})

onUnmounted(() => {
  cleanup?.()
})
</script>

<template>
  <div :class="$style.wrapper">
    <h1>Zoom Image</h1>
    <div :class="$style.demo">
      <div ref="imageContainerRef" id="image-container" :class="$style.imageContainer">
        <img :class="$style.image" alt="Small Pic" src="/small.webp" />
      </div>
      <div ref="zoomTargetRef" id="zoom-target" :class="$style.zoomTarget"></div>
    </div>
  </div>
</template>

<style module>
.wrapper {
  padding: 16px;
}

.demo {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: start;
}

.imageContainer {
  position: relative;
  margin-right: 10px;
  width: 416px;
  height: 416px;
}

.image {
  width: 100%;
  height: 100%;
}

.zoomTarget {
  position: absolute;
  left: 500px;
}
</style>
