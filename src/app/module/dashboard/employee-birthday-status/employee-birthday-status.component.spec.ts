import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeBirthdayStatusComponent } from './employee-birthday-status.component';

describe('EmployeeBirthdayStatusComponent', () => {
  let component: EmployeeBirthdayStatusComponent;
  let fixture: ComponentFixture<EmployeeBirthdayStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeBirthdayStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeBirthdayStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
