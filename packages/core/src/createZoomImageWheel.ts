import {
  clamp,
  getSourceImage,
  // scaleLinear
} from "./utils"

export type ZoomImageWheelProps = {
  maxZoom?: number
  wheelZoomRatio?: number
}

/* The delta values are not consistent across browsers.
 * We need to normalize them to a consistent value.
 * https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaY
 */
const ZOOM_DELTA = 0.5

export function createZoomImageWheel(container: HTMLElement, options: ZoomImageWheelProps = {}) {
  const finalOptions: Required<ZoomImageWheelProps> = {
    maxZoom: options.maxZoom || 4,
    wheelZoomRatio: options.wheelZoomRatio || 0.1,
  }

  //   const calculatePercentage = scaleLinear({
  //     domainStart: 1,
  //     domainStop: finalOptions.maxZoom,
  //     rangeStart: 0,
  //     rangeStop: 100,
  //   })

  //   const calculateCurrentZoom = scaleLinear({
  //     domainStart: 0,
  //     domainStop: 100,
  //     rangeStart: 1,
  //     rangeStop: finalOptions.maxZoom,
  //   })

  const calculatePositionX = (newPositionX: number, currentZoom: number) => {
    const width = container.clientWidth
    if (newPositionX > 0) return 0
    if (newPositionX + width * currentZoom < width) return -width * (currentZoom - 1)
    return newPositionX
  }

  const calculatePositionY = (newPositionY: number, currentZoom: number) => {
    const height = container.clientHeight

    if (newPositionY > 0) return 0
    if (newPositionY + height * currentZoom < height) return -height * (currentZoom - 1)
    return newPositionY
  }

  //   States
  let currentZoom = 1
  //   let currentPercentage = 0
  let currentPositionX = 0
  let currentPositionY = 0

  container.style.overflow = "hidden"
  const sourceImgElement = getSourceImage(container)
  sourceImgElement.style.transformOrigin = "0 0"

  function processZoom({ delta, x, y }: { delta: number; x: number; y: number }) {
    const containerRect = container.getBoundingClientRect()
    const zoomPointX = x - containerRect.left
    const zoomPointY = y - containerRect.top

    const zoomTargetX = (zoomPointX - currentPositionX) / currentZoom
    const zoomTargetY = (zoomPointY - currentPositionY) / currentZoom

    const newCurrentZoom = clamp(currentZoom + delta * currentZoom, 1, finalOptions.maxZoom)

    currentPositionX = calculatePositionX(-zoomTargetX * newCurrentZoom + zoomPointX, newCurrentZoom)
    currentPositionY = calculatePositionY(-zoomTargetY * newCurrentZoom + zoomPointY, newCurrentZoom)
    currentZoom = newCurrentZoom
    // currentPercentage = calculatePercentage(newCurrentZoom)
  }

  function onWheel(event: WheelEvent) {
    event.preventDefault()
    const delta = -clamp(event.deltaY, -ZOOM_DELTA, ZOOM_DELTA) * finalOptions.wheelZoomRatio
    processZoom({ delta, x: event.pageX, y: event.pageY })

    sourceImgElement.style.transform = `translate(${currentPositionX}px, ${currentPositionY}px) scale(${currentZoom})`
  }

  container.addEventListener("wheel", onWheel, { passive: false })

  return {
    cleanup() {
      container.removeEventListener("wheel", onWheel)
    },
  }
}
