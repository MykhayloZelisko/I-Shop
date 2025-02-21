import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { InputComponent } from '../input/input.component';
import { RatingControlComponent } from './components/rating-control/rating-control.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommentFormInterface } from '../../models/interfaces/comment-form.interface';
import { ratingValidator, requiredValidator } from '../../utils/validators';
import { TextareaComponent } from '../textarea/textarea.component';
import { PopupDataInterface } from '../../models/interfaces/popup-data.interface';
import { PopupTypeEnum } from '../../models/enums/popup-type.enum';
import { Store } from '@ngrx/store';
import { State } from '../../../+store/reducers';
import { CreateCommentInterface } from '../../models/interfaces/create-comment.interface';
import { PopupActions } from '../../../+store/popup/actions/popup.actions';
import { CommentActions } from '../../../+store/comments/actions/comment.actions';
import { CommentInterface } from '../../models/interfaces/comment.interface';

@Component({
  selector: 'app-comment-form',
  imports: [
    InputComponent,
    RatingControlComponent,
    ReactiveFormsModule,
    TextareaComponent,
  ],
  templateUrl: './comment-form.component.html',
  styleUrl: './comment-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentFormComponent implements OnInit {
  public dialog = input<PopupDataInterface>();

  public deviceId = input.required<string>();

  public userId = input.required<string | null>();

  public comment = input<CommentInterface>();

  public readonly popupEnum = PopupTypeEnum;

  public commentForm!: FormGroup<CommentFormInterface>;

  private fb = inject(FormBuilder);

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.initForm();
  }

  public initForm(): void {
    const comment = this.comment();
    this.commentForm = this.fb.group<CommentFormInterface>({
      rating: this.fb.nonNullable.control<number>(
        comment ? comment.rating : 0,
        [ratingValidator()],
      ),
      advantages: this.fb.nonNullable.control<string>(
        comment ? comment.advantages : '',
        [requiredValidator()],
      ),
      disadvantages: this.fb.nonNullable.control<string>(
        comment ? comment.disadvantages : '',
        [requiredValidator()],
      ),
      content: this.fb.nonNullable.control<string>(
        comment ? comment.content : '',
        [requiredValidator()],
      ),
    });
  }

  public markAsDirty(): void {
    Object.values(this.commentForm.controls).forEach((control) => {
      control.markAsDirty();
    });
  }

  public sendComment(userId: string | null): void {
    this.markAsDirty();
    if (this.commentForm.valid && userId) {
      const formData = this.commentForm.getRawValue();
      const comment: CreateCommentInterface = {
        ...formData,
        deviceId: this.deviceId(),
        userId,
      };
      this.store.dispatch(CommentActions.addComment({ comment }));
    }
  }

  public login(): void {
    this.store.dispatch(
      PopupActions.openPopup({
        popup: { title: 'Вхід', popupType: PopupTypeEnum.Login },
      }),
    );
  }

  public cancelSending(): void {
    this.store.dispatch(PopupActions.closePopup());
  }

  public updateComment(): void {
    const oldComment = this.comment();
    if (this.commentForm.valid && oldComment) {
      const formData = this.commentForm.getRawValue();
      const comment: CreateCommentInterface = {
        ...formData,
        deviceId: oldComment.device.id,
        userId: oldComment.user.id,
      };
      this.store.dispatch(
        CommentActions.updateComment({ id: oldComment.id, comment }),
      );
    }
  }
}
