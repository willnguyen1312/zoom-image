import { createZoomImageWheel as _createZoomImageWheel } from "@zoom-image/core"
import { onUnmounted, reactive } from "vue"

import type { ZoomImageWheelState, ZoomImageWheelStateUpdate } from "@zoom-image/core"

export function useZoomImageWheel() {
  let result: ReturnType<typeof _createZoomImageWheel> | undefined

  const zoomImageState = reactive<ZoomImageWheelState>({
    currentZoom: 1,
    enable: false,
    currentPositionX: -1,
    currentPositionY: -1,
    currentRotation: 0,
  })

  const createZoomImage = (...arg: Parameters<typeof _createZoomImageWheel>) => {
    result?.cleanup()
    result = _createZoomImageWheel(...arg)
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

  const setZoomImageState = (state: ZoomImageWheelStateUpdate) => {
    result?.setState(state)
  }

  return {
    createZoomImage,
    zoomImageState,
    setZoomImageState,
  }
}
