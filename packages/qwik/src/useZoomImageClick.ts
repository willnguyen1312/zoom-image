import { useSignal, useStore, useVisibleTask$ } from "@builder.io/qwik"
import { createZoomImageClick as _createZoomImageClick } from "@zoom-image/core"

import type { ZoomImageMoveState } from "@zoom-image/core"

export function useZoomImageClick() {
  const result = useSignal<ReturnType<typeof _createZoomImageClick>>()
  const zoomImageState = useStore<ZoomImageMoveState>({
    zoomedImgStatus: "idle",
  })

  const createZoomImage = (...arg: Parameters<typeof _createZoomImageClick>) => {
    result.value?.cleanup()
    result.value = _createZoomImageClick(...arg)
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
