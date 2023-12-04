# Get Started

Zoom Image is a small collection of utilities for zooming image on the web. It is written in pure TypeScript and has no
dependencies. The library is built with framework agnostic in mind, so it can be used with any framework adapters or
even without

## Installation

::: code-group

```sh [pnpm]
$ pnpm add @zoom-image/core
```

```sh [npm]
$ npm install @zoom-image/core
```

```sh [yarn]
$ yarn add @zoom-image/core
```

:::

### CDN

```html
<script src="https://unpkg.com/@zoom-image/core"></script>
```

Everything will be exposed to global as `window.ZoomImage`

## Example with Vanilla JS

Simply importing the utilities you need from `@zoom-image/core`

```html
<div id="container" class="imageContainer">
  <img class="image" alt="Large Pic" src="/image.webp" />
</div>
```

```css
.imageContainer {
  width: var(--imageContainerWidth);
  height: var(--imageContainerHeight);
}

.image {
  max-width: 100%;
  max-height: 100%;
}
```

```js
import { createZoomImageWheel } from "@zoom-image/core"

const container = document.getElementById("container")
createZoomImageWheel(container)
```

Refer to [Core API section](/api/) for more details

## Example with Angular Adapter

Simply importing the utilities you need from `@zoom-image/angular`

```html
<!-- custom.component.html -->
<div #imageWheelContainer class="imageContainer">
  <img class="image" alt="Large Pic" src="/image.webp" />
</div>
```

```css
/* custom.component.css */
.imageContainer {
  width: var(--imageContainerWidth);
  height: var(--imageContainerHeight);
}

.image {
  max-width: 100%;
  max-height: 100%;
}
```

```ts
import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core"
import { ZoomImageWheelState } from "@zoom-image/core"

@Component({
  selector: "custom-component",
  templateUrl: "./custom.component.html",
  styleUrls: ["./custom.component.css"],
  providers: [ZoomImageWheelService],
})
export class AppComponent implements AfterViewInit {
  @ViewChild("imageWheelContainer") imageWheelContainerRef?: ElementRef<HTMLDivElement>

  constructor(private zoomImageWheelService: ZoomImageWheelService) {}

  ngAfterViewInit(): void {
    if (this.imageWheelContainerRef) {
      this.zoomImageWheelService.createZoomImage(this.imageWheelContainerRef.nativeElement)
    }
  }
}
```

Refer to [Angular Adapter section](/api/adapters/angular) for more details

## Example with React Adapter

Simply importing the utilities you need from `@zoom-image/react`

```css
/* styles.css */
.imageContainer {
  width: var(--imageContainerWidth);
  height: var(--imageContainerHeight);
}

.image {
  max-width: 100%;
  max-height: 100%;
}
```

```tsx
import "style.css"
import { useRef, useEffect } from "react"
import { useZoomImageWheel } from "@zoom-image/react"

function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { createZoomImage } = useZoomImageWheel()

  useEffect(() => {
    createZoomImage(containerRef.value)
  }, [])

  return (
    <div className="imageContainer" ref={containerRef}>
      <img className="image" alt="Large Pic" src="/image.webp" />
    </div>
  )
}
```

Refer to [React Adapter section](/api/adapters/react) for more details

## Example with Preact Adapter

Simply importing the utilities you need from `@zoom-image/preact`

```css
/* styles.css */
.imageContainer {
  width: var(--imageContainerWidth);
  height: var(--imageContainerHeight);
}

.image {
  max-width: 100%;
  max-height: 100%;
}
```

```tsx
import "style.css"
import { useRef, useEffect } from "preact/hooks"
import { useZoomImageWheel } from "@zoom-image/preact"

function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { createZoomImage } = useZoomImageWheel()

  useEffect(() => {
    createZoomImage(containerRef.value)
  }, [])

  return (
    <div class="imageContainer" ref={containerRef}>
      <img class="image" alt="Large Pic" src="/image.webp" />
    </div>
  )
}
```

