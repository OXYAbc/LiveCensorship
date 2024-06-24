import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CameraComponent} from "./camera.component";
import {WebcamModule} from "ngx-webcam";

@NgModule({
  declarations: [CameraComponent],
  exports: [CameraComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    WebcamModule,
  ]
})
export class CameraModule { }
