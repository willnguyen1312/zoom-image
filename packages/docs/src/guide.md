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
<script src="https://unpkg.com/@zoom-image/core"></script>
```

It will be exposed to global as `window.ZoomImage`

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
  width: 100%;
  height: 100%;
}
```

```js
import { createZoomImageWheel } from "@zoom-image/core"

const container = document.getElementById("container")
createZoomImageWheel(container)
```

Refer to [Core API section](/api/) for more details

## Example with React Adapter

Simply importing the utilities you need from `@zoom-image/react`

```css
/* styles.css */
.imageContainer {
  width: var(--imageContainerWidth);
  height: var(--imageContainerHeight);
}

.image {
  width: 100%;
  height: 100%;
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
    const container = containerRef.current
    createZoomImage(container)
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
  width: 100%;
  height: 100%;
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
    const container = containerRef.current
    createZoomImage(container)
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
  width: 100%;
  height: 100%;
}
```

```tsx
import "style.css"
import { useSignal } from "@builder.io/qwik"
import { useZoomImageWheel } from "@zoom-image/qwik"

function App() {
  const containerRef = useSignal<HTMLDivElement>()
  const { createZoomImage } = useZoomImageWheel()

  useEffect(() => {
    const container = containerRef.value
    createZoomImage(container)
  }, [])

  return (
    <div class="imageContainer" ref={containerRef}>
      <img class="image" alt="Large Pic" src="/image.webp" />
    </div>
  )
}
```

Refer to [Qwik Adapter section](/api/adapters/qwik) for more details

## Example with Solid Adapter

Simply importing the utilities you need from `@zoom-image/qwik`

```css
/* styles.css */
.imageContainer {
  width: var(--imageContainerWidth);
  height: var(--imageContainerHeight);
}

.image {
  width: 100%;
  height: 100%;
}
```

```tsx
import "style.css"
import { useZoomImageWheel } from "@zoom-image/solid"

function App() {
  let container: HTMLDivElement
  const { createZoomImage } = useZoomImageWheel()

  useEffect(() => {
    createZoomImage(container)
  }, [])

  return (
    <div class="imageContainer" ref={container}>
      <img class="image" alt="Large Pic" src="/image.webp" />
    </div>
  )
}
```

Refer to [Solid Adapter section](/api/adapters/solid) for more details

## Demos

- [Vanilla JS](/examples/vanilla)
- [Vue](/examples/vue)
- [React](/examples/react)
- [Preact](/examples/preact)
- [Svelte](/examples/svelte)
- [Solid](/examples/solid)
- [Qwik](/examples/qwik)
