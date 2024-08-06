import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-core-category',
  standalone: true,
  imports: [],
  templateUrl: './core-category.component.html',
  styleUrl: './core-category.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoreCategoryComponent {}
