import { useCallback, useEffect, useRef, useState } from "react"
import { createZoomImageClick as _createZoomImageClick } from "@zoom-image/core"

import type { ZoomImageMoveState } from "@zoom-image/core"

export function useZoomImageClick() {
  const result = useRef<ReturnType<typeof _createZoomImageClick>>()
  const [zoomImageState, updateZoomImageState] = useState<ZoomImageMoveState>({
    zoomedImgStatus: "idle",
  })

  const createZoomImage = useCallback((...arg: Parameters<typeof _createZoomImageClick>) => {
    result.current?.cleanup()
    result.current = _createZoomImageClick(...arg)
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
  }
}
