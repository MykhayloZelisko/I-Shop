import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertiesComponent {}
