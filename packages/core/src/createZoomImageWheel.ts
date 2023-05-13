import { createStore } from "./store"
import { clamp, disableScroll, enableScroll, getPointersCenter, getSourceImage, makeMaybeCallFunction } from "./utils"
import type { PointerPosition } from "./utils"

export type ZoomImageWheelOptions = {
  maxZoom?: number
  wheelZoomRatio?: number
}

/* The delta values are not consistent across browsers.
 * We need to normalize them to a consistent value.
 * https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaY
 */
const ZOOM_DELTA = 0.5

export type ZoomImageWheelState = {
  currentZoom: number
  enable: boolean
}

type StateUpdate = { enable: boolean }

export function createZoomImageWheel(container: HTMLElement, options: ZoomImageWheelOptions = {}) {
  const store = createStore<ZoomImageWheelState>({
    currentZoom: 1,
    enable: true,
  })

  const sourceImgElement = getSourceImage(container)
  const finalOptions: Required<ZoomImageWheelOptions> = {
    maxZoom: options.maxZoom || 4,
    wheelZoomRatio: options.wheelZoomRatio || 0.1,
  }

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

  let prevDistance = -1
  let enabledScroll = true
  let zoomType: "wheel" | "pinch" | "" = ""
  const pointerMap = new Map<number, { x: number; y: number }>()

  let isOnMove = false
  let currentPositionX = 0
  let lastPositionX = 0
  let currentPositionY = 0
  let lastPositionY = 0
  let startX = 0
  let startY = 0

  container.style.overflow = "hidden"
  sourceImgElement.style.transformOrigin = "0 0"

  function updateZoom() {
    sourceImgElement.style.transform = `translate(${currentPositionX}px, ${currentPositionY}px) scale(${
      store.getState().currentZoom
    })`
  }

  function processZoom({ delta, x, y }: { delta: number; x: number; y: number }) {
    const containerRect = container.getBoundingClientRect()
    const zoomPointX = x - containerRect.left
    const zoomPointY = y - containerRect.top
    const { currentZoom } = store.getState()

    const zoomTargetX = (zoomPointX - currentPositionX) / currentZoom
    const zoomTargetY = (zoomPointY - currentPositionY) / currentZoom

    const newCurrentZoom = clamp(
      currentZoom + delta * finalOptions.wheelZoomRatio * currentZoom,
      1,
      finalOptions.maxZoom,
    )

    currentPositionX = calculatePositionX(-zoomTargetX * newCurrentZoom + zoomPointX, newCurrentZoom)
    currentPositionY = calculatePositionY(-zoomTargetY * newCurrentZoom + zoomPointY, newCurrentZoom)
    store.update({ currentZoom: newCurrentZoom })
  }

  function _onWheel(event: WheelEvent) {
    event.preventDefault()
    const delta = -clamp(event.deltaY, -ZOOM_DELTA, ZOOM_DELTA)
    processZoom({ delta, x: event.clientX, y: event.clientY })
    updateZoom()
  }

  function _handlePointerMove(event: PointerEvent) {
    event.preventDefault()
    const { clientX, clientY, pointerId } = event
    for (const [cachedPointerid] of pointerMap.entries()) {
      if (cachedPointerid === pointerId) {
        pointerMap.set(cachedPointerid, { x: clientX, y: clientY })
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
      const offsetX = clientX - startX
      const offsetY = clientY - startY
      const { currentZoom } = store.getState()
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

    const { clientX, clientY, pointerId } = event
    isOnMove = true
    lastPositionX = currentPositionX
    lastPositionY = currentPositionY
    startX = clientX
    startY = clientY
    pointerMap.set(pointerId, { x: clientX, y: clientY })

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

  function _handlePointerLeave() {
    pointerMap.clear()
    isOnMove = false
    prevDistance = -1
    if (!enabledScroll) {
      enableScroll()
      enabledScroll = true
    }
  }

  function checkZoomEnabled() {
    return store.getState().enable
  }

  const onWheel = makeMaybeCallFunction(checkZoomEnabled, _onWheel)
  const handlePointerDown = makeMaybeCallFunction(checkZoomEnabled, _handlePointerDown)
  const handlePointerLeave = makeMaybeCallFunction(checkZoomEnabled, _handlePointerLeave)
  const handlePointerMove = makeMaybeCallFunction(checkZoomEnabled, _handlePointerMove)
  const handlePointerUp = makeMaybeCallFunction(checkZoomEnabled, _handlePointerUp)

  container.addEventListener("wheel", onWheel)
  container.addEventListener("pointerdown", handlePointerDown)
  container.addEventListener("pointerleave", handlePointerLeave)
  container.addEventListener("pointermove", handlePointerMove)
  container.addEventListener("pointerup", handlePointerUp)

  return {
    cleanup() {
      container.removeEventListener("wheel", onWheel)
      container.removeEventListener("pointerdown", handlePointerDown)
      container.removeEventListener("pointerleave", handlePointerLeave)
      container.removeEventListener("pointermove", handlePointerMove)
      container.removeEventListener("pointerup", handlePointerUp)
      store.cleanup()
    },
    subscribe: store.subscribe,
    update: (newState: StateUpdate) => {
      store.update(newState)
    },
    getState(): ZoomImageWheelState {
      return structuredClone(store.getState())
    },
  }
}
