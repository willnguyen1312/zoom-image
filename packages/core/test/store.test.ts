import { createStore, makeImageCache } from "../src/store"
import { ZoomedImgStatus } from "../src/types"

describe("simple store", () => {
  it("should work as expected", () => {
    const store = createStore({ count: 0 })
    const listener1 = vi.fn()
    const listener2 = vi.fn()
    store.subscribe(listener1)
    const unsubscribe = store.subscribe(listener2)

    expect(store.getState()).toEqual({ count: 0 })
    store.setState({ count: 1 })
    expect(store.getState()).toEqual({ count: 1 })
    expect(listener1).toHaveBeenCalledTimes(1)
    expect(listener2).toHaveBeenCalledTimes(1)

    store.setState({ count: 1 })
    store.setState({ count: 1 })
    store.setState({ count: 1 })
    expect(listener1).toHaveBeenCalledTimes(1)
    expect(listener2).toHaveBeenCalledTimes(1)

    unsubscribe()
    store.setState({ count: 2 })
    expect(store.getState()).toEqual({ count: 2 })
    expect(listener1).toHaveBeenCalledTimes(2)
    expect(listener2).toHaveBeenCalledTimes(1)

    store.batch(() => {
      store.setState({ count: 4 })
      store.setState({ count: 5 })
      store.setState({ count: 6 })
    })
    expect(store.getState()).toEqual({ count: 6 })
    expect(listener1).toHaveBeenCalledTimes(3)

    store.cleanup()
    store.setState({ count: 7 })
    expect(store.getState()).toEqual({ count: 7 })
    expect(listener1).toHaveBeenCalledTimes(3)
    expect(listener2).toHaveBeenCalledTimes(1)
  })
})

describe("image cache", () => {
  it("should work as expected", () => {
    const store = createStore<{ zoomedImgStatus: ZoomedImgStatus }>({
      zoomedImgStatus: "idle",
    })
    const { createZoomImage, checkImageLoaded } = makeImageCache()
    const img = document.createElement("img")
    const src = "https://example.com/image.png"

    expect(checkImageLoaded(src)).toBe(false)
    createZoomImage({ src, store, img })
    expect(store.getState()).toEqual({ zoomedImgStatus: "loading" })

    img.dispatchEvent(new Event("load"))
    expect(checkImageLoaded(src)).toBe(true)
    expect(store.getState()).toEqual({ zoomedImgStatus: "loaded" })

    img.dispatchEvent(new Event("error"))
    expect(checkImageLoaded(src)).toBe(true)
    expect(store.getState()).toEqual({ zoomedImgStatus: "error" })
  })
})
