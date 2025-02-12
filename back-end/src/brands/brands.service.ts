import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBrandInput } from './inputs/create-brand.input';
import { UpdateBrandInput } from './inputs/update-brand.input';
import { Brand as BrandGQL } from '../brands/models/brand.model';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Brand, BrandDocument } from './schemas/brand.schema';
import { DevicesService } from '../devices/devices.service';
import { TransactionsService } from '../common/services/transactions/transactions.service';

@Injectable()
export class BrandsService {
  public constructor(
    @InjectModel(Brand.name) private brandModel: Model<BrandDocument>,
    @Inject(forwardRef(() => DevicesService))
    private devicesService: DevicesService,
    private transactionsService: TransactionsService,
  ) {}

  public async createBrand(
    createBrandInput: CreateBrandInput,
  ): Promise<BrandGQL> {
    try {
      const newBrand = await this.brandModel.create(createBrandInput);
      return newBrand.toObject<BrandGQL>();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('This brand already exists');
      }
      throw error;
    }
  }

  public async getAllBrands(): Promise<BrandGQL[]> {
    const brands = await this.brandModel.find().exec();
    return brands.map((brand: BrandDocument) => brand.toObject<BrandGQL>());
  }

  public async updateBrand(
    id: string,
    updateBrandInput: UpdateBrandInput,
  ): Promise<BrandGQL> {
    try {
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
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('This brand name already exists');
      }
      throw error;
    }
  }

  public async deleteBrand(id: string): Promise<string> {
    return this.transactionsService.execute<string>(async (session) => {
      const isBrandUsed = await this.devicesService.checkBrand(id, session);

      if (isBrandUsed) {
        throw new ForbiddenException(
          'This brand is used in devices and cannot be deleted',
        );
      }

      const brand = await this.brandModel
        .findByIdAndDelete(id)
        .session(session)
        .exec();

      if (!brand) {
        throw new NotFoundException('A brand not found');
      }

      return brand.id;
    });
  }

  public async getBrandById(
    id: string,
    session: ClientSession,
  ): Promise<BrandGQL> {
    const brand = await this.brandModel.findById(id).session(session).exec();
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    return brand.toObject<BrandGQL>();
  }
}