Refer to [Preact Adapter section](/api/adapters/preact) for more details

## Example with Qwik Adapter

Simply importing the utilities you need from `@zoom-image/qwik`

```css
/* styles.css */
.imageContainer {
  width: var(--imageContainerWidth);
  height: var(--imageContainerHeight);
}

.image {
  max-width: 100%;
  max-height: 100%;
}
```

```tsx
import "style.css"
import { useSignal, useVisibleTask$ } from "@builder.io/qwik"
import { useZoomImageWheel } from "@zoom-image/qwik"

function App() {
  const containerRef = useSignal<HTMLDivElement>()
  const { createZoomImage } = useZoomImageWheel()

  useVisibleTask$(() => {
    createZoomImage(containerRef.value)
  })

  return (
    <div class="imageContainer" ref={containerRef}>
      <img class="image" alt="Large Pic" src="/image.webp" />
    </div>
  )
}
```

Refer to [Qwik Adapter section](/api/adapters/qwik) for more details

## Example with Solid Adapter

Simply importing the utilities you need from `@zoom-image/solid`

```css
/* styles.css */
.imageContainer {
  width: var(--imageContainerWidth);
  height: var(--imageContainerHeight);
}

.image {
  max-width: 100%;
  max-height: 100%;
}
```

```tsx
import "style.css"
import { useZoomImageWheel } from "@zoom-image/solid"

function App() {
  let container: HTMLDivElement
  const { createZoomImage } = useZoomImageWheel()

  onMount(() => {
    createZoomImage(container)
  })

  return (
    <div class="imageContainer" ref={container}>
      <img class="image" alt="Large Pic" src="/image.webp" />
    </div>
  )
}
```

Refer to [Solid Adapter section](/api/adapters/solid) for more details

## Example with Svelte Adapter

Simply importing the utilities you need from `@zoom-image/svelte`

```svelte
<script lang="ts">
  import { onMount } from "svelte"
  import { useZoomImageWheel } from "@zoom-image/svelte"

  let container: HTMLDivElement
  const { createZoomImage } = useZoomImageWheel()

  onMount(() => {
    createZoomImage(container)
  })
</script>

<div class="imageContainer" bind:this={container}>
  <img class="image" alt="Large Pic" src="/image.webp" />
</div>

<style>
  .imageContainer {
    width: var(--imageContainerWidth);
    height: var(--imageContainerHeight);
  }

  .image {
    max-width: 100%;
    max-height: 100%;
  }
</style>
```

Refer to [Svelte Adapter section](/api/adapters/svelte) for more details

## Example with Vue Adapter

Simply importing the utilities you need from `@zoom-image/vue`

```vue
<script lang="ts" setup>
import { onMounted } from "vue"
import { useZoomImageWheel } from "@zoom-image/vue"

const imageWheelContainerRef = ref<HTMLDivElement>()
const { createZoomImage } = useZoomImageWheel()

onMounted(() => {
  createZoomImage(imageWheelContainerRef.value)
})
</script>

<template>
  <div class="imageContainer" ref="imageWheelContainerRef">
    <img class="image" alt="Large Pic" src="/image.webp" />
  </div>
</template>

<style>
.imageContainer {
  width: var(--imageContainerWidth);
  height: var(--imageContainerHeight);
}

.image {
  max-width: 100%;
  max-height: 100%;
}
</style>
```

Refer to [Svelte Adapter section](/api/adapters/vue) for more details

## Demos

- [Vanilla JS](/examples/vanilla)
- [Angular](/examples/angular)
- [React](/examples/react)
- [Preact](/examples/preact)
- [Next](/examples/next)
- [Remix](/examples/remix)
- [Qwik](/examples/qwik)
- [Solid](/examples/solid)
- [Svelte](/examples/svelte)
- [Vue](/examples/vue)
