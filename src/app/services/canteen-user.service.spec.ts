import { TestBed } from '@angular/core/testing';

import { CanteenUserService } from './canteen-user.service';

describe('CanteenUserService', () => {
  let service: CanteenUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanteenUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
