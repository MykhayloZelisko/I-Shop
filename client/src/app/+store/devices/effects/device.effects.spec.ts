import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { DeviceEffects } from './device.effects';

describe('DeviceEffects', () => {
  let actions$: Observable<any>;
  let effects: DeviceEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeviceEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.inject(DeviceEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
