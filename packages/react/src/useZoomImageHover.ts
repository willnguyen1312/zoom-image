import { useCallback, useEffect, useRef, useState } from "react"
import { createZoomImageHover as _createZoomImageHover } from "@zoom-image/core"
import { noop } from "./shared"

import type { ZoomImageHoverState } from "@zoom-image/core"

export function useZoomImageHover() {
  const result = useRef<ReturnType<typeof _createZoomImageHover>>()
  const [zoomImageState, updateZoomImageState] = useState<ZoomImageHoverState>({
    enabled: false,
    zoomedImgStatus: "idle",
  })

  const createZoomImage = useCallback((...arg: Parameters<typeof _createZoomImageHover>) => {
    result.current?.cleanup()
    result.current = _createZoomImageHover(...arg)
    updateZoomImageState(result.current.getState())

    result.current.subscribe(({ state }) => {
      updateZoomImageState(state)
    })
  }, [])

  useEffect(() => {
    return () => {
      result.current?.cleanup()
    }
  }, [])

  return {
    createZoomImage,
    zoomImageState,
    setZoomImageState: result.current?.setState ?? noop,
  }
}
