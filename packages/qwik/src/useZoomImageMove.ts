import { useSignal, useStore, useVisibleTask$ } from "@builder.io/qwik"
import { createZoomImageMove as _createZoomImageMove } from "@zoom-image/core"

import type { ZoomImageMoveState } from "@zoom-image/core"

export function useZoomImageMove() {
  const result = useSignal<ReturnType<typeof _createZoomImageMove>>()
  const zoomImageState = useStore<ZoomImageMoveState>({
    zoomedImgStatus: "idle",
  })

  const createZoomImage = (...arg: Parameters<typeof _createZoomImageMove>) => {
    result.value?.cleanup()
    result.value = _createZoomImageMove(...arg)
    zoomImageState.zoomedImgStatus = result.value.getState().zoomedImgStatus

    result.value.subscribe((state) => {
      zoomImageState.zoomedImgStatus = state.zoomedImgStatus
    })
  }

  useVisibleTask$(({ cleanup }) => {
    cleanup(() => {
      result.value?.cleanup()
    })
  })

  return {
    createZoomImage,
    zoomImageState,
  }
}
