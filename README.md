# Zoom Image

A little library to zoom image on hover. It is typical experience on e-commerce sites. Examples are written with Preact,
React, Svelte, Vanilla JS and Vue.

## Demo

![Demo](./demo.gif)

## Table of Contents

- [Usage](#usage)
- [API](#api)
- [Architecture](#architecture)
- [Development](#development)
- [Commands](#commands)
  - [With Preact](#with-preact)
  - [With React](#with-react)
  - [With Svelte](#with-svelte)
  - [With Vanilla JS](#with-vanilla-js)
  - [With Vue](#with-vue)

## Usage

### With Vanilla TS

```html
<div id="image-container" class="image-container">
  <img class="image" alt="Small Pic" src="/small.webp" />
</div>
```

```css
.image-container {
  /* This is important as the zoomed area will be positioned absolute as a child of image container */
  position: relative;
  /* Can be arbitrary value */
  width: 321px;
  /* Can be arbitrary value */
  height: 321px;
}

/* It's best to keep image sizes according to image container. Since img tag cannot have children. We need an extra container to achieve UI composition for zooming purpose */
.image {
  width: 100%;
  height: 100%;
}
```

```js
import { createZoomImage } from "@zoom-image/core"

const imageContainer = document.getElementById("image-container")
const cleanup = createZoomImage(imageContainer)

// Cleanup when you don't need it anymore
```

### With React

```tsx
import React from "react"
import { ZoomImage } from "@zoom-image/react"
import "./styles.css"

function ZoomImageComponent() {
  const imageContainerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const cleanup = createZoomImage(imageContainer)

    return cleanup
  }, [])

  return (
    <div ref={imageContainerRef} class="image-container">
      <img class="image" alt="Small Pic" src="/small.webp" />
    </div>
  )
}
```

```css
.image-container {
  /* This is important as the zoomed area will be positioned absolute as a child of image container */
  position: relative;
  /* Can be arbitrary value */
  width: 321px;
  /* Can be arbitrary value */
  height: 321px;
}

/* It's best to keep image sizes according to image container. Since img tag cannot have children. We need an extra container to achieve UI composition for zooming purpose */
.image {
  width: 100%;
  height: 100%;
}
```

## API

### createZoomImage(container: HTMLElement, options)

The only required parameter is `container`. It is the container of the image. The image will be zoomed when you hover.
By default, the zoomed image will be the same as the original image and placed as direct child of container next to the
original image on the right. You can customize it by passing optional `options` object as documented below.

| Name            |                              Type |                                                                                                                  Note |
| --------------- | --------------------------------: | --------------------------------------------------------------------------------------------------------------------: |
| customZoom      | { width: number; height: number } |                                                        The size of zoomed window where zoomed image will be displayed |
| zoomImageSource |                            string |                                                                                            The source of zoomed image |
| zoomLensClass   |                            string |                                                                      The css class will be added to zoom lens element |
| zoomImageClass  |                            string |                                                                   The css class will be added to zoomed image element |
| zoomTarget      |                       HTMLElement |                                                                                         The container of zoomed image |
| scaleFactor     |                            number | By default, zoomed image will have a scale of 1. The smaller the value, the bigger zoomed image and smaller zoom lens |

## Architecture

![Diagram](./Zoom%20Image%20Diagram.png)

## Development

```bash
git clone https://github.com/willnguyen1312/zoom-image
cd zoom-image
pnpm install
```

## Commands

### With Preact

```bash
pnpm start-preact
```

### With React

```bash
pnpm start-react
```

### With Svelte

```bash
pnpm start-svelte
```

### With Vanilla JS

```bash
pnpm start-vanilla
```

### With Vue

```bash
pnpm start-vue
```

## License

MIT © [Nam Nguyen](https://namnguyen.design)
