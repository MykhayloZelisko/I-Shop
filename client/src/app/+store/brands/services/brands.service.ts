import { inject, Injectable } from '@angular/core';
import { Apollo, gql, MutationResult } from 'apollo-angular';
import { catchError, map, Observable, throwError } from 'rxjs';
import { BrandInterface } from '../../../shared/models/interfaces/brand.interface';
import { ApolloQueryResult } from '@apollo/client';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  private apollo = inject(Apollo);

  public getAllBrands(): Observable<BrandInterface[]> {
    return this.apollo
      .use('withCredentials')
      .query<{ brands: BrandInterface[] }>({
        query: gql`
          query Brands {
            brands {
              id
              brandName
            }
          }
        `,
      })
      .pipe(
        map((response: ApolloQueryResult<{ brands: BrandInterface[] }>) => {
          if (response.errors) {
            throw response.errors[0];
          } else {
            return response.data.brands;
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }

  public createBrand(data: string): Observable<BrandInterface> {
    return this.apollo
      .use('withCredentials')
      .mutate({
        mutation: gql`
          mutation CreateBrand($createBrandInput: CreateBrandInput!) {
            createBrand(createBrandInput: $createBrandInput) {
              id
              brandName
            }
          }
        `,
        variables: { createBrandInput: { brandName: data } },
      })
      .pipe(
        map((response: MutationResult) => {
          if (response.errors) {
            throw response.errors[0];
          } else {
            return response.data.createBrand;
          }
        }),
        catchError((error) => {
          return throwError(() => error);
        }),
      );
  }

  public deleteBrand(id: string): Observable<string> {
    return this.apollo
      .use('withCredentials')
      .mutate({
        mutation: gql`
          mutation DeleteBrand($id: ID!) {
            deleteBrand(id: $id)
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
            return response.data.deleteBrand;
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }

  public updateBrand(
    id: string,
    brandName: string,
  ): Observable<BrandInterface> {
    return this.apollo
      .use('withCredentials')
      .mutate({
        mutation: gql`
          mutation UpdateBrand($id: ID!, $updateBrandInput: UpdateBrandInput!) {
            updateBrand(id: $id, updateBrandInput: $updateBrandInput) {
              id
              brandName
            }
          }
        `,
        variables: {
          id: id,
          updateBrandInput: { brandName },
        },
      })
      .pipe(
        map((response: MutationResult) => {
          if (response.errors) {
            throw response.errors[0];
          } else {
            return response.data.updateBrand;
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }
}
