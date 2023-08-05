import { Injectable, OnDestroy } from '@angular/core';
import { ZoomImageHoverState, createZoomImageHover as _createZoomImageHover } from "@zoom-image/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class ZoomImageHoverService implements OnDestroy {
  private _zoomImageState = new BehaviorSubject<ZoomImageHoverState>({
    enabled: false,
    zoomedImgStatus: "idle",
  })

  private result: ReturnType<typeof _createZoomImageHover> | undefined

  readonly zoomImageState$ = this._zoomImageState.asObservable();

  readonly zoomImageState = this._zoomImageState.value;


  createZoomImage = (...arg: Parameters<typeof _createZoomImageHover>) => {
    this.result?.cleanup()
    this.result = _createZoomImageHover(...arg)

    this.result.subscribe(({ state }) => {
      this._zoomImageState.next(state)
    })

  }

  ngOnDestroy() {
    this.result?.cleanup()
  }
}
