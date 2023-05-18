import { useCallback, useEffect, useRef, useState } from "react"
import { createZoomImageMove as _createZoomImageMove } from "@zoom-image/core"

import type { ZoomImageMoveState } from "@zoom-image/core"

export function useZoomImageMove() {
  const result = useRef<ReturnType<typeof _createZoomImageMove>>()
  const [zoomImageState, updateZoomImageState] = useState<ZoomImageMoveState>({
    zoomedImgStatus: "idle",
  })

  const createZoomImage = useCallback((...arg: Parameters<typeof _createZoomImageMove>) => {
    result.current?.cleanup()
    result.current = _createZoomImageMove(arg[0], arg[1])
    updateZoomImageState(result.current.getState())

    result.current.subscribe((state) => {
      updateZoomImageState(structuredClone(state))
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
