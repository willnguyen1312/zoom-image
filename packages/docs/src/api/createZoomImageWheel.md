<script setup>
import BundleSize from '../components/BundleSize.vue'
</script>

## `createZoomImageWheel` - <BundleSize func="createZoomImageWheel" pkg="@zoom-image/core" />

### Basic Usage

```ts
const { cleanup } = createZoomImageWheel(container)

// Call cleanup when you don't need it anymore
cleanup()
```

### Type Declaration

```ts
type ZoomImageWheelState = {
  currentZoom: number
  enable: boolean
  currentPositionX: number
  currentPositionY: number
  // rotation in degree - https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/rotate
  // Supported values: 0, 90, 180, 270
  currentRotation: number
}

type Listener = (state: ZoomImageWheelState) => void
type ZoomImageWheelStateUpdate = {
  enable: boolean
  currentRotation: number
  currentZoom: number
  zoomTarget: HTMLElement | null
}

type ZoomImageWheelOptions = {
  // Maximum zoom scale, default is 4
  maxZoom?: number

  // Zoom ratio when scrolling, default is 0.1
  wheelZoomRatio?: number

  // Animation duration for zooming on double tap, default is 300 ms
  dblTapAnimationDuration?: number

  // Partial or full initial state
  // useful for storing previous zoomed state and re-initialize it on load
  initialState?: Partial<ZoomImageWheelState>

  // Predicate function to determine if zoom should be triggered on a single touch action
  shouldZoomOnSingleTouch?: () => boolean

  // Zoom target element, default is the closest image element inside a container
  zoomTarget?: HTMLElement | null
}

function createZoomImageWheel(
  container: HTMLElement,
  options?: ZoomImageWheelOptions,
): {
  // Remove all event listeners
  cleanup: () => void

  // Subscribe to state changes, returns a function to unsubscribe
  subscribe: (listener: Listener) => () => void

  // Update current state
  setState(value: ZoomImageWheelStateUpdate): void

  // Get current state
  getState: () => ZoomImageWheelState
}
```
