import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core"
import {
  ZoomImageClickService,
  ZoomImageHoverService,
  ZoomImageMoveService,
  ZoomImageWheelService,
} from "@zoom-image/angular"
import {
  ZoomImageClickState,
  ZoomImageHoverState,
  ZoomImageMoveState,
  ZoomImageWheelState,
  cropImage,
} from "@zoom-image/core"

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
  providers: [ZoomImageClickService, ZoomImageHoverService, ZoomImageMoveService, ZoomImageWheelService],
})
export class AppComponent implements AfterViewInit {
  @ViewChild("imageWheelContainer") imageWheelContainerRef?: ElementRef<HTMLDivElement>
  @ViewChild("imageHoverContainer") imageHoverContainerRef?: ElementRef<HTMLDivElement>
  @ViewChild("imageMoveContainer") imageMoveContainerRef?: ElementRef<HTMLDivElement>
  @ViewChild("imageClickContainer") imageClickContainerRef?: ElementRef<HTMLDivElement>
  @ViewChild("zoomTarget") zoomTargetRef?: ElementRef<HTMLDivElement>

  tabs: Tab[] = [
    { name: "Wheel", href: "#", current: true, value: "wheel" },
    { name: "Hover", href: "#", current: false, value: "hover" },
    { name: "Move", href: "#", current: false, value: "move" },
    { name: "Click", href: "#", current: false, value: "click" },
  ]

  zoomType: ZoomType = "wheel"
  croppedImage: string = ""

  zoomImageWheelState: ZoomImageWheelState = this.zoomImageWheelService.zoomImageState
  zoomImageHoverState: ZoomImageHoverState = this.zoomImageHoverService.zoomImageState
  zoomImageMoveState: ZoomImageMoveState = this.zoomImageMoveService.zoomImageState
  zoomImageClickState: ZoomImageClickState = this.zoomImageClickService.zoomImageState

  constructor(
    private zoomImageWheelService: ZoomImageWheelService,
    private zoomImageHoverService: ZoomImageHoverService,
    private zoomImageMoveService: ZoomImageMoveService,
    private zoomImageClickService: ZoomImageClickService,
  ) {}

  ngAfterViewInit(): void {
    if (this.imageWheelContainerRef) {
      this.zoomImageWheelService.zoomImageState$.subscribe((state) => {
        this.zoomImageWheelState = state
      })
      this.processZoom()
    }
  }

  async processZoom() {
    // We need to wait for Angular to render the image before we can apply zoom effect
    await new Promise((resolve) => setTimeout(resolve))

    const handlers: Record<ZoomType, () => void> = {
      wheel: () => {
        this.zoomImageWheelService.createZoomImage(this.imageWheelContainerRef?.nativeElement as HTMLDivElement)
        this.zoomImageWheelService.zoomImageState$.subscribe((state) => {
          this.zoomImageWheelState = state
        })
      },
      hover: () => {
        this.zoomImageHoverService.createZoomImage(this.imageHoverContainerRef?.nativeElement as HTMLDivElement, {
          zoomImageSource: "sample.avif",
          customZoom: { width: 300, height: 500 },
          zoomTarget: this.zoomTargetRef?.nativeElement as HTMLDivElement,
          scale: 2,
        })
        this.zoomImageHoverService.zoomImageState$.subscribe((state) => {
          this.zoomImageHoverState = state
        })
      },
      move: () => {
        this.zoomImageMoveService.createZoomImage(this.imageMoveContainerRef?.nativeElement as HTMLDivElement, {
          zoomImageSource: "sample.avif",
        })
        this.zoomImageMoveService.zoomImageState$.subscribe((state) => {
          this.zoomImageMoveState = state
        })
      },
      click: () => {
        this.zoomImageClickService.createZoomImage(this.imageClickContainerRef?.nativeElement as HTMLDivElement, {
          zoomImageSource: "sample.avif",
        })
        this.zoomImageClickService.zoomImageState$.subscribe((state) => {
          this.zoomImageClickState = state
        })
      },
    }

    handlers[this.zoomType]()
  }

  getCurrentZoomImageValue() {
    return `${Math.round(this.zoomImageWheelState.currentZoom * 100)}%`
  }

  async handleTabClick(tab: Tab) {
    const zoomType = tab.value
    if (zoomType === this.zoomType) {
      return
    }

    this.croppedImage = ""
    this.tabs.forEach((tab) => (tab.current = false))
    tab.current = true
    this.zoomType = zoomType
    this.processZoom()
  }

  zoomIn() {
    this.zoomImageWheelService.setZoomImageState({ currentZoom: this.zoomImageWheelState.currentZoom + 0.5 })
  }

  zoomOut() {
    this.zoomImageWheelService.setZoomImageState({ currentZoom: this.zoomImageWheelState.currentZoom - 0.5 })
  }

  rotate = () => {
    const currentRotation = this.zoomImageWheelState.currentRotation + 90
    this.zoomImageWheelService.setZoomImageState({
      currentRotation,
    })

    if (this.croppedImage) {
      this.handleCropWheelZoomImage(currentRotation)
    }
  }

  getCroppedImageClasses() {
    if (this.zoomImageWheelState.currentRotation % 180 === 90) {
      return "h-[200px] w-[300px]"
    } else {
      return "h-[300px] w-[200px]"
    }
  }

  async handleCropWheelZoomImage(currentRotation = this.zoomImageWheelState.currentRotation) {
    this.croppedImage = await cropImage({
      currentZoom: this.zoomImageWheelState.currentZoom,
      image: (this.imageWheelContainerRef?.nativeElement as HTMLDivElement).querySelector("img") as HTMLImageElement,
      positionX: this.zoomImageWheelState.currentPositionX,
      positionY: this.zoomImageWheelState.currentPositionY,
      rotation: currentRotation,
    })
  }
}
