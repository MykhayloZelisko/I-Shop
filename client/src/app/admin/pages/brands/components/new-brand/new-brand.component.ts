import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { requiredValidator } from '../../../../../shared/utils/validators';
import { Store } from '@ngrx/store';
import { State } from '../../../../../+store/reducers';
import { BrandActions } from '../../../../../+store/brands/actions/brand.actions';
import { Observable, Subject, takeUntil } from 'rxjs';
import { selectFormCleared } from '../../../../../+store/form/selectors/form.selectors';
import { FormActions } from '../../../../../+store/form/actions/form.actions';
import { InputComponent } from '../../../../../shared/components/input/input.component';

@Component({
  selector: 'app-new-brand',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent],
  templateUrl: './new-brand.component.html',
  styleUrl: './new-brand.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewBrandComponent implements OnInit, OnDestroy {
  public brandCtrl!: FormControl<string>;

  public isFormCleared$!: Observable<boolean>;

  private destroy$: Subject<void> = new Subject<void>();

  private fb = inject(FormBuilder);

  private store = inject(Store<State>);

  private cdr = inject(ChangeDetectorRef);

  public ngOnInit(): void {
    this.brandCtrl = this.fb.nonNullable.control<string>('', [
      requiredValidator(),
    ]);
    this.isFormCleared$ = this.store.select(selectFormCleared);
    this.clearForm();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public addBrand(): void {
    if (this.brandCtrl.valid) {
      const brandName = this.brandCtrl.getRawValue();
      this.store.dispatch(BrandActions.addBrand({ brandName }));
    }
  }

  public clearBrandId(): void {
    this.store.dispatch(BrandActions.clearCurrentBrandId());
  }

  public clearForm(): void {
    this.isFormCleared$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isFormCleared) => {
        if (isFormCleared) {
          this.brandCtrl.reset();
          this.store.dispatch(FormActions.clearFormOff());
          this.cdr.markForCheck();
        }
      });
  }
}
