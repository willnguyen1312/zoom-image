import { createStore } from "@namnode/store"
import { ZoomedImgStatus } from "./types"

// There is a scenario where the image is already in the cache,
// we don't want to trigger the loading state too quickly in that case
// 50ms should be enough to wait before triggering the loading state
const THRESHOLD = 50

export const makeImageLoader = () => {
  const createZoomImage = (
    img: HTMLImageElement,
    src: string,
    store: ReturnType<
      typeof createStore<{
        zoomedImgStatus: ZoomedImgStatus
      }>
    >,
  ) => {
    if (img.src === src) return
    img.src = src
    let complete = false

    img.onload = () => {
      complete = true
      store.setState({ zoomedImgStatus: "loaded" })
    }

    img.onerror = () => {
      complete = true
      store.setState({ zoomedImgStatus: "error" })
    }

    setTimeout(() => {
      if (!complete) store.setState({ zoomedImgStatus: "loading" })
    }, THRESHOLD)
  }

  return {
    createZoomImage,
  }
}

export const imageLoader = makeImageLoader()
