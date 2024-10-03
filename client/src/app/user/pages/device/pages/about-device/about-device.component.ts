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
import { AsyncPipe, NgClass, NgStyle } from '@angular/common';
import { SvgIconComponent } from 'angular-svg-icon';
import { RatingComponent } from '../../../../../shared/components/rating/rating.component';

@Component({
  selector: 'app-about-device',
  standalone: true,
  imports: [AsyncPipe, NgStyle, SvgIconComponent, NgClass, RatingComponent],
  templateUrl: './about-device.component.html',
  styleUrl: './about-device.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutDeviceComponent implements OnInit {
  public device$!: Observable<DeviceInterface | null>;

  public currentImageIndex = 0;

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.device$ = this.store.select(selectDevice);
  }

  public prevImage(device: DeviceInterface): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    } else {
      this.currentImageIndex = device.images.length - 1;
    }
  }

  public nextImage(device: DeviceInterface): void {
    if (this.currentImageIndex < device.images.length - 1) {
      this.currentImageIndex++;
    } else {
      this.currentImageIndex = 0;
    }
  }

  public setCurrentIndex(index: number): void {
    this.currentImageIndex = index;
  }
}
