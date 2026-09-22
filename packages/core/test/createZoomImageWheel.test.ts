import { render, screen } from "@testing-library/vue"
import userEvent from "@testing-library/user-event"
import TestImageZoomWheel from "./components/TestImageZoomWheel.vue"
import { afterEach, it } from "vitest"
import { createZoomImageWheel } from "../src"
import type { ZoomImageWheelOptions } from "../src"

let cleanupZoom: (() => void) | null = null

function renderZoomWheel(options: ZoomImageWheelOptions = {}) {
  const container = document.createElement("div")
  container.appendChild(document.createElement("img"))
  document.body.appendChild(container)

  const zoomImageWheel = createZoomImageWheel(container, options)
  cleanupZoom = zoomImageWheel.cleanup

  function scroll(deltaY: number) {
    container.dispatchEvent(new WheelEvent("wheel", { deltaY, cancelable: true }))
  }

  return { scroll, getZoom: () => zoomImageWheel.getState().currentZoom }
}

afterEach(() => {
  cleanupZoom?.()
  cleanupZoom = null
  document.body.innerHTML = ""
})

describe("createZoomImageWheel function", () => {
  it("should display zoomed image on hover source image", async () => {
    render(TestImageZoomWheel)

    const user = userEvent.setup()

    const zoomWheelLink = screen.getByRole("link", {
      name: /hover/i,
    })

    await user.click(zoomWheelLink)
    const zoomWheelImage = screen.getByRole("img", {
      name: /small pic/i,
    })

    await user.hover(zoomWheelImage)

    const zoomTarget = screen.getByTestId("zoomTarget")
    expect(zoomTarget.children).toHaveLength(1)
    const child = zoomTarget.children[0]
    expect(child.tagName).toBe("DIV")
  })

  it("should zoom by the default wheel delta when none is given", () => {
    const { scroll, getZoom } = renderZoomWheel()

    scroll(-100)

    expect(getZoom()).toBe(1.05)
  })

  it("should zoom by a smaller step when maxWheelDelta is lowered", () => {
    const { scroll, getZoom } = renderZoomWheel({ maxWheelDelta: 0.05 })

    scroll(-100)

    expect(getZoom()).toBe(1.005)
  })

  it("should zoom by a larger step when maxWheelDelta is raised", () => {
    const { scroll, getZoom } = renderZoomWheel({ maxWheelDelta: 1 })

    scroll(-100)

    expect(getZoom()).toBe(1.1)
  })
})
