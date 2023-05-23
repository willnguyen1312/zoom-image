import { writable } from "svelte/store"
import { onDestroy } from "svelte"
import { createZoomImageClick as _createZoomImageClick } from "@zoom-image/core"

import type { ZoomImageMoveState } from "@zoom-image/core"

export function useZoomImageClick() {
  let result: ReturnType<typeof _createZoomImageClick> | undefined
  const { subscribe, set } = writable<ZoomImageMoveState>({
    zoomedImgStatus: "idle",
  })

  const createZoomImage = (...arg: Parameters<typeof _createZoomImageClick>) => {
    result?.cleanup()
    result = _createZoomImageClick(...arg)
    set(result.getState())

    result.subscribe(({ state }) => {
      set(state)
    })

    set(result.getState())

    result.subscribe(({ state }) => {
      set(state)
    })
  }

  onDestroy(() => {
    result?.cleanup()
  })

  return {
    zoomImageState: {
      subscribe,
    },
    createZoomImage,
  }
}
