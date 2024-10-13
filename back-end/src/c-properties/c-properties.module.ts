import { forwardRef, Module } from '@nestjs/common';
import { CPropertiesService } from './c-properties.service';
import { CPropertiesResolver } from './c-properties.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { CProperty, CPropertySchema } from './schemas/c-property.schema';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id/parse-object-id.pipe';
import { CPropertiesGroupsModule } from '../c-properties-groups/c-properties-groups.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CProperty.name, schema: CPropertySchema },
    ]),
    forwardRef(() => CPropertiesGroupsModule),
  ],
  providers: [CPropertiesResolver, CPropertiesService, ParseObjectIdPipe],
  exports: [CPropertiesService],
})
export class CPropertiesModule {}
