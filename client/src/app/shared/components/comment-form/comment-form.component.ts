import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
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
  standalone: true,
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
  @ViewChildren(InputComponent) public inputs!: QueryList<InputComponent>;

  @ViewChild(TextareaComponent) public textarea!: TextareaComponent;

  @ViewChild(RatingControlComponent) public ratingCtrl!: RatingControlComponent;

  @Input() public dialog!: PopupDataInterface;

  @Input({ required: true }) public deviceId!: string;

  @Input({ required: true }) public userId!: string | null;

  @Input() public comment!: CommentInterface;

  public readonly popupEnum = PopupTypeEnum;

  public commentForm!: FormGroup<CommentFormInterface>;

  private fb = inject(FormBuilder);

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.initForm();
  }

  public initForm(): void {
    this.commentForm = this.fb.group<CommentFormInterface>({
      rating: this.fb.nonNullable.control<number>(
        this.comment ? this.comment.rating : 0,
        [ratingValidator()],
      ),
      advantages: this.fb.nonNullable.control<string>(
        this.comment ? this.comment.advantages : '',
        [requiredValidator()],
      ),
      disadvantages: this.fb.nonNullable.control<string>(
        this.comment ? this.comment.disadvantages : '',
        [requiredValidator()],
      ),
      content: this.fb.nonNullable.control<string>(
        this.comment ? this.comment.content : '',
        [requiredValidator()],
      ),
    });
  }

  public sendComment(userId: string): void {
    this.inputs.forEach((input: InputComponent) => {
      input.markAsDirty();
    });
    this.textarea.markAsDirty();
    this.ratingCtrl.markAsDirty();
    if (this.commentForm.valid) {
      const formData = this.commentForm.getRawValue();
      const comment: CreateCommentInterface = {
        ...formData,
        deviceId: this.deviceId,
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
    if (this.commentForm.valid) {
      const formData = this.commentForm.getRawValue();
      const comment: CreateCommentInterface = {
        ...formData,
        deviceId: this.comment.device.id,
        userId: this.comment.user.id,
      };
      this.store.dispatch(
        CommentActions.updateComment({ id: this.comment.id, comment }),
      );
    }
  }
}
