import { onCleanup } from "solid-js"
import { createZoomImageHover as _createZoomImageHover, ZoomImageHoverStateUpdate } from "@zoom-image/core"

import type { ZoomImageHoverState } from "@zoom-image/core"
import { createStore } from "solid-js/store"

export function useZoomImageHover() {
  let result: ReturnType<typeof _createZoomImageHover> | undefined
  const [zoomImageState, updateZoomImageState] = createStore<ZoomImageHoverState>({
    enabled: false,
    zoomedImgStatus: "idle",
  })

  const createZoomImage = (...arg: Parameters<typeof _createZoomImageHover>) => {
    result?.cleanup()
    result = _createZoomImageHover(...arg)
    updateZoomImageState(result.getState())

    result.subscribe((state) => {
      updateZoomImageState(state)
    })
  }

  onCleanup(() => {
    result?.cleanup()
  })

  const setZoomImageState = (updatedState: ZoomImageHoverStateUpdate) => {
    result?.setState(updatedState)
  }

  return {
    createZoomImage,
    zoomImageState,
    setZoomImageState,
  }
}
