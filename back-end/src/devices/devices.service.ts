import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateDeviceInput } from './inputs/create-device.input';
import { UpdateDeviceInput } from './inputs/update-device.input';
import { Device as DeviceGQL } from './models/device.model';
import { InjectModel } from '@nestjs/mongoose';
import { Device, DeviceDocument } from './schemas/device.schema';
import { Model } from 'mongoose';
import { BrandsService } from '../brands/brands.service';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class DevicesService {
  public constructor(
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
    private brandsService: BrandsService,
    private categoriesService: CategoriesService,
  ) {}

  public async createDevice(
    createDeviceInput: CreateDeviceInput,
  ): Promise<boolean> {
    console.log(createDeviceInput);
    const brand = await this.brandsService.getBrandById(
      createDeviceInput.brandId,
    );
    const category = await this.categoriesService.getCategoryById(
      createDeviceInput.categoryId,
    );
    const categoriesIds = await this.categoriesService.findParentCategoriesIds(
      createDeviceInput.categoryId,
    );

    try {
      await this.deviceModel.create({
        deviceName: createDeviceInput.deviceName,
        price: createDeviceInput.price,
        images: createDeviceInput.images,
        category: category.id,
        categories: categoriesIds,
        brand: brand._id,
        properties: createDeviceInput.properties,
      });
    } catch {
      throw new InternalServerErrorException('Device is not created');
    }

    return true;
  }

  public async getAllDevicesByCategoryIdWithPagination(
    categoryId: string,
    page: number,
    size: number,
  ): Promise<DeviceGQL[]> {
    const devices = await this.deviceModel
      .find({ categories: { $in: [categoryId] } })
      .skip(page - 1)
      .limit(size)
      .populate(['category', 'brand', 'categories'])
      .exec();

    return devices.map((device: DeviceDocument) => device.toObject());
  }

  public async getDeviceById(id: string): Promise<DeviceGQL> {
    const device = await this.deviceModel
      .findById(id)
      .populate(['category', 'brand', 'categories'])
      .exec();
    if (!device) {
      throw new NotFoundException('Device not found');
    }
    return device.toObject();
  }

  // public async updateDevice(
  //   id: string,
  //   updateDeviceInput: UpdateDeviceInput,
  // ): Promise<DeviceGQL> {
  //   const brand = await this.brandsService.getBrandById(
  //     updateDeviceInput.brandId,
  //   );
  //   const category = await this.categoriesService.getCategoryById(
  //     updateDeviceInput.categoryId,
  //   );
  //
  //   const updatedDevice = await this.deviceModel
  //     .findByIdAndUpdate(id, {
  //       deviceName: updateDeviceInput.deviceName,
  //       price: updateDeviceInput.price,
  //       images: updateDeviceInput.images,
  //       category: category.id,
  //       brand: brand.id,
  //       properties: updateDeviceInput.properties,
  //     })
  //     .populate(['category', 'brand', 'categories'])
  //     .exec();
  //
  //   if (!updatedDevice) {
  //     throw new NotFoundException('Device not found');
  //   }
  //
  //   return updatedDevice.toObject();
  // }

  public async deleteDevice(id: string): Promise<string> {
    const device = await this.deviceModel.findByIdAndDelete(id).exec();
    if (device) {
      return device.id;
    } else {
      throw new NotFoundException('A device not found');
    }
  }
}
