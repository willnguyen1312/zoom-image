import { createStore } from "@namnode/store"
import { imageCache } from "./store"
import { ZoomedImgStatus } from "./types"
import { disableScroll, enableScroll, getSourceImage } from "./utils"

export type ZoomImageMoveOptions = {
  zoomFactor?: number
  zoomImageSource?: string
}

export type ZoomImageMoveState = {
  zoomedImgStatus: ZoomedImgStatus
}

export function createZoomImageMove(container: HTMLElement, options: ZoomImageMoveOptions = {}) {
  const sourceImgElement = getSourceImage(container)
  const finalOptions: Required<ZoomImageMoveOptions> = {
    zoomFactor: options.zoomFactor ?? 4,
    zoomImageSource: options.zoomImageSource ?? sourceImgElement.src,
  }

  const store = createStore<ZoomImageMoveState>({
    zoomedImgStatus: imageCache.checkImageLoaded(finalOptions.zoomImageSource) ? "loaded" : "idle",
  })

  const zoomedImg = container.appendChild(document.createElement("img"))
  zoomedImg.style.maxWidth = "none"
  zoomedImg.style.position = "absolute"
  zoomedImg.style.top = "0"
  zoomedImg.style.left = "0"

  function init() {
    container.style.width = `${sourceImgElement.clientWidth}px`
    container.style.height = `${sourceImgElement.clientHeight}px`
    zoomedImg.style.display = "none"
    zoomedImg.style.transform = "none"
  }

  if (sourceImgElement.complete) {
    init()
  } else {
    sourceImgElement.onload = init
  }

  function handlePointerEnter(event: PointerEvent) {
    zoomedImg.style.display = "block"
    const zoomedImgWidth = sourceImgElement.clientWidth * finalOptions.zoomFactor
    const zoomedImgHeight = sourceImgElement.clientHeight * finalOptions.zoomFactor
    zoomedImg.style.width = `${zoomedImgWidth}px`
    zoomedImg.style.height = `${zoomedImgHeight}px`
    imageCache.createZoomImage({
      img: zoomedImg,
      src: finalOptions.zoomImageSource,
      store,
    })

    processZoom(event)
    disableScroll()
  }

  function handlePointerMove(event: PointerEvent) {
    processZoom(event)
  }

  function handlePointerLeave() {
    enableScroll()
    zoomedImg.style.display = "none"
    zoomedImg.style.transform = "none"
  }

  const calculatePositionX = (newPositionX: number) => {
    const width = container.clientWidth
    if (newPositionX > 0) return 0
    if (newPositionX + width * finalOptions.zoomFactor < width) return -width * (finalOptions.zoomFactor - 1)
    return newPositionX
  }

  const calculatePositionY = (newPositionY: number) => {
    const height = container.clientHeight
    if (newPositionY > 0) return 0
    if (newPositionY + height * finalOptions.zoomFactor < height) return -height * (finalOptions.zoomFactor - 1)
    return newPositionY
  }

  function processZoom(event: PointerEvent) {
    zoomedImg.style.display = "block"
    imageCache.createZoomImage({
      img: zoomedImg,
      src: finalOptions.zoomImageSource,
      store,
    })

    const containerRect = container.getBoundingClientRect()
    const zoomPointX = event.clientX - containerRect.left
    const zoomPointY = event.clientY - containerRect.top

    const currentPositionX = calculatePositionX(-zoomPointX * finalOptions.zoomFactor + zoomPointX)
    const currentPositionY = calculatePositionY(-zoomPointY * finalOptions.zoomFactor + zoomPointY)
    zoomedImg.style.transform = `translate(${currentPositionX}px, ${currentPositionY}px)`
  }

  const controller = new AbortController()
  const { signal } = controller
  container.addEventListener("pointerenter", handlePointerEnter, { signal })
  container.addEventListener("pointermove", handlePointerMove, { signal })
  container.addEventListener("pointerleave", handlePointerLeave, { signal })

  return {
    cleanup: () => {
      controller.abort()
      container.contains(zoomedImg) && container.removeChild(zoomedImg)
      container.style.width = "100%"
      container.style.height = "100%"
      store.cleanup()
    },
    subscribe: store.subscribe,
    getState: store.getState,
  }
}
