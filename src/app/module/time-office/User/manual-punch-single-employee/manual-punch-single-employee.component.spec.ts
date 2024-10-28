import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualPunchSingleEmployeeComponent } from './manual-punch-single-employee.component';

describe('ManualPunchSingleEmployeeComponent', () => {
  let component: ManualPunchSingleEmployeeComponent;
  let fixture: ComponentFixture<ManualPunchSingleEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualPunchSingleEmployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualPunchSingleEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
