import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-about-device',
  standalone: true,
  imports: [],
  templateUrl: './about-device.component.html',
  styleUrl: './about-device.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutDeviceComponent {}
