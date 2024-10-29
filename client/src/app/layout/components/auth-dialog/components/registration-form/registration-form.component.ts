import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  QueryList,
  ViewChildren,
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
import {
  REG_EMAIL,
  REG_NAME,
  REG_PASSWORD,
  REG_PHONE,
} from '../../../../../shared/models/constants/reg-exp-patterns';
import { InputComponent } from '../../../../../shared/components/input/input.component';

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgxMaskDirective, InputComponent],
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationFormComponent implements OnInit {
  @ViewChildren(InputComponent) public inputs!: QueryList<InputComponent>;

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
        emailPatternValidator(REG_EMAIL),
      ]),
      firstName: this.fb.nonNullable.control<string>('', [
        requiredValidator(),
        minMaxLengthValidator(3, null),
        namePatternValidator(REG_NAME),
      ]),
      lastName: this.fb.nonNullable.control<string>('', [
        requiredValidator(),
        minMaxLengthValidator(3, null),
        namePatternValidator(REG_NAME),
      ]),
      phone: this.fb.nonNullable.control<string>('', [
        requiredValidator(),
        phoneNumberValidator(REG_PHONE),
      ]),
      password: this.fb.nonNullable.control<string>('', [
        requiredValidator(),
        minMaxLengthValidator(8, 32),
        passwordPatternValidator(REG_PASSWORD),
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
    this.inputs.forEach((input: InputComponent) => {
      input.markAsDirty();
    });
    this.registrationForm.controls.phone.markAsDirty();
    if (this.registrationForm.valid) {
      const registrationData = this.registrationForm.getRawValue();
      this.store.dispatch(
        AuthActions.registration({ registration: registrationData }),
      );
    }
  }
}
