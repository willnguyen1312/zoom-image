<script setup>
import BundleSize from '../components/BundleSize.vue'
</script>

## `cropImage` - <BundleSize func="cropImage" pkg="@zoom-image/core" />

Crop the current image based on the zoom level

### Basic Usage

```ts
const croppedImage = await cropImage(arg: CropImageArg)
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
  // Current rotation from createZoomImageWheel - default 0
  rotation?: number
}

async function cropImage = (arg: CropImageArg) => string
```
