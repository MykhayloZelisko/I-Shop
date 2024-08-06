import { Routes } from '@angular/router';
import { UserRouteNameEnum } from '../shared/models/enums/user-route-name.enum';

export const userRoutes: Routes = [
  {
    path: UserRouteNameEnum.Home,
    loadComponent: () =>
      import('../user/pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: UserRouteNameEnum.Categories,
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            '../user/pages/dynamic-category/dynamic-category.component'
          ).then((m) => m.DynamicCategoryComponent),
        pathMatch: 'full',
      },
      {
        path: ':id',
        loadComponent: () =>
          import(
            '../user/pages/dynamic-category/dynamic-category.component'
          ).then((m) => m.DynamicCategoryComponent),
      },
    ],
  },
];
