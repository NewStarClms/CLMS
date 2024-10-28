import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanteenprocessSingleEmployeeComponent } from './canteenprocess-single-employee.component';

describe('CanteenprocessSingleEmployeeComponent', () => {
  let component: CanteenprocessSingleEmployeeComponent;
  let fixture: ComponentFixture<CanteenprocessSingleEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanteenprocessSingleEmployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanteenprocessSingleEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
