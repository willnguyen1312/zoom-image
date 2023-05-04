# With zoomOnWheel

### Basic Usage

```ts
const { cleanup } = createZoomImageWheel(container)

// Call cleanup when you don't need it anymore
cleanup()
```

### Type Declaration

```ts
type ZoomImageWheelProps = {
  // Maximum zoom scale, default is 4
  maxZoom?: number
  // Zoom ratio when scrolling, default is 0.1
  wheelZoomRatio?: number
}

function createZoomImageWheel(
  container: HTMLElement,
  options?: ZoomImageWheelProps,
): {
  cleanup: () => void
}
```
