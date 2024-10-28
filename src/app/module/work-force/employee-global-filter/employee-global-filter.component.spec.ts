import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeGlobalFilterComponent } from './employee-global-filter.component';

describe('EmployeeGlobalFilterComponent', () => {
  let component: EmployeeGlobalFilterComponent;
  let fixture: ComponentFixture<EmployeeGlobalFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeGlobalFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeGlobalFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
