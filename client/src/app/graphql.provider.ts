import { Apollo, APOLLO_NAMED_OPTIONS, NamedOptions } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApplicationConfig, inject } from '@angular/core';
import { InMemoryCache, from } from '@apollo/client/core';
import { environment } from '../environments/environment';
import { onError } from '@apollo/client/link/error';
import { Store } from '@ngrx/store';
import { State } from './+store/reducers';
import { UserInterface } from './shared/models/interfaces/user.interface';
import { selectUser } from './+store/auth/selectors/auth.selectors';

const uri = environment.apiUrl;
export function apolloOptionsFactory(): NamedOptions {
  const httpLink = inject(HttpLink);
  const store = inject(Store<State>);

  let currentUser: UserInterface | null = null;
  store.select(selectUser).subscribe((user: UserInterface | null) => {
    currentUser = user;
  });

  const errorLink = onError(({ graphQLErrors }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach((error) => {
        if (error.extensions?.['code'] === 'UNAUTHENTICATED' && currentUser) {
          window.location.reload();
        }
      });
    }
  });
  const defaultLink = from([errorLink, httpLink.create({ uri })]);
  const withCredentialsLink = from([
    errorLink,
    httpLink.create({ uri, withCredentials: true }),
  ]);

  return {
    // This settings will be saved as default client
    default: {
      cache: new InMemoryCache(),
      link: defaultLink,
    },
    // These settings will be saved by name: withCredentials
    withCredentials: {
      cache: new InMemoryCache(),
      link: withCredentialsLink,
    },
  };
}

export const graphqlProvider: ApplicationConfig['providers'] = [
  Apollo,
  {
    provide: APOLLO_NAMED_OPTIONS,
    useFactory: apolloOptionsFactory,
    deps: [HttpLink],
  },
];
