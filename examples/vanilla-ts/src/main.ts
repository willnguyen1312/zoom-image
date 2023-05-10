// eslint-disable-next-line import/no-unresolved
import "uno.css"
import { createZoomImageHover, createZoomImageWheel, createZoomImageMousemove } from "@zoom-image/core"

function createSimpleState<T>(initialState: T) {
  const listeners = new Set<(value: T) => void>()

  let state: T = initialState
  return {
    subscribe: (listener: (value: T) => void) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    set: (value: T) => {
      if (state === value) {
        return
      }

      state = value
      listeners.forEach((listener) => listener(state))
    },
  }
}

const zoomWheelLink = document.getElementById("zoom-image-wheel") as HTMLAnchorElement
const zoomHoverLink = document.getElementById("zoom-image-hover") as HTMLAnchorElement
const zoomMouseLink = document.getElementById("zoom-image-mousemove") as HTMLAnchorElement

const makeImageTemplate = (id: "image-wheel" | "image-hover" | "image-mousemove") => {
  const template = document.getElementById(id) as HTMLTemplateElement
  return template.content.cloneNode(true)
}

const parent = document.getElementById("parent") as HTMLDivElement
const state = createSimpleState<"wheel" | "hover" | "mousemove" | "">("")

const makeUpdateUIFunc = () => {
  let cleanupZoom: () => void = () => {}

  return (state: "wheel" | "hover" | "mousemove" | "") => {
    if (state === "") {
      return
    }

    cleanupZoom()
    parent.replaceChildren()

    if (state === "wheel") {
      const imageWheel = makeImageTemplate("image-wheel")
      parent.replaceChildren(imageWheel)
      const container = document.getElementById("image-wheel-container") as HTMLDivElement

      cleanupZoom = createZoomImageWheel(container).cleanup
    }

    if (state === "hover") {
      const imageHover = makeImageTemplate("image-hover")
      parent.replaceChildren(imageHover)

      const container = document.getElementById("image-hover-container") as HTMLDivElement
      const zoomTarget = document.getElementById("zoom-hover-target") as HTMLDivElement

      cleanupZoom = createZoomImageHover(container, {
        zoomImageSource: "/large.webp",
        customZoom: { width: 300, height: 500 },
        zoomTarget,
        scaleFactor: 0.5,
      }).cleanup
    }

    if (state === "mousemove") {
      const imageHover = makeImageTemplate("image-mousemove")
      parent.replaceChildren(imageHover)

      const container = document.getElementById("image-mousemove-container") as HTMLDivElement

      cleanupZoom = createZoomImageMousemove(container, {
        zoomImageSource: "/large.webp",
      }).cleanup
    }
  }
}

zoomWheelLink.addEventListener("click", () => {
  state.set("wheel")
  zoomWheelLink.classList.add("bg-gray-200")
  zoomHoverLink.classList.remove("bg-gray-200")
  zoomMouseLink.classList.remove("bg-gray-200")
})

zoomHoverLink.addEventListener("click", () => {
  state.set("hover")
  zoomHoverLink.classList.add("bg-gray-200")
  zoomWheelLink.classList.remove("bg-gray-200")
  zoomMouseLink.classList.remove("bg-gray-200")
})

zoomMouseLink.addEventListener("click", () => {
  state.set("mousemove")
  zoomMouseLink.classList.add("bg-gray-200")
  zoomHoverLink.classList.remove("bg-gray-200")
  zoomWheelLink.classList.remove("bg-gray-200")
})

state.subscribe(makeUpdateUIFunc())
zoomMouseLink.click()
