import { inject, Injectable } from '@angular/core';
import { Apollo, gql, MutationResult } from 'apollo-angular';
import { RegistrationInterface } from '../../../shared/models/interfaces/registration.interface';
import { catchError, map, Observable, throwError } from 'rxjs';
import { LoginInterface } from '../../../shared/models/interfaces/login.interface';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';
import { ApolloQueryResult } from '@apollo/client';
import { environment } from '../../../../environments/environment';
import { CartDeviceInterface } from '../../../shared/models/interfaces/cart-device.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apollo = inject(Apollo);

  public registration(
    registrationData: RegistrationInterface,
  ): Observable<boolean> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation Registration($user: CreateUserInput!) {
            registration(createUserInput: $user)
          }
        `,
        variables: {
          user: registrationData,
        },
      })
      .pipe(
        map((response: MutationResult) => {
          if (response.errors) {
            throw response.errors[0];
          } else {
            return response.data.registration;
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }

  public login(loginData: LoginInterface): Observable<UserInterface> {
    return this.apollo
      .use('withCredentials')
      .mutate({
        mutation: gql`
          mutation Login($login: LoginInput!) {
            login(variables: $login) {
              id
              email
              firstName
              lastName
              phone
              roles {
                id
                role
              }
              cart {
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
          }
        `,
        variables: {
          login: loginData,
        },
      })
      .pipe(
        map((response: MutationResult) => {
          if (response.errors) {
            throw response.errors[0];
          } else {
            return {
              ...response.data.login,
              cart: response.data.login.cart
                ? {
                    ...response.data.login.cart,
                    devices: response.data.login.cart.devices.map(
                      (cartDevice: CartDeviceInterface) => ({
                        ...cartDevice,
                        device: {
                          ...cartDevice.device,
                          images: cartDevice.device.images.map(
                            (image: string) =>
                              `${environment.baseUrl}/${image}`,
                          ),
                        },
                      }),
                    ),
                  }
                : null,
            };
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }

  public getCurrentUser(): Observable<UserInterface> {
    return this.apollo
      .use('withCredentials')
      .query<{ me: UserInterface }>({
        query: gql`
          query GetCurrentUser {
            me {
              id
              email
              firstName
              lastName
              phone
              roles {
                id
                role
              }
              cart {
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
          }
        `,
        fetchPolicy: 'network-only',
      })
      .pipe(
        map((response: ApolloQueryResult<{ me: UserInterface }>) => {
          if (response.errors) {
            throw response.errors[0];
          } else {
            return {
              ...response.data.me,
              cart: response.data.me.cart
                ? {
                    ...response.data.me.cart,
                    devices: response.data.me.cart.devices.map(
                      (cartDevice: CartDeviceInterface) => ({
                        ...cartDevice,
                        device: {
                          ...cartDevice.device,
                          images: cartDevice.device.images.map(
                            (image: string) =>
                              `${environment.baseUrl}/${image}`,
                          ),
                        },
                      }),
                    ),
                  }
                : null,
            };
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }

  public logout(): Observable<boolean> {
    return this.apollo
      .use('withCredentials')
      .mutate({
        mutation: gql`
          mutation Logout {
            logout
          }
        `,
      })
      .pipe(
        map((response: MutationResult) => {
          if (response.errors) {
            throw response.errors[0];
          } else {
            return response.data.logout;
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }
}
