import { TestBed } from '@angular/core/testing';

import { OrganisationMappingService } from './organisation-mapping.service';

describe('OrganisationMappingService', () => {
  let service: OrganisationMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrganisationMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
