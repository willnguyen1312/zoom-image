import { $, noSerialize, useSignal, useStore, useVisibleTask$ } from "@builder.io/qwik"
import { createZoomImageWheel as _createZoomImageWheel } from "@zoom-image/core"

import type { ZoomImageWheelState, ZoomImageWheelStateUpdate } from "@zoom-image/core"

function updateObjectProps(target: Record<string, unknown>, source: Record<string, unknown>) {
  for (const key in source) {
    target[key] = source[key]
  }
}

export function useZoomImageWheel() {
  const result = useSignal<ReturnType<typeof _createZoomImageWheel> | undefined>(undefined)

  const zoomImageState = useStore<ZoomImageWheelState>({
    currentPositionX: -1,
    currentPositionY: -1,
    currentZoom: 1,
    enable: false,
  })

  useVisibleTask$(({ cleanup }) => {
    cleanup(() => {
      result.value?.cleanup()
    })
  })

  const createZoomImage = $((...arg: Parameters<typeof _createZoomImageWheel>) => {
    result.value = noSerialize(_createZoomImageWheel(...arg))
    const currentState = result.value?.getState()

    if (currentState) {
      updateObjectProps(zoomImageState, currentState)
    }

    result.value?.subscribe(({ updatedProperties }) => {
      updateObjectProps(zoomImageState, updatedProperties)
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
