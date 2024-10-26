import { CommentInterface } from './comment.interface';
import { CommentsListStatusInterface } from './comments-list-status.interface';

export interface CommentsListInterface extends CommentsListStatusInterface {
  comments: CommentInterface[];
}
