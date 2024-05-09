import { createStore } from "@namnode/store"
import type { PointerPosition } from "./utils"
import { clamp, computeZoomGesture, disableScroll, enableScroll, getSourceImage, makeMaybeCallFunction } from "./utils"

export type ZoomImageWheelOptions = {
  maxZoom?: number
  wheelZoomRatio?: number
  dblTapAnimationDuration?: number
}

/* The delta values are not consistent across browsers.
 * We need to normalize them to a consistent value.
 * https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaY
 */
const ZOOM_DELTA = 0.5

export type ZoomImageWheelState = {
  currentRotation: number
  currentZoom: number
  enable: boolean
  currentPositionX: number
  currentPositionY: number
}

export type ZoomImageWheelStateUpdate = Partial<{
  enable: boolean
  currentZoom: number
  currentRotation: number
}>

export function createZoomImageWheel(container: HTMLElement, options: ZoomImageWheelOptions = {}) {
  const store = createStore<ZoomImageWheelState>({
    currentZoom: 1,
    enable: true,
    currentPositionX: 0,
    currentPositionY: 0,
    currentRotation: 0,
  })

  const sourceImgElement = getSourceImage(container)
  const finalOptions: Required<ZoomImageWheelOptions> = {
    maxZoom: options.maxZoom || 4,
    wheelZoomRatio: options.wheelZoomRatio || 0.1,
    dblTapAnimationDuration: options.dblTapAnimationDuration || 300,
  }

  const checkDimensionSwitched = () => {
    return [90, 270].includes(store.getState().currentRotation % 360)
  }

  const calculatePositionX = (newPositionX: number, currentZoom: number) => {
    if (newPositionX > 0) return 0

    const width = container.clientWidth
    if (newPositionX + width * currentZoom < width) return -width * (currentZoom - 1)
    return newPositionX
  }

  const calculatePositionY = (newPositionY: number, currentZoom: number) => {
    if (newPositionY > 0) return 0

    const height = container.clientHeight
    if (newPositionY + height * currentZoom < height) return -height * (currentZoom - 1)
    return newPositionY
  }

  // last pair of coordinates of a touch with two fingers
  let prevTwoPositions: [PointerPosition, PointerPosition] | null = null
  let enabledScroll = true
  const pointerMap = new Map<number, PointerPosition>()

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

      if (typeof newState.currentRotation === "number") {
        const newCurrentRotation = newState.currentRotation
        store.setState({
          currentRotation: newCurrentRotation,
        })
        container.style.rotate = `${newCurrentRotation}deg`
      }

      if (typeof newState.currentZoom === "number" && newState.currentZoom !== currentState.currentZoom) {
        const newCurrentZoom = clamp(newState.currentZoom, 1, finalOptions.maxZoom)

        if (newCurrentZoom === currentState.currentZoom) {
          return
        }

        const zoomPointX = container.clientWidth / 2
        const zoomPointY = container.clientHeight / 2
        const isDimensionSwitched = checkDimensionSwitched()

        const zoomX = isDimensionSwitched ? currentState.currentPositionY : currentState.currentPositionX
        const zoomY = isDimensionSwitched ? currentState.currentPositionX : currentState.currentPositionY

        const zoomTargetX = (zoomPointX - zoomX) / currentState.currentZoom
        const zoomTargetY = (zoomPointY - zoomY) / currentState.currentZoom

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
    const currentState = store.getState()
    const isDimensionSwitched = checkDimensionSwitched()

    let zoomPointX = -1
    let zoomPointY = -1

    switch (currentState.currentRotation % 360) {
      case 0:
        zoomPointX = x - containerRect.left
        zoomPointY = y - containerRect.top
        break
      case 90:
        zoomPointX = Math.abs(x - containerRect.right)
        zoomPointY = Math.abs(y - containerRect.top)
        break
      case 180:
        zoomPointX = Math.abs(x - containerRect.right)
        zoomPointY = Math.abs(y - containerRect.bottom)
        break
      case 270:
        zoomPointX = Math.abs(x - containerRect.left)
        zoomPointY = Math.abs(y - containerRect.bottom)
        break
    }

    const zoomX = isDimensionSwitched ? currentState.currentPositionY : currentState.currentPositionX
    const zoomY = isDimensionSwitched ? currentState.currentPositionX : currentState.currentPositionY

    const zoomTargetX = (zoomPointX - zoomX) / currentState.currentZoom
    const zoomTargetY = (zoomPointY - zoomY) / currentState.currentZoom

    const newCurrentZoom = clamp(
      currentState.currentZoom + delta * finalOptions.wheelZoomRatio * currentState.currentZoom,
      1,
      finalOptions.maxZoom,
    )

    const newX = calculatePositionX(-zoomTargetX * newCurrentZoom + zoomPointX, newCurrentZoom)
    const newY = calculatePositionY(-zoomTargetY * newCurrentZoom + zoomPointY, newCurrentZoom)

    store.setState({
      currentZoom: newCurrentZoom,
      currentPositionX: isDimensionSwitched ? newY : newX,
      currentPositionY: isDimensionSwitched ? newX : newY,
    })
  }

  function _handleWheel(event: WheelEvent) {
    event.preventDefault()

    if (store.getState().currentZoom === finalOptions.maxZoom && event.deltaY < 0) {
      return
    }

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

    if (pointerMap.size === 1) {
      const { currentZoom, currentRotation } = store.getState()
      const isDimensionSwitched = checkDimensionSwitched()
      const normalizedClientX = isDimensionSwitched ? clientY : clientX
      const normalizedClientY = isDimensionSwitched ? clientX : clientY

      let offsetX = -1
      let offsetY = -1

      switch (currentRotation % 360) {
        case 0:
          offsetX = normalizedClientX - startX
          offsetY = normalizedClientY - startY
          break
        case 90:
          offsetX = normalizedClientX - startX
          offsetY = startY - normalizedClientY
          break
        case 180:
          offsetX = startX - normalizedClientX
          offsetY = startY - normalizedClientY
          break
        case 270:
          offsetX = startX - normalizedClientX
          offsetY = normalizedClientY - startY
          break
      }

      store.setState({
        currentPositionX: calculatePositionX(lastPositionX + offsetX, currentZoom),
        currentPositionY: calculatePositionY(lastPositionY + offsetY, currentZoom),
      })
      updateZoom()
    }
  }

  // These variables are used for zooming on double tap
  let touchTimer: NodeJS.Timeout | null = null
  let startTimestamp = 0
  let currentValue = 0
  const endValue = 100
  let zoomDirection: "in" | "out" = "in"
  let x = 0
  let y = 0
  const durationBetweenTap = 300

  function animateZoom(timestamp: number) {
    const currentState = store.getState()
    const containerRect = container.getBoundingClientRect()
    const zoomPointX = x - containerRect.left
    const zoomPointY = y - containerRect.top
    const isDimensionSwitched = checkDimensionSwitched()
    const zoomX = isDimensionSwitched ? currentState.currentPositionY : currentState.currentPositionX
    const zoomY = isDimensionSwitched ? currentState.currentPositionX : currentState.currentPositionY
    const zoomTargetX = (zoomPointX - zoomX) / currentState.currentZoom
    const zoomTargetY = (zoomPointY - zoomY) / currentState.currentZoom

    if (!startTimestamp) {
      startTimestamp = timestamp
      zoomDirection = currentState.currentZoom > 1 ? "out" : "in"
    }

    const progress = timestamp - startTimestamp
    currentValue = Math.min((progress / finalOptions.dblTapAnimationDuration) * endValue, endValue)

    if (zoomDirection === "in") {
      const newCurrentZoom = clamp(1 + (finalOptions.maxZoom - 1) * (currentValue / 100), 1, finalOptions.maxZoom)

      store.setState({
        currentZoom: newCurrentZoom,
        currentPositionX: calculatePositionX(-zoomTargetX * newCurrentZoom + zoomPointX, newCurrentZoom),
        currentPositionY: calculatePositionY(-zoomTargetY * newCurrentZoom + zoomPointY, newCurrentZoom),
      })

      updateZoom()
    }

    if (zoomDirection === "out") {
      const newCurrentZoom = clamp(
        1 + (finalOptions.maxZoom - 1) - (finalOptions.maxZoom - 1) * (currentValue / 100),
        1,
        finalOptions.maxZoom,
      )
      store.setState({
        currentZoom: newCurrentZoom,
        currentPositionX: calculatePositionX(-zoomPointX * newCurrentZoom + zoomPointX, newCurrentZoom),
        currentPositionY: calculatePositionY(-zoomPointY * newCurrentZoom + zoomPointY, newCurrentZoom),
      })

      updateZoom()
    }

    if (progress < finalOptions.dblTapAnimationDuration) {
      requestAnimationFrame(animateZoom)
    } else {
      currentValue = 0
      startTimestamp = 0
    }
  }

  function _handleTouchStart(event: TouchEvent) {
    event.preventDefault()
    if (event.touches.length > 1) {
      return
    }

    x = event.touches[0].clientX
    y = event.touches[0].clientY

    if (touchTimer === null) {
      touchTimer = setTimeout(() => {
        touchTimer = null
      }, durationBetweenTap)
    } else {
      clearTimeout(touchTimer)
      touchTimer = null
      requestAnimationFrame(animateZoom)
      return
    }
  }

  function _handleTouchMove(event: TouchEvent) {
    event.preventDefault()
    console.log(event.touches.length)
    if (event.touches.length === 2) {
      const currentTwoPositions = [...event.touches].map((t) => ({ x: t.clientX, y: t.clientY })) as [
        PointerPosition,
        PointerPosition,
      ]

      if (prevTwoPositions !== null) {
        const { scale, center } = computeZoomGesture(prevTwoPositions, currentTwoPositions)
        processZoomWheel({ delta: Math.log(scale) / finalOptions.wheelZoomRatio, ...center })
      }
      // Store the current two pointer positions for the next move event
      prevTwoPositions = currentTwoPositions
      updateZoom()
      return
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

    const currentState = store.getState()
    lastPositionX = currentState.currentPositionX
    lastPositionY = currentState.currentPositionY

    const isDimensionSwitched = checkDimensionSwitched()
    startX = isDimensionSwitched ? clientY : clientX
    startY = isDimensionSwitched ? clientX : clientY
    pointerMap.set(pointerId, { x: clientX, y: clientY })
  }

  function _handlePointerUp(event: PointerEvent) {
    event.preventDefault()
    pointerMap.delete(event.pointerId)

    // Reset the distance as soon as one of the pointers is released
    if (pointerMap.size < 2) {
      prevTwoPositions = null
    }

    if (pointerMap.size === 0 && !enabledScroll) {
      enableScroll()
      enabledScroll = true
    }

    // Kick off the single pointer flow if there is only one pointer left
    if (pointerMap.size === 1) {
      const { x, y } = pointerMap.values().next().value as PointerPosition
      const isDimensionSwitched = checkDimensionSwitched()
      startX = isDimensionSwitched ? y : x
      startY = isDimensionSwitched ? x : y
    }

    const currentState = store.getState()
    lastPositionX = currentState.currentPositionX
    lastPositionY = currentState.currentPositionY
  }

  function _handlePointerLeave(event: PointerEvent) {
    event.preventDefault()
    pointerMap.delete(event.pointerId)
    prevTwoPositions = null
    if (!enabledScroll) {
      enableScroll()
      enabledScroll = true
    }
  }

  function checkZoomEnabled() {
    return store.getState().enable
  }

  const handleWheel = makeMaybeCallFunction(checkZoomEnabled, _handleWheel)
  const handlePointerDown = makeMaybeCallFunction(checkZoomEnabled, _handlePointerDown)
  const handlePointerLeave = makeMaybeCallFunction(checkZoomEnabled, _handlePointerLeave)
  const handlePointerMove = makeMaybeCallFunction(checkZoomEnabled, _handlePointerMove)
  const handlePointerUp = makeMaybeCallFunction(checkZoomEnabled, _handlePointerUp)
  const handleTouchStart = makeMaybeCallFunction(checkZoomEnabled, _handleTouchStart)
  const handleTouchMove = makeMaybeCallFunction(checkZoomEnabled, _handleTouchMove)

  const controller = new AbortController()
  const { signal } = controller
  container.addEventListener("wheel", handleWheel, { signal })
  container.addEventListener("touchstart", handleTouchStart, { signal })
  container.addEventListener("touchmove", handleTouchMove, { signal })
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
