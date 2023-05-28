import { createStore } from "@namnode/store"

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
