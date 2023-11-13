import { createZoomImageWheel as _createZoomImageWheel } from "@zoom-image/core"
import { onDestroy } from "svelte"
import { writable } from "svelte/store"

import type { ZoomImageWheelState, ZoomImageWheelStateUpdate } from "@zoom-image/core"

export function useZoomImageWheel() {
  let result: ReturnType<typeof _createZoomImageWheel> | undefined

  const { set, subscribe } = writable<ZoomImageWheelState>({
    currentZoom: 1,
    enable: false,
    currentPositionX: -1,
    currentPositionY: -1,
    currentRotation: 0,
  })

  const createZoomImage = (...arg: Parameters<typeof _createZoomImageWheel>) => {
    result?.cleanup()
    result = _createZoomImageWheel(...arg)
    set(result.getState())

    result.subscribe(({ state }) => {
      set(state)
    })
  }

  onDestroy(() => {
    result?.cleanup()
  })

  const setZoomImageState = (state: ZoomImageWheelStateUpdate) => {
    result?.setState(state)
  }

  return {
    createZoomImage,
    zoomImageState: {
      subscribe,
    },
    setZoomImageState,
  }
}
