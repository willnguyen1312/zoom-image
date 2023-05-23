import { reactive, onUnmounted } from "vue"
import { createZoomImageMove as _createZoomImageMove } from "@zoom-image/core"

import type { ZoomImageMoveState } from "@zoom-image/core"

export function useZoomImageMove() {
  let result: ReturnType<typeof _createZoomImageMove> | undefined
  const zoomImageState = reactive<ZoomImageMoveState>({
    zoomedImgStatus: "idle",
  })

  const createZoomImage = (...arg: Parameters<typeof _createZoomImageMove>) => {
    result?.cleanup()
    result = _createZoomImageMove(...arg)
    const currentState = result.getState()
    for (const key in currentState) {
      zoomImageState[key] = currentState[key]
    }

    result.subscribe(({ updatedProperties }) => {
      for (const key in updatedProperties) {
        zoomImageState[key] = updatedProperties[key]
      }
    })
  }

  onUnmounted(() => {
    result?.cleanup()
  })

  return {
    createZoomImage,
    zoomImageState,
  }
}
