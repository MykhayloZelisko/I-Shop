import { RoleInterface } from './role.interface';
import { CartInterface } from './cart.interface';

export interface UserInterface {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  roles: RoleInterface[];
  cart: CartInterface | null;
}
