import { Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesResolver } from './devices.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Device, DeviceSchema } from './schemas/device.schema';
import { BrandsModule } from '../brands/brands.module';
import { CategoriesModule } from '../categories/categories.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
    BrandsModule,
    CategoriesModule,
    FilesModule,
  ],
  providers: [DevicesResolver, DevicesService],
})
export class DevicesModule {}
