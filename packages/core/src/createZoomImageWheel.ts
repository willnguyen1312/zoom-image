import { createStore } from "@namnode/store"
import type { PointerPosition } from "./utils"
import { clamp, computeZoomGesture, disableScroll, enableScroll, getSourceImage, makeMaybeCallFunction } from "./utils"

export type ZoomImageWheelOptions = {
  maxZoom?: number
  wheelZoomRatio?: number
  dblTapAnimationDuration?: number
  initialState?: Partial<ZoomImageWheelStateUpdate>
  shouldZoomOnSingleTouch?: () => boolean
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

const defaultInitialState: ZoomImageWheelState = {
  currentZoom: 1,
  enable: true,
  currentPositionX: 0,
  currentPositionY: 0,
  currentRotation: 0,
}

const defaultShouldZoomOnSingleTouch = () => true

export function createZoomImageWheel(container: HTMLElement, options: ZoomImageWheelOptions = {}) {
  const sourceImgElement = getSourceImage(container)
  const finalOptions: Required<ZoomImageWheelOptions> = {
    maxZoom: options.maxZoom || 4,
    wheelZoomRatio: options.wheelZoomRatio || 0.1,
    dblTapAnimationDuration: options.dblTapAnimationDuration || 300,
    initialState: { ...defaultInitialState, ...options.initialState },
    shouldZoomOnSingleTouch: options.shouldZoomOnSingleTouch || defaultShouldZoomOnSingleTouch,
  }

  const store = createStore<ZoomImageWheelState>(finalOptions.initialState as ZoomImageWheelState)

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

  const updateStateOnNewZoom = (currentZoom: number) => {
    const zoomPointX = container.clientWidth / 2
    const zoomPointY = container.clientHeight / 2
    const isDimensionSwitched = checkDimensionSwitched()
    const currentState = store.getState()

    const zoomX = isDimensionSwitched ? currentState.currentPositionY : currentState.currentPositionX
    const zoomY = isDimensionSwitched ? currentState.currentPositionX : currentState.currentPositionY

    const zoomTargetX = (zoomPointX - zoomX) / currentState.currentZoom
    const zoomTargetY = (zoomPointY - zoomY) / currentState.currentZoom

    store.setState({
      currentZoom,
      currentPositionX: calculatePositionX(-zoomTargetX * currentZoom + zoomPointX, currentZoom),
      currentPositionY: calculatePositionY(-zoomTargetY * currentZoom + zoomPointY, currentZoom),
    })
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
    sourceImgElement.style.transform = `translate3d(${currentState.currentPositionX}px, ${currentState.currentPositionY}px, 0) scale(${currentState.currentZoom})`
    container.style.rotate = `${currentState.currentRotation}deg`
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
      }

      if (typeof newState.currentZoom === "number" && newState.currentZoom !== currentState.currentZoom) {
        const newCurrentZoom = clamp(newState.currentZoom, 1, finalOptions.maxZoom)

        if (newCurrentZoom === currentState.currentZoom) {
          return
        }

        updateStateOnNewZoom(newCurrentZoom)
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
    for (const [cachedPointerId] of pointerMap.entries()) {
      if (cachedPointerId === pointerId) {
        pointerMap.set(cachedPointerId, { x: clientX, y: clientY })
      }
    }

    const { currentZoom, currentRotation } = store.getState()
    if (pointerMap.size === 1 && currentZoom !== 1) {
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

  const animationState = {
    startTimestamp: null as DOMHighResTimeStamp | null,
    // the state at the start of the zoom animation
    start: { x: 0, y: 0, zoom: 0 },
    // the target state at the end of the zoom animation
    target: { x: 0, y: 0, zoom: 0 },
  }

  function animateZoom(touchCoordinate: { x: number; y: number }) {
    // the `touchCoordinate` should be relative to the container
    const currentState = store.getState()

    animationState.startTimestamp = null
    animationState.start = {
      x: currentState.currentPositionX,
      y: currentState.currentPositionY,
      zoom: currentState.currentZoom,
    }

    if (currentState.currentZoom > 1) {
      animationState.target = {
        x: 0,
        y: 0,
        zoom: 1,
      }
    } else {
      animationState.target = {
        zoom: finalOptions.maxZoom,
        x: touchCoordinate.x * (1 - finalOptions.maxZoom),
        y: touchCoordinate.y * (1 - finalOptions.maxZoom),
      }
    }

    function lerp(a: number, b: number, t: number): number {
      return a * (1 - t) + b * t
    }

    function frame(timestamp: DOMHighResTimeStamp) {
      if (animationState.startTimestamp === null) {
        animationState.startTimestamp = timestamp
      }

      // interpolation parameter that linearly goes from 0 to 1 during the animation
      let t = (timestamp - animationState.startTimestamp) / finalOptions.dblTapAnimationDuration
      if (t > 1) {
        t = 1
      }

      store.setState({
        currentPositionX: lerp(animationState.start.x, animationState.target.x, t),
        currentPositionY: lerp(animationState.start.y, animationState.target.y, t),
        currentZoom: lerp(animationState.start.zoom, animationState.target.zoom, t),
      })
      updateZoom()

      if (t < 1) {
        requestAnimationFrame(frame)
      }
    }

    requestAnimationFrame(frame)
  }

  // These variables are used for zooming on double tap
  let touchTimer: NodeJS.Timeout | null = null
  const durationBetweenTap = 300

  function _handleTouchStart(event: TouchEvent) {
    if (event.touches.length > 1) {
      return
    }

    if (touchTimer === null) {
      touchTimer = setTimeout(() => {
        touchTimer = null
      }, durationBetweenTap)
    } else {
      clearTimeout(touchTimer)
      touchTimer = null

      const rect = container.getBoundingClientRect()
      const touch = event.touches[0]
      animateZoom({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      })
      return
    }
  }

  function _handleTouchMove(event: TouchEvent) {
    if (finalOptions.shouldZoomOnSingleTouch()) event.preventDefault()
    if (event.touches.length === 2) {
      event.preventDefault()
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
    if (event.pointerType === "touch" && !finalOptions.shouldZoomOnSingleTouch()) return
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
  container.addEventListener(
    "touchend",
    () => {
      enabledScroll = true
      enableScroll()
    },
    { signal },
  )

  // Kick things off in case we have initial zoom other than 1
  if (store.getState().currentZoom !== defaultInitialState.currentZoom) {
    updateStateOnNewZoom(store.getState().currentZoom)
    updateZoom()
  }

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
