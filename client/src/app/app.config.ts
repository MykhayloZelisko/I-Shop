import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { appRoutes } from './routes/app.routes';
import {
  provideClientHydration,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { graphqlProvider } from './graphql.provider';
import { provideStore } from '@ngrx/store';
import { reducers, metaReducers } from './+store/reducers';
import { provideEffects } from '@ngrx/effects';
import { environment } from '../environments/environment';
import { AppEffects } from './+store/effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideClientHydration(
      withHttpTransferCacheOptions({ includePostRequests: true }),
    ),
    provideHttpClient(withFetch()),
    graphqlProvider,
    provideStore(reducers, { metaReducers }),
    provideEffects(AppEffects),
    environment.providers,
  ],
};
