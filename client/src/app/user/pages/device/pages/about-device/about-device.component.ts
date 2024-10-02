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
import { AsyncPipe, JsonPipe, NgClass, NgStyle } from '@angular/common';
import {
  ImageConfigInterface
} from '../../../../../shared/models/interfaces/image-config.interface';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-about-device',
  standalone: true,
  imports: [AsyncPipe, JsonPipe, NgStyle, SvgIconComponent, NgClass],
  templateUrl: './about-device.component.html',
  styleUrl: './about-device.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutDeviceComponent implements OnInit {
  public device$!: Observable<DeviceInterface | null>;

  public currentImageIndex = 0;

  // public imageConfig: ImageConfigInterface = {
  //   width: 0,
  //   height: 0,
  // };

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.device$ = this.store.select(selectDevice);
  }

  // public onImageLoad(event: Event): void {
  //   console.log(this.imageConfig);
  //   const imgElement = event.target as HTMLImageElement;
  //   this.imageConfig.width = imgElement.width;
  //   this.imageConfig.height = imgElement.height;
  //   console.log(this.imageConfig);
  // }
  //
  public getStyle(device: DeviceInterface): Record<string, string> {
    return {
      'background-image': `url(${device.images[this.currentImageIndex]})`,
    };
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
}
