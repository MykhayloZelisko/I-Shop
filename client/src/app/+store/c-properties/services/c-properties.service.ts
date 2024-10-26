import { inject, Injectable } from '@angular/core';
import { Apollo, gql, MutationResult } from 'apollo-angular';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';
import { CPropertyInterface } from '../../../shared/models/interfaces/c-property.interface';
import { CreateCPropertyInterface } from '../../../shared/models/interfaces/create-c-property.interface';
import { DeletedInterface } from '../../../shared/models/interfaces/deleted.interface';

@Injectable({
  providedIn: 'root',
})
export class CPropertiesService {
  private apollo = inject(Apollo);

  public getFilteredCProperties(
    ids: string[],
  ): Observable<CPropertyInterface[]> {
    return this.apollo
      .use('withCredentials')
      .query<{ allProperties: CPropertyInterface[] }>({
        query: gql`
          query AllProperties($ids: [ID!]!) {
            allProperties(ids: $ids) {
              id
              propertyName
              groupId
            }
          }
        `,
        variables: { ids },
      })
      .pipe(
        map(
          (
            response: ApolloQueryResult<{
              allProperties: CPropertyInterface[];
            }>,
          ) => {
            if (response.errors) {
              throw response.errors[0];
            } else {
              return response.data.allProperties;
            }
          },
        ),
        catchError((error) => throwError(() => error)),
      );
  }

  public addCPropertiesByGroupsIds(
    ids: string[],
  ): Observable<CPropertyInterface[]> {
    return this.apollo
      .use('withCredentials')
      .query<{ propertiesByGroupsIds: CPropertyInterface[] }>({
        query: gql`
          query propertiesByGroupsIds($ids: [ID!]!) {
            propertiesByGroupsIds(ids: $ids) {
              id
              propertyName
              groupId
            }
          }
        `,
        variables: { ids },
      })
      .pipe(
        map(
          (
            response: ApolloQueryResult<{
              propertiesByGroupsIds: CPropertyInterface[];
            }>,
          ) => {
            if (response.errors) {
              throw response.errors[0];
            } else {
              // console.log(response.data.propertiesByGroupsIds);
              return response.data.propertiesByGroupsIds;
            }
          },
        ),
        catchError((error) => throwError(() => error)),
      );
  }

  public getCPropertiesByGroupId(id: string): Observable<CPropertyInterface[]> {
    return this.apollo
      .use('withCredentials')
      .query<{ propertiesByGroupId: CPropertyInterface[] }>({
        query: gql`
          query PropertiesByGroupId($id: ID!) {
            propertiesByGroupId(id: $id) {
              id
              propertyName
              groupId
            }
          }
        `,
        variables: { id },
      })
      .pipe(
        map(
          (
            response: ApolloQueryResult<{
              propertiesByGroupId: CPropertyInterface[];
            }>,
          ) => {
            if (response.errors) {
              throw response.errors[0];
            } else {
              return response.data.propertiesByGroupId;
            }
          },
        ),
        catchError((error) => throwError(() => error)),
      );
  }

  public addCProperties(
    data: CreateCPropertyInterface[],
  ): Observable<CPropertyInterface[]> {
    return this.apollo
      .use('withCredentials')
      .mutate({
        mutation: gql`
          mutation CreateCProperties(
            $createCPropertyInputs: [CreateCPropertyInput!]!
          ) {
            createCProperties(createCPropertyInputs: $createCPropertyInputs) {
              id
              propertyName
              groupId
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
            return response.data.createCProperties;
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }

  public updateCProperty(
    id: string,
    propertyName: string,
  ): Observable<CPropertyInterface> {
    return this.apollo
      .use('withCredentials')
      .mutate({
        mutation: gql`
          mutation UpdateCProperty(
            $id: ID!
            $updateCPropertyInput: UpdateCPropertyInput!
          ) {
            updateCProperty(
              id: $id
              updateCPropertyInput: $updateCPropertyInput
            ) {
              id
              propertyName
              groupId
            }
          }
        `,
        variables: {
          id: id,
          updateCPropertyInput: { propertyName },
        },
      })
      .pipe(
        map((response: MutationResult) => {
          if (response.errors) {
            throw response.errors[0];
          } else {
            return response.data.updateCProperty;
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }

  public deleteCProperty(id: string): Observable<DeletedInterface> {
    return this.apollo
      .use('withCredentials')
      .mutate({
        mutation: gql`
          mutation DeleteCProperty($id: ID!) {
            deleteCProperty(id: $id) {
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
            return response.data.deleteCProperty;
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }
}
