<script lang="ts">
  import { onDestroy, onMount } from "svelte"
  import { createZoomImage } from "@zoom-image/core"

  let cleanup: (() => void) | undefined
  let imageContainer: HTMLDivElement
  let zoomTarget: HTMLDivElement

  onMount(() => {
    cleanup = createZoomImage(imageContainer, {
      zoomImageSource: "/large.webp",
      customZoom: { width: 820, height: 820 },
      zoomTarget,
      scaleFactor: 0.5,
    })
  })

  onDestroy(() => {
    cleanup?.()
  })
</script>

<main>
  <div class="wrapper">
    <h1>Zoom Image</h1>
    <div class="demo">
      <div id="image-container" class="image-container" bind:this={imageContainer}>
        <img class="image" alt="Small Pic" src="/small.webp" />
      </div>
      <div id="zoom-target" class="zoom-target" bind:this={zoomTarget} />
    </div>
  </div>
</main>

<style>
  .wrapper {
    padding: 16px;
  }

  .demo {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: start;
  }

  .image-container {
    position: relative;
    margin-right: 10px;
    width: 416px;
    height: 416px;
  }

  .image {
    width: 100%;
    height: 100%;
  }

  .zoom-target {
    position: absolute;
    display: block;
    left: 500px;
  }
</style>
