import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { ClickOutsideDirective } from '../../../../../../../../../shared/directives/click-outside.directive';
import { CommentInterface } from '../../../../../../../../../shared/models/interfaces/comment.interface';
import { UserInterface } from '../../../../../../../../../shared/models/interfaces/user.interface';
import { Observable, take } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { State } from '../../../../../../../../../+store/reducers';
import { selectAdmin } from '../../../../../../../../../+store/auth/selectors/auth.selectors';
import { CommentsListStatusInterface } from '../../../../../../../../../shared/models/interfaces/comments-list-status.interface';
import { CommentActions } from '../../../../../../../../../+store/comments/actions/comment.actions';
import { PopupActions } from '../../../../../../../../../+store/popup/actions/popup.actions';
import { PopupTypeEnum } from '../../../../../../../../../shared/models/enums/popup-type.enum';

@Component({
  selector: 'app-comment-menu',
  standalone: true,
  imports: [ClickOutsideDirective, AsyncPipe],
  templateUrl: './comment-menu.component.html',
  styleUrl: './comment-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentMenuComponent implements OnInit {
  public comment = input.required<CommentInterface>();

  public user$ = input.required<Observable<UserInterface | null>>();

  public commentsStatus$ =
    input.required<Observable<CommentsListStatusInterface>>();

  public isAdmin$!: Observable<boolean>;

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.isAdmin$ = this.store.select(selectAdmin);
  }

  public editComment(): void {
    this.store.dispatch(
      PopupActions.openPopup({
        popup: {
          title: 'Редагувати відгук',
          popupType: PopupTypeEnum.EditComment,
        },
      }),
    );
  }

  public deleteComment(id: string): void {
    this.commentsStatus$()
      .pipe(take(1))
      .subscribe({
        next: (status: CommentsListStatusInterface) => {
          this.store.dispatch(
            CommentActions.deleteComment({
              id,
              cursor: status.cursor,
            }),
          );
        },
      });
  }
}
