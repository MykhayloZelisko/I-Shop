import { DeviceRouteNameEnum } from '../enums/device-route-name.enum';
import { TabMenuItemInterface } from '../interfaces/tab-menu-item.interface';

export const DEVICE_MENU: TabMenuItemInterface[] = [
  {
    label: 'Усе про товар',
    route: DeviceRouteNameEnum.About,
  },
  {
    label: 'Характеристики',
    route: DeviceRouteNameEnum.Properties,
  },
  {
    label: '',
    route: DeviceRouteNameEnum.Comments,
  },
];
