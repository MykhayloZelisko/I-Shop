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
        path: AdminRouteNameEnum.NewDevice,
        loadComponent: () =>
          import('../admin/pages/new-device/new-device.component').then(
            (m) => m.NewDeviceComponent,
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
        path: AdminRouteNameEnum.Brands,
        loadComponent: () =>
          import('../admin/pages/brands/brands.component').then(
            (m) => m.BrandsComponent,
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
