import { createStore } from "@namnode/store"
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
  currentPositionX: number
  currentPositionY: number
}

export type ZoomImageWheelStateUpdate = Partial<{ enable: boolean; currentZoom: number }>

export function createZoomImageWheel(container: HTMLElement, options: ZoomImageWheelOptions = {}) {
  const store = createStore<ZoomImageWheelState>({
    currentZoom: 1,
    enable: true,
    currentPositionX: 0,
    currentPositionY: 0,
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
  let lastPositionX = 0
  let lastPositionY = 0
  let startX = 0
  let startY = 0

  container.style.overflow = "hidden"
  sourceImgElement.style.transformOrigin = "0 0"

  function updateZoom() {
    const currentState = store.getState()
    sourceImgElement.style.transform = `translate(${currentState.currentPositionX}px, ${currentState.currentPositionY}px) scale(${currentState.currentZoom})`
  }

  function setState(newState: ZoomImageWheelStateUpdate) {
    store.batch(() => {
      const currentState = store.getState()
      if (typeof newState.enable === "boolean" && newState.enable !== currentState.enable) {
        store.setState({
          enable: newState.enable,
        })

        if (!newState.enable) {
          return
        }
      }

      if (typeof newState.currentZoom === "number" && newState.currentZoom !== currentState.currentZoom) {
        const newCurrentZoom = clamp(newState.currentZoom, 1, finalOptions.maxZoom)

        if (newCurrentZoom === currentState.currentZoom) {
          return
        }

        const zoomPointX = container.clientWidth / 2
        const zoomPointY = container.clientHeight / 2

        const zoomTargetX = (zoomPointX - currentState.currentPositionX) / currentState.currentZoom
        const zoomTargetY = (zoomPointY - currentState.currentPositionY) / currentState.currentZoom

        store.setState({
          currentZoom: newCurrentZoom,
          currentPositionX: calculatePositionX(-zoomTargetX * newCurrentZoom + zoomPointX, newCurrentZoom),
          currentPositionY: calculatePositionY(-zoomTargetY * newCurrentZoom + zoomPointY, newCurrentZoom),
        })
      }
    })

    updateZoom()
  }

  function processZoomWheel({ delta, x, y }: { delta: number; x: number; y: number }) {
    const containerRect = container.getBoundingClientRect()
    const zoomPointX = x - containerRect.left
    const zoomPointY = y - containerRect.top
    const currentState = store.getState()

    const zoomTargetX = (zoomPointX - currentState.currentPositionX) / currentState.currentZoom
    const zoomTargetY = (zoomPointY - currentState.currentPositionY) / currentState.currentZoom

    const newCurrentZoom = clamp(
      currentState.currentZoom + delta * finalOptions.wheelZoomRatio * currentState.currentZoom,
      1,
      finalOptions.maxZoom,
    )

    store.setState({
      currentZoom: newCurrentZoom,
      currentPositionX: calculatePositionX(-zoomTargetX * newCurrentZoom + zoomPointX, newCurrentZoom),
      currentPositionY: calculatePositionY(-zoomTargetY * newCurrentZoom + zoomPointY, newCurrentZoom),
    })
  }

  function _onWheel(event: WheelEvent) {
    event.preventDefault()
    const delta = -clamp(event.deltaY, -ZOOM_DELTA, ZOOM_DELTA)
    processZoomWheel({ delta, x: event.clientX, y: event.clientY })
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
          processZoomWheel({ delta: ZOOM_DELTA, x, y })
        }
        if (curDistance < prevDistance) {
          // The distance between the two pointers has decreased
          processZoomWheel({ delta: -ZOOM_DELTA, x, y })
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
      store.setState({
        currentPositionX: calculatePositionX(lastPositionX + offsetX, currentZoom),
        currentPositionY: calculatePositionY(lastPositionY + offsetY, currentZoom),
      })
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
    const currentState = store.getState()
    lastPositionX = currentState.currentPositionX
    lastPositionY = currentState.currentPositionY
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

    const currentState = store.getState()
    lastPositionX = currentState.currentPositionX
    lastPositionY = currentState.currentPositionY
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

  const controller = new AbortController()
  const { signal } = controller
  container.addEventListener("wheel", onWheel, { signal })
  container.addEventListener("pointerdown", handlePointerDown, { signal })
  container.addEventListener("pointerleave", handlePointerLeave, { signal })
  container.addEventListener("pointermove", handlePointerMove, { signal })
  container.addEventListener("pointerup", handlePointerUp, { signal })

  return {
    cleanup() {
      controller.abort()
      store.cleanup()
    },
    subscribe: store.subscribe,
    setState,
    getState: store.getState,
  }
}
