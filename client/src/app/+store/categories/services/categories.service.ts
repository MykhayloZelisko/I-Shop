import { inject, Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { catchError, map, Observable, throwError } from 'rxjs';
import { CategoryInterface } from '../../../shared/models/interfaces/category.interface';
import { ApolloQueryResult } from '@apollo/client';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private apollo = inject(Apollo);

  public getAllCategories(): Observable<CategoryInterface[]> {
    return this.apollo
      .query<{ catalog: CategoryInterface[] }>({
        query: gql`
          query Catalog {
            catalog {
              id
              categoryName
              parentId
            }
          }
        `,
      })
      .pipe(
        map((response: ApolloQueryResult<{ catalog: CategoryInterface[] }>) => {
          if (response.errors) {
            throw response.errors[0];
          } else {
            return response.data.catalog;
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }
}
