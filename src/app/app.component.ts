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
  // icons = {xmark: 'fa-solid fa-xmark'}
  title = 'liveCensorship';
  promotField = new FormControl<string>('');
  keywords: string[] = ['person'];

  addKeyword() {
    if (this.promotField.value && !this.keywords.includes(this.promotField.value)) {
      this.keywords.push(this.promotField.value);
    }
    this.promotField.setValue('');
  }

  removeKeyword(index: number) {
    if (index >= 0 && index < this.keywords.length) {
      this.keywords.splice(index, 1);
    } else {
      console.error("Index out of range");
    }
  }
}
