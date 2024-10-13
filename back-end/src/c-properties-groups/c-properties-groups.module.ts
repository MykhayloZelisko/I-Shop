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
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id/parse-object-id.pipe';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CPropertiesGroup.name, schema: CPropertiesGroupSchema },
    ]),
    forwardRef(() => CategoriesModule),
    CPropertiesModule,
  ],
  providers: [
    CPropertiesGroupsResolver,
    CPropertiesGroupsService,
    ParseObjectIdPipe,
  ],
  exports: [CPropertiesGroupsService],
})
export class CPropertiesGroupsModule {}
