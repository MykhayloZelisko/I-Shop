import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { CPropertiesGroupEffects } from './c-properties-group.effects';

describe('CPropertiesGroupEffects', () => {
  let actions$: Observable<unknown>;
  let effects: CPropertiesGroupEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CPropertiesGroupEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.inject(CPropertiesGroupEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
