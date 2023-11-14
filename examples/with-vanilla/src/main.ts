import "@unocss/reset/tailwind.css"
import {
  createZoomImageClick,
  createZoomImageHover,
  createZoomImageMove,
  createZoomImageWheel,
  cropImage,
} from "@zoom-image/core"
import "virtual:uno.css"

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

const getImageTemplate = (id: "image-wheel" | "image-hover" | "image-move" | "image-click") => {
  const template = document.getElementById(id) as HTMLTemplateElement
  return template.content.cloneNode(true)
}

const parent = document.getElementById("parent") as HTMLDivElement
const state = createSimpleState<ZoomType | "">("")

const makeUpdateUIFunc = () => {
  let cleanupZoom: () => void = () => {
    // noop
  }

  return (state: ZoomType | "") => {
    if (state === "") {
      return
    }

    cleanupZoom()
    parent.replaceChildren()

    if (state === "wheel") {
      const imageWheel = getImageTemplate("image-wheel")
      parent.replaceChildren(imageWheel)
      const container = document.getElementById("image-wheel-container") as HTMLDivElement

      const result = createZoomImageWheel(container)

      const controller = new AbortController()
      const cropImg = document.getElementById("cropImg") as HTMLImageElement
      const cropImgBtn = document.getElementById("cropImgBtn") as HTMLButtonElement
      const zoomInBtn = document.getElementById("zoomInBtn") as HTMLInputElement
      const zoomOutBtn = document.getElementById("zoomOutBtn") as HTMLInputElement
      const currentZoom = document.getElementById("currentZoom") as HTMLParagraphElement

      result.subscribe(({ state }) => {
        currentZoom.textContent = `Current zoom: ${Math.round(state.currentZoom * 100)}%`
      })

      zoomInBtn.addEventListener(
        "click",
        () => {
          result.setState({
            currentZoom: result.getState().currentZoom + 0.5,
          })
        },
        { signal: controller.signal },
      )

      zoomOutBtn.addEventListener(
        "click",
        () => {
          result.setState({
            currentZoom: result.getState().currentZoom - 0.5,
          })
        },
        { signal: controller.signal },
      )

      cropImgBtn.addEventListener(
        "click",
        async () => {
          const currentState = result.getState()
          const croppedImage = await cropImage({
            image: container.querySelector("img") as HTMLImageElement,
            currentZoom: currentState.currentZoom,
            positionX: currentState.currentPositionX,
            positionY: currentState.currentPositionY,
          })

          cropImg.src = croppedImage
          cropImg.hidden = false
        },
        { signal: controller.signal },
      )

      cleanupZoom = () => {
        result.cleanup()
        controller.abort()
      }
    }

    if (state === "hover") {
      const imageHover = getImageTemplate("image-hover")
      parent.replaceChildren(imageHover)

      const container = document.getElementById("image-hover-container") as HTMLDivElement
      const zoomTarget = document.getElementById("zoom-hover-target") as HTMLDivElement

      cleanupZoom = createZoomImageHover(container, {
        zoomImageSource: "/sample.avif",
        customZoom: { width: 300, height: 500 },
        zoomTarget,
        scale: 2,
      }).cleanup
    }

    if (state === "move") {
      const imageHover = getImageTemplate("image-move")
      parent.replaceChildren(imageHover)

      const container = document.getElementById("image-move-container") as HTMLDivElement

      cleanupZoom = createZoomImageMove(container, {
        zoomImageSource: "/sample.avif",
      }).cleanup
    }

    if (state === "click") {
      const imageClick = getImageTemplate("image-click")
      parent.replaceChildren(imageClick)

      const container = document.getElementById("image-click-container") as HTMLDivElement

      cleanupZoom = createZoomImageClick(container, {
        zoomImageSource: "/sample.avif",
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
