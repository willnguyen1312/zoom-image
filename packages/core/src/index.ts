type ZoomImageOptions = {
  width?: number
  height?: number
  customZoom?: { width: number; height: number }
  zoomImageSource?: string
  offset?: { x?: number; y?: number }
  zoomContainer?: HTMLElement
  zoomStyle?: string
  zoomLensStyle?: string
  zoomAreaClass?: string
  zoomImageClass?: string
}

type ZoomImageData = {
  zoomPosition: string
  zoomContainer: HTMLElement
  sourceImg: {
    element: HTMLImageElement
    width: number
    height: number
    naturalWidth: number
    naturalHeight: number
  }
  zoomedImgOffset: {
    vertical: number
    horizontal: number
  }
  zoomedImg: {
    element: HTMLDivElement
    width: number
    height: number
  }
  zoomLens: {
    element: HTMLDivElement
    width: number
    height: number
  }
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
    width: options.width || sourceImgElement.width,
    height: options.height || sourceImgElement.height,
    zoomImageSource: options.zoomImageSource || sourceImgElement.src,
    offset: options.offset || { y: 0, x: 0 },
    zoomContainer: options.zoomContainer || container,
    zoomStyle: options.zoomStyle || "",
    zoomLensStyle: options.zoomLensStyle || "",
    zoomAreaClass: options.zoomAreaClass || "__zoom-area",
    zoomImageClass: options.zoomImageClass || "__zoom-image",
    customZoom: options.customZoom || { width: 0, height: 0 },
  }

  const div = document.createElement("div")
  const lensDiv = document.createElement("div")

  const data: ZoomImageData = {
    zoomPosition: "right",
    zoomContainer: container,
    sourceImg: {
      element: sourceImgElement,
      width: 0,
      height: 0,
      naturalWidth: 0,
      naturalHeight: 0,
    },
    zoomedImgOffset: {
      vertical: 0,
      horizontal: 0,
    },
    zoomedImg: {
      element: container.appendChild(div),
      width: 0,
      height: 0,
    },
    zoomLens: {
      element: container.appendChild(lensDiv),
      width: 0,
      height: 0,
    },
  }

  let scaleX: number
  let scaleY: number
  let offset: { left: number; top: number }

  data.zoomedImgOffset = {
    vertical: finalOptions.offset && finalOptions.offset.y ? finalOptions.offset.y : 0,
    horizontal: finalOptions.offset && finalOptions.offset.x ? finalOptions.offset.x : 0,
  }

  data.zoomContainer = finalOptions.zoomContainer ? finalOptions.zoomContainer : container
  function getOffset(el: HTMLElement) {
    if (el) {
      const elRect = el.getBoundingClientRect()
      return { left: elRect.left, top: elRect.top }
    }
    return { left: 0, top: 0 }
  }

  function leftLimit(min: number) {
    return finalOptions.width - min
  }

  function topLimit(min: number) {
    return finalOptions.height - min
  }

  function clamp(val: number, min: number, max: number) {
    if (val < min) {
      return min
    }

    if (val > max) {
      return max
    }

    return val
  }

  function getPosition(v: number, min: number, max: number) {
    const value = clamp(v, min, max)
    return value - min
  }

  function zoomLensLeft(left: number) {
    const leftMin = data.zoomLens.width / 2
    return getPosition(left, leftMin, leftLimit(leftMin))
  }

  function zoomLensTop(top: number) {
    const topMin = data.zoomLens.height / 2
    return getPosition(top, topMin, topLimit(topMin))
  }

  function setZoomedImgSize() {
    if (finalOptions.customZoom.width && finalOptions.customZoom.height) {
      data.zoomedImg.element.style.width = finalOptions.customZoom.width + "px"
      data.zoomedImg.element.style.height = finalOptions.customZoom.height + "px"
      return
    }

    data.zoomedImg.element.style.width = data.sourceImg.element.width + "px"
    data.zoomedImg.element.style.height = data.sourceImg.element.height + "px"
  }

  function onSourceImgLoad() {
    setZoomedImgSize()

    data.sourceImg.naturalWidth = data.sourceImg.element.naturalWidth
    data.sourceImg.naturalHeight = data.sourceImg.element.naturalHeight
    data.zoomedImg.element.style.backgroundSize =
      data.sourceImg.naturalWidth + "px " + data.sourceImg.naturalHeight + "px"

    if (finalOptions.zoomStyle) {
      data.zoomedImg.element.style.cssText += finalOptions.zoomStyle
    }
    if (finalOptions.zoomLensStyle) {
      data.zoomLens.element.style.cssText += finalOptions.zoomLensStyle
    } else {
      data.zoomLens.element.style.background = "red"
      data.zoomLens.element.style.opacity = "0.4"
      data.zoomLens.element.style.cursor = "crosshair"
    }

    scaleX = data.sourceImg.naturalWidth / finalOptions.width
    scaleY = data.sourceImg.naturalHeight / finalOptions.height
    offset = getOffset(data.sourceImg.element)

    if (finalOptions.customZoom.width && finalOptions.customZoom.height) {
      data.zoomLens.width = finalOptions.customZoom.width / scaleX
      data.zoomLens.height = finalOptions.customZoom.height / scaleY
    }

    // else read from the zoomedImg
    else {
      data.zoomedImg.element.style.display = "block"
      data.zoomLens.width = data.sourceImg.element.clientWidth / scaleX
      data.zoomLens.height = data.sourceImg.element.clientHeight / scaleY
      data.zoomedImg.element.style.display = "none"
    }

    data.zoomLens.element.style.position = "absolute"
    data.zoomLens.element.style.width = data.zoomLens.width + "px"
    data.zoomLens.element.style.height = data.zoomLens.height + "px"
  }

  function setup() {
    data.zoomLens.element = container.appendChild(lensDiv)
    data.zoomLens.element.style.display = "none"
    data.zoomLens.element.classList.add(finalOptions.zoomAreaClass)

    data.zoomedImg.element = data.zoomContainer.appendChild(div)
    data.zoomedImg.element.classList.add(finalOptions.zoomImageClass)
    data.zoomedImg.element.style.backgroundImage = "url('" + finalOptions.zoomImageSource + "')"
    data.zoomedImg.element.style.backgroundRepeat = "no-repeat"
    data.zoomedImg.element.style.display = "none"

    switch (data.zoomPosition) {
      case "left":
        data.zoomedImg.element.style.position = "absolute"
        data.zoomedImg.element.style.top = data.zoomedImgOffset.vertical + "px"
        data.zoomedImg.element.style.left = data.zoomedImgOffset.horizontal - data.zoomedImgOffset.horizontal * 2 + "px"
        data.zoomedImg.element.style.transform = "translateX(-100%)"
        break

      case "top":
        data.zoomedImg.element.style.position = "absolute"
        data.zoomedImg.element.style.top = data.zoomedImgOffset.vertical - data.zoomedImgOffset.vertical * 2 + "px"
        data.zoomedImg.element.style.left = "calc(50% + " + data.zoomedImgOffset.horizontal + "px)"
        data.zoomedImg.element.style.transform = "translate3d(-50%, -100%, 0)"
        break

      case "bottom":
        data.zoomedImg.element.style.position = "absolute"
        data.zoomedImg.element.style.bottom = data.zoomedImgOffset.vertical - data.zoomedImgOffset.vertical * 2 + "px"
        data.zoomedImg.element.style.left = "calc(50% + " + data.zoomedImgOffset.horizontal + "px)"
        data.zoomedImg.element.style.transform = "translate3d(-50%, 100%, 0)"
        break

      case "original":
        data.zoomedImg.element.style.position = "absolute"
        data.zoomedImg.element.style.top = "0px"
        data.zoomedImg.element.style.left = "0px"
        break

      // Right Position
      default:
        data.zoomedImg.element.style.position = "absolute"
        data.zoomedImg.element.style.top = data.zoomedImgOffset.vertical + "px"
        data.zoomedImg.element.style.right =
          data.zoomedImgOffset.horizontal - data.zoomedImgOffset.horizontal * 2 + "px"
        data.zoomedImg.element.style.transform = "translateX(100%)"
        break
    }

    // setup event listeners
    container.addEventListener("pointermove", handlePointerMove, false)
    container.addEventListener("pointerenter", handlePointerEnter, false)
    container.addEventListener("pointerleave", handlePointerLeave, false)
    data.zoomLens.element.addEventListener("pointerenter", handlePointerEnter, false)
    data.zoomLens.element.addEventListener("pointerleave", handlePointerLeave, false)
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
      data.zoomedImg.element.style.backgroundPosition = backgroundPosition
      data.zoomLens.element.style.cssText +=
        "transform:" + "translate(" + offsetX + "px," + offsetY + "px); top: 0; left: 0;"
    }
  }

  function handlePointerEnter() {
    data.zoomedImg.element.style.display = "block"
    data.zoomLens.element.style.display = "block"
  }

  function handlePointerLeave() {
    // data.zoomedImg.element.style.display = "none"
    // data.zoomLens.element.style.display = "none"
  }

  function handleScroll() {
    offset = getOffset(data.sourceImg.element)
  }

  setup()

  if (data.sourceImg.element.complete) {
    onSourceImgLoad()
  } else {
    data.sourceImg.element.onload = onSourceImgLoad
  }

  function destroy() {
    container.removeEventListener("pointermove", handlePointerMove)
    container.removeEventListener("pointerenter", handlePointerEnter)
    container.removeEventListener("pointerleave", handlePointerLeave)
    data.zoomLens.element.removeEventListener("pointerenter", handlePointerEnter)
    data.zoomLens.element.removeEventListener("pointerleave", handlePointerLeave)
    window.removeEventListener("scroll", handleScroll)

    container.removeChild(data.zoomLens.element)
    data.zoomContainer.removeChild(data.zoomedImg.element)

    container.removeChild(data.sourceImg.element)

    return data
  }

  return destroy
}

export { createZoomImage }
