import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { TreeNode } from 'primeng/api';
import { CategoryInterface } from '../../../../../shared/models/interfaces/category.interface';
import { SvgIconComponent } from 'angular-svg-icon';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-large-catalog',
  standalone: true,
  imports: [SvgIconComponent, NgClass],
  templateUrl: './large-catalog.component.html',
  styleUrl: './large-catalog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LargeCatalogComponent implements OnInit {
  @Input({ required: true }) public categories!: TreeNode<CategoryInterface>[];

  public currentCategory!: TreeNode<CategoryInterface>;

  public ngOnInit(): void {
    this.currentCategory = this.categories[0];
  }

  public onHover(category: TreeNode<CategoryInterface>): void {
    this.currentCategory = category;
  }
}
