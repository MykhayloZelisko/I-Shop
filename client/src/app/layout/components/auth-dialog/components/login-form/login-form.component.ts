import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  viewChildren,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  emailPatternValidator,
  minMaxLengthValidator,
  passwordPatternValidator,
  requiredValidator,
} from '../../../../../shared/utils/validators';
import { Store } from '@ngrx/store';
import { State } from '../../../../../+store/reducers';
import { PopupTypeEnum } from '../../../../../shared/models/enums/popup-type.enum';
import { AuthActions } from '../../../../../+store/auth/actions/auth.actions';
import { PopupActions } from '../../../../../+store/popup/actions/popup.actions';
import { LoginFormInterface } from '../../../../../shared/models/interfaces/login-form.interface';
import { LoginInterface } from '../../../../../shared/models/interfaces/login.interface';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import {
  REG_EMAIL,
  REG_PASSWORD,
} from '../../../../../shared/models/constants/reg-exp-patterns';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent implements OnInit {
  public inputs = viewChildren(InputComponent);

  public loginForm!: FormGroup<LoginFormInterface>;

  private fb = inject(FormBuilder);

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.initLoginForm();
  }

  public initLoginForm(): void {
    this.loginForm = this.fb.group<LoginFormInterface>({
      email: this.fb.nonNullable.control<string>('', [
        requiredValidator(),
        emailPatternValidator(REG_EMAIL),
      ]),
      password: this.fb.nonNullable.control<string>('', [
        requiredValidator(),
        minMaxLengthValidator(8, 32),
        passwordPatternValidator(REG_PASSWORD),
      ]),
    });
  }

  public registration(): void {
    this.store.dispatch(
      PopupActions.openPopup({
        popup: {
          title: 'Реєстрація',
          popupType: PopupTypeEnum.Registration,
        },
      }),
    );
  }

  public restorePassword(): void {
    this.store.dispatch(
      PopupActions.openPopup({
        popup: {
          title: 'Відновлення пароля',
          popupType: PopupTypeEnum.RestorePassword,
        },
      }),
    );
  }

  public login(): void {
    this.inputs().forEach((input: InputComponent) => {
      input.markAsDirty();
    });
    if (this.loginForm.valid) {
      const loginData: LoginInterface = this.loginForm.getRawValue();
      this.store.dispatch(AuthActions.login({ login: loginData }));
    }
  }
}
