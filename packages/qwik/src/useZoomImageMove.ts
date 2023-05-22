import { useStore, useVisibleTask$, $ } from "@builder.io/qwik"
import { createZoomImageMove as _createZoomImageMove } from "@zoom-image/core"

import type { ZoomImageMoveState } from "@zoom-image/core"

export function useZoomImageMove() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = {} as any
  const zoomImageState = useStore<ZoomImageMoveState>({
    zoomedImgStatus: "idle",
  })

  const createZoomImage = $((...arg: Parameters<typeof _createZoomImageMove>) => {
    result.value?.cleanup()
    result.value = _createZoomImageMove(...arg)
    zoomImageState.zoomedImgStatus = result.value.getState().zoomedImgStatus

    result.value.subscribe((state: ZoomImageMoveState) => {
      zoomImageState.zoomedImgStatus = state.zoomedImgStatus
    })
  })

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
