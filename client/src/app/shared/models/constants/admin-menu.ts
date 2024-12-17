import { AdminRouteNameEnum } from '../enums/admin-route-name.enum';
import { TabMenuItemInterface } from '../interfaces/tab-menu-item.interface';

export const ADMIN_MENU: TabMenuItemInterface[] = [
  {
    label: 'Категорії',
    route: AdminRouteNameEnum.Categories,
  },
  {
    label: 'Новий товар',
    route: AdminRouteNameEnum.NewDevice,
  },
  {
    label: 'Користувачі',
    route: AdminRouteNameEnum.Users,
  },
  {
    label: 'Бренди',
    route: AdminRouteNameEnum.Brands,
  },
];
