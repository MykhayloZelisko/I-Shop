import { Routes } from '@angular/router';
import { CategoriesRouteNameEnum } from '../shared/models/enums/categories-route-name.enum';

export const categoriesRoutes: Routes = [
  {
    path: CategoriesRouteNameEnum.NotFound,
    loadComponent: () =>
      import('../user/pages/page-not-found/page-not-found.component').then(
        (m) => m.PageNotFoundComponent,
      ),
    pathMatch: 'full',
  },
  {
    path: CategoriesRouteNameEnum.CategoryId,
    loadComponent: () =>
      import('../user/pages/category/category.component').then(
        (m) => m.CategoryComponent,
      ),
  },
];
