# createZoomImageWheel

Calculate the current zoom level based on the percentage

### Basic Usage

```ts
const calculateZoom = makeCalculateZoom(percentage)
const currentZoom = calculateZoom(currentZoom)
```

### Type Declaration

```ts
function makeCalculateZoom = (maxZoom: number) => {
  return (percentage: number) => number
}
```
