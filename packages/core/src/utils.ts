export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

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

let controller: AbortController | undefined

export function disableScroll() {
  controller = new AbortController()
  const { signal } = controller
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
