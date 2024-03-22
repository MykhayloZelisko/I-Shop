import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../../../../+store/reducers';
import { AuthDialogActions } from '../../../../../../+store/auth-dialog/actions/auth-dialog.actions';
import { AuthDialogTypeEnum } from '../../../../../../shared/models/enums/auth-dialog-type.enum';

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
      this.elementRef.nativeElement
        .querySelector('.auth-dialog')
        .contains(targetElement)
    ) {
      return;
    }

    this.store.dispatch(
      AuthDialogActions.authDialog({
        dialog: {
          title: '',
          dialogType: AuthDialogTypeEnum.None,
        },
      }),
    );
  }
}
