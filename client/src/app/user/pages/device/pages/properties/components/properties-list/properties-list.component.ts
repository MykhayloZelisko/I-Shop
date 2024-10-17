import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DeviceInterface } from '../../../../../../../shared/models/interfaces/device.interface';

@Component({
  selector: 'app-properties-list',
  standalone: true,
  imports: [],
  templateUrl: './properties-list.component.html',
  styleUrl: './properties-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertiesListComponent {
  @Input({ required: true }) public device!: DeviceInterface;
}
