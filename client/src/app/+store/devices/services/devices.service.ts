import { inject, Injectable } from '@angular/core';
import { Apollo, gql, MutationResult } from 'apollo-angular';
import { catchError, map, Observable, throwError } from 'rxjs';
import { CreateDeviceInterface } from '../../../shared/models/interfaces/create-device.interface';
import { DeviceInterface } from '../../../shared/models/interfaces/device.interface';
import { ApolloQueryResult } from '@apollo/client';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DevicesService {
  private apollo = inject(Apollo);

  public createDevice(data: CreateDeviceInterface): Observable<boolean> {
    return this.apollo
      .use('withCredentials')
      .mutate({
        mutation: gql`
          mutation CreateDevice($createDeviceInput: CreateDeviceInput!) {
            createDevice(createDeviceInput: $createDeviceInput)
          }
        `,
        variables: { createDeviceInput: data },
      })
      .pipe(
        map((response: MutationResult) => {
          if (response.errors) {
            throw response.errors[0];
          } else {
            return response.data.createDevice;
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }

  public getDevices(
    categoryId: string,
    page: number,
    size: number,
  ): Observable<DeviceInterface[]> {
    return this.apollo
      .query<{ devices: DeviceInterface[] }>({
        query: gql`
          query Devices($categoryId: String!, $page: Int!, $size: Int!) {
            devices(categoryId: $categoryId, page: $page, size: $size) {
              id
              deviceName
              price
              count
              rating
              votes
              images
              properties {
                propertyName
                value
              }
            }
          }
        `,
        variables: { categoryId, page, size },
        fetchPolicy: 'network-only',
      })
      .pipe(
        map((response: ApolloQueryResult<{ devices: DeviceInterface[] }>) => {
          if (response.errors) {
            throw response.errors[0];
          } else {
            return response.data.devices.map((device: DeviceInterface) => ({
              ...device,
              images: device.images.map(
                (image: string) => `${environment.baseUrl}/${image}`,
              ),
            }));
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }
}
