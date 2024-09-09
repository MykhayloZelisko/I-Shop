import { Directive, inject, Injector, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormControlDirective,
  FormControlName,
  FormGroupDirective,
  NgControl,
  NgModel,
} from '@angular/forms';
import { Subject, takeUntil, tap } from 'rxjs';

@Directive()
export class GetControlDirective implements OnDestroy {
  public control!: FormControl<string | null>;

  private destroy$: Subject<void> = new Subject<void>();

  private injector = inject(Injector);

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public setComponentControl(): void {
    const injectedControl = this.injector.get(NgControl);

    switch (injectedControl.constructor) {
      case NgModel: {
        const { control, update } = injectedControl as NgModel;
        this.control = control;
        this.control.valueChanges
          .pipe(
            tap((value: unknown) => update.emit(value)),
            takeUntil(this.destroy$),
          )
          .subscribe();
        break;
      }
      case FormControlName: {
        this.control = this.injector
          .get(FormGroupDirective)
          .getControl(injectedControl as FormControlName);
        break;
      }
      default: {
        this.control = (injectedControl as FormControlDirective)
          .form as FormControl;
        break;
      }
    }
  }
}
