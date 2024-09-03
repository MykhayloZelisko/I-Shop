import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  ValidatorFn,
} from '@angular/forms';
import {
  emailPatternValidator,
  requiredValidator,
} from '../../../../../shared/utils/validators';
import { Store } from '@ngrx/store';
import { State } from '../../../../../+store/reducers';
import { PopupTypeEnum } from '../../../../../shared/models/enums/popup-type.enum';
import { PopupActions } from '../../../../../+store/popup/actions/popup.actions';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { REG_EMAIL } from '../../../../../shared/models/constants/reg-exp-patterns';

@Component({
  selector: 'app-restore-password-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent],
  templateUrl: './restore-password-form.component.html',
  styleUrl: './restore-password-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestorePasswordFormComponent implements OnInit {
  protected readonly emailValidators: ValidatorFn[] = [
    requiredValidator(),
    emailPatternValidator(REG_EMAIL),
  ];

  public restorePasswordCtrl!: FormControl<string>;

  private fb = inject(FormBuilder);

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.restorePasswordCtrl = this.fb.nonNullable.control<string>('', []);
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
}
