import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { BrandInterface } from '../../../../../../../shared/models/interfaces/brand.interface';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../../../../../../../+store/reducers';
import { selectCurrentBrandId } from '../../../../../../../+store/brands/selectors/brand.selectors';
import { AsyncPipe } from '@angular/common';
import { SvgIconComponent } from 'angular-svg-icon';
import { PaginatorModule } from 'primeng/paginator';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { BrandActions } from '../../../../../../../+store/brands/actions/brand.actions';
import { requiredValidator } from '../../../../../../../shared/utils/validators';

@Component({
  selector: 'app-brand-item',
  standalone: true,
  imports: [AsyncPipe, SvgIconComponent, PaginatorModule, ReactiveFormsModule],
  templateUrl: './brand-item.component.html',
  styleUrl: './brand-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandItemComponent implements OnInit {
  public brand = input.required<BrandInterface>();

  public brandCtrl!: FormControl<string>;

  public currentId$!: Observable<string | null>;

  private store = inject(Store<State>);

  private fb = inject(FormBuilder);

  public ngOnInit(): void {
    this.currentId$ = this.store.select(selectCurrentBrandId);
    this.brandCtrl = this.fb.nonNullable.control<string>(
      this.brand().brandName,
      [requiredValidator()],
    );
  }

  public editBrand(): void {
    this.store.dispatch(
      BrandActions.setCurrentBrandId({ currentId: this.brand().id }),
    );
    this.brandCtrl.setValue(this.brand().brandName);
  }

  public saveBrand(): void {
    const brandName = this.brandCtrl.getRawValue().trim();
    this.store.dispatch(
      BrandActions.updateBrand({ id: this.brand().id, brandName }),
    );
  }

  public cancelEditBrand(): void {
    this.store.dispatch(BrandActions.clearCurrentBrandId());
  }

  public deleteBrand(): void {
    this.store.dispatch(BrandActions.deleteBrand({ id: this.brand().id }));
  }
}
