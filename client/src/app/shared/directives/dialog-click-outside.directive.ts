import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../+store/reducers';
import { DialogActions } from '../../+store/dialog/actions/dialog.actions';
import { DialogTypeEnum } from '../models/enums/dialog-type.enum';

@Directive({
  selector: '[appDialogClickOutside]',
  standalone: true,
})
export class DialogClickOutsideDirective {
  private elementRef = inject(ElementRef);

  private store = inject(Store<State>);

  @HostListener('document:click', ['$event'])
  private onClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;

    if (
      !this.elementRef.nativeElement.contains(targetElement) ||
      this.elementRef.nativeElement !== targetElement
    ) {
      return;
    }

    this.store.dispatch(
      DialogActions.openDialog({
        dialog: {
          title: '',
          dialogType: DialogTypeEnum.None,
        },
      }),
    );
  }
}
