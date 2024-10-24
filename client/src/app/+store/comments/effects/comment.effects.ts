import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CommentsService } from '../services/comments.service';
import { Store } from '@ngrx/store';
import { State } from '../../reducers';
import { CommentActions } from '../actions/comment.actions';
import { catchError, mergeMap, of, switchMap, tap } from 'rxjs';
import { LoaderActions } from '../../loader/actions/loader.actions';
import { CommentInterface } from '../../../shared/models/interfaces/comment.interface';
import { DeviceActions } from '../../devices/actions/device.actions';
import { CommentsListInterface } from '../../../shared/models/interfaces/comments-list.interface';
import { PopupActions } from '../../popup/actions/popup.actions';

@Injectable()
export class CommentEffects {
  private actions$ = inject(Actions);

  private commentsService = inject(CommentsService);

  private store = inject(Store<State>);

  public addComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentActions.addComment),
      tap(() => this.store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        this.commentsService.addComment(action.comment).pipe(
          mergeMap((comment: CommentInterface) => [
            LoaderActions.toggleLoader(),
            CommentActions.addCommentSuccess({ comment }),
            DeviceActions.updateDeviceRating({
              id: comment.device.id,
              votes: comment.device.votes,
              rating: comment.device.rating,
            }),
            DeviceActions.updateCurrentDeviceRating({
              votes: comment.device.votes,
              rating: comment.device.rating,
            }),
            PopupActions.closePopup(),
          ]),
          catchError(() => {
            this.store.dispatch(LoaderActions.toggleLoader());
            return of(CommentActions.addCommentFailure());
          }),
        ),
      ),
    ),
  );

  public addCommentFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CommentActions.addCommentFailure),
        tap(() => {
          // TODO: add dialog
        }),
      ),
    { dispatch: false },
  );

  public loadComments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentActions.loadComments),
      tap(() => this.store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        this.commentsService
          .getAllCommentsByDeviceId(
            action.deviceId,
            action.cursor,
            action.limit,
          )
          .pipe(
            mergeMap((comments: CommentsListInterface) => [
              LoaderActions.toggleLoader(),
              CommentActions.loadCommentsSuccess({ comments }),
            ]),
            catchError(() => {
              this.store.dispatch(LoaderActions.toggleLoader());
              return of(CommentActions.loadCommentsFailure());
            }),
          ),
      ),
    ),
  );

  public loadCommentsFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CommentActions.loadCommentsFailure),
        tap(() => {
          // TODO: add dialog
        }),
      ),
    { dispatch: false },
  );

  public updateLikes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentActions.updateLikes),
      tap(() => this.store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        this.commentsService
          .updateLikeDislike(action.commentId, action.status)
          .pipe(
            mergeMap((comment: CommentInterface) => [
              LoaderActions.toggleLoader(),
              CommentActions.updateLikesSuccess({ comment }),
            ]),
            catchError(() => {
              this.store.dispatch(LoaderActions.toggleLoader());
              return of(CommentActions.updateLikesFailure());
            }),
          ),
      ),
    ),
  );

  public updateLikesFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CommentActions.updateLikesFailure),
        tap(() => {
          // TODO: add dialog
        }),
      ),
    { dispatch: false },
  );
}
