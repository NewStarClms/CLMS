import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAttendancePolicyMasterComponent } from './add-edit-attendance-policy-master.component';

describe('AddEditAttendancePolicyMasterComponent', () => {
  let component: AddEditAttendancePolicyMasterComponent;
  let fixture: ComponentFixture<AddEditAttendancePolicyMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditAttendancePolicyMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditAttendancePolicyMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
