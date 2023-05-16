<script setup>
import BundleSize from '../components/BundleSize.vue'
</script>

<BundleSize func="cropImage" />

Crop the current image based on the zoom level

### Basic Usage

```ts
const croppedImage = cropImage({
  currentZoom: number
  image: HTMLImageElement
  positionX: number
  positionY: number
})
```

### Type Declaration

```ts
type CropImageArg = {
  // Zoom image element
  image: HTMLImageElement
  // Current zoom positionX returned from createZoomImageWheel
  positionX: number
  // Current zoom positionY returned from createZoomImageWheel
  positionY: number
  // Current zoom level from createZoomImageWheel
  currentZoom: number
}

function cropImage = (arg: CropImageArg) => string
```
