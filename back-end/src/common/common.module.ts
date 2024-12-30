import { forwardRef, Module } from '@nestjs/common';
import { CommonResolver } from './resolvers/common/common.resolver';
import { CPropertiesGroupsModule } from '../c-properties-groups/c-properties-groups.module';
import { CPropertiesModule } from '../c-properties/c-properties.module';
import { ParseObjectIdPipe } from './pipes/parse-object-id/parse-object-id.pipe';
import { CronService } from './services/cron/cron.service';
import { CartsModule } from '../carts/carts.module';
import { TransactionsService } from './services/transactions/transactions.service';

@Module({
  imports: [
    forwardRef(() => CPropertiesGroupsModule),
    forwardRef(() => CPropertiesModule),
    forwardRef(() => CartsModule),
  ],
  providers: [
    CommonResolver,
    ParseObjectIdPipe,
    CronService,
    TransactionsService,
  ],
  exports: [ParseObjectIdPipe, TransactionsService],
})
export class CommonModule {}
