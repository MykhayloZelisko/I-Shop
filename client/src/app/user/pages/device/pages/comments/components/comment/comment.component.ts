import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { CommentInterface } from '../../../../../../../shared/models/interfaces/comment.interface';
import { DatePipe } from '@angular/common';
import { RatingComponent } from '../../../../../../../shared/components/rating/rating.component';
import { SvgIconComponent } from 'angular-svg-icon';
import { Store } from '@ngrx/store';
import { State } from '../../../../../../../+store/reducers';
import { CommentActions } from '../../../../../../../+store/comments/actions/comment.actions';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [DatePipe, RatingComponent, SvgIconComponent],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentComponent {
  @Input({ required: true }) public comment!: CommentInterface;

  private store = inject(Store<State>);

  public likeComment(status: 1 | -1): void {
    this.store.dispatch(
      CommentActions.updateLikes({ commentId: this.comment.id, status }),
    );
  }
}
