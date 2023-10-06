import { createStore } from "@namnode/store"
import { ZoomedImgStatus } from "./types"

const THRESHOLD = 50

export const makeImageLoader = () => {
  const createZoomImage = ({
    src,
    store,
    img,
  }: {
    src: string
    store: ReturnType<
      typeof createStore<{
        zoomedImgStatus: ZoomedImgStatus
      }>
    >
    img: HTMLImageElement
  }) => {
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
