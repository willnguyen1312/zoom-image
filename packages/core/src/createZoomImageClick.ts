import { imageCache } from "./store"
import { createStore } from "@namnode/store"
import { ZoomedImgStatus } from "./types"
import { disableScroll, enableScroll, getSourceImage } from "./utils"

export type ZoomImageClickOptions = {
  zoomFactor?: number
  zoomImageSource?: string
}

export type ZoomImageClickState = {
  zoomedImgStatus: ZoomedImgStatus
}

export function createZoomImageClick(container: HTMLElement, options: ZoomImageClickOptions = {}) {
  const sourceImgElement = getSourceImage(container)
  const finalOptions: Required<ZoomImageClickOptions> = {
    zoomFactor: options.zoomFactor ?? 4,
    zoomImageSource: options.zoomImageSource ?? sourceImgElement.src,
  }

  let isOnMove = false

  const store = createStore<ZoomImageClickState>({
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

  function handlePointerMove(event: PointerEvent) {
    if (!isOnMove) {
      return
    }

    processZoom(event)
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

  function handlePointerDown(event: PointerEvent) {
    if (isOnMove) {
      isOnMove = false
      zoomedImg.style.display = "none"
      return
    }

    processZoom(event)
    isOnMove = true
  }

  const controller = new AbortController()
  const { signal } = controller
  container.addEventListener("pointerdown", handlePointerDown, { signal })
  container.addEventListener("pointerenter", disableScroll, { signal })
  container.addEventListener("pointerleave", enableScroll, { signal })
  container.addEventListener("pointermove", handlePointerMove, { signal })

  return {
    cleanup: () => {
      controller.abort()
      container.removeChild(zoomedImg)
      store.cleanup()
    },
    subscribe: store.subscribe,
    getState: store.getState,
  }
}
