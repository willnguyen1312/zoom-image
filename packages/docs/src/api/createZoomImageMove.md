<script setup>
import BundleSize from '../components/BundleSize.vue'
</script>

## `createZoomImageMove` - <BundleSize func="createZoomImageMove" pkg="@zoom-image/core" />

### Basic Usage

```ts
const { cleanup } = createZoomImageMove(container, {
  zoomImageSource: "large-image.webp",
})

// Call cleanup when you don't need it anymore
cleanup()
```

### Type Declaration

```ts
type Listener = (state: ZoomImageMoveState) => void

type ZoomImageMoveState = {
  zoomedImgStatus: ZoomedImgStatus
}

type ZoomImageMoveOptions = {
  // Props for the zoomed image
  zoomImageProps?: {
    alt?: string
  }

  // Zoom scale, default is 4
  zoomFactor?: number

  // The source of zoomed image, default is the same as the original image
  zoomImageSource?: string
}

function createZoomImageMove(
  container: HTMLElement,
  options?: ZoomImageMoveOptions,
): {
  // Remove all event listeners and zoomed image
  cleanup: () => void

  // Subscribe to state changes, returns a function to unsubscribe
  subscribe: (listener: Listener) => () => void

  // Get current state
  getState: () => ZoomImageMoveState
}
```
