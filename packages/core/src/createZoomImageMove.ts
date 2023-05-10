import { clamp, disableScroll, enableScroll, getSourceImage } from "./utils"

export type ZoomImageMousemoveOptions = {
  zoomFactor?: number
  zoomImageSource?: string
}

export function createZoomImageMove(container: HTMLElement, options: ZoomImageMousemoveOptions = {}) {
  const sourceImgElement = getSourceImage(container)
  const finalOptions: Required<ZoomImageMousemoveOptions> = {
    zoomFactor: options.zoomFactor ?? 4,
    zoomImageSource: options.zoomImageSource ?? "",
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

  function handlePointerEnter(event: PointerEvent) {
    disableScroll()
    sourceImgElement.style.display = "none"
    zoomedImg.style.display = "block"
    processZoom(event)
  }

  function handlePointerMove(event: PointerEvent) {
    processZoom(event)
  }

  function handlePointerLeave() {
    enableScroll()
    zoomedImg.style.display = "none"
    sourceImgElement.style.display = "block"
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
    },
  }
}
