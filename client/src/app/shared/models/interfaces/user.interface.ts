import { RoleInterface } from './role.interface';

export interface UserInterface {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  roles: RoleInterface[];
}
