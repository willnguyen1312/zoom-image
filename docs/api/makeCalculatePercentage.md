# createZoomImageWheel

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
