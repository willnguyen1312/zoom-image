import { createStore } from "../src/store"

describe("simple store", () => {
  it("should work as expected", () => {
    const store = createStore({ count: 0 })
    const listener1 = vi.fn()
    const listener2 = vi.fn()
    store.subscribe(listener1)
    const unsubscribe = store.subscribe(listener2)

    expect(store.getState()).toEqual({ count: 0 })
    store.update({ count: 1 })
    expect(store.getState()).toEqual({ count: 1 })
    expect(listener1).toHaveBeenCalledTimes(1)
    expect(listener2).toHaveBeenCalledTimes(1)

    unsubscribe()
    store.update({ count: 2 })
    expect(store.getState()).toEqual({ count: 2 })
    expect(listener1).toHaveBeenCalledTimes(2)
    expect(listener2).toHaveBeenCalledTimes(1)

    store.cleanup()
    store.update({ count: 3 })
    expect(store.getState()).toEqual({ count: 3 })
    expect(listener1).toHaveBeenCalledTimes(2)
    expect(listener2).toHaveBeenCalledTimes(1)
  })
})
