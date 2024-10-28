import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanteenprocessMultipleEmployeeComponent } from './canteenprocess-multiple-employee.component';

describe('CanteenprocessMultipleEmployeeComponent', () => {
  let component: CanteenprocessMultipleEmployeeComponent;
  let fixture: ComponentFixture<CanteenprocessMultipleEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanteenprocessMultipleEmployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanteenprocessMultipleEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
