import { useSignal, useStore, useVisibleTask$ } from "@builder.io/qwik"
import { createZoomImageHover as _createZoomImageHover, ZoomImageHoverStateUpdate } from "@zoom-image/core"

import type { ZoomImageHoverState } from "@zoom-image/core"

export function useZoomImageHover() {
  const result = useSignal<ReturnType<typeof _createZoomImageHover>>()
  const zoomImageState = useStore<ZoomImageHoverState>({
    enabled: false,
    zoomedImgStatus: "idle",
  })

  useVisibleTask$(({ cleanup }) => {
    cleanup(() => {
      result.value?.cleanup()
    })
  })

  const createZoomImage = (...arg: Parameters<typeof _createZoomImageHover>) => {
    result.value?.cleanup()
    result.value = _createZoomImageHover(...arg)
    const currentState = result.value.getState()
    zoomImageState.enabled = currentState.enabled
    zoomImageState.zoomedImgStatus = currentState.zoomedImgStatus

    result.value.subscribe((state) => {
      zoomImageState.enabled = state.enabled
      zoomImageState.zoomedImgStatus = state.zoomedImgStatus
    })
  }

  const setZoomImageState = (state: ZoomImageHoverStateUpdate) => {
    result.value?.setState(state)
  }

  return {
    createZoomImage,
    zoomImageState,
    setZoomImageState,
  }
}
