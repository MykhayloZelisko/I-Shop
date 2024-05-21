import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../+store/reducers';
import { PopupActions } from '../../+store/popup/actions/popup.actions';

@Directive({
  selector: '[appClickOutside]',
  standalone: true,
})
export class ClickOutsideDirective {
  private elementRef = inject(ElementRef);

  private store = inject(Store<State>);

  @HostListener('document:click', ['$event'])
  private onClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;

    if (
      this.elementRef.nativeElement.contains(targetElement) &&
      this.elementRef.nativeElement === targetElement
    ) {
      this.store.dispatch(PopupActions.closePopup());
    }
  }
}
