import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrandsComponent {

}
