import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { requiredValidator } from '../../../../../shared/utils/validators';
import { Store } from '@ngrx/store';
import { State } from '../../../../../+store/reducers';
import { BrandActions } from '../../../../../+store/brands/actions/brand.actions';

@Component({
  selector: 'app-new-brand',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './new-brand.component.html',
  styleUrl: './new-brand.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewBrandComponent implements OnInit {
  public brandCtrl!: FormControl<string>;

  public brand = '';

  private fb = inject(FormBuilder);

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.brandCtrl = this.fb.nonNullable.control<string>('', [
      requiredValidator(),
    ]);
  }

  public addBrand(): void {
    const brandName = this.brandCtrl.getRawValue();
    this.store.dispatch(BrandActions.addBrand({ brandName }));
  }
}
