import { UserInterface } from './user.interface';
import { DeviceInterface } from './device.interface';

export interface CommentInterface {
  id: string;
  device: DeviceInterface;
  rating: number;
  advantages: string;
  disadvantages: string;
  content: string;
  user: UserInterface;
  updatedAt: Date;
  createdAt: Date;
  likesUsers: UserInterface[];
  dislikesUsers: UserInterface[];
}
