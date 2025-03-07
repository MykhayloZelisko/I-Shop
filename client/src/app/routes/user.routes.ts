import { Routes } from '@angular/router';
import { UserRouteNameEnum } from '../shared/models/enums/user-route-name.enum';
import { checkoutGuard } from '../user/guards/checkout.guard';

export const userRoutes: Routes = [
  {
    path: UserRouteNameEnum.Home,
    loadComponent: () =>
      import('../user/pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: UserRouteNameEnum.Categories,
    loadChildren: () =>
      import('./categories.routes').then((m) => m.categoriesRoutes),
  },
  {
    path: UserRouteNameEnum.Devices,
    loadChildren: () => import('./devices.routes').then((m) => m.devicesRoutes),
  },
  {
    path: UserRouteNameEnum.Checkout,
    loadComponent: () =>
      import('../user/pages/checkout/checkout.component').then(
        (m) => m.CheckoutComponent,
      ),
    canActivate: [checkoutGuard],
  },
];
