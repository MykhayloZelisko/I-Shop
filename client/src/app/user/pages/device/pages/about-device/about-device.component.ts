import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../../../+store/reducers';
import { selectDevice } from '../../../../../+store/devices/selectors/device.selectors';
import { Observable } from 'rxjs';
import { DeviceInterface } from '../../../../../shared/models/interfaces/device.interface';
import { AsyncPipe } from '@angular/common';
import { SvgIconComponent } from 'angular-svg-icon';
import { RatingComponent } from '../../../../../shared/components/rating/rating.component';
import { DeviceCarouselComponent } from './components/device-carousel/device-carousel.component';

@Component({
  selector: 'app-about-device',
  standalone: true,
  imports: [
    AsyncPipe,
    SvgIconComponent,
    RatingComponent,
    DeviceCarouselComponent,
  ],
  templateUrl: './about-device.component.html',
  styleUrl: './about-device.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutDeviceComponent implements OnInit {
  public device$!: Observable<DeviceInterface | null>;

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.device$ = this.store.select(selectDevice);
  }
}
