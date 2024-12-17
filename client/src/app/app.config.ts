import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './routes/app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { graphqlProvider } from './graphql.provider';
import { provideStore } from '@ngrx/store';
import { reducers, metaReducers } from './+store/reducers';
import { provideEffects } from '@ngrx/effects';
import { environment } from '../environments/environment';
import { AppEffects } from './+store/effects';
import { provideAngularSvgIcon } from 'angular-svg-icon';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouterStore } from '@ngrx/router-store';
import { CustomRouteSerializer } from './+store/router/serializer/custom-route-serializer';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(withFetch()),
    graphqlProvider,
    provideClientHydration(withEventReplay()),
    provideStore(reducers, { metaReducers }),
    provideEffects(AppEffects),
    environment.providers,
    provideAngularSvgIcon(),
    provideEnvironmentNgxMask(),
    provideAnimationsAsync(),
    provideRouterStore({
      serializer: CustomRouteSerializer,
    }),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
  ],
};
