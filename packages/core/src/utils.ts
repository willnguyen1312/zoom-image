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

export function disableScroll() {
  window.addEventListener("DOMMouseScroll", preventDefault)
  window.addEventListener("wheel", preventDefault, { passive: false })
  window.addEventListener("touchmove", preventDefault, { passive: false })
  window.addEventListener("keydown", preventDefaultForScrollKeys)
}

export function enableScroll() {
  window.removeEventListener("DOMMouseScroll", preventDefault)
  window.removeEventListener("wheel", preventDefault)
  window.removeEventListener("touchmove", preventDefault)
  window.removeEventListener("keydown", preventDefaultForScrollKeys)
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

export function makeMaybeCallFunction<T>(predicateFn: () => boolean, fn: (arg?: T) => void) {
  return (arg?: T) => {
    if (predicateFn()) {
      fn(arg)
    }
  }
}
