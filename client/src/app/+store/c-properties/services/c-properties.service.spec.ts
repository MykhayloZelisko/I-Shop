import { TestBed } from '@angular/core/testing';

import { CPropertiesService } from './c-properties.service';

describe('CPropertiesService', () => {
  let service: CPropertiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CPropertiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
