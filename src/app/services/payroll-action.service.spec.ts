import { TestBed } from '@angular/core/testing';

import { PayrollActionService } from './payroll-action.service';

describe('PayrollActionService', () => {
  let service: PayrollActionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayrollActionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
