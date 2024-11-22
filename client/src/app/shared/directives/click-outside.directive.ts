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
    const target = event.target as HTMLElement;
    const isButtonOrLinkOrLoader =
      target.closest('button') ??
      target.closest('a') ??
      target.closest('.loading-spinner');
    if (!this.inside(target) && !isButtonOrLinkOrLoader) {
      this.store.dispatch(PopupActions.closePopup());
    }
  }

  public inside(element: HTMLElement): boolean {
    return (
      element === this.elementRef.nativeElement ||
      this.elementRef.nativeElement.contains(element)
    );
  }
}
