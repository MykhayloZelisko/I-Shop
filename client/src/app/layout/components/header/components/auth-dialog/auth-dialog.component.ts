import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { AuthDialogTypeEnum } from '../../../../../shared/models/enums/auth-dialog-type.enum';
import { RegistrationFormComponent } from './components/registration-form/registration-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RestorePasswordFormComponent } from './components/restore-password-form/restore-password-form.component';
import { AuthDialogDataInterface } from '../../../../../shared/models/interfaces/auth-dialog-data.interface';
import { Store } from '@ngrx/store';
import { State } from '../../../../../+store/reducers';
import { AuthDialogActions } from '../../../../../+store/auth-dialog/actions/auth-dialog.actions';
import { DialogClickOutsideDirective } from './directives/dialog-click-outside.directive';

@Component({
  selector: 'app-auth-dialog',
  standalone: true,
  imports: [
    SvgIconComponent,
    RegistrationFormComponent,
    LoginFormComponent,
    RestorePasswordFormComponent,
    DialogClickOutsideDirective,
  ],
  templateUrl: './auth-dialog.component.html',
  styleUrl: './auth-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthDialogComponent {
  @Input({ required: true }) public dialog!: AuthDialogDataInterface;

  public readonly dialogTypeEnum = AuthDialogTypeEnum;

  private store = inject(Store<State>);

  public closeDialog(): void {
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
