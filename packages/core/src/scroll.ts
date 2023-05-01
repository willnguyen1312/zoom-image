// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
const keySet = new Set([37, 38, 39, 40])

function preventDefault(e: Event) {
  e.preventDefault()
}

function preventDefaultForScrollKeys(e: KeyboardEvent) {
  if (keySet.has[e.keyCode]) {
    preventDefault(e)
    return false
  }
}

const wheelOpt = { passive: false }
const wheelEvent = "onwheel" in document.createElement("div") ? "wheel" : "mousewheel"

export function disableScroll() {
  window.addEventListener("DOMMouseScroll", preventDefault)
  window.addEventListener(wheelEvent, preventDefault, wheelOpt)
  window.addEventListener("touchmove", preventDefault, wheelOpt)
  window.addEventListener("keydown", preventDefaultForScrollKeys)
}

export function enableScroll() {
  window.removeEventListener("DOMMouseScroll", preventDefault)
  window.removeEventListener(wheelEvent, preventDefault)
  window.removeEventListener("touchmove", preventDefault)
  window.removeEventListener("keydown", preventDefaultForScrollKeys)
}
