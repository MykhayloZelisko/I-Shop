import { inject } from '@angular/core';
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
import { DeletedCommentInterface } from '../../../shared/models/interfaces/deleted-comment.interface';

export const addComment$ = createEffect(
  (
    actions$ = inject(Actions),
    commentsService = inject(CommentsService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(CommentActions.addComment),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        commentsService.addComment(action.comment).pipe(
          mergeMap((comment: CommentInterface) => [
            LoaderActions.toggleLoader(),
            CommentActions.addCommentSuccess({ comment }),
            DeviceActions.updateCurrentDeviceRating({
              votes: comment.device.votes,
              rating: comment.device.rating,
            }),
            PopupActions.closePopup(),
          ]),
          catchError(() => {
            store.dispatch(LoaderActions.toggleLoader());
            return of(CommentActions.addCommentFailure());
          }),
        ),
      ),
    ),
  { functional: true },
);

export const addCommentFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(CommentActions.addCommentFailure),
      tap(() => {
        // TODO: add dialog
      }),
    ),
  { dispatch: false, functional: true },
);

export const loadComments$ = createEffect(
  (
    actions$ = inject(Actions),
    commentsService = inject(CommentsService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(CommentActions.loadComments),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        commentsService
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
              store.dispatch(LoaderActions.toggleLoader());
              return of(CommentActions.loadCommentsFailure());
            }),
          ),
      ),
    ),
  { functional: true },
);

export const loadCommentsFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(CommentActions.loadCommentsFailure),
      tap(() => {
        // TODO: add dialog
      }),
    ),
  { dispatch: false, functional: true },
);

export const updateLikes$ = createEffect(
  (
    actions$ = inject(Actions),
    commentsService = inject(CommentsService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(CommentActions.updateLikes),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        commentsService.updateLikeDislike(action.commentId, action.status).pipe(
          mergeMap((comment: CommentInterface) => [
            LoaderActions.toggleLoader(),
            CommentActions.updateLikesSuccess({ comment }),
          ]),
          catchError(() => {
            store.dispatch(LoaderActions.toggleLoader());
            return of(CommentActions.updateLikesFailure());
          }),
        ),
      ),
    ),
  { functional: true },
);

export const updateLikesFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(CommentActions.updateLikesFailure),
      tap(() => {
        // TODO: add dialog
      }),
    ),
  { dispatch: false, functional: true },
);

export const upsertComments$ = createEffect(
  (
    actions$ = inject(Actions),
    commentsService = inject(CommentsService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(CommentActions.upsertComments),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        commentsService
          .getAllCommentsByDeviceId(
            action.deviceId,
            action.cursor,
            action.limit,
          )
          .pipe(
            mergeMap((comments: CommentsListInterface) => [
              LoaderActions.toggleLoader(),
              CommentActions.upsertCommentsSuccess({ comments }),
            ]),
            catchError(() => {
              store.dispatch(LoaderActions.toggleLoader());
              return of(CommentActions.upsertCommentsFailure());
            }),
          ),
      ),
    ),
  { functional: true },
);

export const upsertCommentsFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(CommentActions.upsertCommentsFailure),
      tap(() => {
        // TODO: add dialog
      }),
    ),
  { dispatch: false, functional: true },
);

export const deleteComment$ = createEffect(
  (
    actions$ = inject(Actions),
    commentsService = inject(CommentsService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(CommentActions.deleteComment),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        commentsService.deleteComment(action.id, action.cursor).pipe(
          mergeMap((payload: DeletedCommentInterface) => [
            LoaderActions.toggleLoader(),
            CommentActions.deleteCommentSuccess({ payload }),
            DeviceActions.updateCurrentDeviceRating({
              votes: payload.device.votes,
              rating: payload.device.rating,
            }),
          ]),
          catchError(() => {
            store.dispatch(LoaderActions.toggleLoader());
            return of(CommentActions.deleteCommentFailure());
          }),
        ),
      ),
    ),
  { functional: true },
);

export const deleteCommentFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(CommentActions.deleteCommentFailure),
      tap(() => {
        // TODO: add dialog
      }),
    ),
  { dispatch: false, functional: true },
);

export const updateComment$ = createEffect(
  (
    actions$ = inject(Actions),
    commentsService = inject(CommentsService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(CommentActions.updateComment),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        commentsService.updateComment(action.id, action.comment).pipe(
          mergeMap((comment: CommentInterface) => [
            LoaderActions.toggleLoader(),
            CommentActions.updateCommentSuccess({ comment }),
            DeviceActions.updateCurrentDeviceRating({
              votes: comment.device.votes,
              rating: comment.device.rating,
            }),
            PopupActions.closePopup(),
          ]),
          catchError(() => {
            store.dispatch(LoaderActions.toggleLoader());
            return of(CommentActions.updateCommentFailure());
          }),
        ),
      ),
    ),
  { functional: true },
);

export const updateCommentFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(CommentActions.updateCommentFailure),
      tap(() => {
        // TODO: add dialog
      }),
    ),
  { dispatch: false, functional: true },
);
