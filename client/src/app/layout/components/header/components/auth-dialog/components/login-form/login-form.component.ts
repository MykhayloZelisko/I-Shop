import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  emailPatternValidator,
  minMaxLengthValidator,
  passwordPatternValidator,
  requiredValidator,
  showErrorMessage,
} from '../../../../../../../shared/utils/validators';
import { Store } from '@ngrx/store';
import { State } from '../../../../../../../+store/reducers';
import { AuthDialogActions } from '../../../../../../../+store/auth-dialog/actions/auth-dialog.actions';
import { AuthDialogTypeEnum } from '../../../../../../../shared/models/enums/auth-dialog-type.enum';
import { AuthActions } from '../../../../../../../+store/auth/actions/auth.actions';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {
  private regEmail =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  private regPassword =
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}\[\]:;<>,.?\/~_+\-=|\\]).{8,32}$/;

  private fb = inject(FormBuilder);

  public loginForm: FormGroup = this.fb.group({
    email: [null, [requiredValidator(), emailPatternValidator(this.regEmail)]],
    password: [
      null,
      [
        requiredValidator(),
        minMaxLengthValidator(8, 32),
        passwordPatternValidator(this.regPassword),
      ],
    ],
  });

  private store = inject(Store<State>);

  public showMessage(controlName: string): string {
    const control = this.loginForm.controls[controlName];
    return showErrorMessage(control);
  }

  public registration(): void {
    this.store.dispatch(
      AuthDialogActions.authDialog({
        dialog: {
          title: 'Реєстрація',
          dialogType: AuthDialogTypeEnum.Registration,
        },
      }),
    );
  }

  public restorePassword(): void {
    this.store.dispatch(
      AuthDialogActions.authDialog({
        dialog: {
          title: 'Відновлення пароля',
          dialogType: AuthDialogTypeEnum.RestorePassword,
        },
      }),
    );
  }

  public login(): void {
    const loginData = this.loginForm.getRawValue();
    this.store.dispatch(AuthActions.login({ login: loginData }));
  }
}
