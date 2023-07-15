import { $, noSerialize, useSignal, useStore, useVisibleTask$ } from "@builder.io/qwik"
import { overrideObjectProps } from "@namnode/utils"
import type { ZoomImageWheelState, ZoomImageWheelStateUpdate } from "@zoom-image/core"
import { createZoomImageWheel as _createZoomImageWheel } from "@zoom-image/core"

export function useZoomImageWheel() {
  const result = useSignal<ReturnType<typeof _createZoomImageWheel> | undefined>(undefined)

  const zoomImageState = useStore<ZoomImageWheelState>({
    currentZoom: 1,
    enable: false,
    currentPositionX: -1,
    currentPositionY: -1,
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
      overrideObjectProps(zoomImageState, currentState)
    }

    result.value?.subscribe(({ updatedProperties }) => {
      overrideObjectProps(zoomImageState, updatedProperties)
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
