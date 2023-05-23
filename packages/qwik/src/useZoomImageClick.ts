import { useStore, useVisibleTask$, $ } from "@builder.io/qwik"
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
    for (const key in currentState) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      zoomImageState[key] = currentState[key]
    }

    result.value.subscribe(({ updatedProperties }) => {
      for (const key in updatedProperties) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        zoomImageState[key] = updatedProperties[key]
      }
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
