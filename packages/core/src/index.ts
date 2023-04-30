type ZoomImageOptions = {
  customZoom?: { width: number; height: number }
  zoomImageSource?: string
  zoomLensClass?: string
  zoomImageClass?: string
}

type ZoomImageData = {
  zoomContainer: HTMLElement
  sourceImg: HTMLImageElement
  zoomedImg: HTMLDivElement
  zoomLens: HTMLDivElement
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function createZoomImage(container: HTMLElement, options: ZoomImageOptions = {}) {
  if (!container) {
    throw new Error("Please specify a container for the zoom image")
  }

  const sourceImgElement = container.querySelector("img")
  if (!sourceImgElement) {
    throw new Error("Please place an image inside the container")
  }

  const finalOptions: Required<ZoomImageOptions> = {
    zoomImageSource: options.zoomImageSource || sourceImgElement.src,
    zoomLensClass: options.zoomLensClass || "",
    zoomImageClass: options.zoomImageClass || "",
    customZoom: options.customZoom || { width: 0, height: 0 },
  }

  const data: ZoomImageData = {
    zoomContainer: container,
    sourceImg: sourceImgElement,
    zoomedImg: container.appendChild(document.createElement("div")),
    zoomLens: container.appendChild(document.createElement("div")),
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
    const minX = data.zoomLens.clientWidth / 2
    return clamp(left, minX, getLimitX(minX)) - minX
  }

  function zoomLensTop(top: number) {
    const minY = data.zoomLens.clientHeight / 2
    return clamp(top, minY, getLimitY(minY)) - minY
  }

  function setZoomedImgSize() {
    // Custom zoom available
    if (finalOptions.customZoom.width && finalOptions.customZoom.height) {
      data.zoomedImg.style.width = finalOptions.customZoom.width + "px"
      data.zoomedImg.style.height = finalOptions.customZoom.height + "px"
      return
    }

    // Default zoom to source image size
    data.zoomedImg.style.width = data.sourceImg.width + "px"
    data.zoomedImg.style.height = data.sourceImg.height + "px"
  }

  function onSourceImageREady() {
    setZoomedImgSize()
    offset = getOffset(data.sourceImg)
    // Calculate scale and offset
    scaleX = data.sourceImg.naturalWidth / sourceImgElement!.width
    scaleY = data.sourceImg.naturalHeight / sourceImgElement!.height

    // Setup default zoom image style
    data.zoomedImg.style.backgroundSize = data.sourceImg.naturalWidth + "px " + data.sourceImg.naturalHeight + "px"
    data.zoomedImg.style.display = "block"
    data.zoomedImg.style.display = "none"

    // Setup default zoom lens style
    data.zoomLens.style.position = "absolute"

    if (!finalOptions.zoomLensClass) {
      data.zoomLens.style.background = "red"
      data.zoomLens.style.opacity = "0.4"
      data.zoomLens.style.cursor = "crosshair"
    }

    if (finalOptions.customZoom.width && finalOptions.customZoom.height) {
      data.zoomLens.style.width = finalOptions.customZoom.width / scaleX + "px"
      data.zoomLens.style.height = finalOptions.customZoom.height / scaleY + "px"
      return
    }

    data.zoomLens.style.width = data.sourceImg.clientWidth / scaleX + "px"
    data.zoomLens.style.height = data.sourceImg.clientHeight / scaleY + "px"
  }

  function setup() {
    data.zoomLens.style.display = "none"

    if (finalOptions.zoomLensClass) {
      data.zoomLens.classList.add(finalOptions.zoomLensClass)
    }

    if (finalOptions.zoomImageClass) {
      data.zoomedImg.classList.add(finalOptions.zoomImageClass)
    }

    data.zoomedImg.style.backgroundImage = "url('" + finalOptions.zoomImageSource + "')"
    data.zoomedImg.style.backgroundRepeat = "no-repeat"
    data.zoomedImg.style.display = "none"

    data.zoomedImg.style.position = "absolute"
    data.zoomedImg.style.top = "0px"
    data.zoomedImg.style.right = "0px"
    data.zoomedImg.style.transform = "translateX(100%)"

    // setup event listeners
    container.addEventListener("pointermove", handlePointerMove, false)
    container.addEventListener("pointerenter", handlePointerEnter, false)
    container.addEventListener("pointerleave", handlePointerLeave, false)
    data.zoomLens.addEventListener("pointerenter", handlePointerEnter, false)
    data.zoomLens.addEventListener("pointerleave", handlePointerLeave, false)
    window.addEventListener("scroll", handleScroll, false)

    return data
  }

  function handlePointerMove(event: PointerEvent) {
    let offsetX: number
    let offsetY: number
    let backgroundTop: number
    let backgroundRight: number
    let backgroundPosition: string
    if (offset) {
      offsetX = zoomLensLeft(event.clientX - offset.left)
      offsetY = zoomLensTop(event.clientY - offset.top)
      backgroundTop = offsetX * scaleX
      backgroundRight = offsetY * scaleY
      backgroundPosition = "-" + backgroundTop + "px " + "-" + backgroundRight + "px"
      data.zoomedImg.style.backgroundPosition = backgroundPosition
      data.zoomLens.style.cssText += "transform:" + "translate(" + offsetX + "px," + offsetY + "px); top: 0; left: 0;"
    }
  }

  function handlePointerEnter() {
    data.zoomedImg.style.display = "block"
    data.zoomLens.style.display = "block"
  }

  function handlePointerLeave() {
    data.zoomedImg.style.display = "none"
    data.zoomLens.style.display = "none"
  }

  function handleScroll() {
    offset = getOffset(data.sourceImg)
  }

  if (data.sourceImg.complete) {
    onSourceImageREady()
  } else {
    data.sourceImg.onload = onSourceImageREady
  }

  setup()

  return function cleanup() {
    container.removeEventListener("pointermove", handlePointerMove)
    container.removeEventListener("pointerenter", handlePointerEnter)
    container.removeEventListener("pointerleave", handlePointerLeave)
    data.zoomLens.removeEventListener("pointerenter", handlePointerEnter)
    data.zoomLens.removeEventListener("pointerleave", handlePointerLeave)
    window.removeEventListener("scroll", handleScroll)

    container.removeChild(data.zoomLens)
    data.zoomContainer.removeChild(data.zoomedImg)

    return data
  }
}

export { createZoomImage }
