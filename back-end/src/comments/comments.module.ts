import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsResolver } from './comments.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { RatingsModule } from '../ratings/ratings.module';
import { DevicesModule } from '../devices/devices.module';
import { CommonModule } from '../common/common.module';

@Module({
  providers: [CommentsResolver, CommentsService],
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    RatingsModule,
    DevicesModule,
    CommonModule,
  ],
})
export class CommentsModule {}
