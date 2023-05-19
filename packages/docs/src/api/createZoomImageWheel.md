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
}

type Listener = (state: ZoomImageWheelState) => void
type StateUpdate = { currentZoom: number; enabled: boolean }

type ZoomImageWheelOptions = {
  // Maximum zoom scale, default is 4
  maxZoom?: number

  // Zoom ratio when scrolling, default is 0.1
  wheelZoomRatio?: number
}

function createZoomImageWheel(
  container: HTMLElement,
  options?: ZoomImageWheelOptions,
): {
  // Remove all event listeners
  cleanup: () => void

  // Subscribe to state changes, returns a function to unsubscribe
  subscribe: (listener: Listener) => () => void

  // Update state, can be used to enable/disable the zoom
  update(value: StateUpdate): void

  // Get current state
  getState: () => ZoomImageWheelState
}
```
