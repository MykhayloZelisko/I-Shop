import { Routes } from '@angular/router';
import { DeviceRouteNameEnum } from '../shared/models/enums/device-route-name.enum';
import { AdminRouteNameEnum } from '../shared/models/enums/admin-route-name.enum';

export const deviceRoutes: Routes = [
  {
    path: DeviceRouteNameEnum.About,
    loadComponent: () =>
      import(
        '../user/pages/device/pages/about-device/about-device.component'
      ).then((m) => m.AboutDeviceComponent),
    pathMatch: 'full',
  },
  {
    path: DeviceRouteNameEnum.Comments,
    loadComponent: () =>
      import('../user/pages/device/pages/comments/comments.component').then(
        (m) => m.CommentsComponent,
      ),
  },
  {
    path: DeviceRouteNameEnum.Properties,
    loadComponent: () =>
      import('../user/pages/device/pages/properties/properties.component').then(
        (m) => m.PropertiesComponent,
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: DeviceRouteNameEnum.About,
  },
];
