import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { PopupDataInterface } from '../../../../../shared/models/interfaces/popup-data.interface';
import { PopupTypeEnum } from '../../../../../shared/models/enums/popup-type.enum';
import { Store } from '@ngrx/store';
import { State } from '../../../../../+store/reducers';
import { selectPopup } from '../../../../../+store/popup/selectors/popup.selectors';
import { AsyncPipe } from '@angular/common';
import { NewCommentDialogComponent } from './components/new-comment-dialog/new-comment-dialog.component';
import { DeviceInterface } from '../../../../../shared/models/interfaces/device.interface';
import { selectDevice } from '../../../../../+store/devices/selectors/device.selectors';
import { NewCommentFormComponent } from '../../../../../shared/components/new-comment-form/new-comment-form.component';
import { RatingComponent } from '../../../../../shared/components/rating/rating.component';
import { DeviceAsideComponent } from '../../../../../shared/components/device-aside/device-aside.component';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    AsyncPipe,
    NewCommentDialogComponent,
    NewCommentFormComponent,
    RatingComponent,
    DeviceAsideComponent,
  ],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsComponent implements OnInit {
  public readonly popupEnum = PopupTypeEnum;

  public dialog$!: Observable<PopupDataInterface>;

  public device$!: Observable<DeviceInterface | null>;

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.dialog$ = this.store.select(selectPopup);
    this.device$ = this.store.select(selectDevice);
  }
}
