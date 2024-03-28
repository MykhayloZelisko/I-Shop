import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  emailPatternValidator,
  minMaxLengthValidator,
  namePatternValidator,
  passwordPatternValidator,
  phoneNumberValidator,
  requiredValidator,
  showErrorMessage,
} from '../../../../../../../shared/utils/validators';
import { AuthDialogActions } from '../../../../../../../+store/auth-dialog/actions/auth-dialog.actions';
import { AuthDialogTypeEnum } from '../../../../../../../shared/models/enums/auth-dialog-type.enum';
import { Store } from '@ngrx/store';
import { State } from '../../../../../../../+store/reducers';
import { NgxMaskDirective } from 'ngx-mask';
import { AuthActions } from '../../../../../../../+store/auth/actions/auth.actions';

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationFormComponent {
  private regPassword =
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}\[\]:;<>,.?\/~_+\-=|\\]).{8,32}$/;

  private regEmail =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  private regName = /^([A-Z]{1}[a-z-]+|[А-Я]{1}[а-я-]+)$/;

  private regPhone =
    /^(39|50|63|66|67|68|73|75|77|91|92|93|94|95|96|97|98|99)\d{7}$/;

  private fb = inject(FormBuilder);

  public registrationForm: FormGroup = this.fb.group({
    email: [null, [requiredValidator(), emailPatternValidator(this.regEmail)]],
    firstName: [
      null,
      [
        requiredValidator(),
        minMaxLengthValidator(3, null),
        namePatternValidator(this.regName),
      ],
    ],
    lastName: [
      null,
      [
        requiredValidator(),
        minMaxLengthValidator(3, null),
        namePatternValidator(this.regName),
      ],
    ],
    phone: [null, [requiredValidator(), phoneNumberValidator(this.regPhone)]],
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
    const control = this.registrationForm.controls[controlName];
    return showErrorMessage(control);
  }

  public login(): void {
    this.store.dispatch(
      AuthDialogActions.authDialog({
        dialog: {
          title: 'Вхід',
          dialogType: AuthDialogTypeEnum.Login,
        },
      }),
    );
  }

  public registration(): void {
    const registrationData = this.registrationForm.getRawValue();
    this.store.dispatch(
      AuthActions.registration({ registration: registrationData }),
    );
  }
}
