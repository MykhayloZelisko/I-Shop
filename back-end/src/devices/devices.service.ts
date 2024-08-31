import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateDeviceInput } from './inputs/create-device.input';
import { Device as DeviceGQL } from './models/device.model';
import { InjectModel } from '@nestjs/mongoose';
import { Device, DeviceDocument } from './schemas/device.schema';
import { Model } from 'mongoose';
import { BrandsService } from '../brands/brands.service';
import { CategoriesService } from '../categories/categories.service';
import { FilesService } from '../files/files.service';

@Injectable()
export class DevicesService {
  public constructor(
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
    private brandsService: BrandsService,
    private categoriesService: CategoriesService,
    private filesService: FilesService,
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
      const fileNames: string[] = [];
      for (const image of createDeviceInput.images) {
        const fileName = await this.filesService.createImageFile(image);
        fileNames.push(fileName);
      }

      await this.deviceModel.create({
        deviceName: createDeviceInput.deviceName,
        price: createDeviceInput.price,
        images: fileNames,
        category: category.id,
        categories: categoriesIds,
        brand: brand.id,
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
}
