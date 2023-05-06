import { render, screen } from "@testing-library/vue"
import userEvent from "@testing-library/user-event"
import TestImageZoomWheel from "./TestImageZoomWheel.vue"
import { it } from "vitest"

describe("createZoomImageWheel function", () => {
  it("should display zoomed image on hover source image", async () => {
    render(TestImageZoomWheel)

    const user = userEvent.setup()

    const zoomWheelLink = screen.getByRole("link", {
      name: /zoom image hover/i,
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
})
