import { Injectable } from '@angular/core';
import { Apollo, gql, MutationResult } from 'apollo-angular';
import { RegistrationInterface } from '../../../shared/models/interfaces/registration.interface';
import { catchError, map, Observable, throwError } from 'rxjs';
import { LoginInterface } from '../../../shared/models/interfaces/login.interface';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';
import { ApolloQueryResult } from '@apollo/client';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public constructor(private apollo: Apollo) {}

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
            return response.data.login;
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
            }
          }
        `,
      })
      .pipe(
        map((response: ApolloQueryResult<{ me: UserInterface }>) => {
          if (response.errors) {
            throw response.errors[0];
          } else {
            return response.data.me;
          }
        }),
        catchError((error) => throwError(() => error)),
      );
  }
}
