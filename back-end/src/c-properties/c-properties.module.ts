import { Module } from '@nestjs/common';
import { CPropertiesService } from './c-properties.service';
import { CPropertiesResolver } from './c-properties.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { CProperty, CPropertySchema } from './schemas/c-property.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CProperty.name, schema: CPropertySchema },
    ]),
  ],
  providers: [CPropertiesResolver, CPropertiesService],
  exports: [CPropertiesService],
})
export class CPropertiesModule {}
