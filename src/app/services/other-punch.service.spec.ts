import { TestBed } from '@angular/core/testing';

import { OtherPunchService } from './other-punch.service';

describe('OtherPunchService', () => {
  let service: OtherPunchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OtherPunchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
