# With zoomOnHover

### Basic Usage

```ts
const { cleanup } = createZoomImageHover(container)

// Call cleanup when you don't need it anymore
cleanup()
```

### Type Declaration

```ts
type ZoomImageHoverOptions = {
  // The size of zoomed window where zoomed image will be displayed
  customZoom?: { width: number; height: number }
  // The source of zoomed image
  zoomImageSource?: string
  // The css class will be added to zoom lens element
  zoomLensClass?: string
  // The css class will be added to zoomed image element
  zoomImageClass?: string
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
  cleanup: () => void
}
```
