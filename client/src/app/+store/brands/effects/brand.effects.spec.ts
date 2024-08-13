import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { BrandEffects } from './brand.effects';

describe('BrandEffects', () => {
  let actions$: Observable<any>;
  let effects: BrandEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BrandEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.inject(BrandEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
