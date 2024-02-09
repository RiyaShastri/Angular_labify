import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[loadingSpinner]',
})
export class LoadingSpinnerDirective {
  hostElement!: any;

  @Input() set loadingSpinner(loading: boolean) {
    if (loading) {
      this.renderer.setStyle(this.hostElement, 'position', 'relative');
      this.renderer.setStyle(this.hostElement, 'overflow', 'hidden');

      const spinnerWrapper = this.renderer.createElement('div');
      this.renderer.addClass(spinnerWrapper, 'spinner-wrapper');
      const spinnerWrapperStyle: any = {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        display: 'flex',
        'justify-content': 'center',
        'align-items': 'center',
        'background-color': '#00000080',
      };

      for (let roleKey in spinnerWrapperStyle) {
        this.renderer.setStyle(
          spinnerWrapper,
          roleKey,
          spinnerWrapperStyle[roleKey]
        );
      }

      const spinnerElement = this.renderer.createElement('div');
      this.renderer.addClass(spinnerElement, 'spinner-border'); // bootstrap class
      this.renderer.addClass(spinnerElement, 'text-white'); // bootstrap class
      this.renderer.setStyle(spinnerElement, 'width', '24px');
      this.renderer.setStyle(spinnerElement, 'height', '24px');

      this.renderer.appendChild(this.hostElement, spinnerWrapper);
      this.renderer.appendChild(spinnerWrapper, spinnerElement);
    } else {
      const spinnerWrapper = this.hostElement.querySelector('.spinner-wrapper');
      if (spinnerWrapper) {
        this.renderer.removeChild(this.hostElement, spinnerWrapper);
      }
    }
  }

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {
    this.hostElement = this.elementRef.nativeElement;
  }
}
