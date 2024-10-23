import { Module } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { DevicesModule } from '../devices/devices.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Rating, RatingSchema } from './schemas/rating.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Rating.name, schema: RatingSchema }]),
    DevicesModule,
  ],
  providers: [RatingsService],
  exports: [RatingsService],
})
export class RatingsModule {}
