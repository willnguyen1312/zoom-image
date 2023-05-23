import { writable } from "svelte/store"
import { onDestroy } from "svelte"
import { createZoomImageHover as _createZoomImageHover, ZoomImageHoverStateUpdate } from "@zoom-image/core"

import type { ZoomImageHoverState } from "@zoom-image/core"

export function useZoomImageHover() {
  let result: ReturnType<typeof _createZoomImageHover> | undefined
  const { subscribe, set } = writable<ZoomImageHoverState>({
    enabled: false,
    zoomedImgStatus: "idle",
  })

  const createZoomImage = (...arg: Parameters<typeof _createZoomImageHover>) => {
    result?.cleanup()
    result = _createZoomImageHover(...arg)
    set(result.getState())

    result.subscribe(({ state }) => {
      set(state)
    })
  }

  onDestroy(() => {
    result?.cleanup()
  })

  const setZoomImageState = (state: ZoomImageHoverStateUpdate) => {
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
