import { Injectable } from '@nestjs/common';
import { CreateDeviceInput } from './inputs/create-device.input';
import { UpdateDeviceInput } from './inputs/update-device.input';

@Injectable()
export class DevicesService {
  create(createDeviceInput: CreateDeviceInput) {
    return 'This action adds a new device';
  }

  findAll() {
    return `This action returns all devices`;
  }

  findOne(id: number) {
    return `This action returns a #${id} device`;
  }

  update(id: number, updateDeviceInput: UpdateDeviceInput) {
    return `This action updates a #${id} device`;
  }

  remove(id: number) {
    return `This action removes a #${id} device`;
  }
}
