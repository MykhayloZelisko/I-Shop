import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NewBrandComponent } from './components/new-brand/new-brand.component';
import { BrandsListComponent } from './components/brands-list/brands-list.component';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [NewBrandComponent, BrandsListComponent],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandsComponent {}
