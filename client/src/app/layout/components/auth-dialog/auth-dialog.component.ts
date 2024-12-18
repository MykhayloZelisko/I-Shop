import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { PopupTypeEnum } from '../../../shared/models/enums/popup-type.enum';
import { RegistrationFormComponent } from './components/registration-form/registration-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RestorePasswordFormComponent } from './components/restore-password-form/restore-password-form.component';
import { PopupDataInterface } from '../../../shared/models/interfaces/popup-data.interface';
import { Store } from '@ngrx/store';
import { State } from '../../../+store/reducers';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';
import { PopupActions } from '../../../+store/popup/actions/popup.actions';

@Component({
  selector: 'app-auth-dialog',
  standalone: true,
  imports: [
    SvgIconComponent,
    RegistrationFormComponent,
    LoginFormComponent,
    RestorePasswordFormComponent,
    ClickOutsideDirective,
  ],
  templateUrl: './auth-dialog.component.html',
  styleUrl: './auth-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthDialogComponent {
  public dialog = input.required<PopupDataInterface>();

  public readonly dialogTypeEnum = PopupTypeEnum;

  private store = inject(Store<State>);

  public closeDialog(): void {
    this.store.dispatch(PopupActions.closePopup());
  }
}
