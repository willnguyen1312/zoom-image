# createZoomImageMove

### Basic Usage

```ts
const { cleanup } = createZoomImageMove(container, {
  zoomImageSource: "large-image.jpg",
})

// Call cleanup when you don't need it anymore
cleanup()
```

### Type Declaration

```ts
type ZoomImageMoveOptions = {
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
}
```
