import { enableScroll, disableScroll, clamp, getSourceImage } from "./utils"

export type ZoomImageHoverOptions = {
  customZoom?: { width: number; height: number }
  zoomImageSource?: string
  zoomLensClass?: string
  zoomImageClass?: string
  zoomTarget?: HTMLElement
  scaleFactor?: number
}

type RequiredExcept<T, K extends keyof T> = Omit<Required<T>, K> & { [P in K]?: T[P] }

function createZoomImageHover(container: HTMLElement, options: ZoomImageHoverOptions = {}) {
  const sourceImgElement = getSourceImage(container)
  const zoomedImg = container.appendChild(document.createElement("div"))
  const zoomLens = container.appendChild(document.createElement("div"))

  const finalOptions: RequiredExcept<ZoomImageHoverOptions, "zoomTarget" | "customZoom"> = {
    zoomImageSource: options.zoomImageSource || sourceImgElement.src,
    zoomLensClass: options.zoomLensClass || "",
    zoomImageClass: options.zoomImageClass || "",
    customZoom: options.customZoom,
    scaleFactor: options.scaleFactor || 1,
    zoomTarget: options.zoomTarget,
  }

  let scaleX: number
  let scaleY: number
  let offset: { left: number; top: number }

  function getOffset(element: HTMLElement) {
    const elRect = element.getBoundingClientRect()
    return { left: elRect.left, top: elRect.top }
  }

  function getLimitX(value: number) {
    return sourceImgElement!.width - value
  }

  function getLimitY(value: number) {
    return sourceImgElement!.height - value
  }

  function zoomLensLeft(left: number) {
    const minX = zoomLens.clientWidth / 2
    return clamp(left, minX, getLimitX(minX)) - minX
  }

  function zoomLensTop(top: number) {
    const minY = zoomLens.clientHeight / 2
    return clamp(top, minY, getLimitY(minY)) - minY
  }

  function setZoomedImgSize() {
    // Custom zoom available
    if (finalOptions.customZoom) {
      zoomedImg.style.width = finalOptions.customZoom.width + "px"
      zoomedImg.style.height = finalOptions.customZoom.height + "px"
      return
    }

    // Default zoom to source image size
    zoomedImg.style.width = sourceImgElement.width + "px"
    zoomedImg.style.height = sourceImgElement.height + "px"
  }

  function onSourceImageREady() {
    setZoomedImgSize()
    offset = getOffset(sourceImgElement)
    // Calculate scale and offset
    scaleX = sourceImgElement.naturalWidth / sourceImgElement!.width
    scaleY = sourceImgElement.naturalHeight / sourceImgElement!.height

    // Setup default zoom image style
    zoomedImg.style.backgroundSize =
      sourceImgElement.naturalWidth / finalOptions.scaleFactor +
      "px " +
      sourceImgElement.naturalHeight / finalOptions.scaleFactor +
      "px"
    zoomedImg.style.display = "block"
    zoomedImg.style.display = "none"

    // Setup default zoom lens style
    zoomLens.style.position = "absolute"

    if (!finalOptions.zoomLensClass) {
      zoomLens.style.background = "violet"
      zoomLens.style.opacity = "0.4"
      zoomLens.style.cursor = "crosshair"
    }

    if (finalOptions.customZoom) {
      zoomLens.style.width = (finalOptions.customZoom.width / scaleX) * finalOptions.scaleFactor + "px"
      zoomLens.style.height = (finalOptions.customZoom.height / scaleY) * finalOptions.scaleFactor + "px"
      return
    }

    zoomLens.style.width = sourceImgElement.clientWidth / scaleX + "px"
    zoomLens.style.height = sourceImgElement.clientHeight / scaleY + "px"
  }

  function setup() {
    zoomLens.style.display = "none"

    if (finalOptions.zoomLensClass) {
      zoomLens.classList.add(finalOptions.zoomLensClass)
    }

    if (finalOptions.zoomImageClass) {
      zoomedImg.classList.add(finalOptions.zoomImageClass)
    }

    // Setup zoomed image style
    zoomedImg.style.backgroundImage = "url('" + finalOptions.zoomImageSource + "')"
    zoomedImg.style.backgroundRepeat = "no-repeat"
    zoomedImg.style.display = "none"

    // setup event listeners
    container.addEventListener("pointerdown", processZoom)
    container.addEventListener("pointermove", processZoom)
    container.addEventListener("pointerenter", handlePointerEnter)
    container.addEventListener("pointerleave", handlePointerLeave)
    zoomLens.addEventListener("pointerenter", handlePointerEnter)
    zoomLens.addEventListener("pointerleave", handlePointerLeave)
    window.addEventListener("scroll", handleScroll)

    // Setup zoomed image position if zoom target is specified
    if (finalOptions.zoomTarget) {
      finalOptions.zoomTarget.appendChild(zoomedImg)
      return
    }

    container.appendChild(zoomedImg)
    // Default zoom image position
    zoomedImg.style.position = "absolute"
    zoomedImg.style.top = "0px"
    zoomedImg.style.right = "0px"
    zoomedImg.style.transform = "translateX(100%)"
  }

  function processZoom(event: PointerEvent) {
    disableScroll()
    let offsetX: number
    let offsetY: number
    let backgroundTop: number
    let backgroundRight: number
    let backgroundPosition: string
    if (offset) {
      offsetX = zoomLensLeft(event.clientX - offset.left)
      offsetY = zoomLensTop(event.clientY - offset.top)
      backgroundTop = (offsetX * scaleX) / finalOptions.scaleFactor
      backgroundRight = (offsetY * scaleY) / finalOptions.scaleFactor
      backgroundPosition = "-" + backgroundTop + "px " + "-" + backgroundRight + "px"
      zoomedImg.style.backgroundPosition = backgroundPosition
      zoomLens.style.cssText += "transform:" + "translate(" + offsetX + "px," + offsetY + "px); top: 0; left: 0;"
    }
  }

  function handlePointerEnter() {
    zoomedImg.style.display = "block"
    zoomLens.style.display = "block"
  }

  function handlePointerLeave() {
    enableScroll()
    zoomedImg.style.display = "none"
    zoomLens.style.display = "none"
  }

  function handleScroll() {
    offset = getOffset(sourceImgElement)
  }

  if (sourceImgElement.complete) {
    onSourceImageREady()
  } else {
    sourceImgElement.onload = onSourceImageREady
  }

  setup()

  function cleanup() {
    container.removeEventListener("pointermove", processZoom)
    container.removeEventListener("pointerdown", processZoom)
    container.removeEventListener("pointerenter", handlePointerEnter)
    container.removeEventListener("pointerleave", handlePointerLeave)
    zoomLens.removeEventListener("pointerenter", handlePointerEnter)
    zoomLens.removeEventListener("pointerleave", handlePointerLeave)
    window.removeEventListener("scroll", handleScroll)
    container.removeChild(zoomLens)

    if (finalOptions.zoomTarget) {
      finalOptions.zoomTarget.removeChild(zoomedImg)
      return
    }

    container.removeChild(zoomedImg)
  }

  return {
    cleanup,
  }
}

export { createZoomImageHover }
