import { createStore, imageCache } from "./store"
import { ZoomedImgStatus } from "./types"
import { enableScroll, disableScroll, clamp, getSourceImage } from "./utils"

export type ZoomImageHoverOptions = {
  customZoom?: { width: number; height: number }
  zoomImageSource?: string
  zoomLensClass?: string
  zoomTarget?: HTMLElement
  scaleFactor?: number
}

export type ZoomImageHoverState = {
  zoomedImgStatus: ZoomedImgStatus
  enabled: boolean
}

type StateUpdate = { enabled: boolean }

type RequiredExcept<T, K extends keyof T> = Omit<Required<T>, K> & {
  [P in K]?: T[P]
}

export function createZoomImageHover(container: HTMLElement, options: ZoomImageHoverOptions = {}) {
  const sourceImgElement = getSourceImage(container)
  const zoomedImgWrapper = document.createElement("div")
  zoomedImgWrapper.style.overflow = "hidden"
  const zoomedImg = zoomedImgWrapper.appendChild(document.createElement("img"))
  zoomedImg.style.maxWidth = "none"
  const zoomLens = container.appendChild(document.createElement("div"))

  const finalOptions: RequiredExcept<ZoomImageHoverOptions, "zoomTarget" | "customZoom"> = {
    zoomImageSource: options.zoomImageSource || sourceImgElement.src,
    zoomLensClass: options.zoomLensClass || "",
    customZoom: options.customZoom,
    scaleFactor: options.scaleFactor || 1,
    zoomTarget: options.zoomTarget,
  }

  const store = createStore<ZoomImageHoverState>({
    zoomedImgStatus: imageCache.checkImageLoaded(finalOptions.zoomImageSource) ? "loaded" : "idle",
    enabled: true,
  })

  let scaleX: number
  let scaleY: number
  let offset: { left: number; top: number }

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

  function setZoomedImgSize() {
    // Custom zoom available
    if (finalOptions.customZoom) {
      zoomedImgWrapper.style.width = finalOptions.customZoom.width + "px"
      zoomedImgWrapper.style.height = finalOptions.customZoom.height + "px"
      return
    }

    // Default zoom to source image size
    zoomedImgWrapper.style.width = sourceImgElement.width + "px"
    zoomedImgWrapper.style.height = sourceImgElement.height + "px"
  }

  function onSourceImageReady() {
    setZoomedImgSize()
    offset = getOffset(sourceImgElement)
    // Calculate scale and offset
    scaleX = sourceImgElement.naturalWidth / sourceImgElement.width
    scaleY = sourceImgElement.naturalHeight / sourceImgElement.height

    zoomedImg.style.display = "block"
    zoomedImg.style.display = "none"

    // Setup default zoom lens style
    zoomLens.style.position = "absolute"

    if (!finalOptions.zoomLensClass) {
      zoomLens.style.background = "rgba(238, 130, 238, 0.5)"
    }

    if (finalOptions.customZoom) {
      zoomLens.style.width =
        (finalOptions.customZoom.width / scaleX) * finalOptions.scaleFactor + "px"
      zoomLens.style.height =
        (finalOptions.customZoom.height / scaleY) * finalOptions.scaleFactor + "px"
      return
    }

    zoomLens.style.width = sourceImgElement.clientWidth / scaleX + "px"
    zoomLens.style.height = sourceImgElement.clientHeight / scaleY + "px"
  }

  function setup() {
    zoomLens.style.display = "none"

    if (finalOptions.zoomLensClass) {
      zoomLens.classList.add(finalOptions.zoomLensClass)
    }

    // setup event listeners
    container.addEventListener("pointerdown", processZoom)
    container.addEventListener("pointermove", processZoom)
    container.addEventListener("pointerenter", handlePointerEnter)
    container.addEventListener("pointerleave", handlePointerLeave)
    window.addEventListener("scroll", handleScroll)

    // Setup zoomed image position if zoom target is specified
    if (finalOptions.zoomTarget) {
      finalOptions.zoomTarget.appendChild(zoomedImgWrapper)
      return
    }

    container.appendChild(zoomedImgWrapper)
    zoomedImg.style.position = "absolute"
    zoomedImg.style.top = "0px"
    zoomedImg.style.right = "0px"
    zoomedImg.style.transform = "translateX(100%)"
  }

  function processZoom(event: PointerEvent) {
    let offsetX: number
    let offsetY: number
    let backgroundTop: number
    let backgroundRight: number
    // let backgroundPosition: string
    if (offset) {
      offsetX = zoomLensLeft(event.clientX - offset.left)
      offsetY = zoomLensTop(event.clientY - offset.top)
      backgroundTop = (offsetX * scaleX) / finalOptions.scaleFactor
      backgroundRight = (offsetY * scaleY) / finalOptions.scaleFactor
      zoomedImg.style.transform = "translate(" + -backgroundTop + "px," + -backgroundRight + "px)"
      zoomLens.style.cssText +=
        "transform:" + "translate(" + offsetX + "px," + offsetY + "px); top: 0; left: 0;"
    }
  }

  async function handlePointerEnter() {
    imageCache.createZoomImage({
      img: zoomedImg,
      src: finalOptions.zoomImageSource,
      store,
    })

    disableScroll()
    zoomedImg.style.display = "block"
    zoomLens.style.display = "block"
  }

  function handlePointerLeave() {
    enableScroll()
    zoomedImg.style.display = "none"
    zoomLens.style.display = "none"
  }

  function handleScroll() {
    offset = getOffset(sourceImgElement)
  }

  if (sourceImgElement.complete) {
    onSourceImageReady()
  } else {
    sourceImgElement.onload = onSourceImageReady
  }

  setup()

  return {
    cleanup: () => {
      container.removeEventListener("pointermove", processZoom)
      container.removeEventListener("pointerdown", processZoom)
      container.removeEventListener("pointerenter", handlePointerEnter)
      container.removeEventListener("pointerleave", handlePointerLeave)
      window.removeEventListener("scroll", handleScroll)
      container.removeChild(zoomLens)

      if (finalOptions.zoomTarget) {
        finalOptions.zoomTarget.removeChild(zoomedImgWrapper)
        return
      }

      container.removeChild(zoomedImgWrapper)
    },
    subscribe: store.subscribe,
    getState: store.getState,
    update: (newState: StateUpdate) => {
      store.update(newState)
    },
  }
}
