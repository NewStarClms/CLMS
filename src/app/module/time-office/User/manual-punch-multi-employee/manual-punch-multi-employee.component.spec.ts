import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualPunchMultiEmployeeComponent } from './manual-punch-multi-employee.component';

describe('ManualPunchMultiEmployeeComponent', () => {
  let component: ManualPunchMultiEmployeeComponent;
  let fixture: ComponentFixture<ManualPunchMultiEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualPunchMultiEmployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualPunchMultiEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
