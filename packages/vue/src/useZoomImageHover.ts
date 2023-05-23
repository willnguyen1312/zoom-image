import { reactive, onUnmounted } from "vue"
import { createZoomImageHover as _createZoomImageHover, ZoomImageHoverStateUpdate } from "@zoom-image/core"

import type { ZoomImageHoverState } from "@zoom-image/core"

export function useZoomImageHover() {
  let result: ReturnType<typeof _createZoomImageHover> | undefined
  const zoomImageState = reactive<ZoomImageHoverState>({
    enabled: false,
    zoomedImgStatus: "idle",
  })

  const createZoomImage = (...arg: Parameters<typeof _createZoomImageHover>) => {
    result?.cleanup()
    result = _createZoomImageHover(...arg)
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

  const setZoomImageState = (state: ZoomImageHoverStateUpdate) => {
    result?.setState(state)
  }

  return {
    createZoomImage,
    zoomImageState,
    setZoomImageState,
  }
}
