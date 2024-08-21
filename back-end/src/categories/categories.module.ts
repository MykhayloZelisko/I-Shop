import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesResolver } from './categories.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schemas/category.schema';
import { FilesModule } from '../files/files.module';
import { CPropertiesModule } from '../c-properties/c-properties.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
    FilesModule,
    CPropertiesModule,
  ],
  providers: [CategoriesService, CategoriesResolver],
  exports: [CategoriesService],
})
export class CategoriesModule {}
