import { Injectable, OnDestroy } from "@angular/core"
import { ZoomImageMoveState, createZoomImageMove as _createZoomImageMove } from "@zoom-image/core"
import { BehaviorSubject } from "rxjs"

@Injectable()
export class ZoomImageMoveService implements OnDestroy {
  private _zoomImageState = new BehaviorSubject<ZoomImageMoveState>({
    zoomedImgStatus: "idle",
  })

  private result: ReturnType<typeof _createZoomImageMove> | undefined

  readonly zoomImageState$ = this._zoomImageState.asObservable()

  readonly zoomImageState = this._zoomImageState.value

  createZoomImage = (...arg: Parameters<typeof _createZoomImageMove>) => {
    this.result?.cleanup()
    this.result = _createZoomImageMove(...arg)

    this.result.subscribe(({ state }) => {
      this._zoomImageState.next(state)
    })
  }

  ngOnDestroy() {
    this.result?.cleanup()
  }
}
