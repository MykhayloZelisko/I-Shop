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
  ReactiveFormsModule,
} from '@angular/forms';
import {
  emailPatternValidator,
  minMaxLengthValidator,
  namePatternValidator,
  passwordPatternValidator,
  phoneNumberValidator,
  requiredValidator,
  showErrorMessage,
} from '../../../../../shared/utils/validators';
import { PopupTypeEnum } from '../../../../../shared/models/enums/popup-type.enum';
import { Store } from '@ngrx/store';
import { State } from '../../../../../+store/reducers';
import { NgxMaskDirective } from 'ngx-mask';
import { AuthActions } from '../../../../../+store/auth/actions/auth.actions';
import { PopupActions } from '../../../../../+store/popup/actions/popup.actions';
import { RegistrationFormInterface } from '../../../../../shared/models/interfaces/registration-form.interface';

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationFormComponent implements OnInit {
  private regPassword =
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}\[\]:;<>,.?\/~_+\-=|\\]).{8,32}$/;

  private regEmail =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  private regName = /^([A-Z]{1}[a-z-]+|[А-Я]{1}[а-я-]+)$/;

  private regPhone =
    /^(39|50|63|66|67|68|73|75|77|91|92|93|94|95|96|97|98|99)\d{7}$/;

  public registrationForm!: FormGroup<RegistrationFormInterface>;

  private fb = inject(FormBuilder);

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.initRegistrationForm();
  }

  public initRegistrationForm(): void {
    this.registrationForm = this.fb.group<RegistrationFormInterface>({
      email: this.fb.nonNullable.control<string>('', [
        requiredValidator(),
        emailPatternValidator(this.regEmail),
      ]),
      firstName: this.fb.nonNullable.control<string>('', [
        requiredValidator(),
        minMaxLengthValidator(3, null),
        namePatternValidator(this.regName),
      ]),
      lastName: this.fb.nonNullable.control<string>('', [
        requiredValidator(),
        minMaxLengthValidator(3, null),
        namePatternValidator(this.regName),
      ]),
      phone: this.fb.nonNullable.control<string>('', [
        requiredValidator(),
        phoneNumberValidator(this.regPhone),
      ]),
      password: this.fb.nonNullable.control<string>('', [
        requiredValidator(),
        minMaxLengthValidator(8, 32),
        passwordPatternValidator(this.regPassword),
      ]),
    });
  }

  public showMessage(controlName: string): string {
    const control = this.registrationForm.get(controlName) as FormControl;
    return showErrorMessage(control);
  }

  public login(): void {
    this.store.dispatch(
      PopupActions.openPopup({
        popup: {
          title: 'Вхід',
          popupType: PopupTypeEnum.Login,
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
