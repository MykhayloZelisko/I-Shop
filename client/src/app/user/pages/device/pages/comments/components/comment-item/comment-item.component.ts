import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { CommentInterface } from '../../../../../../../shared/models/interfaces/comment.interface';
import { AsyncPipe, DatePipe } from '@angular/common';
import { RatingComponent } from '../../../../../../../shared/components/rating/rating.component';
import { SvgIconComponent } from 'angular-svg-icon';
import { Store } from '@ngrx/store';
import { State } from '../../../../../../../+store/reducers';
import { CommentActions } from '../../../../../../../+store/comments/actions/comment.actions';
import { CommentMenuComponent } from './components/comment-menu/comment-menu.component';
import { Observable } from 'rxjs';
import { UserInterface } from '../../../../../../../shared/models/interfaces/user.interface';
import { PopupTypeEnum } from '../../../../../../../shared/models/enums/popup-type.enum';
import { PopupDataInterface } from '../../../../../../../shared/models/interfaces/popup-data.interface';
import { selectPopup } from '../../../../../../../+store/popup/selectors/popup.selectors';
import { PopupActions } from '../../../../../../../+store/popup/actions/popup.actions';
import { selectCurrentComment } from '../../../../../../../+store/comments/selectors/comment.selectors';
import { CommentsListStatusInterface } from '../../../../../../../shared/models/interfaces/comments-list-status.interface';
import { CommentDialogComponent } from '../../../../../../../shared/components/comment-dialog/comment-dialog.component';

@Component({
  selector: 'app-comment-item',
  standalone: true,
  imports: [
    DatePipe,
    RatingComponent,
    SvgIconComponent,
    CommentMenuComponent,
    AsyncPipe,
    CommentDialogComponent,
  ],
  templateUrl: './comment-item.component.html',
  styleUrl: './comment-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentItemComponent implements OnInit {
  public comment = input.required<CommentInterface>();

  public user$ = input.required<Observable<UserInterface | null>>();

  public commentsStatus$ =
    input.required<Observable<CommentsListStatusInterface>>();

  public readonly popupEnum = PopupTypeEnum;

  public dialog$!: Observable<PopupDataInterface>;

  public currentComment$!: Observable<string | null>;

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.dialog$ = this.store.select(selectPopup);
    this.currentComment$ = this.store.select(selectCurrentComment);
  }

  public likeComment(status: 1 | -1): void {
    this.store.dispatch(
      CommentActions.updateLikes({ commentId: this.comment().id, status }),
    );
  }

  public openMenu(): void {
    this.store.dispatch(
      PopupActions.openPopup({
        popup: { title: '', popupType: PopupTypeEnum.CommentMenu },
      }),
    );
    this.store.dispatch(
      CommentActions.updateCurrentComment({ id: this.comment().id }),
    );
  }
}
