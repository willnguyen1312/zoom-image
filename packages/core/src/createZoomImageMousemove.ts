import { clamp, getSourceImage } from "./utils"

export type ZoomImageMousemoveOptions = {
  zoomFactor?: number
  zoomImageSource?: string
}

export function createZoomImageMousemove(container: HTMLElement, options: ZoomImageMousemoveOptions = {}) {
  const sourceImgElement = getSourceImage(container)
  const finalOptions: Required<ZoomImageMousemoveOptions> = {
    zoomFactor: options.zoomFactor ?? 4,
    zoomImageSource: options.zoomImageSource ?? "",
  }

  const zoomedImg = document.createElement("img")
  container.appendChild(zoomedImg)
  zoomedImg.style.width = `${sourceImgElement.clientWidth * finalOptions.zoomFactor}px`
  zoomedImg.style.height = `${sourceImgElement.clientHeight * finalOptions.zoomFactor}px`
  zoomedImg.src = finalOptions.zoomImageSource

  function handleMouseEnter() {
    sourceImgElement.style.display = "none"
    zoomedImg.style.display = "block"
  }

  function handleMousemove(event: MouseEvent) {
    const rect = container.getBoundingClientRect()
    const offsetX = event.clientX - rect.left
    const offsetY = event.clientY - rect.top

    let left = container.clientWidth / 2 - zoomedImg.clientWidth * (offsetX / container.clientWidth)
    let top = container.offsetHeight / 2 - zoomedImg.offsetHeight * (offsetY / container.clientHeight)

    const minLeft = container.clientWidth - zoomedImg.clientWidth
    const minTop = container.offsetHeight - zoomedImg.offsetHeight

    left = clamp(left, minLeft, 0)
    top = clamp(top, minTop, 0)
    zoomedImg.style.transform = `translate(${left}px, ${top}px)`
  }

  function handleMouseLeave() {
    zoomedImg.style.display = "none"
    sourceImgElement.style.display = "block"
  }

  container.addEventListener("mouseenter", handleMouseEnter)
  container.addEventListener("mousemove", handleMousemove)
  container.addEventListener("mouseleave", handleMouseLeave)

  return {
    cleanup: () => {
      container.removeEventListener("mouseenter", handleMousemove)
      container.removeEventListener("mousemove", handleMousemove)
      container.removeEventListener("mouseleave", handleMousemove)
    },
  }
}
