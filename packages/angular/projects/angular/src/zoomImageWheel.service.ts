import { Injectable, OnDestroy } from '@angular/core';
import { ZoomImageWheelState, ZoomImageWheelStateUpdate, createZoomImageWheel as _createZoomImageWheel } from "@zoom-image/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class ZoomImageWheelService implements OnDestroy {
  private _zoomImageState = new BehaviorSubject<ZoomImageWheelState>({
    currentZoom: 1,
    enable: false,
    currentPositionX: -1,
    currentPositionY: -1,
  })

  private result: ReturnType<typeof _createZoomImageWheel> | undefined

  readonly zoomImageState$ = this._zoomImageState.asObservable();

  readonly zoomImageState = this._zoomImageState.value;


  createZoomImage = (...arg: Parameters<typeof _createZoomImageWheel>) => {
    this.result?.cleanup()
    this.result = _createZoomImageWheel(...arg)

    this.result.subscribe(({ state }) => {
      this._zoomImageState.next(state)
    })

  }

  setZoomImageState(state: ZoomImageWheelStateUpdate) {
    this.result?.setState(state)
  }

  ngOnDestroy() {
    this.result?.cleanup()
  }
}
