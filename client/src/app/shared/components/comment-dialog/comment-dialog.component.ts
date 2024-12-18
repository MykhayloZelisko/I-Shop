import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { PopupDataInterface } from '../../models/interfaces/popup-data.interface';
import { SvgIconComponent } from 'angular-svg-icon';
import { Store } from '@ngrx/store';
import { State } from '../../../+store/reducers';
import { PopupActions } from '../../../+store/popup/actions/popup.actions';
import { CommentFormComponent } from '../comment-form/comment-form.component';
import { CommentInterface } from '../../models/interfaces/comment.interface';

@Component({
  selector: 'app-comment-dialog',
  standalone: true,
  imports: [ClickOutsideDirective, SvgIconComponent, CommentFormComponent],
  templateUrl: './comment-dialog.component.html',
  styleUrl: './comment-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentDialogComponent {
  public dialog = input.required<PopupDataInterface>();

  public deviceId = input.required<string>();

  public userId = input.required<string>();

  public comment = input<CommentInterface>();

  private store = inject(Store<State>);

  public closeDialog(): void {
    this.store.dispatch(PopupActions.closePopup());
  }
}
