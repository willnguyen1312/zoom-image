<script lang="ts">
  import { onDestroy, onMount } from "svelte"
  import { createZoomImageHover } from "@zoom-image/core"

  let cleanup: (() => void) | undefined
  let imageContainer: HTMLDivElement
  let zoomTarget: HTMLDivElement

  onMount(() => {
    const result = createZoomImageHover(imageContainer, {
      zoomImageSource: "/large.webp",
      customZoom: { width: 820, height: 820 },
      zoomTarget,
      scaleFactor: 0.5,
    })

    cleanup = result.cleanup
  })

  onDestroy(() => {
    cleanup?.()
  })
</script>

<main>
  <div class="wrapper">
    <h1>Zoom Image Hover</h1>
    <div class="demo-image-hover">
      <div id="image-hover-container" class="image-hover-container" bind:this={imageContainer}>
        <img class="image-hover" alt="Small Pic" src="/small.webp" />
      </div>
      <div id="zoom-hover-target" class="zoom-hover-target" bind:this={zoomTarget} />
    </div>
  </div>
</main>

<style>
  .wrapper {
    padding: 16px;
  }

  .demo-image-hover {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: start;
  }

  .image-hover-container {
    position: relative;
    margin-right: 10px;
    width: 416px;
    height: 416px;
  }

  .image-hover {
    width: 100%;
    height: 100%;
  }

  .zoom-hover-target {
    position: absolute;
    display: block;
    left: 500px;
  }
</style>
