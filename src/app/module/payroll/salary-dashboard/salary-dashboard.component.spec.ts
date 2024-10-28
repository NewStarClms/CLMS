import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryDashboardComponent } from './salary-dashboard.component';

describe('SalaryDashboardComponent', () => {
  let component: SalaryDashboardComponent;
  let fixture: ComponentFixture<SalaryDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
