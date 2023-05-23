import { writable } from "svelte/store"
import { onDestroy } from "svelte"
import { createZoomImageWheel as _createZoomImageWheel } from "@zoom-image/core"

import type { ZoomImageWheelState, ZoomImageWheelStateUpdate } from "@zoom-image/core"

export function useZoomImageWheel() {
  let result: ReturnType<typeof _createZoomImageWheel> | undefined

  const { set, subscribe } = writable<ZoomImageWheelState>({
    currentPositionX: -1,
    currentPositionY: -1,
    currentZoom: -1,
    enable: false,
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
