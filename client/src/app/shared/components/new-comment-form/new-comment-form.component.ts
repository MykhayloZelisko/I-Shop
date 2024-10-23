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
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
} from '@angular/forms';
import { CommentFormInterface } from '../../models/interfaces/comment-form.interface';
import { ratingValidator, requiredValidator } from '../../utils/validators';
import { TextareaComponent } from '../textarea/textarea.component';
import { PopupDataInterface } from '../../models/interfaces/popup-data.interface';
import { PopupTypeEnum } from '../../models/enums/popup-type.enum';
import { UserInterface } from '../../models/interfaces/user.interface';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../../../+store/reducers';
import { AsyncPipe } from '@angular/common';
import { CreateCommentInterface } from '../../models/interfaces/create-comment.interface';
import { PopupActions } from '../../../+store/popup/actions/popup.actions';
import { CommentActions } from '../../../+store/comments/actions/comment.actions';

@Component({
  selector: 'app-new-comment-form',
  standalone: true,
  imports: [
    InputComponent,
    RatingControlComponent,
    ReactiveFormsModule,
    TextareaComponent,
    AsyncPipe,
  ],
  templateUrl: './new-comment-form.component.html',
  styleUrl: './new-comment-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewCommentFormComponent implements OnInit {
  @ViewChildren(InputComponent) public inputs!: QueryList<InputComponent>;

  @ViewChild(TextareaComponent) public textarea!: TextareaComponent;

  @ViewChild(RatingControlComponent) public ratingCtrl!: RatingControlComponent;

  @Input() public dialog!: PopupDataInterface;

  @Input({ required: true }) public deviceId!: string;

  @Input({ required: true }) public user$!: Observable<UserInterface | null>;

  protected readonly requiredValidators: ValidatorFn[] = [requiredValidator()];

  public readonly popupEnum = PopupTypeEnum;

  public commentForm!: FormGroup<CommentFormInterface>;

  private fb = inject(FormBuilder);

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.initForm();
  }

  public initForm(): void {
    this.commentForm = this.fb.group<CommentFormInterface>({
      rating: this.fb.nonNullable.control<number>(0, [ratingValidator()]),
      advantages: this.fb.nonNullable.control<string>('', [
        requiredValidator(),
      ]),
      disadvantages: this.fb.nonNullable.control<string>('', []),
      comment: this.fb.nonNullable.control<string>('', []),
    });
  }

  public sendComment(id: string): void {
    this.inputs.forEach((input: InputComponent) => input.markAsDirty());
    this.textarea.markAsDirty();
    this.ratingCtrl.markAsDirty();
    if (this.commentForm.valid) {
      const formData = this.commentForm.getRawValue();
      const comment: CreateCommentInterface = {
        ...formData,
        deviceId: this.deviceId,
        userId: id,
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
}
