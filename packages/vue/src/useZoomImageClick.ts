import { reactive, onUnmounted } from "vue"
import { createZoomImageClick as _createZoomImageClick } from "@zoom-image/core"

import type { ZoomImageClickState } from "@zoom-image/core"

export function useZoomImageClick() {
  let result: ReturnType<typeof _createZoomImageClick> | undefined
  const zoomImageState = reactive<ZoomImageClickState>({
    zoomedImgStatus: "idle",
  })

  const createZoomImage = (...arg: Parameters<typeof _createZoomImageClick>) => {
    result?.cleanup()
    result = _createZoomImageClick(...arg)
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
    zoomImageState,
    createZoomImage,
  }
}
