import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeUserGroupComponent } from './employee-usergroup.component';

describe('EmployeeUserGroupComponent', () => {
  let component: EmployeeUserGroupComponent;
  let fixture: ComponentFixture<EmployeeUserGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeUserGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeUserGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
