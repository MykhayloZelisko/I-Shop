import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { MainMenuActions } from '../../../../../../+store/main-menu/actions/main-menu.actions';
import { Store } from '@ngrx/store';
import { State } from '../../../../../../+store/reducers';

@Directive({
  selector: '[appMainMenuClickOutside]',
  standalone: true,
})
export class MainMenuClickOutsideDirective {
  private elementRef = inject(ElementRef);

  private store = inject(Store<State>);

  @HostListener('document:click', ['$event'])
  private onClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;

    if (
      !this.elementRef.nativeElement.contains(targetElement) ||
      this.elementRef.nativeElement
        .querySelector('.main-menu')
        .contains(targetElement)
    ) {
      return;
    }

    this.store.dispatch(MainMenuActions.toggleMainMenu({ toggle: 'close' }));
  }
}
