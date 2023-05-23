import { useStore, useVisibleTask$, $ } from "@builder.io/qwik"
import { createZoomImageWheel as _createZoomImageWheel } from "@zoom-image/core"

import type { ZoomImageWheelState, ZoomImageWheelStateUpdate } from "@zoom-image/core"

export function useZoomImageWheel() {
  const result: { value: ReturnType<typeof _createZoomImageWheel> } = {} as {
    value: ReturnType<typeof _createZoomImageWheel>
  }
  const zoomImageState = useStore<ZoomImageWheelState>({
    currentPositionX: -1,
    currentPositionY: -1,
    currentZoom: -1,
    enable: false,
  })

  useVisibleTask$(({ cleanup }) => {
    cleanup(() => {
      result.value?.cleanup()
    })
  })

  const createZoomImage = $((...arg: Parameters<typeof _createZoomImageWheel>) => {
    result.value?.cleanup()
    result.value = _createZoomImageWheel(...arg)

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

  const setZoomImageState = $((updateState: ZoomImageWheelStateUpdate) => {
    result.value?.setState(updateState)
  })

  return {
    createZoomImage,
    zoomImageState,
    setZoomImageState,
  }
}
