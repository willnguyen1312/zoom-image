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
  currentRotation: number
}

type Listener = (state: ZoomImageWheelState) => void
type ZoomImageWheelStateUpdate = { currentZoom: number; enabled: boolean; currentRotation: number }

type ZoomImageWheelOptions = {
  // Maximum zoom scale, default is 4
  maxZoom?: number

  // Zoom ratio when scrolling, default is 0.1
  wheelZoomRatio?: number

  // Animation duration for zooming on double tap, default is 300 ms
  dblTapAnimationDuration?: number
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
