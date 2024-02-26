import { provideStoreDevtools } from '@ngrx/store-devtools';

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/graphql',
  providers: [
    provideStoreDevtools({
      maxAge: 50,
    }),
  ],
};
