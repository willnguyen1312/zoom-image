import { Component } from "@angular/core"
import { ZoomImageWheelService } from '@zoom-image/angular'

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  providers: [ZoomImageWheelService],
})
export class AppComponent {
  title = "with-angular"

  constructor(private zoomImageWheelService: ZoomImageWheelService) {
  }
}
