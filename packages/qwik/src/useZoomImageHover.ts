import { $, useStore, useVisibleTask$ } from "@builder.io/qwik"
import { overrideObjectProps } from "@namnode/utils"
import { createZoomImageHover as _createZoomImageHover } from "@zoom-image/core"

import type { ZoomImageHoverState, ZoomImageHoverStateUpdate } from "@zoom-image/core"

export function useZoomImageHover() {
  const result: { value: ReturnType<typeof _createZoomImageHover> } = {} as {
    value: ReturnType<typeof _createZoomImageHover>
  }
  const zoomImageState = useStore<ZoomImageHoverState>({
    enabled: false,
    zoomedImgStatus: "idle",
  })

  useVisibleTask$(({ cleanup }) => {
    cleanup(() => {
      result.value?.cleanup()
    })
  })

  const createZoomImage = $((...arg: Parameters<typeof _createZoomImageHover>) => {
    result.value?.cleanup()
    result.value = _createZoomImageHover(...arg)
    const currentState = result.value.getState()
    overrideObjectProps(zoomImageState, currentState)

    result.value.subscribe(({ updatedProperties }) => {
      overrideObjectProps(zoomImageState, updatedProperties)
    })
  })

  const setZoomImageState = $((state: ZoomImageHoverStateUpdate) => {
    result.value?.setState(state)
  })

  return {
    createZoomImage,
    zoomImageState,
    setZoomImageState,
  }
}
