import { Apollo, APOLLO_NAMED_OPTIONS, NamedOptions } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import {
  ApplicationConfig,
  inject,
  InjectionToken,
  PLATFORM_ID,
} from '@angular/core';
import { InMemoryCache, from } from '@apollo/client/core';
import { environment } from '../environments/environment';
import { onError } from '@apollo/client/link/error';
import { Store } from '@ngrx/store';
import { State } from './+store/reducers';
import { UserInterface } from './shared/models/interfaces/user.interface';
import { selectUser } from './+store/auth/selectors/auth.selectors';
import { isPlatformBrowser } from '@angular/common';

const uri = environment.apiUrl;
const MY_APOLLO_CACHE = new InjectionToken<InMemoryCache>('apollo-cache');

export function apolloOptionsFactory(): NamedOptions {
  const httpLink = inject(HttpLink);
  const store = inject(Store<State>);
  const platformId = inject(PLATFORM_ID);
  const cache = inject(MY_APOLLO_CACHE);

  let currentUser: UserInterface | null = null;
  store.select(selectUser).subscribe((user: UserInterface | null) => {
    currentUser = user;
  });

  const errorLink = onError(({ graphQLErrors }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach((error) => {
        if (error.extensions?.['code'] === 'UNAUTHENTICATED' && currentUser) {
          if (isPlatformBrowser(platformId)) {
            window.location.reload();
          }
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
      cache: cache,
      link: defaultLink,
      ssrMode: true,
    },
    // These settings will be saved by name: withCredentials
    withCredentials: {
      cache: cache,
      link: withCredentialsLink,
      ssrMode: true,
    },
  };
}

export const graphqlProvider: ApplicationConfig['providers'] = [
  Apollo,
  {
    provide: APOLLO_NAMED_OPTIONS,
    useFactory: apolloOptionsFactory,
  },
  { provide: MY_APOLLO_CACHE, useValue: new InMemoryCache() },
];
