import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { DialogTypeEnum } from '../../../../../shared/models/enums/dialog-type.enum';
import { RegistrationFormComponent } from './components/registration-form/registration-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RestorePasswordFormComponent } from './components/restore-password-form/restore-password-form.component';
import { DialogDataInterface } from '../../../../../shared/models/interfaces/dialog-data.interface';
import { Store } from '@ngrx/store';
import { State } from '../../../../../+store/reducers';
import { DialogActions } from '../../../../../+store/dialog/actions/dialog.actions';
import { DialogClickOutsideDirective } from '../../../../../shared/directives/dialog-click-outside.directive';

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
  @Input({ required: true }) public dialog!: DialogDataInterface;

  public readonly dialogTypeEnum = DialogTypeEnum;

  private store = inject(Store<State>);

  public closeDialog(): void {
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
