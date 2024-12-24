import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBrandInput } from './inputs/create-brand.input';
import { UpdateBrandInput } from './inputs/update-brand.input';
import { Brand as BrandGQL } from '../brands/models/brand.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Brand, BrandDocument } from './schemas/brand.schema';

@Injectable()
export class BrandsService {
  public constructor(
    @InjectModel(Brand.name) private brandModel: Model<BrandDocument>,
  ) {}

  public async createBrand(
    createBrandInput: CreateBrandInput,
  ): Promise<BrandGQL> {
    const brand = await this.brandModel
      .findOne({ brandName: createBrandInput.brandName })
      .exec();
    if (brand) {
      throw new ConflictException('This brand already exists');
    }
    const newBrand = await this.brandModel.create(createBrandInput);
    return newBrand.toObject<BrandGQL>();
  }

  public async getAllBrands(): Promise<BrandGQL[]> {
    const brands = await this.brandModel.find().exec();
    return brands.map((brand: BrandDocument) => brand.toObject<BrandGQL>());
  }

  public async updateBrand(
    id: string,
    updateBrandInput: UpdateBrandInput,
  ): Promise<BrandGQL> {
    const brand = await this.brandModel
      .findOne({ brandName: updateBrandInput.brandName })
      .exec();
    if (brand && brand.id !== id) {
      throw new ConflictException('This brand already exists');
    }
    const updatedBrand = await this.brandModel
      .findByIdAndUpdate(
        id,
        { brandName: updateBrandInput.brandName },
        { new: true },
      )
      .exec();
    if (updatedBrand) {
      return updatedBrand.toObject<BrandGQL>();
    }
    throw new BadRequestException('A brand is not updated');
  }

  public async deleteBrand(id: string): Promise<string> {
    // TODO: check products. If a brand cannot be deleted you should throw ForbiddenException
    const brand = await this.brandModel.findByIdAndDelete(id).exec();
    if (brand) {
      return brand.id;
    } else {
      throw new NotFoundException('A brand not found');
    }
  }

  public async getBrandById(id: string): Promise<BrandGQL> {
    const brand = await this.brandModel.findById(id).exec();
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    return brand.toObject<BrandGQL>();
  }
}
