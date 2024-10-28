import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAttendanceStatsComponent } from './employee-attendance-stats.component';

describe('EmployeeAttendanceStatsComponent', () => {
  let component: EmployeeAttendanceStatsComponent;
  let fixture: ComponentFixture<EmployeeAttendanceStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeAttendanceStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeAttendanceStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
