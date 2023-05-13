// eslint-disable-next-line import/no-unresolved
import "uno.css"
import { createZoomImageHover, createZoomImageWheel, createZoomImageMove, createZoomImageClick } from "@zoom-image/core"

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
      if (Object.is(state, value)) {
        return
      }
      state = value
      listeners.forEach((listener) => listener(state))
    },
  }
}

const zoomWheelLink = document.getElementById("zoom-image-wheel") as HTMLAnchorElement
const zoomHoverLink = document.getElementById("zoom-image-hover") as HTMLAnchorElement
const zoomMouseLink = document.getElementById("zoom-image-move") as HTMLAnchorElement
const zoomClickLink = document.getElementById("zoom-image-click") as HTMLAnchorElement

type ZoomType = "wheel" | "hover" | "move" | "click"

const makeImageTemplate = (id: "image-wheel" | "image-hover" | "image-move" | "image-click") => {
  const template = document.getElementById(id) as HTMLTemplateElement
  return template.content.cloneNode(true)
}

const parent = document.getElementById("parent") as HTMLDivElement
const state = createSimpleState<ZoomType | "">("")

const makeUpdateUIFunc = () => {
  let cleanupZoom: () => void = () => {}

  return (state: ZoomType | "") => {
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

    if (state === "move") {
      const imageHover = makeImageTemplate("image-move")
      parent.replaceChildren(imageHover)

      const container = document.getElementById("image-move-container") as HTMLDivElement

      cleanupZoom = createZoomImageMove(container, {
        zoomImageSource: "/large.webp",
      }).cleanup
    }

    if (state === "click") {
      const imageClick = makeImageTemplate("image-click")
      parent.replaceChildren(imageClick)

      const container = document.getElementById("image-click-container") as HTMLDivElement

      cleanupZoom = createZoomImageClick(container, {
        zoomImageSource: "/large.webp",
      }).cleanup
    }
  }
}

state.subscribe(makeUpdateUIFunc())

const links: { element: HTMLElement; type: ZoomType }[] = [
  { element: zoomWheelLink, type: "wheel" },
  { element: zoomHoverLink, type: "hover" },
  { element: zoomMouseLink, type: "move" },
  { element: zoomClickLink, type: "click" },
]

links.forEach((link) => {
  link.element.addEventListener("click", () => {
    state.set(link.type)
    links.forEach((link) => link.element.classList.remove("bg-gray-200"))
    link.element.classList.add("bg-gray-200")
  })
})

zoomWheelLink.click()
