import { justSayHi } from "@zoom-image/core"

export function setupCounter(element: HTMLButtonElement) {
  let counter = 0
  const setCounter = (count: number) => {
    justSayHi()
    counter = count
    element.innerHTML = `count is ${counter}`
  }
  element.addEventListener("click", () => setCounter(counter + 1))
  setCounter(0)
}
