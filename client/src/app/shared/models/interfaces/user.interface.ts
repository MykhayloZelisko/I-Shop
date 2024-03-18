import { RoleInterface } from './role.interface';

export interface UserInterface {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  roles: RoleInterface[];
}
