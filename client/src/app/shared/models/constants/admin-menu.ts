import { MenuItem } from 'primeng/api';
import { AdminRouteNameEnum } from '../enums/admin-route-name.enum';

export const ADMIN_MENU: MenuItem[] = [
  {
    label: 'Категорії',
    routerLink: AdminRouteNameEnum.Categories,
  },
  {
    label: 'Новий товар',
    routerLink: AdminRouteNameEnum.NewDevice,
  },
  {
    label: 'Користувачі',
    routerLink: AdminRouteNameEnum.Users,
  },
  {
    label: 'Бренди',
    routerLink: AdminRouteNameEnum.Brands,
  },
];
