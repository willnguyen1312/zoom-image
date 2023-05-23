import { onCleanup } from "solid-js"
import { createZoomImageMove as _createZoomImageMove } from "@zoom-image/core"

import type { ZoomImageMoveState } from "@zoom-image/core"
import { createStore } from "solid-js/store"

export function useZoomImageMove() {
  let result: ReturnType<typeof _createZoomImageMove> | undefined
  const [zoomImageState, updateZoomImageState] = createStore<ZoomImageMoveState>({
    zoomedImgStatus: "idle",
  })

  const createZoomImage = (...arg: Parameters<typeof _createZoomImageMove>) => {
    result?.cleanup()
    result = _createZoomImageMove(...arg)
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
