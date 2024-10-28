import { TestBed } from '@angular/core/testing';

import { PayGroupService } from './pay-group.service';

describe('PayGroupService', () => {
  let service: PayGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
