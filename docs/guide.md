# Get Started

Zoom Image is a small collection of utilities for zooming image on the web. It is written in pure TypeScript and has no
dependencies. The library is built with framework agnostic in mind, so it can be used with any framework or even without

## Installation

::: code-group

```sh [npm]
$ npm install @zoom-image/core
```

```sh [pnpm]
$ pnpm add @zoom-image/core
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

## Usage Example

Simply importing the utilities you need from `@zoom-image/core`

```html
<div id="container" class="container">
  <img class="image" alt="Large Pic" src="/image.jpg" />
</div>
```

```css
.container {
  width: 300px;
  height: 300px;
  cursor: crosshair;
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

Refer to [API section](/api/) for more details.

## Demos

- [Vanilla JS](/examples/vanilla)
- [Vue](/examples/vue)
- [React](/examples/react)
- [Preact](/examples/preact)
- [Svelte](/examples/svelte)
- [Solid](/examples/solid)
- [Qwik](/examples/qwik)
