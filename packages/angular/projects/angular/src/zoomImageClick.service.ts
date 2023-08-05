import { Injectable, OnDestroy } from "@angular/core"
import { ZoomImageClickState, createZoomImageClick as _createZoomImageClick } from "@zoom-image/core"
import { BehaviorSubject } from "rxjs"

@Injectable()
export class ZoomImageClickService implements OnDestroy {
  private _zoomImageState = new BehaviorSubject<ZoomImageClickState>({
    zoomedImgStatus: "idle",
  })

  private result: ReturnType<typeof _createZoomImageClick> | undefined

  readonly zoomImageState$ = this._zoomImageState.asObservable()

  readonly zoomImageState = this._zoomImageState.value

  createZoomImage = (...arg: Parameters<typeof _createZoomImageClick>) => {
    this.result?.cleanup()
    this.result = _createZoomImageClick(...arg)

    this.result.subscribe(({ state }) => {
      this._zoomImageState.next(state)
    })
  }

  ngOnDestroy() {
    this.result?.cleanup()
  }
}
