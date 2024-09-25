import { ApplicationConfig } from '@angular/core';
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
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouterStore } from '@ngrx/router-store';
import { CustomRouteSerializer } from './+store/router/serializer/custom-route-serializer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withFetch()),
    graphqlProvider,
    provideStore(reducers, { metaReducers }),
    provideEffects(AppEffects),
    environment.providers,
    provideAngularSvgIcon(),
    provideEnvironmentNgxMask(),
    provideAnimations(),
    provideRouterStore({
      serializer: CustomRouteSerializer,
    }),
  ],
};
