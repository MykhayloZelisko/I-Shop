import { forwardRef, Module } from '@nestjs/common';
import { CPropertiesService } from './c-properties.service';
import { CPropertiesResolver } from './c-properties.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { CProperty, CPropertySchema } from './schemas/c-property.schema';
import { CPropertiesGroupsModule } from '../c-properties-groups/c-properties-groups.module';
import { CommonModule } from '../common/common.module';
import { DevicesModule } from '../devices/devices.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CProperty.name, schema: CPropertySchema },
    ]),
    forwardRef(() => CPropertiesGroupsModule),
    CommonModule,
    forwardRef(() => DevicesModule),
  ],
  providers: [CPropertiesResolver, CPropertiesService],
  exports: [CPropertiesService],
})
export class CPropertiesModule {}
