import { createZoomImageWheel as _createZoomImageWheel, ZoomImageWheelStateUpdate } from "@zoom-image/core"
import { onCleanup } from "solid-js"
import { createStore } from "solid-js/store"

import type { ZoomImageWheelState } from "@zoom-image/core"

export function useZoomImageWheel() {
  let result: ReturnType<typeof _createZoomImageWheel> | undefined
  const [zoomImageState, updateZoomImageState] = createStore<ZoomImageWheelState>({
    currentZoom: 1,
    enable: true,
    currentPositionX: -1,
    currentPositionY: -1,
    currentRotation: 0,
  })

  const createZoomImage = (...arg: Parameters<typeof _createZoomImageWheel>) => {
    result?.cleanup()
    result = _createZoomImageWheel(...arg)
    updateZoomImageState(result.getState())

    result.subscribe(({ state }) => {
      updateZoomImageState(state)
    })
  }

  onCleanup(() => {
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
