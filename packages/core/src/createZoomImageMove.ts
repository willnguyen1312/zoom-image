import { createStore, imageCache } from "./store"
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

  const zoomedImgWidth = sourceImgElement.clientWidth * finalOptions.zoomFactor
  const zoomedImgHeight = sourceImgElement.clientHeight * finalOptions.zoomFactor
  const zoomedImg = container.appendChild(document.createElement("img"))
  zoomedImg.style.maxWidth = "none"
  zoomedImg.style.width = `${zoomedImgWidth}px`
  zoomedImg.style.height = `${zoomedImgHeight}px`
  zoomedImg.style.position = "absolute"
  zoomedImg.style.top = "0"
  zoomedImg.style.left = "0"

  function handlePointerEnter(event: PointerEvent) {
    zoomedImg.style.display = "block"
    imageCache.createZoomImage({ img: zoomedImg, src: finalOptions.zoomImageSource, store })

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
    imageCache.createZoomImage({ img: zoomedImg, src: finalOptions.zoomImageSource, store })

    const containerRect = container.getBoundingClientRect()
    const zoomPointX = event.clientX - containerRect.left
    const zoomPointY = event.clientY - containerRect.top

    const currentPositionX = calculatePositionX(-zoomPointX * finalOptions.zoomFactor + zoomPointX)
    const currentPositionY = calculatePositionY(-zoomPointY * finalOptions.zoomFactor + zoomPointY)
    zoomedImg.style.transform = `translate(${currentPositionX}px, ${currentPositionY}px)`
  }

  container.addEventListener("pointerenter", handlePointerEnter)
  container.addEventListener("pointermove", handlePointerMove)
  container.addEventListener("pointerleave", handlePointerLeave)

  return {
    cleanup: () => {
      container.removeEventListener("pointerenter", handlePointerEnter)
      container.removeEventListener("pointermove", handlePointerMove)
      container.removeEventListener("pointerleave", handlePointerLeave)
      container.removeChild(zoomedImg)
      store.cleanup()
    },
    subscribe: store.subscribe,
    getState: store.getState,
  }
}
