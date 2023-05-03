import { clamp, disableScroll, enableScroll, getPointersCenter, getSourceImage, makeMaybeCallFunction } from "./utils"
import type { PointerPosition } from "./utils"

export type ZoomImageWheelProps = {
  maxZoom?: number
  wheelZoomRatio?: number
}

/* The delta values are not consistent across browsers.
 * We need to normalize them to a consistent value.
 * https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaY
 */
const ZOOM_DELTA = 0.5

type ZoomImageWheelState = {
  currentZoom: number
}

type Listener = (state: ZoomImageWheelState) => void

export function createZoomImageWheel(container: HTMLElement, options: ZoomImageWheelProps = {}) {
  const finalOptions: Required<ZoomImageWheelProps> = {
    maxZoom: options.maxZoom || 4,
    wheelZoomRatio: options.wheelZoomRatio || 0.1,
  }

  const listeners = new Set<Listener>()

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

  let enabledZoom = true
  let prevDistance = -1
  let enabledScroll = true
  let zoomType: "wheel" | "pinch" | "" = ""
  const pointerMap = new Map<number, { x: number; y: number }>()

  //   States
  let currentZoom = 1
  let isOnMove = false
  let currentPositionX = 0
  let lastPositionX = 0
  let currentPositionY = 0
  let lastPositionY = 0
  let startX = 0
  let startY = 0

  container.style.overflow = "hidden"
  const sourceImgElement = getSourceImage(container)
  sourceImgElement.style.transformOrigin = "0 0"

  function updateZoom() {
    sourceImgElement.style.transform = `translate(${currentPositionX}px, ${currentPositionY}px) scale(${currentZoom})`
    listeners.forEach((listener) => {
      listener({
        currentZoom,
      })
    })
  }

  function processZoom({ delta, x, y }: { delta: number; x: number; y: number }) {
    const containerRect = container.getBoundingClientRect()
    const zoomPointX = x - containerRect.left
    const zoomPointY = y - containerRect.top

    const zoomTargetX = (zoomPointX - currentPositionX) / currentZoom
    const zoomTargetY = (zoomPointY - currentPositionY) / currentZoom

    const newCurrentZoom = clamp(
      currentZoom + delta * finalOptions.wheelZoomRatio * currentZoom,
      1,
      finalOptions.maxZoom,
    )

    currentPositionX = calculatePositionX(-zoomTargetX * newCurrentZoom + zoomPointX, newCurrentZoom)
    currentPositionY = calculatePositionY(-zoomTargetY * newCurrentZoom + zoomPointY, newCurrentZoom)
    currentZoom = newCurrentZoom
    // currentPercentage = calculatePercentage(newCurrentZoom)
  }

  function _onWheel(event: WheelEvent) {
    event.preventDefault()
    const delta = -clamp(event.deltaY, -ZOOM_DELTA, ZOOM_DELTA)
    processZoom({ delta, x: event.pageX, y: event.pageY })
    updateZoom()
  }

  function _handlePointerMove(event: PointerEvent) {
    event.preventDefault()
    const { pageX, pageY, pointerId } = event
    for (const [cachedPointerid] of pointerMap.entries()) {
      if (cachedPointerid === pointerId) {
        pointerMap.set(cachedPointerid, { x: pageX, y: pageY })
      }
    }

    if (!isOnMove) {
      return
    }

    if (pointerMap.size === 2 && zoomType === "pinch") {
      const pointersIterator = pointerMap.values()
      const first = pointersIterator.next().value as PointerPosition
      const second = pointersIterator.next().value as PointerPosition
      const curDistance = Math.sqrt(Math.pow(first.x - second.x, 2) + Math.pow(first.y - second.y, 2))
      const { x, y } = getPointersCenter(first, second)
      if (prevDistance > 0) {
        if (curDistance > prevDistance) {
          // The distance between the two pointers has increased
          processZoom({ delta: ZOOM_DELTA, x, y })
        }
        if (curDistance < prevDistance) {
          // The distance between the two pointers has decreased
          processZoom({ delta: -ZOOM_DELTA, x, y })
        }
      }
      // Store the distance for the next move event
      prevDistance = curDistance

      updateZoom()
      return
    }

    if (pointerMap.size === 1 && zoomType !== "pinch") {
      const offsetX = pageX - startX
      const offsetY = pageY - startY
      currentPositionX = calculatePositionX(lastPositionX + offsetX, currentZoom)
      currentPositionY = calculatePositionY(lastPositionY + offsetY, currentZoom)
      updateZoom()
    }
  }

  function _handlePointerDown(event: PointerEvent) {
    event.preventDefault()

    if (pointerMap.size === 2) {
      return
    }

    if (enabledScroll) {
      disableScroll()
      enabledScroll = false
    }

    const { pageX, pageY, pointerId } = event
    isOnMove = true
    lastPositionX = currentPositionX
    lastPositionY = currentPositionY
    startX = pageX
    startY = pageY
    pointerMap.set(pointerId, { x: pageX, y: pageY })

    if (pointerMap.size === 2) {
      zoomType = "pinch"
    }
  }

  function _handlePointerUp(event: PointerEvent) {
    pointerMap.delete(event.pointerId)

    if (pointerMap.size === 0) {
      isOnMove = false
      prevDistance = -1
    }

    if (pointerMap.size === 0 && !enabledScroll) {
      enableScroll()
      enabledScroll = true
    }

    if (pointerMap.size === 0 && zoomType === "pinch") {
      zoomType = ""
    }

    lastPositionX = currentPositionX
    lastPositionY = currentPositionY
  }

  function checkZoomEnabled() {
    return enabledZoom
  }

  const onWheel = makeMaybeCallFunction(checkZoomEnabled, _onWheel)
  const handlePointerDown = makeMaybeCallFunction(checkZoomEnabled, _handlePointerMove)
  const handlePointerMove = makeMaybeCallFunction(checkZoomEnabled, _handlePointerDown)
  const handlePointerUp = makeMaybeCallFunction(checkZoomEnabled, _handlePointerUp)

  container.addEventListener("wheel", onWheel)
  container.addEventListener("pointerdown", handlePointerDown)
  container.addEventListener("pointermove", handlePointerMove)
  container.addEventListener("pointerup", handlePointerUp)

  return {
    cleanup() {
      container.removeEventListener("wheel", onWheel)
      container.removeEventListener("pointerdown", handlePointerDown)
      container.removeEventListener("pointermove", handlePointerMove)
      container.removeEventListener("pointerup", handlePointerUp)
      listeners.clear()
    },
    subscribe(listener: Listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    setEnabledZoom(value: boolean) {
      enabledZoom = value
    },
  }
}
