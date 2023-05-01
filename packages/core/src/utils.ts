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
