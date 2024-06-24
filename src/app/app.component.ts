import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AutoCompleteDirective} from "./directives/auto-completec-directive.directive";
import {CameraModule} from "./camera/camera/camera.module";
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AutoCompleteDirective, CameraModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'liveCensorship';
  promotField = new FormControl<string>('');
  keywords: string[] = [];

  addKeyword() {
    if (this.promotField.value && !this.promotField.value.includes(this.promotField.value)) {
      this.keywords.push(this.promotField.value);
    }
    this.promotField.setValue('');
  }
}
