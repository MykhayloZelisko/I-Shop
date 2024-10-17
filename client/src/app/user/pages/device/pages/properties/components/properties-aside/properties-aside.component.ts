import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { DeviceInterface } from '../../../../../../../shared/models/interfaces/device.interface';

@Component({
  selector: 'app-properties-aside',
  standalone: true,
  imports: [SvgIconComponent],
  templateUrl: './properties-aside.component.html',
  styleUrl: './properties-aside.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertiesAsideComponent {
  @Input({ required: true }) public device!: DeviceInterface;
}
