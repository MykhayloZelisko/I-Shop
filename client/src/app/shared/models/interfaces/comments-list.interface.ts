import { CommentInterface } from './comment.interface';

export interface CommentsListInterface {
  cursor: string | null;
  hasMore: boolean;
  comments: CommentInterface[];
}
