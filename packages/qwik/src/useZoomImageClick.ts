import { $, useStore, useVisibleTask$ } from "@builder.io/qwik"
import { overrideObjectProps } from "@namnode/utils"
import { createZoomImageClick as _createZoomImageClick } from "@zoom-image/core"

import type { ZoomImageMoveState } from "@zoom-image/core"

export function useZoomImageClick() {
  const result: { value: ReturnType<typeof _createZoomImageClick> } = {} as {
    value: ReturnType<typeof _createZoomImageClick>
  }
  const zoomImageState = useStore<ZoomImageMoveState>({
    zoomedImgStatus: "idle",
  })

  const createZoomImage = $((...arg: Parameters<typeof _createZoomImageClick>) => {
    result.value?.cleanup()
    result.value = _createZoomImageClick(...arg)
    const currentState = result.value.getState()
    overrideObjectProps(zoomImageState, currentState)

    result.value.subscribe(({ updatedProperties }) => {
      overrideObjectProps(zoomImageState, updatedProperties)
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
