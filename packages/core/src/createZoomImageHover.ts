import { createStore } from "@namnode/store"
import { imageLoader } from "./imageLoader"
import { ZoomedImgStatus } from "./types"
import { clamp, disableScroll, enableScroll, getSourceImage } from "./utils"

export type ZoomImageHoverOptions = {
  customZoom: { width: number; height: number }
  zoomImageSource?: string
  zoomLensClass?: string
  zoomLensScale?: number
  zoomTarget: HTMLElement
  zoomTargetClass?: string
  scale?: number
  disableScrollLock?: boolean
}

export type ZoomImageHoverState = {
  zoomedImgStatus: ZoomedImgStatus
  enabled: boolean
}

export type ZoomImageHoverStateUpdate = { enabled: boolean }

export function createZoomImageHover(container: HTMLElement, options: ZoomImageHoverOptions) {
  const controller = new AbortController()
  const { signal } = controller
  const sourceImgElement = getSourceImage(container)
  const zoomedImgWrapper = document.createElement("div")
  zoomedImgWrapper.style.overflow = "hidden"
  const zoomedImg = zoomedImgWrapper.appendChild(document.createElement("img"))
  zoomedImg.style.maxWidth = "none"
  zoomedImg.style.display = "none"
  const zoomLens = container.appendChild(document.createElement("div"))
  zoomLens.style.display = "none"

  const finalOptions: Required<ZoomImageHoverOptions> = {
    zoomImageSource: options.zoomImageSource || sourceImgElement.src,
    zoomLensClass: options.zoomLensClass || "",
    zoomTargetClass: options.zoomTargetClass || "",
    customZoom: options.customZoom,
    scale: options.scale || 2,
    zoomTarget: options.zoomTarget,
    zoomLensScale: options.zoomLensScale || 1,
    disableScrollLock: options.disableScrollLock || false,
  }

  const {
    scale,
    zoomImageSource,
    customZoom,
    zoomLensClass,
    zoomTarget,
    zoomLensScale,
    zoomTargetClass,
    disableScrollLock,
  } = finalOptions

  const store = createStore<ZoomImageHoverState>({
    zoomedImgStatus: "idle",
    enabled: true,
  })

  let offset: { left: number; top: number } = getOffset(sourceImgElement)

  function getOffset(element: HTMLElement) {
    const elRect = element.getBoundingClientRect()
    return { left: elRect.left, top: elRect.top }
  }

  function getLimitX(value: number) {
    return sourceImgElement.width - value
  }

  function getLimitY(value: number) {
    return sourceImgElement.height - value
  }

  function zoomLensLeft(left: number) {
    const minX = zoomLens.clientWidth / 2
    return clamp(left, minX, getLimitX(minX)) - minX
  }

  function zoomLensTop(top: number) {
    const minY = zoomLens.clientHeight / 2
    return clamp(top, minY, getLimitY(minY)) - minY
  }

  function processZoom(event: PointerEvent) {
    let offsetX: number
    let offsetY: number
    let backgroundX: number
    let backgroundY: number
    if (offset) {
      offsetX = zoomLensLeft(event.clientX - offset.left)
      offsetY = zoomLensTop(event.clientY - offset.top)
      backgroundX = (offsetX * scale) / zoomLensScale
      backgroundY = (offsetY * scale) / zoomLensScale
      zoomedImg.style.transform = "translate(" + -backgroundX + "px," + -backgroundY + "px)"
      zoomLens.style.cssText += "transform:" + "translate(" + offsetX + "px," + offsetY + "px);"
    }
  }

  async function handlePointerEnter() {
    imageLoader.createZoomImage(zoomedImg, zoomImageSource, store)
    zoomedImg.style.display = "block"
    zoomLens.style.display = "block"

    if (zoomTargetClass) {
      const classes = zoomTargetClass.split(" ")
      classes.forEach((className) => zoomTarget.classList.add(className))
    }

    if (!disableScrollLock) disableScroll()
  }

  function handlePointerLeave() {
    zoomedImg.style.display = "none"
    zoomLens.style.display = "none"

    if (zoomTargetClass) {
      const classes = zoomTargetClass.split(" ")
      classes.forEach((className) => zoomTarget.classList.remove(className))
    }

    if (!disableScrollLock) enableScroll()
  }

  function handleScroll() {
    offset = getOffset(sourceImgElement)
  }

  function setup() {
    if (zoomLensClass) {
      zoomLens.className = zoomLensClass
    } else {
      zoomLens.style.background = "rgba(238, 130, 238, 0.5)"
    }

    // setup event listeners
    container.addEventListener("pointerdown", processZoom, { signal })
    container.addEventListener("pointermove", processZoom, { signal })
    container.addEventListener("pointerenter", handlePointerEnter, { signal })
    container.addEventListener("pointerleave", handlePointerLeave, { signal })
    window.addEventListener("scroll", handleScroll, { signal })

    // Append zoomed image wrapper to zoom target
    zoomTarget.appendChild(zoomedImgWrapper)

    // Set up styles if custom zoom available
    if (customZoom) {
      zoomedImgWrapper.style.width = customZoom.width + "px"
      zoomedImgWrapper.style.height = customZoom.height + "px"
    } else {
      // Else default zoom to source image size
      zoomedImgWrapper.style.width = sourceImgElement.width + "px"
      zoomedImgWrapper.style.height = sourceImgElement.height + "px"
    }

    zoomedImg.width = (sourceImgElement.width * scale) / zoomLensScale
    zoomedImg.height = (sourceImgElement.height * scale) / zoomLensScale

    // Setup default zoom lens style
    const fromLeft = sourceImgElement.getBoundingClientRect().left - container.getBoundingClientRect().left
    const fromTop = sourceImgElement.getBoundingClientRect().top - container.getBoundingClientRect().top
    zoomTarget.style.pointerEvents = "none"
    zoomLens.style.position = "absolute"
    zoomLens.style.left = fromLeft + "px"
    zoomLens.style.top = fromTop + "px"
    zoomLens.style.width = (customZoom.width / scale) * zoomLensScale + "px"
    zoomLens.style.height = (customZoom.height / scale) * zoomLensScale + "px"
  }

  setup()

  return {
    cleanup: () => {
      controller.abort()
      container.contains(zoomLens) && container.removeChild(zoomLens)

      if (zoomTarget && zoomTarget.contains(zoomedImgWrapper)) {
        zoomTarget.removeChild(zoomedImgWrapper)
        return
      }

      container.contains(zoomedImgWrapper) && container.removeChild(zoomedImgWrapper)
    },
    subscribe: store.subscribe,
    getState: store.getState,
    setState: (newState: ZoomImageHoverStateUpdate) => {
      store.setState(newState)
    },
  }
}
