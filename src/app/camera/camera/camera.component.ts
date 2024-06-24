import {Component, ElementRef, ViewChild} from '@angular/core';
import * as cocoSSD from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.scss'
})
export class CameraComponent {
  @ViewChild('videoElement', {static: false}) videoElement: ElementRef;
  video: any;
  modelCOCOSSD: any
  constraints = {
    video: {
      facingMode: 'user'
    },
    audio: false
  };

  constructor(private elem: ElementRef) {
    navigator.mediaDevices.getUserMedia(this.constraints).then((stream) => {
      this.video = this.videoElement.nativeElement;
      this.video.srcObject = stream;

      (async () => {
        this.modelCOCOSSD = await cocoSSD.load();
        this.detectFrame(this.video, this.modelCOCOSSD)
      })();
    });
  }

  detectFrame = (video: any, model: any) => {
    // console.log(video, model)
    model.detect(video).then((predictions: any[]) => {
      // console.log(predictions)
      this.renderPredictions(predictions);
      requestAnimationFrame(() => {
        this.detectFrame(video, model);
      });
    });
  }

  waitForVideoReady(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.video.oncanplay = () => {
        resolve();
      };
    });
  }

  renderPredictions = (predictions: any[]) => {
    const canvas = <HTMLCanvasElement>document.getElementById("myCanvas");
    const ctx = <CanvasRenderingContext2D>canvas.getContext("2d");

    canvas.width = 640;
    canvas.height = 480;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Font options.
    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";
    ctx.drawImage(this.video, 0, 0, 640, 480);

    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];
      // Draw the bounding box.
      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      // Draw the label background.
      ctx.fillStyle = "#00FFFF";
      const textWidth = ctx.measureText(prediction.class).width;
      const textHeight = parseInt(font, 10); // base 10
      ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
    });

    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      // Draw the text last to ensure it's on top.
      ctx.fillStyle = "#000000";
      ctx.fillText(prediction.class, x, y);
    });
  };
}
