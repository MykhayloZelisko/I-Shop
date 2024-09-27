import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Int,
} from '@nestjs/graphql';
import { DevicesService } from './devices.service';
import { Device } from './models/device.model';
import { CreateDeviceInput } from './inputs/create-device.input';
import { Category } from '../categories/models/category.model';
import { Brand } from '../brands/models/brand.model';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id/parse-object-id.pipe';
import { ParseIntegerPipe } from '../common/pipes/parse-integer/parse-integer.pipe';
import { UseGuards, UsePipes } from '@nestjs/common';
import { GqlAdminGuard } from '../common/guards/gql-admin/gql-admin.guard';
import { ValidationPipe } from '../common/pipes/validation/validation.pipe';
import { DevicesList } from './models/devices-list.model';

@Resolver(() => Device)
export class DevicesResolver {
  public constructor(private devicesService: DevicesService) {}

  @Mutation(() => Boolean)
  @UseGuards(GqlAdminGuard)
  @UsePipes(ValidationPipe)
  public async createDevice(
    @Args('createDeviceInput') createDeviceInput: CreateDeviceInput,
  ): Promise<boolean> {
    return this.devicesService.createDevice(createDeviceInput);
  }

  @Query(() => DevicesList, { name: 'devices' })
  public async getAllDevicesByCategoryIdWithPagination(
    @Args('categoryId', ParseObjectIdPipe) categoryId: string,
    @Args('page', { type: () => Int }, ParseIntegerPipe) page: number,
    @Args('size', { type: () => Int }, ParseIntegerPipe) size: number,
  ): Promise<DevicesList> {
    return this.devicesService.getAllDevicesByCategoryIdWithPagination(
      categoryId,
      page,
      size,
    );
  }

  @ResolveField(() => Category)
  public async category(@Parent() device: Device): Promise<Category> {
    return device.category;
  }

  @ResolveField(() => Category)
  public async categories(@Parent() device: Device): Promise<Category[]> {
    return device.categories;
  }

  @ResolveField(() => Brand)
  public async brand(@Parent() device: Device): Promise<Brand> {
    return device.brand;
  }
}
