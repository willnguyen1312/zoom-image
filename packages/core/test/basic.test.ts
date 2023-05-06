import { render, screen } from "@testing-library/vue"
import userEvent from "@testing-library/user-event"
import Hello from "./TestComponent.vue"

test("increments value on click", async () => {
  render(Hello)

  const user = userEvent.setup()
  screen.getByText("Times clicked: 0")

  const button = screen.getByText("increment")

  await user.click(button)
  await user.click(button)

  screen.getByText("Times clicked: 2")
})
