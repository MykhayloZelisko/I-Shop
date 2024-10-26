import { DeviceInterface } from './device.interface';

export interface DeletedCommentInterface {
  id: string;
  cursor: string | null;
  device: DeviceInterface;
}
