import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  emailPatternValidator,
  requiredValidator,
  showErrorMessage,
} from '../../../../../../../shared/utils/validators';
import { Store } from '@ngrx/store';
import { State } from '../../../../../../../+store/reducers';
import { DialogActions } from '../../../../../../../+store/dialog/actions/dialog.actions';
import { DialogTypeEnum } from '../../../../../../../shared/models/enums/dialog-type.enum';

@Component({
  selector: 'app-restore-password-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './restore-password-form.component.html',
  styleUrl: './restore-password-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestorePasswordFormComponent {
  private regEmail =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  private fb = inject(FormBuilder);

  public restorePasswordForm: FormGroup = this.fb.group({
    email: [null, [requiredValidator(), emailPatternValidator(this.regEmail)]],
  });

  private store = inject(Store<State>);

  public showMessage(controlName: string): string {
    const control = this.restorePasswordForm.controls[controlName];
    return showErrorMessage(control);
  }

  public login(): void {
    this.store.dispatch(
      DialogActions.openDialog({
        dialog: {
          title: 'Вхід',
          dialogType: DialogTypeEnum.Login,
        },
      }),
    );
  }
}
