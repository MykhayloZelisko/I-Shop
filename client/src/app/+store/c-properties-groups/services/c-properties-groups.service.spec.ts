import { TestBed } from '@angular/core/testing';

import { CPropertiesGroupsService } from './c-properties-groups.service';

describe('CPropertiesGroupsService', () => {
  let service: CPropertiesGroupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CPropertiesGroupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
