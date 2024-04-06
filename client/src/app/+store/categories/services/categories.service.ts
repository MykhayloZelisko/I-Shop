import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { CategoryInterface } from '../../../shared/models/interfaces/category.interface';
import { Apollo, gql, MutationResult } from 'apollo-angular';
import { ApolloQueryResult } from '@apollo/client';
import { CreateCategoryType } from '../../../shared/models/types/create-category.type';

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
              level
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

  public updateCategory(
    id: string,
    categoryName: string,
  ): Observable<CategoryInterface> {
    return this.apollo
      .use('withCredentials')
      .mutate({
        mutation: gql`
          mutation UpdateCategory(
            $id: String!
            $updateCategoryInput: UpdateCategoryInput!
          ) {
            updateCategory(id: $id, updateCategoryInput: $updateCategoryInput) {
              id
              categoryName
              parentId
              level
            }
          }
        `,
        variables: {
          id: id,
          updateCategoryInput: { categoryName },
        },
      })
      .pipe(
        map((response: MutationResult) => {
          if (response.errors) {
            throw response.errors[0];
          } else {
            return response.data.updateCategory;
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }

  public createCategory(
    data: CreateCategoryType,
  ): Observable<CategoryInterface> {
    return this.apollo
      .use('withCredentials')
      .mutate({
        mutation: gql`
          mutation CreateCategory($createCategoryInput: CreateCategoryInput!) {
            createCategory(createCategoryInput: $createCategoryInput) {
              id
              categoryName
              parentId
              level
            }
          }
        `,
        variables: { createCategoryInput: data },
      })
      .pipe(
        map((response: MutationResult) => {
          if (response.errors) {
            throw response.errors[0];
          } else {
            return response.data.createCategory;
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }

  public deleteCategory(id: string): Observable<string[]> {
    return this.apollo
      .use('withCredentials')
      .mutate({
        mutation: gql`
          mutation DeleteCategory($id: String!) {
            deleteCategory(id: $id)
          }
        `,
        variables: {
          id: id,
        },
      })
      .pipe(
        map((response: MutationResult) => {
          if (response.errors) {
            throw response.errors[0];
          } else {
            return response.data.deleteCategory;
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }
}
