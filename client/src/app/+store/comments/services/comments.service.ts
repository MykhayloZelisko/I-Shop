import { inject, Injectable } from '@angular/core';
import { Apollo, gql, MutationResult } from 'apollo-angular';
import { CreateCommentInterface } from '../../../shared/models/interfaces/create-comment.interface';
import { catchError, map, Observable, throwError } from 'rxjs';
import { CommentInterface } from '../../../shared/models/interfaces/comment.interface';

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
              deviceId
              advantages
              disadvantages
              comment
              rating
              user {
                id
                firstName
                lastName
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
}
