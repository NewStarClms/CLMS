import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeOrganizationComponent } from './employee-organization.component';

describe('EmployeeOrganizationComponent', () => {
  let component: EmployeeOrganizationComponent;
  let fixture: ComponentFixture<EmployeeOrganizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeOrganizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
