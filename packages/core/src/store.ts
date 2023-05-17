export type Listener<TState> = (currentState: TState) => void

export function createStore<TState>(initialState: TState) {
  let batching = false
  const listeners = new Set<Listener<TState>>()
  let state: TState = initialState
  let prevState: TState | undefined

  const setState = (updatedState: Partial<TState> = {}) => {
    if (!prevState) {
      prevState = { ...state }
    }

    for (const key in updatedState) {
      state[key] = updatedState[key] as TState[Extract<keyof TState, string>]
    }

    flush()
  }

  const flush = () => {
    if (batching) return

    let hasChanged = false

    if (prevState) {
      for (const key in state) {
        if (state[key] !== prevState[key]) {
          hasChanged = true
          break
        }
      }
    }

    prevState = undefined

    if (!hasChanged) {
      return
    }

    listeners.forEach((listener) => listener(state))
  }

  const batch = (cb: () => void) => {
    batching = true
    cb()
    batching = false
    flush()
  }

  const subscribe = (listener: Listener<TState>) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  const cleanup = () => listeners.clear()

  const getState = () => state

  return {
    subscribe,
    cleanup,
    getState,
    setState,
    batch,
  }
}

export const makeImageCache = () => {
  const loadedImageSet = new Set<string>()

  const checkImageLoaded = (src: string) => loadedImageSet.has(src)

  const createZoomImage = ({
    src,
    store,
    img,
  }: {
    src: string
    store: ReturnType<typeof createStore>
    img: HTMLImageElement
  }) => {
    img.src = src
    if (checkImageLoaded(src)) return

    loadedImageSet.add(src)

    store.setState({ zoomedImgStatus: "loading" })

    img.addEventListener("load", () => {
      store.setState({ zoomedImgStatus: "loaded" })
    })

    img.addEventListener("error", () => {
      store.setState({ zoomedImgStatus: "error" })
    })
  }

  return {
    createZoomImage,
    checkImageLoaded,
  }
}

export const imageCache = makeImageCache()
