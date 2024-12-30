import { forwardRef, Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesResolver } from './categories.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schemas/category.schema';
import { FilesModule } from '../files/files.module';
import { CPropertiesGroupsModule } from '../c-properties-groups/c-properties-groups.module';
import { DevicesModule } from '../devices/devices.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
    FilesModule,
    CPropertiesGroupsModule,
    forwardRef(() => DevicesModule),
    CommonModule,
  ],
  providers: [CategoriesService, CategoriesResolver],
  exports: [CategoriesService],
})
export class CategoriesModule {}
