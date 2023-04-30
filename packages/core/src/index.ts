type ZoomImageOptions = {
  customZoom?: { width: number; height: number }
  zoomImageSource?: string
  zoomLensClass?: string
  zoomImageClass?: string
  zoomTarget?: HTMLElement
}

const scaleFactor = 0.5

type RequiredExcept<T, K extends keyof T> = Omit<Required<T>, K> & { [P in K]?: T[P] }

type ZoomImageStore = {
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

  const finalOptions: RequiredExcept<ZoomImageOptions, "zoomTarget"> = {
    zoomImageSource: options.zoomImageSource || sourceImgElement.src,
    zoomLensClass: options.zoomLensClass || "",
    zoomImageClass: options.zoomImageClass || "",
    customZoom: options.customZoom || { width: 0, height: 0 },
    zoomTarget: options.zoomTarget,
  }

  const store: ZoomImageStore = {
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
    const minX = store.zoomLens.clientWidth / 2
    return clamp(left, minX, getLimitX(minX)) - minX
  }

  function zoomLensTop(top: number) {
    const minY = store.zoomLens.clientHeight / 2
    return clamp(top, minY, getLimitY(minY)) - minY
  }

  function setZoomedImgSize() {
    // Custom zoom available
    if (finalOptions.customZoom.width && finalOptions.customZoom.height) {
      store.zoomedImg.style.width = finalOptions.customZoom.width + "px"
      store.zoomedImg.style.height = finalOptions.customZoom.height + "px"
      return
    }

    // Default zoom to source image size
    store.zoomedImg.style.width = store.sourceImg.width + "px"
    store.zoomedImg.style.height = store.sourceImg.height + "px"
  }

  function onSourceImageREady() {
    setZoomedImgSize()
    offset = getOffset(store.sourceImg)
    // Calculate scale and offset
    scaleX = store.sourceImg.naturalWidth / sourceImgElement!.width
    scaleY = store.sourceImg.naturalHeight / sourceImgElement!.height

    // Setup default zoom image style
    store.zoomedImg.style.backgroundSize = store.sourceImg.naturalWidth + "px " + store.sourceImg.naturalHeight + "px"
    store.zoomedImg.style.display = "block"
    store.zoomedImg.style.display = "none"

    // Setup default zoom lens style
    store.zoomLens.style.position = "absolute"

    if (!finalOptions.zoomLensClass) {
      store.zoomLens.style.background = "red"
      store.zoomLens.style.opacity = "0.4"
      store.zoomLens.style.cursor = "crosshair"
    }

    if (finalOptions.customZoom.width && finalOptions.customZoom.height) {
      store.zoomLens.style.width = (finalOptions.customZoom.width / scaleX) * scaleFactor + "px"
      store.zoomLens.style.height = (finalOptions.customZoom.height / scaleY) * scaleFactor + "px"
      return
    }

    store.zoomLens.style.width = store.sourceImg.clientWidth / scaleX + "px"
    store.zoomLens.style.height = store.sourceImg.clientHeight / scaleY + "px"
  }

  function setup() {
    store.zoomLens.style.display = "none"

    if (finalOptions.zoomLensClass) {
      store.zoomLens.classList.add(finalOptions.zoomLensClass)
    }

    if (finalOptions.zoomImageClass) {
      store.zoomedImg.classList.add(finalOptions.zoomImageClass)
    }

    // Setup zoomed image style
    store.zoomedImg.style.backgroundImage = "url('" + finalOptions.zoomImageSource + "')"
    store.zoomedImg.style.backgroundRepeat = "no-repeat"
    store.zoomedImg.style.display = "none"

    // setup event listeners
    container.addEventListener("pointermove", handlePointerMove)
    container.addEventListener("pointerenter", handlePointerEnter)
    container.addEventListener("pointerleave", handlePointerLeave)
    store.zoomLens.addEventListener("pointerenter", handlePointerEnter)
    store.zoomLens.addEventListener("pointerleave", handlePointerLeave)
    window.addEventListener("scroll", handleScroll)

    // Setup zoomed image position if zoom target is specified
    if (finalOptions.zoomTarget) {
      finalOptions.zoomTarget.appendChild(store.zoomedImg)
      return
    }

    // Default zoom image position
    store.zoomedImg.style.position = "absolute"
    store.zoomedImg.style.top = "0px"
    store.zoomedImg.style.right = "0px"
    store.zoomedImg.style.transform = "translateX(100%)"
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
      store.zoomedImg.style.backgroundPosition = backgroundPosition
      store.zoomLens.style.cssText += "transform:" + "translate(" + offsetX + "px," + offsetY + "px); top: 0; left: 0;"
    }
  }

  function handlePointerEnter() {
    store.zoomedImg.style.display = "block"
    store.zoomLens.style.display = "block"
  }

  function handlePointerLeave() {
    store.zoomedImg.style.display = "none"
    store.zoomLens.style.display = "none"
  }

  function handleScroll() {
    offset = getOffset(store.sourceImg)
  }

  if (store.sourceImg.complete) {
    onSourceImageREady()
  } else {
    store.sourceImg.onload = onSourceImageREady
  }

  setup()

  return function cleanup() {
    container.removeEventListener("pointermove", handlePointerMove)
    container.removeEventListener("pointerenter", handlePointerEnter)
    container.removeEventListener("pointerleave", handlePointerLeave)
    store.zoomLens.removeEventListener("pointerenter", handlePointerEnter)
    store.zoomLens.removeEventListener("pointerleave", handlePointerLeave)
    window.removeEventListener("scroll", handleScroll)

    container.removeChild(store.zoomLens)
    store.zoomContainer.removeChild(store.zoomedImg)

    return store
  }
}

export { createZoomImage }
