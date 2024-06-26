import { Routes } from '@angular/router';
import { AdminRouteNameEnum } from '../shared/models/enums/admin-route-name.enum';

export const adminRoutes: Routes = [
  {
    path: AdminRouteNameEnum.AdminPanel,
    loadComponent: () =>
      import('../admin/admin.component').then((m) => m.AdminComponent),
    children: [
      {
        path: AdminRouteNameEnum.Categories,
        loadComponent: () =>
          import('../admin/pages/categories/categories.component').then(
            (m) => m.CategoriesComponent,
          ),
      },
      {
        path: AdminRouteNameEnum.NewProduct,
        loadComponent: () =>
          import('../admin/pages/new-product/new-product.component').then(
            (m) => m.NewProductComponent,
          ),
      },
      {
        path: AdminRouteNameEnum.Users,
        loadComponent: () =>
          import('../admin/pages/users/users.component').then(
            (m) => m.UsersComponent,
          ),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: AdminRouteNameEnum.Categories,
      },
    ],
  },
];
