import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { CPropertyEffects } from './c-property.effects';

describe('CPropertyEffects', () => {
  let actions$: Observable<unknown>;
  let effects: CPropertyEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CPropertyEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.inject(CPropertyEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
