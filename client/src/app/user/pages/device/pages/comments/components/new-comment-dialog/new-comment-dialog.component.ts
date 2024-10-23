import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { ClickOutsideDirective } from '../../../../../../../shared/directives/click-outside.directive';
import { PopupDataInterface } from '../../../../../../../shared/models/interfaces/popup-data.interface';
import { SvgIconComponent } from 'angular-svg-icon';
import { Store } from '@ngrx/store';
import { State } from '../../../../../../../+store/reducers';
import { PopupActions } from '../../../../../../../+store/popup/actions/popup.actions';
import { NewCommentFormComponent } from '../../../../../../../shared/components/new-comment-form/new-comment-form.component';
import { Observable } from 'rxjs';
import { UserInterface } from '../../../../../../../shared/models/interfaces/user.interface';

@Component({
  selector: 'app-new-comment-dialog',
  standalone: true,
  imports: [ClickOutsideDirective, SvgIconComponent, NewCommentFormComponent],
  templateUrl: './new-comment-dialog.component.html',
  styleUrl: './new-comment-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewCommentDialogComponent {
  @Input({ required: true }) public dialog!: PopupDataInterface;

  @Input({ required: true }) public deviceId!: string;

  @Input({ required: true }) public user$!: Observable<UserInterface | null>;

  private store = inject(Store<State>);

  public closeDialog(): void {
    this.store.dispatch(PopupActions.closePopup());
  }
}
