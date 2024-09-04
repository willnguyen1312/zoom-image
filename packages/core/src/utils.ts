export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

export function noop() {}

function preventDefault(event: Event) {
  event.preventDefault()
}

const keySet = new Set(["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"])
function preventDefaultForScrollKeys(event: KeyboardEvent) {
  if (keySet.has(event.key)) {
    preventDefault(event)
    return false
  }
}

const controller = new AbortController()
const signal = controller.signal

export function disableScroll() {
  window.addEventListener("DOMMouseScroll", preventDefault, { signal })
  window.addEventListener("wheel", preventDefault, { passive: false, signal })
  window.addEventListener("touchmove", preventDefault, { passive: false, signal })
  window.addEventListener("keydown", preventDefaultForScrollKeys, { signal })
}

export function enableScroll() {
  controller?.abort()
}

export function getSourceImage(container: HTMLElement) {
  if (!container) {
    throw new Error("Please specify a container for the zoom image")
  }

  const sourceImgElement = container.querySelector("img")
  if (!sourceImgElement) {
    throw new Error("Please place an image inside the container")
  }

  return sourceImgElement
}

export type PointerPosition = {
  x: number
  y: number
}

export function getPointersCenter(first: PointerPosition, second: PointerPosition) {
  return {
    x: (first.x + second.x) / 2,
    y: (first.y + second.y) / 2,
  }
}

// Given the previous and current positions of two touch inputs, compute the zoom
// factor and the origin of the zoom gesture.
export function computeZoomGesture(prev: [PointerPosition, PointerPosition], curr: [PointerPosition, PointerPosition]) {
  const prevCenter = getPointersCenter(prev[0], prev[1])
  const currCenter = getPointersCenter(curr[0], curr[1])
  const centerDist = { x: currCenter.x - prevCenter.x, y: currCenter.y - prevCenter.y }

  const prevDistance = Math.hypot(prev[0].x - prev[1].x, prev[0].y - prev[1].y)
  const currDistance = Math.hypot(curr[0].x - curr[1].x, curr[0].y - curr[1].y)
  let scale = currDistance / prevDistance

  // avoid division by zero
  const eps = 0.00001
  if (Math.abs(scale - 1) < eps) {
    scale = 1 + eps
  }

  return {
    scale,
    center: {
      // We shift the zoom center away such that the translation part of the gesture
      // is also captured by the zoom operation.
      x: prevCenter.x + centerDist.x / (1 - scale),
      y: prevCenter.y + centerDist.y / (1 - scale),
    },
  }
}

export function makeMaybeCallFunction<T>(predicateFn: () => boolean, fn: (arg: T) => void) {
  return (arg: T) => {
    if (predicateFn()) {
      fn(arg)
    }
  }
}

export const scaleLinear =
  ({
    domainStart,
    domainStop,
    rangeStart,
    rangeStop,
  }: {
    domainStart: number
    domainStop: number
    rangeStart: number
    rangeStop: number
  }) =>
  (value: number) =>
    rangeStart + (rangeStop - rangeStart) * ((value - domainStart) / (domainStop - domainStart))
