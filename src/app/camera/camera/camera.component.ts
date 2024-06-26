import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import * as cocoSSD from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import {WebcamImage} from "ngx-webcam";

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.scss'
})
export class CameraComponent {
  @ViewChild('videoElement', {static: false}) videoElement: ElementRef;
  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;

  @Input() keywords: string[];
  modelCOCOSSD: cocoSSD.ObjectDetection;

  constructor() {
    navigator.mediaDevices.getUserMedia({video: true}).then((stream) => {
      this.videoElement.nativeElement.srcObject = stream;

      (async () => {
        this.modelCOCOSSD = await cocoSSD.load();
        this.detectFrame(this.videoElement.nativeElement, this.modelCOCOSSD)
      })();
    });
  }

  detectFrame = (video: WebcamImage, model: any) => {
    model.detect(video).then((predictions: any[]) => {
      this.renderPredictions(predictions);
      requestAnimationFrame(() => {
        this.detectFrame(video, model);
      });
    });
  }

  renderPredictions = (predictions: any[]) => {
    const context = <CanvasRenderingContext2D>this.canvas.nativeElement.getContext("2d");

    this.canvas.nativeElement.width = 640;
    this.canvas.nativeElement.height = 480;

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    const font = "16px sans-serif";
    context.font = font;
    context.textBaseline = "top";
    context.drawImage(this.videoElement.nativeElement, 0, 0, 640, 480);

    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];

      context.strokeStyle = "#bb171e";
      context.lineWidth = 2;
      context.strokeRect(x, y, width, height);

      context.fillStyle = "#bb171e";
      const textWidth = context.measureText(prediction.class).width;
      const textHeight = parseInt(font, 10);
      context.fillRect(x, y, textWidth + 4, textHeight + 4);
    });

    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];

      context.fillStyle = "#000000";
      context.fillText(prediction.class, x, y);

      if (this.keywords.includes(prediction.class) && prediction.score > 0.5) {
        this.blurArea(context, prediction.bbox);
      }
    });
  };

  blurArea(context: CanvasRenderingContext2D, bbox: number[]) {
    const [x, y, width, height] = bbox;
    context.filter = 'blur(10px)';
    context.fillRect(x, y, width, height);
    context.filter = 'none';
  }
}
