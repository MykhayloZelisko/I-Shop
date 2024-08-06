import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { TreeNode } from 'primeng/api';
import { CategoryInterface } from '../../../../../shared/models/interfaces/category.interface';
import { SvgIconComponent } from 'angular-svg-icon';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '../../../../../+store/reducers';
import { PopupActions } from '../../../../../+store/popup/actions/popup.actions';

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

  private router = inject(Router);

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.currentCategory = this.categories[0];
  }

  public onHover(category: TreeNode<CategoryInterface>): void {
    this.currentCategory = category;
  }

  public changeCategory(event: MouseEvent, id: string | undefined): void {
    event.preventDefault();
    if (id) {
      this.router.navigate(['categories', `${id}`]);
    } else {
      this.router.navigate(['categories']);
    }
    this.store.dispatch(PopupActions.closePopup());
  }
}
