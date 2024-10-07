import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { CategoryInterface } from '../../../shared/models/interfaces/category.interface';
import { Apollo, gql, MutationResult } from 'apollo-angular';
import { ApolloQueryResult } from '@apollo/client';
import { environment } from '../../../../environments/environment';
import { CreateCategoryInterface } from '../../../shared/models/interfaces/create-category.interface';
import { UpdateCategoryInterface } from '../../../shared/models/interfaces/update-category.interface';
import { CreateCPropertyInterface } from '../../../shared/models/interfaces/create-c-property.interface';
import { CreateCPropertiesGroupInterface } from '../../../shared/models/interfaces/create-c-properties-group.interface';

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
              groups {
                id
                categoryId
                groupName
                properties {
                  id
                  groupId
                  propertyName
                }
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
            $id: String!
            $updateCategoryInput: UpdateCategoryInput!
          ) {
            updateCategory(id: $id, updateCategoryInput: $updateCategoryInput) {
              id
              categoryName
              parentId
              image
              icon
              level
              groups {
                id
                categoryId
                groupName
                properties {
                  id
                  groupId
                  propertyName
                }
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
              groups {
                id
                categoryId
                groupName
                properties {
                  id
                  groupId
                  propertyName
                }
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
              groups {
                id
                categoryId
                groupName
                properties {
                  id
                  groupId
                  propertyName
                }
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
                image: `${environment.baseUrl}/${category.image}`,
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
              icon
              level
              groups {
                id
                categoryId
                groupName
                properties {
                  id
                  groupId
                  propertyName
                }
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
              icon: response.data.createCProperties.icon
                ? `${environment.baseUrl}/${response.data.createCProperties.icon}`
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
            $updateCPropertyInput: UpdateCPropertyInput!
          ) {
            updateCProperty(
              id: $id
              updateCPropertyInput: $updateCPropertyInput
            ) {
              id
              categoryName
              parentId
              image
              icon
              level
              groups {
                id
                categoryId
                groupName
                properties {
                  id
                  groupId
                  propertyName
                }
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
              icon: response.data.updateCProperty.icon
                ? `${environment.baseUrl}/${response.data.updateCProperty.icon}`
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
              icon
              level
              groups {
                id
                categoryId
                groupName
                properties {
                  id
                  groupId
                  propertyName
                }
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
              icon: response.data.deleteCProperty.icon
                ? `${environment.baseUrl}/${response.data.deleteCProperty.icon}`
                : null,
            };
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }

  public addCPropertiesGroup(
    data: CreateCPropertiesGroupInterface[],
  ): Observable<CategoryInterface> {
    return this.apollo
      .use('withCredentials')
      .mutate({
        mutation: gql`
          mutation CreateCPropertiesGroups(
            $createCPropertiesGroupInputs: [CreateCPropertiesGroupInput!]!
          ) {
            createCPropertiesGroups(
              createCPropertiesGroupInputs: $createCPropertiesGroupInputs
            ) {
              id
              categoryName
              parentId
              image
              icon
              level
              groups {
                id
                categoryId
                groupName
                properties {
                  id
                  groupId
                  propertyName
                }
              }
            }
          }
        `,
        variables: { createCPropertiesGroupInputs: data },
      })
      .pipe(
        map((response: MutationResult) => {
          if (response.errors) {
            throw response.errors[0];
          } else {
            return {
              ...response.data.createCPropertiesGroups,
              image: response.data.createCPropertiesGroups.image
                ? `${environment.baseUrl}/${response.data.createCPropertiesGroups.image}`
                : null,
              icon: response.data.createCPropertiesGroups.icon
                ? `${environment.baseUrl}/${response.data.createCPropertiesGroups.icon}`
                : null,
            };
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }

  public updateCPropertiesGroup(
    id: string,
    groupName: string,
  ): Observable<CategoryInterface> {
    return this.apollo
      .use('withCredentials')
      .mutate({
        mutation: gql`
          mutation UpdateCPropertiesGroup(
            $id: String!
            $updateCPropertiesGroupInput: UpdateCPropertiesGroupInput!
          ) {
            updateCPropertiesGroup(
              id: $id
              updateCPropertiesGroupInput: $updateCPropertiesGroupInput
            ) {
              id
              categoryName
              parentId
              image
              icon
              level
              groups {
                id
                categoryId
                groupName
                properties {
                  id
                  groupId
                  propertyName
                }
              }
            }
          }
        `,
        variables: { id: id, updateCPropertiesGroupInput: { groupName } },
      })
      .pipe(
        map((response: MutationResult) => {
          if (response.errors) {
            throw response.errors[0];
          } else {
            return {
              ...response.data.updateCPropertiesGroup,
              image: response.data.updateCPropertiesGroup.image
                ? `${environment.baseUrl}/${response.data.updateCPropertiesGroup.image}`
                : null,
              icon: response.data.updateCPropertiesGroup.icon
                ? `${environment.baseUrl}/${response.data.updateCPropertiesGroup.icon}`
                : null,
            };
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }

  public deleteCPropertiesGroup(id: string): Observable<CategoryInterface> {
    return this.apollo
      .use('withCredentials')
      .mutate({
        mutation: gql`
          mutation DeleteCPropertiesGroup($id: String!) {
            deleteCPropertiesGroup(id: $id) {
              id
              categoryName
              parentId
              image
              icon
              level
              groups {
                id
                categoryId
                groupName
                properties {
                  id
                  groupId
                  propertyName
                }
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
              ...response.data.deleteCPropertiesGroup,
              image: response.data.deleteCPropertiesGroup.image
                ? `${environment.baseUrl}/${response.data.deleteCPropertiesGroup.image}`
                : null,
              icon: response.data.deleteCPropertiesGroup.icon
                ? `${environment.baseUrl}/${response.data.deleteCPropertiesGroup.icon}`
                : null,
            };
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }
}
