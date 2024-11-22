import { inject, Injectable } from '@angular/core';
import { Apollo, gql, MutationResult } from 'apollo-angular';
import { catchError, map, Observable, throwError } from 'rxjs';
import { CartInterface } from '../../../shared/models/interfaces/cart.interface';
import { CartDeviceInterface } from '../../../shared/models/interfaces/cart-device.interface';
import { DeletedCartDeviceInterface } from '../../../shared/models/interfaces/deleted-cart-device.interface';
import { environment } from '../../../../environments/environment';
import { UpdateCartDeviceInterface } from '../../../shared/models/interfaces/update-cart-device.interface';
import { UpdateCartDevicesInterface } from '../../../shared/models/interfaces/update-cart-devices.interface';

@Injectable({
  providedIn: 'root',
})
export class CartsService {
  private apollo = inject(Apollo);

  public createCart(deviceId: string): Observable<CartInterface> {
    return this.apollo
      .use('withCredentials')
      .mutate({
        mutation: gql`
          mutation CreateCart($deviceId: ID!) {
            createCart(deviceId: $deviceId) {
              id
              devices {
                id
                quantity
                priceAtAdd
                isInOrder
                device {
                  id
                  deviceName
                  price
                  quantity
                  images
                }
              }
            }
          }
        `,
        variables: { deviceId },
      })
      .pipe(
        map((response: MutationResult) => {
          if (response.errors) {
            throw response.errors[0];
          } else {
            return {
              ...response.data.createCart,
              devices: response.data.createCart.devices.map(
                (cartDevice: CartDeviceInterface) => ({
                  ...cartDevice,
                  device: {
                    ...cartDevice.device,
                    images: cartDevice.device.images.map(
                      (image: string) => `${environment.baseUrl}/${image}`,
                    ),
                  },
                }),
              ),
            };
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }

  public addDeviceToCart(
    id: string,
    cartId: string,
  ): Observable<CartDeviceInterface> {
    return this.apollo
      .use('withCredentials')
      .mutate({
        mutation: gql`
          mutation AddDeviceToCart($id: ID!, $cartId: ID!) {
            addDeviceToCart(id: $id, cartId: $cartId) {
              id
              quantity
              priceAtAdd
              isInOrder
              device {
                id
                deviceName
                price
                quantity
                images
              }
            }
          }
        `,
        variables: { id, cartId },
      })
      .pipe(
        map((response: MutationResult) => {
          if (response.errors) {
            throw response.errors[0];
          } else {
            return {
              ...response.data.addDeviceToCart,
              device: {
                ...response.data.addDeviceToCart.device,
                images: response.data.addDeviceToCart.device.images.map(
                  (image: string) => `${environment.baseUrl}/${image}`,
                ),
              },
            };
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }

  public deleteDevicesFromCart(
    ids: string[],
    cartId: string,
  ): Observable<DeletedCartDeviceInterface> {
    return this.apollo
      .use('withCredentials')
      .mutate({
        mutation: gql`
          mutation DeleteDevicesFromCart($ids: [ID!]!, $cartId: ID!) {
            deleteDevicesFromCart(ids: $ids, cartId: $cartId) {
              ids
              cart
            }
          }
        `,
        variables: { ids, cartId },
      })
      .pipe(
        map((response: MutationResult) => {
          if (response.errors) {
            throw response.errors[0];
          } else {
            return response.data.deleteDevicesFromCart;
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }

  public updateCartDevice(
    id: string,
    device: UpdateCartDeviceInterface,
  ): Observable<CartDeviceInterface> {
    return this.apollo
      .use('withCredentials')
      .mutate({
        mutation: gql`
          mutation UpdateCartDevice(
            $id: ID!
            $updateCartDeviceInput: UpdateCartDeviceInput!
          ) {
            updateCartDevice(
              id: $id
              updateCartDeviceInput: $updateCartDeviceInput
            ) {
              id
              quantity
              priceAtAdd
              isInOrder
              device {
                id
                deviceName
                price
                quantity
                images
              }
            }
          }
        `,
        variables: { id, updateCartDeviceInput: device },
      })
      .pipe(
        map((response: MutationResult) => {
          if (response.errors) {
            throw response.errors[0];
          } else {
            return {
              ...response.data.updateCartDevice,
              device: {
                ...response.data.updateCartDevice.device,
                images: response.data.updateCartDevice.device.images.map(
                  (image: string) => `${environment.baseUrl}/${image}`,
                ),
              },
            };
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }

  public updateCartDevices(
    data: UpdateCartDevicesInterface,
  ): Observable<boolean> {
    return this.apollo
      .use('withCredentials')
      .mutate({
        mutation: gql`
          mutation UpdateCartDevices(
            $updateCartDevicesInput: UpdateCartDevicesInput!
          ) {
            updateCartDevices(updateCartDevicesInput: $updateCartDevicesInput)
          }
        `,
        variables: { updateCartDevicesInput: data },
      })
      .pipe(
        map((response: MutationResult) => {
          if (response.errors) {
            throw response.errors[0];
          } else {
            return response.data.updateCartDevices;
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }
}
