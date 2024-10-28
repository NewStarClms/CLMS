import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeVisitorStatusComponent } from './employee-visitor-status.component';

describe('EmployeeVisitorStatusComponent', () => {
  let component: EmployeeVisitorStatusComponent;
  let fixture: ComponentFixture<EmployeeVisitorStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeVisitorStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeVisitorStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
