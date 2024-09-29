import { Routes } from '@angular/router';
import { DevicesRouteNameEnum } from '../shared/models/enums/devices-route-name.enum';
import { deviceRoutes } from './device.routes';

export const devicesRoutes: Routes = [
  {
    path: DevicesRouteNameEnum.NotFound,
    loadComponent: () =>
      import('../user/pages/page-not-found/page-not-found.component').then(
        (m) => m.PageNotFoundComponent,
      ),
    pathMatch: 'full',
  },
  {
    path: DevicesRouteNameEnum.DeviceId,
    loadComponent: () =>
      import('../user/pages/device/device.component').then(
        (m) => m.DeviceComponent,
      ),
    loadChildren: () => import('./device.routes').then((m) => m.deviceRoutes),
  },
];
