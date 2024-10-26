import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
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
  @Input({ required: true }) public dialog!: PopupDataInterface;

  @Input({ required: true }) public deviceId!: string;

  @Input({ required: true }) public userId!: string;

  @Input() public comment!: CommentInterface;

  private store = inject(Store<State>);

  public closeDialog(): void {
    this.store.dispatch(PopupActions.closePopup());
  }
}
