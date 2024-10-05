import { createStore } from "@namnode/store"
import { imageLoader } from "./imageLoader"
import { ZoomedImgStatus } from "./types"
import { disableScroll, enableScroll, getSourceImage } from "./utils"

export type ZoomImageMoveOptions = {
  zoomFactor?: number
  zoomImageSource?: string
  // @deprecated
  disableScrollLock?: boolean
  disabledContextMenu?: boolean
  zoomImageProps?: {
    alt?: string
    className?: string
  }
}

export type ZoomImageMoveState = {
  zoomedImgStatus: ZoomedImgStatus
}

export function createZoomImageMove(container: HTMLElement, options: ZoomImageMoveOptions = {}) {
  let activePointerId: number | null = null
  const sourceImgElement = getSourceImage(container)
  const finalOptions: Omit<Required<ZoomImageMoveOptions>, "zoomImageProps" | "disableScrollLock"> = {
    zoomFactor: options.zoomFactor ?? 4,
    zoomImageSource: options.zoomImageSource ?? sourceImgElement.src,
    disabledContextMenu: options.disabledContextMenu ?? false,
  }

  const { disabledContextMenu, zoomFactor, zoomImageSource } = finalOptions

  const store = createStore<ZoomImageMoveState>({
    zoomedImgStatus: "idle",
  })

  const zoomedImg = document.createElement("img")
  options.zoomImageProps?.alt && (zoomedImg.alt = options.zoomImageProps.alt)
  options.zoomImageProps?.className && (zoomedImg.className = options.zoomImageProps.className)
  zoomedImg.style.maxWidth = "none"
  zoomedImg.style.position = "absolute"
  zoomedImg.style.top = "0"
  zoomedImg.style.left = "0"

  // Credit to https://stackoverflow.com/questions/19587555/disable-default-save-image-option-in-mobile/19590365#19590365
  if (disabledContextMenu) {
    zoomedImg.style["-webkit-user-select"] = "none"
    zoomedImg.style["-webkit-touch-callout"] = "none"
    zoomedImg.oncontextmenu = () => false
  }

  const checkValidPointer = (event: PointerEvent) => {
    return activePointerId && event.pointerId === activePointerId
  }

  function handlePointerEnter(event: PointerEvent) {
    if (activePointerId === null) {
      activePointerId = event.pointerId
      container.appendChild(zoomedImg)
      zoomedImg.style.display = "block"
      const zoomedImgWidth = sourceImgElement.clientWidth * zoomFactor
      const zoomedImgHeight = sourceImgElement.clientHeight * zoomFactor
      zoomedImg.style.width = `${zoomedImgWidth}px`
      zoomedImg.style.height = `${zoomedImgHeight}px`
      imageLoader.createZoomImage(zoomedImg, zoomImageSource, store)

      processZoom(event)

      event.pointerType !== "mouse" && disableScroll()
    }
  }

  function handlePointerMove(event: PointerEvent) {
    if (checkValidPointer(event)) {
      processZoom(event)
    }
  }

  function resetZoomedImg(event: PointerEvent) {
    if (checkValidPointer(event)) {
      container.contains(zoomedImg) && container.removeChild(zoomedImg)
      zoomedImg.style.display = "none"
      zoomedImg.style.transform = "none"
      enableScroll()
      activePointerId = null
    }
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

    const containerRect = container.getBoundingClientRect()
    const zoomPointX = event.clientX - containerRect.left
    const zoomPointY = event.clientY - containerRect.top

    const currentPositionX = calculatePositionX(-zoomPointX * zoomFactor + zoomPointX)
    const currentPositionY = calculatePositionY(-zoomPointY * zoomFactor + zoomPointY)
    zoomedImg.style.transform = `translate(${currentPositionX}px, ${currentPositionY}px)`
  }

  const controller = new AbortController()
  const { signal } = controller
  container.addEventListener("pointerenter", handlePointerEnter, { signal })
  container.addEventListener("pointermove", handlePointerMove, { signal })
  container.addEventListener("pointerleave", resetZoomedImg, { signal })
  container.addEventListener(
    "touchstart",
    (event) => {
      disabledContextMenu && event.preventDefault()
    },
    { signal },
  )

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
