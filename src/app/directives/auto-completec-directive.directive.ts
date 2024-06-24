import {Directive, ElementRef, HostListener} from '@angular/core';
import {CENSORED_WORDS} from "../constans/censored-words";

@Directive({
  selector: '[appAutoComplete]',
  standalone: true
})
export class AutoCompleteDirective {
  protected popupElement!: HTMLDivElement;

  constructor(private el: ElementRef) {
    this.createPopupElement();
  }

  @HostListener('input', ['$event']) onInput(event: Event) {
    const inputText = (event.target as HTMLInputElement).value;
    const suggestions = this.getSuggestions(inputText);
    !!inputText ? this.showSuggestions(suggestions) : this.hideSuggestions();
  }

  private getSuggestions(inputText: string): string[] {
    return CENSORED_WORDS.filter(word => word.startsWith(inputText));
  }

  private showSuggestions(suggestions: string[]) {
    if (suggestions.length > 0) {
      const inputElement = this.el.nativeElement as HTMLInputElement;
      const inputRect = inputElement.getBoundingClientRect();
      this.popupElement.style.bottom = `${window.innerHeight - inputRect.top}px`;
      this.popupElement.style.left = `${inputRect.left}px`;
      this.popupElement.style.color = 'black'
      this.popupElement.innerHTML = suggestions.map(suggestion => `<div>${suggestion}</div>`).join('');
      document.body.appendChild(this.popupElement);
      this.popupElement.style.display = 'block';

      this.popupElement.querySelectorAll('div').forEach((element: HTMLDivElement) => {
        element.addEventListener('click', () => {
          inputElement.value = element.textContent || '';
          this.hideSuggestions();
        });
      });
    } else {
      this.hideSuggestions();
    }
  }

  private hideSuggestions() {
    if (this.popupElement) {
      this.popupElement.style.display = 'none';
    }
  }

  private createPopupElement() {
    this.popupElement = document.createElement('div');
    this.popupElement.className = 'autocomplete-popup';
    this.popupElement.style.position = 'absolute';
    this.popupElement.style.display = 'none';
    this.popupElement.style.border = '1px solid #ccc';
    this.popupElement.style.backgroundColor = '#fff';
    this.popupElement.style.padding = '5px';
  }
}
