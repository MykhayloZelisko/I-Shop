import { forwardRef, Module } from '@nestjs/common';
import { CPropertiesGroupsService } from './c-properties-groups.service';
import { CPropertiesGroupsResolver } from './c-properties-groups.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CPropertiesGroup,
  CPropertiesGroupSchema,
} from './schemas/c-properties-group.schema';
import { CategoriesModule } from '../categories/categories.module';
import { CPropertiesModule } from '../c-properties/c-properties.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CPropertiesGroup.name, schema: CPropertiesGroupSchema },
    ]),
    forwardRef(() => CategoriesModule),
    CPropertiesModule,
    CommonModule,
  ],
  providers: [
    CPropertiesGroupsResolver,
    CPropertiesGroupsService,
  ],
  exports: [CPropertiesGroupsService],
})
export class CPropertiesGroupsModule {}
