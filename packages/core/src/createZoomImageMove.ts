import { clamp, disableScroll, enableScroll, getSourceImage } from "./utils"

export type ZoomImageMoveOptions = {
  zoomFactor?: number
  zoomImageSource?: string
}

function loadImage(src: string) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener("load", resolve)
    image.addEventListener("error", reject)
    image.src = src
  })
}

type ZoomImageMoveState = {
  zoomedImgLoaded: boolean
}

type Listener = (state: ZoomImageMoveState) => void

export function createZoomImageMove(container: HTMLElement, options: ZoomImageMoveOptions = {}) {
  const zoomImageState: ZoomImageMoveState = { zoomedImgLoaded: false }
  const listeners = new Set<Listener>()

  const sourceImgElement = getSourceImage(container)
  const finalOptions: Required<ZoomImageMoveOptions> = {
    zoomFactor: options.zoomFactor ?? 4,
    zoomImageSource: options.zoomImageSource ?? sourceImgElement.src,
  }

  const zoomedImgWidth = sourceImgElement.clientWidth * finalOptions.zoomFactor
  const zoomedImgHeight = sourceImgElement.clientHeight * finalOptions.zoomFactor

  const zoomedImg = container.appendChild(document.createElement("div"))
  zoomedImg.style.pointerEvents = "none"
  zoomedImg.style.width = `${zoomedImgWidth}px`
  zoomedImg.style.height = `${zoomedImgHeight}px`
  zoomedImg.style.backgroundSize = `${zoomedImgWidth}px ${zoomedImgHeight}px`
  zoomedImg.style.backgroundImage = "url('" + finalOptions.zoomImageSource + "')"
  zoomedImg.style.backgroundRepeat = "no-repeat"
  zoomedImg.style.display = "none"
  zoomedImg.style.position = "absolute"
  zoomedImg.style.top = "0"
  zoomedImg.style.left = "0"

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

    zoomedImg.style.backgroundPosition = `top ${top}px left ${left}px`
  }

  function notifyListeners() {
    listeners.forEach((listener) => listener(zoomImageState))
  }

  async function handlePointerEnter(event: PointerEvent) {
    if (!zoomImageState.zoomedImgLoaded) {
      try {
        await loadImage(finalOptions.zoomImageSource)
        zoomImageState.zoomedImgLoaded = true
        notifyListeners()
      } catch (error) {
        console.log("Error loading zoomed image")
        console.log(error)
      }
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
