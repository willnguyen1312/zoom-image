// eslint-disable-next-line import/no-unresolved
import "virtual:uno.css"
import { createZoomImageHover, createZoomImageWheel } from "@zoom-image/core"

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

const makeImageWheel = (id: "image-wheel" | "image-hover") => {
  const template = document.getElementById(id) as HTMLTemplateElement
  return template.content.cloneNode(true)
}

const parent = document.getElementById("parent") as HTMLDivElement
const state = createSimpleState<"wheel" | "hover" | "">("")

const makeUpdateUIFunc = () => {
  let cleanupZoom: () => void = () => {}

  return (state: "wheel" | "hover" | "") => {
    if (state === "") {
      return
    }

    cleanupZoom()
    parent.replaceChildren()

    if (state === "wheel") {
      const imageWheel = makeImageWheel("image-wheel")
      parent.replaceChildren(imageWheel)
      const container = document.getElementById("image-wheel-container") as HTMLDivElement

      cleanupZoom = createZoomImageWheel(container).cleanup
    }

    if (state === "hover") {
      const imageHover = makeImageWheel("image-hover")
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
  }
}

state.subscribe(makeUpdateUIFunc())
state.set("wheel")

zoomWheelLink.addEventListener("click", () => {
  state.set("wheel")
  zoomWheelLink.classList.add("bg-gray-200")
  zoomHoverLink.classList.remove("bg-gray-200")
})

zoomHoverLink.addEventListener("click", () => {
  state.set("hover")
  zoomHoverLink.classList.add("bg-gray-200")
  zoomWheelLink.classList.remove("bg-gray-200")
})
