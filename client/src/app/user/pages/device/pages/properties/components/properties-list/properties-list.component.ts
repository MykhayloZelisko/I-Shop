import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DeviceInterface } from '../../../../../../../shared/models/interfaces/device.interface';

@Component({
  selector: 'app-properties-list',
  standalone: true,
  templateUrl: './properties-list.component.html',
  styleUrl: './properties-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertiesListComponent {
  public device = input.required<DeviceInterface>();
}
