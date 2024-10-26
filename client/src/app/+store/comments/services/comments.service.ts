import { inject, Injectable } from '@angular/core';
import { Apollo, gql, MutationResult } from 'apollo-angular';
import { CreateCommentInterface } from '../../../shared/models/interfaces/create-comment.interface';
import { catchError, map, Observable, throwError } from 'rxjs';
import { CommentInterface } from '../../../shared/models/interfaces/comment.interface';
import { ApolloQueryResult } from '@apollo/client';
import { CommentsListInterface } from '../../../shared/models/interfaces/comments-list.interface';
import { DeletedCommentInterface } from '../../../shared/models/interfaces/deleted-comment.interface';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private apollo = inject(Apollo);

  public addComment(
    data: CreateCommentInterface,
  ): Observable<CommentInterface> {
    return this.apollo
      .use('withCredentials')
      .mutate({
        mutation: gql`
          mutation CreateComment($createCommentInput: CreateCommentInput!) {
            createComment(createCommentInput: $createCommentInput) {
              id
              advantages
              disadvantages
              content
              rating
              user {
                id
                firstName
                lastName
              }
              device {
                id
                votes
                rating
              }
              createdAt
              updatedAt
              likesUsers {
                id
              }
              dislikesUsers {
                id
              }
            }
          }
        `,
        variables: { createCommentInput: data },
      })
      .pipe(
        map((response: MutationResult) => {
          if (response.errors) {
            throw response.errors[0];
          } else {
            return response.data.createComment;
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }

  public getAllCommentsByDeviceId(
    deviceId: string,
    cursor: string | null,
    limit: number,
  ): Observable<CommentsListInterface> {
    return this.apollo
      .query<{ comments: CommentsListInterface }>({
        query: gql`
          query Comments($deviceId: ID!, $cursor: ID, $limit: Int!) {
            comments(deviceId: $deviceId, cursor: $cursor, limit: $limit) {
              cursor
              hasMore
              comments {
                id
                rating
                advantages
                disadvantages
                content
                device {
                  id
                }
                user {
                  id
                  firstName
                  lastName
                }
                createdAt
                updatedAt
                likesUsers {
                  id
                }
                dislikesUsers {
                  id
                }
              }
            }
          }
        `,
        variables: { deviceId, cursor, limit },
        fetchPolicy: 'network-only',
      })
      .pipe(
        map(
          (
            response: ApolloQueryResult<{ comments: CommentsListInterface }>,
          ) => {
            if (response.errors) {
              throw response.errors[0];
            } else {
              return response.data.comments;
            }
          },
        ),
        catchError((error) => throwError(() => error)),
      );
  }

  public updateLikeDislike(
    commentId: string,
    status: -1 | 1,
  ): Observable<CommentInterface> {
    return this.apollo
      .use('withCredentials')
      .mutate({
        mutation: gql`
          mutation UpdateLikeDislike(
            $updateLikeDislikeInput: UpdateLikeDislikeInput!
          ) {
            updateLikeDislike(updateLikeDislikeInput: $updateLikeDislikeInput) {
              id
              advantages
              disadvantages
              content
              rating
              user {
                id
                firstName
                lastName
              }
              device {
                id
                votes
                rating
              }
              createdAt
              updatedAt
              likesUsers {
                id
              }
              dislikesUsers {
                id
              }
            }
          }
        `,
        variables: { updateLikeDislikeInput: { commentId, status } },
      })
      .pipe(
        map((response: MutationResult) => {
          if (response.errors) {
            throw response.errors[0];
          } else {
            return response.data.updateLikeDislike;
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }

  public deleteComment(
    id: string,
    cursor: string | null,
  ): Observable<DeletedCommentInterface> {
    return this.apollo
      .use('withCredentials')
      .mutate({
        mutation: gql`
          mutation DeleteComment($id: ID!, $cursor: ID) {
            deleteComment(id: $id, cursor: $cursor) {
              id
              cursor
              device {
                id
                votes
                rating
              }
            }
          }
        `,
        variables: { id, cursor },
      })
      .pipe(
        map((response: MutationResult) => {
          if (response.errors) {
            throw response.errors[0];
          } else {
            return response.data.deleteComment;
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }

  public updateComment(
    id: string,
    data: CreateCommentInterface,
  ): Observable<CommentInterface> {
    return this.apollo
      .use('withCredentials')
      .mutate({
        mutation: gql`
          mutation UpdateComment(
            $id: ID!
            $updateCommentInput: UpdateCommentInput!
          ) {
            updateComment(id: $id, updateCommentInput: $updateCommentInput) {
              id
              advantages
              disadvantages
              content
              rating
              user {
                id
                firstName
                lastName
              }
              device {
                id
                votes
                rating
              }
              createdAt
              updatedAt
              likesUsers {
                id
              }
              dislikesUsers {
                id
              }
            }
          }
        `,
        variables: { id, updateCommentInput: data },
      })
      .pipe(
        map((response: MutationResult) => {
          if (response.errors) {
            throw response.errors[0];
          } else {
            return response.data.updateComment;
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }
}
