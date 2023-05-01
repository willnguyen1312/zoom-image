const keySet = new Set(["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"])

function preventDefault(event: Event) {
  event.preventDefault()
}

function preventDefaultForScrollKeys(event: KeyboardEvent) {
  if (keySet.has(event.key)) {
    preventDefault(event)
    return false
  }
}

const wheelOpt = { passive: false }

export function disableScroll() {
  window.addEventListener("DOMMouseScroll", preventDefault)
  window.addEventListener("wheel", preventDefault, wheelOpt)
  window.addEventListener("touchmove", preventDefault, wheelOpt)
  window.addEventListener("keydown", preventDefaultForScrollKeys)
}

export function enableScroll() {
  window.removeEventListener("DOMMouseScroll", preventDefault)
  window.removeEventListener("wheel", preventDefault)
  window.removeEventListener("touchmove", preventDefault)
  window.removeEventListener("keydown", preventDefaultForScrollKeys)
}
