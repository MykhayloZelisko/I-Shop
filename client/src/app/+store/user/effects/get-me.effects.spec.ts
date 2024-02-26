import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { GetMeEffects } from './get-me.effects';

describe('GetMeEffects', () => {
  let actions$: Observable<any>;
  let effects: GetMeEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GetMeEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(GetMeEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
