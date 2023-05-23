import { writable } from "svelte/store"
import { onDestroy } from "svelte"
import { createZoomImageMove as _createZoomImageMove } from "@zoom-image/core"

import type { ZoomImageMoveState } from "@zoom-image/core"

export function useZoomImageMove() {
  let result: ReturnType<typeof _createZoomImageMove> | undefined
  const { set, subscribe } = writable<ZoomImageMoveState>({
    zoomedImgStatus: "idle",
  })

  const createZoomImage = (...arg: Parameters<typeof _createZoomImageMove>) => {
    result?.cleanup()
    result = _createZoomImageMove(...arg)
    set(result.getState())

    result.subscribe(({ state }) => {
      set(state)
    })
  }

  onDestroy(() => {
    result?.cleanup()
  })

  return {
    createZoomImage,
    zoomImageState: {
      subscribe,
    },
  }
}
