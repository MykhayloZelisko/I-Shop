import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { CategoryInterface } from '../../../shared/models/interfaces/category.interface';
import { Apollo, gql, MutationResult } from 'apollo-angular';
import { ApolloQueryResult } from '@apollo/client';
import { environment } from '../../../../environments/environment';
import { CreateCategoryInterface } from '../../../shared/models/interfaces/create-category.interface';
import { UpdateCategoryInterface } from '../../../shared/models/interfaces/update-category.interface';
import { CreateCPropertyInterface } from '../../../shared/models/interfaces/create-c-property.interface';

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
              properties {
                id
                categoryId
                propertyName
              }
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
            $id: String!
            $updateCategoryInput: UpdateCategoryInput!
          ) {
            updateCategory(id: $id, updateCategoryInput: $updateCategoryInput) {
              id
              categoryName
              parentId
              image
              properties {
                id
                categoryId
                propertyName
              }
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
              properties {
                id
                categoryId
                propertyName
              }
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
              properties {
                id
                categoryId
                propertyName
              }
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
                image: category.image
                  ? `${environment.baseUrl}/${category.image}`
                  : null,
              }),
            );
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

  public addCProperties(
    data: CreateCPropertyInterface[],
  ): Observable<CategoryInterface> {
    return this.apollo
      .use('withCredentials')
      .mutate({
        mutation: gql`
          mutation CreateCProperties(
            $createCPropertyInputs: [CreateCPropertyInput!]!
          ) {
            createCProperties(createCPropertyInputs: $createCPropertyInputs) {
              id
              categoryName
              parentId
              image
              properties {
                id
                categoryId
                propertyName
              }
            }
          }
        `,
        variables: { createCPropertyInputs: data },
      })
      .pipe(
        map((response: MutationResult) => {
          if (response.errors) {
            throw response.errors[0];
          } else {
            return {
              ...response.data.createCProperties,
              image: response.data.createCProperties.image
                ? `${environment.baseUrl}/${response.data.createCProperties.image}`
                : null,
            };
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }

  public updateCProperty(
    id: string,
    propertyName: string,
  ): Observable<CategoryInterface> {
    return this.apollo
      .use('withCredentials')
      .mutate({
        mutation: gql`
          mutation UpdateCProperty(
            $id: String!
            $updateCPropertyInputs: UpdateCPropertyInput!
          ) {
            updateCProperty(
              id: $id
              updateCPropertyInput: $updateCPropertyInputs
            ) {
              id
              categoryName
              parentId
              image
              properties {
                id
                categoryId
                propertyName
              }
            }
          }
        `,
        variables: { id: id, updateCPropertyInputs: { propertyName } },
      })
      .pipe(
        map((response: MutationResult) => {
          if (response.errors) {
            throw response.errors[0];
          } else {
            return {
              ...response.data.updateCProperty,
              image: response.data.updateCProperty.image
                ? `${environment.baseUrl}/${response.data.updateCProperty.image}`
                : null,
            };
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }

  public deleteCProperty(id: string): Observable<CategoryInterface> {
    return this.apollo
      .use('withCredentials')
      .mutate({
        mutation: gql`
          mutation DeleteCProperty($id: String!) {
            deleteCProperty(id: $id) {
              id
              categoryName
              parentId
              image
              properties {
                id
                categoryId
                propertyName
              }
            }
          }
        `,
        variables: { id: id },
      })
      .pipe(
        map((response: MutationResult) => {
          if (response.errors) {
            throw response.errors[0];
          } else {
            return {
              ...response.data.deleteCProperty,
              image: response.data.deleteCProperty.image
                ? `${environment.baseUrl}/${response.data.deleteCProperty.image}`
                : null,
            };
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }
}
