import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsResolver } from './comments.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { RatingsModule } from '../ratings/ratings.module';

@Module({
  providers: [CommentsResolver, CommentsService],
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    RatingsModule,
  ],
})
export class CommentsModule {}
