// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
const keySet = new Set([37, 38, 39, 40])

function preventDefault(event: Event) {
  event.preventDefault()
}

function preventDefaultForScrollKeys(event: KeyboardEvent) {
  if (keySet.has[event.keyCode]) {
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
