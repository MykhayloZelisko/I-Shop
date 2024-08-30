import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { DevicesService } from './devices.service';
import { Device } from './models/device.model';
import { CreateDeviceInput } from './inputs/create-device.input';
import { UpdateDeviceInput } from './inputs/update-device.input';
import { Category } from '../categories/models/category.model';
import { Brand } from '../brands/models/brand.model';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id/parse-object-id.pipe';
import { ParseIntegerPipe } from '../common/pipes/parse-integer/parse-integer.pipe';
import { UseGuards, UsePipes } from '@nestjs/common';
import { GqlAdminGuard } from '../common/guards/gql-admin/gql-admin.guard';
import { ValidationPipe } from '../common/pipes/validation/validation.pipe';

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

  @Query(() => [Device], { name: 'devices' })
  public async getAllDevicesByCategoryIdWithPagination(
    @Args('categoryId', ParseObjectIdPipe) categoryId: string,
    @Args('page', ParseIntegerPipe) page: number,
    @Args('size', ParseIntegerPipe) size: number,
  ): Promise<Device[]> {
    return this.devicesService.getAllDevicesByCategoryIdWithPagination(
      categoryId,
      page,
      size,
    );
  }

  @Query(() => Device, { name: 'device' })
  public async getDeviceById(
    @Args('id', ParseObjectIdPipe) id: string,
  ): Promise<Device> {
    return this.devicesService.getDeviceById(id);
  }

  // @Mutation(() => Device)
  // @UseGuards(GqlAdminGuard)
  // @UsePipes(ValidationPipe)
  // public async updateDevice(
  //   @Args('id', ParseObjectIdPipe) id: string,
  //   @Args('updateDeviceInput') updateDeviceInput: UpdateDeviceInput,
  // ): Promise<Device> {
  //   return this.devicesService.updateDevice(id, updateDeviceInput);
  // }

  @Mutation(() => String)
  public async deleteDevice(
    @Args('id', ParseObjectIdPipe) id: string,
  ): Promise<string> {
    return this.devicesService.deleteDevice(id);
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
