import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { DeviceInterface } from '../../models/interfaces/device.interface';

@Component({
  selector: 'app-device-aside',
  standalone: true,
  imports: [SvgIconComponent],
  templateUrl: './device-aside.component.html',
  styleUrl: './device-aside.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceAsideComponent {
  @Input({ required: true }) public device!: DeviceInterface;
}
