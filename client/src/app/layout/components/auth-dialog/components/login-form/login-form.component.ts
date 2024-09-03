import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule, ValidatorFn,
} from '@angular/forms';
import {
  emailPatternValidator,
  minMaxLengthValidator,
  passwordPatternValidator,
  requiredValidator,
  showErrorMessage,
} from '../../../../../shared/utils/validators';
import { Store } from '@ngrx/store';
import { State } from '../../../../../+store/reducers';
import { PopupTypeEnum } from '../../../../../shared/models/enums/popup-type.enum';
import { AuthActions } from '../../../../../+store/auth/actions/auth.actions';
import { PopupActions } from '../../../../../+store/popup/actions/popup.actions';
import { LoginFormInterface } from '../../../../../shared/models/interfaces/login-form.interface';
import { LoginInterface } from '../../../../../shared/models/interfaces/login.interface';
import { InputComponent } from '../../../../../shared/components/input/input.component';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent implements OnInit {
  private regEmail =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  private regPassword =
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}\[\]:;<>,.?\/~_+\-=|\\]).{8,32}$/;

  public loginForm!: FormGroup<LoginFormInterface>;

  protected readonly emailValidators: ValidatorFn[] = [
    requiredValidator(),
    emailPatternValidator(this.regEmail),
  ];

  protected readonly passwordValidators: ValidatorFn[] = [
    requiredValidator(),
    minMaxLengthValidator(8, 32),
    passwordPatternValidator(this.regPassword),
  ];

  private fb = inject(FormBuilder);

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.initLoginForm();
  }

  public initLoginForm(): void {
    this.loginForm = this.fb.group<LoginFormInterface>({
      email: this.fb.nonNullable.control<string>('', []),
      password: this.fb.nonNullable.control<string>('', []),
    });
  }

  public showMessage(controlName: string): string {
    const control = this.loginForm.get(controlName) as FormControl;
    return showErrorMessage(control);
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
    const loginData: LoginInterface = this.loginForm.getRawValue();
    this.store.dispatch(AuthActions.login({ login: loginData }));
  }
}
