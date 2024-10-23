import { MenuItem } from 'primeng/api';
import { DeviceRouteNameEnum } from '../enums/device-route-name.enum';

export const DEVICE_MENU: MenuItem[] = [
  {
    label: 'Усе про товар',
    routerLink: DeviceRouteNameEnum.About,
  },
  {
    label: 'Характеристики',
    routerLink: DeviceRouteNameEnum.Properties,
  },
  {
    label: '',
    routerLink: DeviceRouteNameEnum.Comments,
  },
];
