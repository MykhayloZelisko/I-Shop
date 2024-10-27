import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { CategoryInterface } from '../../../shared/models/interfaces/category.interface';
import { Apollo, gql, MutationResult } from 'apollo-angular';
import { ApolloQueryResult } from '@apollo/client';
import { environment } from '../../../../environments/environment';
import { CreateCategoryInterface } from '../../../shared/models/interfaces/create-category.interface';
import { UpdateCategoryInterface } from '../../../shared/models/interfaces/update-category.interface';
import { DeletedInterface } from '../../../shared/models/interfaces/deleted.interface';

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
              image
              icon
              level
              hasGroups
            }
          }
        `,
      })
      .pipe(
        map((response: ApolloQueryResult<{ catalog: CategoryInterface[] }>) => {
          if (response.errors) {
            throw response.errors[0];
          } else {
            return response.data.catalog.map((category: CategoryInterface) => ({
              ...category,
              image: category.image
                ? `${environment.baseUrl}/${category.image}`
                : null,
              icon: category.icon
                ? `${environment.baseUrl}/${category.icon}`
                : null,
            }));
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }

  public updateCategory(
    id: string,
    data: UpdateCategoryInterface,
  ): Observable<CategoryInterface> {
    return this.apollo
      .use('withCredentials')
      .mutate({
        mutation: gql`
          mutation UpdateCategory(
            $id: ID!
            $updateCategoryInput: UpdateCategoryInput!
          ) {
            updateCategory(id: $id, updateCategoryInput: $updateCategoryInput) {
              id
              categoryName
              parentId
              image
              icon
              level
              hasGroups
            }
          }
        `,
        variables: {
          id: id,
          updateCategoryInput: data,
        },
      })
      .pipe(
        map((response: MutationResult) => {
          if (response.errors) {
            throw response.errors[0];
          } else {
            return {
              ...response.data.updateCategory,
              image: response.data.updateCategory.image
                ? `${environment.baseUrl}/${response.data.updateCategory.image}`
                : null,
              icon: response.data.updateCategory.icon
                ? `${environment.baseUrl}/${response.data.updateCategory.icon}`
                : null,
            };
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }

  public createCategory(
    data: CreateCategoryInterface,
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
              image
              icon
              level
              hasGroups
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
            return {
              ...response.data.createCategory,
              icon: `${environment.baseUrl}/${response.data.createCategory.icon}`,
            };
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }

  public addSubCategories(
    data: CreateCategoryInterface[],
  ): Observable<CategoryInterface[]> {
    return this.apollo
      .use('withCredentials')
      .mutate({
        mutation: gql`
          mutation AddSubCategories(
            $createCategoryInputs: [CreateCategoryInput!]!
          ) {
            addSubCategories(createCategoryInputs: $createCategoryInputs) {
              id
              categoryName
              parentId
              image
              icon
              level
              hasGroups
            }
          }
        `,
        variables: { createCategoryInputs: data },
      })
      .pipe(
        map((response: MutationResult) => {
          if (response.errors) {
            throw response.errors[0];
          } else {
            return response.data.addSubCategories.map(
              (category: CategoryInterface) => ({
                ...category,
                image: `${environment.baseUrl}/${category.image}`,
              }),
            );
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }

  public deleteCategory(id: string): Observable<DeletedInterface> {
    return this.apollo
      .use('withCredentials')
      .mutate({
        mutation: gql`
          mutation DeleteCategory($id: ID!) {
            deleteCategory(id: $id) {
              categoriesIds
              groupsIds
              propertiesIds
              category {
                id
                categoryName
                parentId
                image
                icon
                level
                hasGroups
              }
              group {
                id
                groupName
                categoryId
                hasProperties
              }
            }
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
