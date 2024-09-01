import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  emailPatternValidator,
  requiredValidator,
  showErrorMessage,
} from '../../../../../shared/utils/validators';
import { Store } from '@ngrx/store';
import { State } from '../../../../../+store/reducers';
import { PopupTypeEnum } from '../../../../../shared/models/enums/popup-type.enum';
import { PopupActions } from '../../../../../+store/popup/actions/popup.actions';

@Component({
  selector: 'app-restore-password-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './restore-password-form.component.html',
  styleUrl: './restore-password-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestorePasswordFormComponent implements OnInit {
  private regEmail =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  public restorePasswordCtrl!: FormControl<string>;

  private fb = inject(FormBuilder);

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.restorePasswordCtrl = this.fb.nonNullable.control<string>('', [
      requiredValidator(),
      emailPatternValidator(this.regEmail),
    ]);
  }

  public showMessage(): string {
    return showErrorMessage(this.restorePasswordCtrl);
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
