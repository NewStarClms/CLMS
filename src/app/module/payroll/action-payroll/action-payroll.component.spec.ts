import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPayrollComponent } from './action-payroll.component';

describe('ActionPayrollComponent', () => {
  let component: ActionPayrollComponent;
  let fixture: ComponentFixture<ActionPayrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionPayrollComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPayrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
