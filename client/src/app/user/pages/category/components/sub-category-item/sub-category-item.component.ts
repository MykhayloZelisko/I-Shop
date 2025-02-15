import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CascadeCategoryInterface } from '../../../../../shared/models/interfaces/cascade-category.interface';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-sub-category-item',
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './sub-category-item.component.html',
  styleUrl: './sub-category-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubCategoryItemComponent {
  public category = input.required<CascadeCategoryInterface>();
}
