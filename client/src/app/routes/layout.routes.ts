import { Routes } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { LayoutRouteNameEnum } from '../shared/models/enums/layout-route-name.enum';
import { adminGuard } from '../admin/guards/admin.guard';

export const layoutRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: LayoutRouteNameEnum.User,
        loadChildren: () => import('./user.routes').then((m) => m.userRoutes),
      },
      {
        path: LayoutRouteNameEnum.Admin,
        loadChildren: () => import('./admin.routes').then((m) => m.adminRoutes),
        canActivate: [adminGuard],
      },
      {
        path: LayoutRouteNameEnum.PageNotFound,
        loadComponent: () =>
          import('../user/pages/page-not-found/page-not-found.component').then(
            (m) => m.PageNotFoundComponent,
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
