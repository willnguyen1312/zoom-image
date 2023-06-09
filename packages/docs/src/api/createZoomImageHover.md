<script setup>
import BundleSize from '../components/BundleSize.vue'
</script>

## `createZoomImageHover` - <BundleSize func="createZoomImageHover" pkg="@zoom-image/core" />

### Basic Usage

```ts
const { cleanup } = createZoomImageHover(container, {
  zoomImageSource: "large-image.webp",
})

// Call cleanup when you don't need it anymore
cleanup()
```

### Type Declaration

```ts
type ZoomedImgStatus = "idle" | "loading" | "loaded" | "error"

type ZoomImageHoverState = {
  zoomedImgStatus: ZoomedImgStatus
  enabled: boolean
}

type Listener = (state: ZoomImageClickState, prevState: ZoomImageClickState) => void
type StateUpdate = { enabled: boolean }

type ZoomImageHoverOptions = {
  // The size of zoomed window where zoomed image will be displayed
  customZoom?: { width: number; height: number }

  // The source of zoomed image, default is the same as the original image
  zoomImageSource?: string

  // The css class will be added to zoom lens element
  zoomLensClass?: string

  // The container of zoomed image
  zoomTarget?: HTMLElement

  // By default, zoomed image will have a scale of 1
  // The smaller the value, the bigger zoomed image and smaller zoom lens
  scaleFactor?: number
}

function createZoomImageHover(
  container: HTMLElement,
  options?: ZoomImageHoverOptions,
): {
  // Remove all event listeners, remove zoom lens and zoomed image
  cleanup: () => void

  // Subscribe to state changes, returns a function to unsubscribe
  subscribe: (listener: Listener) => () => void

  // Get current state
  getState: () => ZoomImageHoverState

  // Update state, can be used to enable/disable the zoom
  update(value: StateUpdate): void
}
```
