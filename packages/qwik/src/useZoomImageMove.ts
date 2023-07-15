import { $, useStore, useVisibleTask$ } from "@builder.io/qwik"
import { overrideObjectProps } from "@namnode/utils"
import { createZoomImageMove as _createZoomImageMove } from "@zoom-image/core"

import type { ZoomImageMoveState } from "@zoom-image/core"

export function useZoomImageMove() {
  const result: { value: ReturnType<typeof _createZoomImageMove> } = {} as {
    value: ReturnType<typeof _createZoomImageMove>
  }
  const zoomImageState = useStore<ZoomImageMoveState>({
    zoomedImgStatus: "idle",
  })

  const createZoomImage = $((...arg: Parameters<typeof _createZoomImageMove>) => {
    result.value?.cleanup()
    result.value = _createZoomImageMove(...arg)
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
