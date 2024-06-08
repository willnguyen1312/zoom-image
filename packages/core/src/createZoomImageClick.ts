import { createStore } from "@namnode/store"
import { imageLoader } from "./imageLoader"
import { ZoomedImgStatus } from "./types"
import { disableScroll, enableScroll, getSourceImage, noop } from "./utils"

export type ZoomImageClickOptions = {
  zoomFactor?: number
  zoomImageSource?: string
  disableScrollLock?: boolean
  zoomImageProps?: {
    alt?: string
  }
}

export type ZoomImageClickState = {
  zoomedImgStatus: ZoomedImgStatus
}

export function createZoomImageClick(container: HTMLElement, options: ZoomImageClickOptions = {}) {
  const sourceImgElement = getSourceImage(container)
  const finalOptions: Omit<Required<ZoomImageClickOptions>, "zoomImageProps"> = {
    zoomFactor: options.zoomFactor ?? 4,
    zoomImageSource: options.zoomImageSource ?? sourceImgElement.src,
    disableScrollLock: options.disableScrollLock ?? false,
  }

  const { zoomFactor, zoomImageSource, disableScrollLock } = finalOptions

  let isOnMove = false

  const store = createStore<ZoomImageClickState>({
    zoomedImgStatus: "idle",
  })

  const zoomedImgWidth = sourceImgElement.clientWidth * zoomFactor
  const zoomedImgHeight = sourceImgElement.clientHeight * zoomFactor
  const zoomedImg = container.appendChild(document.createElement("img"))
  zoomedImg.alt = options.zoomImageProps?.alt || ""
  zoomedImg.style.maxWidth = "none"
  zoomedImg.style.display = "none"
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
    if (newPositionX + width * zoomFactor < width) return -width * (zoomFactor - 1)
    return newPositionX
  }

  const calculatePositionY = (newPositionY: number) => {
    const height = container.clientHeight
    if (newPositionY > 0) return 0
    if (newPositionY + height * zoomFactor < height) return -height * (zoomFactor - 1)
    return newPositionY
  }

  function processZoom(event: PointerEvent) {
    zoomedImg.style.display = "block"
    imageLoader.createZoomImage(zoomedImg, zoomImageSource, store)

    const containerRect = container.getBoundingClientRect()
    const zoomPointX = event.clientX - containerRect.left
    const zoomPointY = event.clientY - containerRect.top

    const currentPositionX = calculatePositionX(-zoomPointX * zoomFactor + zoomPointX)
    const currentPositionY = calculatePositionY(-zoomPointY * zoomFactor + zoomPointY)

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
  container.addEventListener("pointerenter", disableScrollLock ? noop : disableScroll, { signal })
  container.addEventListener("pointerleave", disableScrollLock ? noop : enableScroll, { signal })
  container.addEventListener("pointermove", handlePointerMove, { signal })
  container.addEventListener("touchend", enableScroll, { signal })

  return {
    cleanup: () => {
      controller.abort()
      container.contains(zoomedImg) && container.removeChild(zoomedImg)
      store.cleanup()
    },
    subscribe: store.subscribe,
    getState: store.getState,
  }
}
