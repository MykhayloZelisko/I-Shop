import { forwardRef, Module } from '@nestjs/common';
import { CPropertiesService } from './c-properties.service';
import { CPropertiesResolver } from './c-properties.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { CProperty, CPropertySchema } from './schemas/c-property.schema';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CProperty.name, schema: CPropertySchema },
    ]),
    forwardRef(() => CategoriesModule),
  ],
  providers: [CPropertiesResolver, CPropertiesService],
  exports: [CPropertiesService],
})
export class CPropertiesModule {}
