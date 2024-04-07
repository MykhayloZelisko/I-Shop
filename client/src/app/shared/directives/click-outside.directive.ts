import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../+store/reducers';
import { DialogActions } from '../../+store/dialog/actions/dialog.actions';
import { DialogTypeEnum } from '../models/enums/dialog-type.enum';
import { MainMenuActions } from '../../+store/main-menu/actions/main-menu.actions';

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
      this.store.dispatch(
        DialogActions.openDialog({
          dialog: {
            title: '',
            dialogType: DialogTypeEnum.None,
          },
        }),
      );
      this.store.dispatch(MainMenuActions.toggleMainMenu({ toggle: 'close' }));
    }
  }
}
