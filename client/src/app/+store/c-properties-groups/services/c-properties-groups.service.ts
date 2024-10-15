import { inject, Injectable } from '@angular/core';
import { Apollo, gql, MutationResult } from 'apollo-angular';
import { CPropertiesGroupInterface } from '../../../shared/models/interfaces/c-properties-group.interface';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';
import { CreateCPropertiesGroupInterface } from '../../../shared/models/interfaces/create-c-properties-group.interface';
import { DeletedInterface } from '../../../shared/models/interfaces/deleted.interface';

@Injectable({
  providedIn: 'root',
})
export class CPropertiesGroupsService {
  private apollo = inject(Apollo);

  public getFilteredCPropertiesGroups(
    ids: string[],
  ): Observable<CPropertiesGroupInterface[]> {
    return this.apollo
      .use('withCredentials')
      .query<{ allGroups: CPropertiesGroupInterface[] }>({
        query: gql`
          query AllGroups($ids: [String!]!) {
            allGroups(ids: $ids) {
              id
              groupName
              categoryId
              hasProperties
            }
          }
        `,
        variables: { ids },
      })
      .pipe(
        map(
          (
            response: ApolloQueryResult<{
              allGroups: CPropertiesGroupInterface[];
            }>,
          ) => {
            if (response.errors) {
              throw response.errors[0];
            } else {
              return response.data.allGroups;
            }
          },
        ),
        catchError((error) => throwError(() => error)),
      );
  }

  public getCPGroupsByCategoryId(
    id: string,
  ): Observable<CPropertiesGroupInterface[]> {
    return this.apollo
      .use('withCredentials')
      .query<{ groupsByCategoryId: CPropertiesGroupInterface[] }>({
        query: gql`
          query GroupsByCategoryId($id: String!) {
            groupsByCategoryId(id: $id) {
              id
              groupName
              categoryId
              hasProperties
            }
          }
        `,
        variables: { id },
      })
      .pipe(
        map(
          (
            response: ApolloQueryResult<{
              groupsByCategoryId: CPropertiesGroupInterface[];
            }>,
          ) => {
            if (response.errors) {
              throw response.errors[0];
            } else {
              return response.data.groupsByCategoryId;
            }
          },
        ),
        catchError((error) => throwError(() => error)),
      );
  }

  public addCPropertiesGroups(
    data: CreateCPropertiesGroupInterface[],
  ): Observable<CPropertiesGroupInterface[]> {
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
              groupName
              categoryId
              hasProperties
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
            return response.data.createCPropertiesGroups;
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }

  public updateCPropertiesGroup(
    id: string,
    groupName: string,
  ): Observable<CPropertiesGroupInterface> {
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
              groupName
              categoryId
              hasProperties
            }
          }
        `,
        variables: {
          id: id,
          updateCPropertiesGroupInput: { groupName },
        },
      })
      .pipe(
        map((response: MutationResult) => {
          if (response.errors) {
            throw response.errors[0];
          } else {
            return response.data.updateCPropertiesGroup;
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }

  public deleteCPropertiesGroup(id: string): Observable<DeletedInterface> {
    return this.apollo
      .use('withCredentials')
      .mutate({
        mutation: gql`
          mutation DeleteCPropertiesGroup($id: String!) {
            deleteCPropertiesGroup(id: $id) {
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
        variables: { id },
      })
      .pipe(
        map((response: MutationResult) => {
          if (response.errors) {
            throw response.errors[0];
          } else {
            return response.data.deleteCPropertiesGroup;
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }
}
