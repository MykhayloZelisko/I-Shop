import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DeviceInterface } from '../../../../../shared/models/interfaces/device.interface';
import { RouterLink } from '@angular/router';
import { RatingComponent } from '../../../../../shared/components/rating/rating.component';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-device-item',
  standalone: true,
  imports: [RouterLink, RatingComponent, SvgIconComponent],
  templateUrl: './device-item.component.html',
  styleUrl: './device-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceItemComponent {
  @Input({ required: true }) public device!: DeviceInterface;
}
