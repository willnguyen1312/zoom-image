<script setup>
import BundleSize from '../components/BundleSize.vue'
</script>

## `makeCalculatePercentage` - <BundleSize func="makeCalculatePercentage" pkg="@zoom-image/core" />

Calculate the current percentage based on the zoom level

### Basic Usage

```ts
const calculatePercentage = makeCalculatePercentage(maxZoom)
const currentPercentage = calculatePercentage(currentZoom)
```

### Type Declaration

```ts
function makeCalculatePercentage = (maxZoom: number) => {
  return (currentZoom: number) => number
}
```
