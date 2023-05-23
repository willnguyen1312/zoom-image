import { onCleanup } from "solid-js"
import { createZoomImageClick as _createZoomImageClick } from "@zoom-image/core"

import type { ZoomImageMoveState } from "@zoom-image/core"
import { createStore } from "solid-js/store"

export function useZoomImageClick() {
  let result: ReturnType<typeof _createZoomImageClick> | undefined
  const [zoomImageState, updateZoomImageState] = createStore<ZoomImageMoveState>({
    zoomedImgStatus: "idle",
  })

  const createZoomImage = (...arg: Parameters<typeof _createZoomImageClick>) => {
    result?.cleanup()
    result = _createZoomImageClick(...arg)
    updateZoomImageState(result.getState())

    result.subscribe(({ state }) => {
      updateZoomImageState(state)
    })
  }

  onCleanup(() => {
    result?.cleanup()
  })

  return {
    createZoomImage,
    zoomImageState,
  }
}
