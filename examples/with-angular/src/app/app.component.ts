import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core"
import { ZoomImageWheelService } from "@zoom-image/angular"
import { ZoomImageWheelState, cropImage } from "@zoom-image/core"

type Tab = {
  name: string
  href: string
  current: boolean
  value: "wheel" | "hover" | "move" | "click"
}

type ZoomType = "wheel" | "hover" | "move" | "click"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  providers: [ZoomImageWheelService],
})
export class AppComponent implements AfterViewInit {
  @ViewChild("imageWheelContainer") imageWheelContainerRef: ElementRef | undefined
  // @ViewChild('imageMoveContainer') imageMoveContainerRef: ElementRef;
  // @ViewChild('imageHoverContainer') imageHoverContainerRef: ElementRef;
  // @ViewChild('imageClickContainer') imageClickContainerRef: ElementRef;
  // @ViewChild('zoomTarget') zoomTargetRef: ElementRef;

  zoomImageWheelState: ZoomImageWheelState = {} as ZoomImageWheelState

  tabs: Tab[] = [
    { name: "Wheel", href: "#", current: true, value: "wheel" },
    { name: "Hover", href: "#", current: false, value: "hover" },
    { name: "Move", href: "#", current: false, value: "move" },
    { name: "Click", href: "#", current: false, value: "click" },
  ]

  zoomType: ZoomType = "wheel"
  croppedImage: string = ""

  constructor(private zoomImageWheelService: ZoomImageWheelService) {
    this.zoomImageWheelState = zoomImageWheelService.zoomImageState
  }

  ngAfterViewInit(): void {
    if (this.imageWheelContainerRef) {
      this.zoomImageWheelService.createZoomImage(this.imageWheelContainerRef.nativeElement)
      this.zoomImageWheelService.zoomImageState$.subscribe((state) => {
        this.zoomImageWheelState = state
      })
    }
  }

  getCurrentZoomImageValue() {
    return `${Math.round(this.zoomImageWheelState.currentZoom * 100)}%`
  }

  handleTabClick(tab: Tab) {
    const zoomType = tab.value
    if (zoomType === this.zoomType) {
      return
    }

    this.croppedImage = ""
    this.tabs.forEach((tab) => (tab.current = false))
    tab.current = true
    this.zoomType = zoomType
  }

  zoomIn() {
    this.zoomImageWheelService.setZoomImageState({ currentZoom: this.zoomImageWheelState.currentZoom + 0.5 })
  }

  zoomOut() {
    this.zoomImageWheelService.setZoomImageState({ currentZoom: this.zoomImageWheelState.currentZoom - 0.5 })
  }

  handleCropWheelZoomImage() {
    this.croppedImage = cropImage({
      currentZoom: this.zoomImageWheelState.currentZoom,
      image: (this.imageWheelContainerRef?.nativeElement as HTMLDivElement).querySelector("img") as HTMLImageElement,
      positionX: this.zoomImageWheelState.currentPositionX,
      positionY: this.zoomImageWheelState.currentPositionY,
    })
  }
}
