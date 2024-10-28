import { TestBed } from '@angular/core/testing';

import { LeaveMasterService } from './leave-master.service';

describe('LeaveMasterService', () => {
  let service: LeaveMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeaveMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
