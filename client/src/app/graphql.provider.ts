import { Apollo, APOLLO_NAMED_OPTIONS, NamedOptions } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApplicationConfig, inject } from '@angular/core';
import { InMemoryCache } from '@apollo/client/core';
import { environment } from '../environments/environment';

const uri = environment.apiUrl;
export function apolloOptionsFactory(): NamedOptions {
  const httpLink = inject(HttpLink);
  return {
    // This settings will be saved as default client
    default: {
      cache: new InMemoryCache(),
      link: httpLink.create({ uri }),
      ssrMode: true,
    },
    // These settings will be saved by name: withCredentials
    withCredentials: {
      cache: new InMemoryCache(),
      link: httpLink.create({ uri }),
      credentials: 'include',
      ssrMode: true,
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
