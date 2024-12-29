import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDeviceInput } from './inputs/create-device.input';
import { InjectModel } from '@nestjs/mongoose';
import { Device, DeviceDocument } from './schemas/device.schema';
import { ClientSession, Model } from 'mongoose';
import { BrandsService } from '../brands/brands.service';
import { CategoriesService } from '../categories/categories.service';
import { FilesService } from '../files/files.service';
import { DevicesList } from './models/devices-list.model';
import { Device as DeviceGQL } from './models/device.model';
import { CPropertiesGroupsService } from '../c-properties-groups/c-properties-groups.service';
import { CPropertiesService } from '../c-properties/c-properties.service';

@Injectable()
export class DevicesService {
  public constructor(
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
    private brandsService: BrandsService,
    private categoriesService: CategoriesService,
    private filesService: FilesService,
    private cPropertiesGroupsService: CPropertiesGroupsService,
    private cPropertiesService: CPropertiesService,
  ) {}

  public async createDevice(
    createDeviceInput: CreateDeviceInput,
  ): Promise<boolean> {
    const brand = await this.brandsService.getBrandById(
      createDeviceInput.brandId,
    );
    const category = await this.categoriesService.getCategoryById(
      createDeviceInput.categoryId,
    );
    const categoriesIds = await this.categoriesService.getParentCategoriesIds(
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
        quantity: createDeviceInput.quantity,
        images: fileNames,
        category: category.id,
        categories: categoriesIds,
        brand: brand.id,
        groups: createDeviceInput.groups,
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
  ): Promise<DevicesList> {
    const devices = await this.deviceModel
      .find({ categories: { $in: [categoryId] } })
      .skip((page - 1) * size)
      .limit(size)
      .populate(['category', 'brand', 'categories'])
      .exec();

    const total = await this.deviceModel.countDocuments({
      categories: { $in: [categoryId] },
    });

    return {
      total,
      page,
      size,
      devices: devices.map((device: DeviceDocument) =>
        device.toObject<DeviceGQL>(),
      ),
    };
  }

  public async getDeviceById(id: string): Promise<DeviceGQL> {
    const device = await this.deviceModel
      .findById(id)
      .populate(['category', 'brand', 'categories'])
      .exec();
    if (!device) {
      throw new NotFoundException('Brand not found');
    }
    return device.toObject<DeviceGQL>();
  }

  public async recalculateDeviceRating(
    id: string,
    votes: number,
    rating: number,
    session: ClientSession,
  ): Promise<void> {
    const device = await this.deviceModel
      .findByIdAndUpdate(id, { votes, rating }, { new: true })
      .session(session)
      .exec();
    if (!device) {
      throw new NotFoundException('Device not found');
    }
  }

  public async checkBrand(brandId: string): Promise<boolean> {
    const device = await this.deviceModel.exists({ brand: brandId }).exec();
    return !!device;
  }

  public async checkCategory(categoryId: string): Promise<boolean> {
    const device = await this.deviceModel
      .exists({ categories: { $in: [categoryId] } })
      .exec();
    return !!device;
  }

  public async checkGroup(groupId: string): Promise<boolean> {
    const categoryId =
      await this.cPropertiesGroupsService.getCategoryId(groupId);
    return this.checkCategory(categoryId);
  }

  public async checkProperty(propertyId: string): Promise<boolean> {
    const groupId = await this.cPropertiesService.getGroupId(propertyId);
    return this.checkGroup(groupId);
  }
}
