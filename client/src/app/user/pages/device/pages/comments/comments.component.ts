import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Observable, take } from 'rxjs';
import { PopupDataInterface } from '../../../../../shared/models/interfaces/popup-data.interface';
import { PopupTypeEnum } from '../../../../../shared/models/enums/popup-type.enum';
import { Store } from '@ngrx/store';
import { State } from '../../../../../+store/reducers';
import { selectPopup } from '../../../../../+store/popup/selectors/popup.selectors';
import { AsyncPipe } from '@angular/common';
import { CommentDialogComponent } from '../../../../../shared/components/comment-dialog/comment-dialog.component';
import { DeviceInterface } from '../../../../../shared/models/interfaces/device.interface';
import { selectDevice } from '../../../../../+store/devices/selectors/device.selectors';
import { CommentFormComponent } from '../../../../../shared/components/comment-form/comment-form.component';
import { RatingComponent } from '../../../../../shared/components/rating/rating.component';
import { DeviceAsideComponent } from '../../../../../shared/components/device-aside/device-aside.component';
import { CommentInterface } from '../../../../../shared/models/interfaces/comment.interface';
import {
  selectAllComments,
  selectCommentsStatus,
} from '../../../../../+store/comments/selectors/comment.selectors';
import { CommentActions } from '../../../../../+store/comments/actions/comment.actions';
import { COMMENTS_PAGE_SIZE } from '../../../../../shared/models/constants/page-size';
import { UserInterface } from '../../../../../shared/models/interfaces/user.interface';
import { selectUser } from '../../../../../+store/auth/selectors/auth.selectors';
import { PopupActions } from '../../../../../+store/popup/actions/popup.actions';
import { CommentComponent } from './components/comment/comment.component';
import { selectIdAndPage } from '../../../../../+store/router/selectors/router.selectors';
import { RouterParamsInterface } from '../../../../../shared/models/interfaces/router-params.interface';
import { CommentsListStatusInterface } from '../../../../../shared/models/interfaces/comments-list-status.interface';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    AsyncPipe,
    CommentDialogComponent,
    CommentFormComponent,
    RatingComponent,
    DeviceAsideComponent,
    CommentComponent,
  ],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsComponent implements OnInit {
  public readonly popupEnum = PopupTypeEnum;

  public dialog$!: Observable<PopupDataInterface>;

  public device$!: Observable<DeviceInterface | null>;

  public comments$!: Observable<CommentInterface[]>;

  public user$!: Observable<UserInterface | null>;

  public commentsStatus$!: Observable<CommentsListStatusInterface>;

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.user$ = this.store.select(selectUser);
    this.dialog$ = this.store.select(selectPopup);
    this.device$ = this.store.select(selectDevice);
    this.comments$ = this.store.select(selectAllComments);
    this.commentsStatus$ = this.store.select(selectCommentsStatus);
    this.initCommentsList();
  }

  public initCommentsList(): void {
    this.store
      .select(selectIdAndPage)
      .pipe(take(1))
      .subscribe({
        next: (params: RouterParamsInterface) => {
          if (params.id) {
            this.store.dispatch(
              CommentActions.loadComments({
                deviceId: params.id,
                cursor: null,
                limit: COMMENTS_PAGE_SIZE,
              }),
            );
          }
        },
      });
  }

  public openDialog(user: UserInterface | null): void {
    if (user) {
      this.store.dispatch(
        PopupActions.openPopup({
          popup: {
            title: 'Написати відгук',
            popupType: PopupTypeEnum.NewComment,
          },
        }),
      );
    } else {
      this.store.dispatch(
        PopupActions.openPopup({
          popup: { title: 'Вхід', popupType: PopupTypeEnum.Login },
        }),
      );
    }
  }

  public loadMore(deviceId: string, cursor: string): void {
    this.store.dispatch(
      CommentActions.upsertComments({
        deviceId,
        cursor,
        limit: COMMENTS_PAGE_SIZE,
      }),
    );
  }
}
