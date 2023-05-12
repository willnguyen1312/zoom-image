import { clamp, disableScroll, enableScroll, getSourceImage } from "./utils"

export type ZoomImageMoveOptions = {
  zoomFactor?: number
  zoomImageSource?: string
}

export type ZoomedImgStatus = "initial" | "loading" | "loaded" | "error"

type ZoomImageMoveState = {
  zoomedImgStatus: ZoomedImgStatus
}

type Listener = (state: ZoomImageMoveState) => void

export function createZoomImageMove(container: HTMLElement, options: ZoomImageMoveOptions = {}) {
  let createdZoomImage = false
  const zoomImageState: ZoomImageMoveState = { zoomedImgStatus: "initial" }
  const listeners = new Set<Listener>()

  const sourceImgElement = getSourceImage(container)
  const finalOptions: Required<ZoomImageMoveOptions> = {
    zoomFactor: options.zoomFactor ?? 4,
    zoomImageSource: options.zoomImageSource ?? sourceImgElement.src,
  }

  const zoomedImgWidth = sourceImgElement.clientWidth * finalOptions.zoomFactor
  const zoomedImgHeight = sourceImgElement.clientHeight * finalOptions.zoomFactor
  const zoomedImg = container.appendChild(document.createElement("img"))

  function createZoomImage() {
    createdZoomImage = true
    zoomImageState.zoomedImgStatus = "loading"
    zoomedImg.style.width = `${zoomedImgWidth}px`
    zoomedImg.style.height = `${zoomedImgHeight}px`
    zoomedImg.src = finalOptions.zoomImageSource
    zoomedImg.style.position = "absolute"
    zoomedImg.style.top = "0"
    zoomedImg.style.left = "0"
    notifyListeners()

    zoomedImg.addEventListener("load", () => {
      zoomImageState.zoomedImgStatus = "loaded"
      notifyListeners()
    })
  }

  function processZoom(event: PointerEvent) {
    const rect = container.getBoundingClientRect()
    const offsetX = event.clientX - rect.left
    const offsetY = event.clientY - rect.top

    const minLeft = container.clientWidth - zoomedImgWidth
    const minTop = container.offsetHeight - zoomedImgHeight

    let left = container.clientWidth / 2 - zoomedImgWidth * (offsetX / container.clientWidth)
    let top = container.offsetHeight / 2 - zoomedImgHeight * (offsetY / container.clientHeight)

    left = clamp(left, minLeft, 0)
    top = clamp(top, minTop, 0)

    zoomedImg.style.transform = `translate(${left}px, ${top}px)`
  }

  function notifyListeners() {
    listeners.forEach((listener) => listener(zoomImageState))
  }

  async function handlePointerEnter(event: PointerEvent) {
    if (!createdZoomImage) {
      createZoomImage()
    }

    disableScroll()
    zoomedImg.style.display = "block"
    processZoom(event)
  }

  function handlePointerMove(event: PointerEvent) {
    processZoom(event)
  }

  function handlePointerLeave() {
    enableScroll()
    zoomedImg.style.display = "none"
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
      listeners.clear()
    },
    subscribe(listener: Listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    getState(): ZoomImageMoveState {
      return zoomImageState
    },
  }
}
