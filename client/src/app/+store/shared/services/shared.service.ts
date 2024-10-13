import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { GPInterface } from '../../../shared/models/interfaces/g-p.interface';
import { Apollo, gql } from 'apollo-angular';
import { ApolloQueryResult } from '@apollo/client';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private apollo = inject(Apollo);

  public getGroupsWithProperties(categoryId: string): Observable<GPInterface> {
    return this.apollo
      .use('withCredentials')
      .query<{ GP: GPInterface }>({
        query: gql`
          query GP($id: String!) {
            GP(id: $id) {
              groups {
                id
                categoryId
                hasProperties
                groupName
              }
              properties {
                id
                propertyName
                groupId
              }
            }
          }
        `,
        variables: { id: categoryId },
      })
      .pipe(
        map(
          (
            response: ApolloQueryResult<{
              GP: GPInterface;
            }>,
          ) => {
            if (response.errors) {
              throw response.errors[0];
            } else {
              return response.data.GP;
            }
          },
        ),
        catchError((error) => throwError(() => error)),
      );
  }
}
