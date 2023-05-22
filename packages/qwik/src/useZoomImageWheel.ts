import { useStore, useVisibleTask$, $ } from "@builder.io/qwik"
import { createZoomImageWheel as _createZoomImageWheel } from "@zoom-image/core"

import type { ZoomImageWheelState, ZoomImageWheelStateUpdate } from "@zoom-image/core"

export function useZoomImageWheel() {
  // const result = useSignal<CreateZoomImageWheelResult>()
  const zoomImageState = useStore<ZoomImageWheelState>({
    currentPositionX: -1,
    currentPositionY: -1,
    currentZoom: -1,
    enable: false,
  })

  const result = {} as any

  useVisibleTask$(({ cleanup }) => {
    cleanup(() => {
      result.value?.cleanup()
    })
  })

  const createZoomImage = $((...arg: Parameters<typeof _createZoomImageWheel>) => {
    result.value?.cleanup()
    result.value = _createZoomImageWheel(...arg)

    const currentState = result.value.getState()
    zoomImageState.currentPositionX = currentState.currentPositionX
    zoomImageState.currentPositionY = currentState.currentPositionY
    zoomImageState.currentZoom = currentState.currentZoom
    zoomImageState.enable = currentState.enable
    result.value.subscribe((state: ZoomImageWheelState) => {
      zoomImageState.currentPositionX = state.currentPositionX
      zoomImageState.currentPositionY = state.currentPositionY
      zoomImageState.currentZoom = state.currentZoom
      zoomImageState.enable = state.enable
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
