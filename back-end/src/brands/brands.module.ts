import { forwardRef, Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsResolver } from './brands.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Brand, BrandSchema } from './schemas/brand.schema';
import { DevicesModule } from '../devices/devices.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }]),
    forwardRef(() => DevicesModule),
  ],
  providers: [BrandsResolver, BrandsService],
  exports: [BrandsService],
})
export class BrandsModule {}
