import { createZoomImageWheel as _createZoomImageWheel } from "@zoom-image/core"
import { useCallback, useEffect, useRef, useState } from "react"
import { noop } from "./shared"

import type { ZoomImageWheelState } from "@zoom-image/core"

export function useZoomImageWheel() {
  const result = useRef<ReturnType<typeof _createZoomImageWheel>>()
  const [zoomImageState, updateZoomImageState] = useState<ZoomImageWheelState>({
    currentZoom: 1,
    enable: false,
    currentPositionX: -1,
    currentPositionY: -1,
    currentRotation: 0,
  })

  const createZoomImage = useCallback((...arg: Parameters<typeof _createZoomImageWheel>) => {
    result.current?.cleanup()
    result.current = _createZoomImageWheel(...arg)
    updateZoomImageState(result.current.getState())

    result.current.subscribe(({ state }) => {
      updateZoomImageState(state)
    })
  }, [])

  const getZoomImageState = useCallback(() => {
    return result.current?.getState()
  }, [])

  useEffect(() => {
    return () => {
      result.current?.cleanup()
    }
  }, [])

  return {
    createZoomImage,
    zoomImageState,
    getZoomImageState,
    setZoomImageState: result.current?.setState ?? noop,
  }
}
