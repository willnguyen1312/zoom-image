<script setup>
import BundleSize from '../components/BundleSize.vue'
</script>

## `createZoomImageClick` - <BundleSize func="createZoomImageClick" pkg="@zoom-image/core" />

### Basic Usage

```ts
const { cleanup } = createZoomImageClick(container, {
  zoomImageSource: "large-image.webp",
})

// Call cleanup when you don't need it anymore
cleanup()
```

### Type Declaration

```ts
type Listener = (state: ZoomImageClickState) => void

type ZoomImageClickState = {
  zoomedImgStatus: ZoomedImgStatus
}

type ZoomImageClickOptions = {
  // Zoom scale, default is 4
  zoomFactor?: number

  // The source of zoomed image, default is the same as the original image
  zoomImageSource?: string
}

function createZoomImageClick(
  container: HTMLElement,
  options?: ZoomImageClickOptions,
): {
  // Remove all event listeners and zoomed image
  cleanup: () => void

  // Subscribe to state changes, returns a function to unsubscribe
  subscribe: (listener: Listener) => () => void

  // Get current state
  getState: () => ZoomImageClickState
}
```
