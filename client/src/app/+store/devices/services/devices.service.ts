import { inject, Injectable } from '@angular/core';
import { Apollo, gql, MutationResult } from 'apollo-angular';
import { catchError, map, Observable, throwError } from 'rxjs';
import { CreateDeviceInterface } from '../../../shared/models/interfaces/create-device.interface';

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
}
