import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DevicesService } from './devices.service';
import { Device } from './models/device.model';
import { CreateDeviceInput } from './inputs/create-device.input';
import { UpdateDeviceInput } from './inputs/update-device.input';

@Resolver(() => Device)
export class DevicesResolver {
  constructor(private readonly devicesService: DevicesService) {}

  @Mutation(() => Device)
  createDevice(@Args('createDeviceInput') createDeviceInput: CreateDeviceInput) {
    return this.devicesService.create(createDeviceInput);
  }

  @Query(() => [Device], { name: 'devices' })
  findAll() {
    return this.devicesService.findAll();
  }

  @Query(() => Device, { name: 'device' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.devicesService.findOne(id);
  }

  @Mutation(() => Device)
  updateDevice(@Args('updateDeviceInput') updateDeviceInput: UpdateDeviceInput) {
    return this.devicesService.update(updateDeviceInput.id, updateDeviceInput);
  }

  @Mutation(() => Device)
  removeDevice(@Args('id', { type: () => Int }) id: number) {
    return this.devicesService.remove(id);
  }
}
