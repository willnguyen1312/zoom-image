import { createStore } from "./store"
import { ZoomedImgStatus } from "./types"
import { clamp, disableScroll, enableScroll, getSourceImage } from "./utils"

export type ZoomImageMoveOptions = {
  zoomFactor?: number
  zoomImageSource?: string
}

export type ZoomImageMoveState = {
  zoomedImgStatus: ZoomedImgStatus
}

export function createZoomImageMove(container: HTMLElement, options: ZoomImageMoveOptions = {}) {
  let createdZoomImage = false
  const zoomImageStore = createStore<ZoomImageMoveState>({ zoomedImgStatus: "initial" })

  const sourceImgElement = getSourceImage(container)
  const finalOptions: Required<ZoomImageMoveOptions> = {
    zoomFactor: options.zoomFactor ?? 4,
    zoomImageSource: options.zoomImageSource ?? sourceImgElement.src,
  }

  const zoomedImgWidth = sourceImgElement.clientWidth * finalOptions.zoomFactor
  const zoomedImgHeight = sourceImgElement.clientHeight * finalOptions.zoomFactor
  const zoomedImg = container.appendChild(document.createElement("img"))

  function createZoomImage() {
    zoomedImg.src = finalOptions.zoomImageSource
    createdZoomImage = true
    zoomImageStore.update({ zoomedImgStatus: "loading" })
    zoomedImg.style.width = `${zoomedImgWidth}px`
    zoomedImg.style.height = `${zoomedImgHeight}px`
    zoomedImg.style.position = "absolute"
    zoomedImg.style.top = "0"
    zoomedImg.style.left = "0"

    zoomedImg.addEventListener("load", () => {
      zoomImageStore.update({ zoomedImgStatus: "loaded" })
    })

    zoomedImg.addEventListener("error", () => {
      zoomImageStore.update({ zoomedImgStatus: "error" })
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

  function handlePointerEnter(event: PointerEvent) {
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
      zoomImageStore.cleanup()
    },
    subscribe: zoomImageStore.subscribe,
    getState: zoomImageStore.getState,
  }
}
