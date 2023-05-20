export type Listener<TState> = (currentState: TState, prevState: TState) => void

export function createStore<TState>(initialState: TState) {
  const listeners = new Set<Listener<TState>>()
  let batching = false
  let state: TState = initialState
  let prevState: TState = { ...initialState }

  const setState = (updatedState: Partial<TState> = {}) => {
    state = { ...state, ...updatedState }
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

    if (!hasChanged) {
      return
    }

    listeners.forEach((listener) => listener(state, prevState))
    prevState = { ...state }
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
