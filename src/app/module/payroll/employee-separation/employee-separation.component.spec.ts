import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSeparationComponent } from './employee-separation.component';

describe('EmployeeSeparationComponent', () => {
  let component: EmployeeSeparationComponent;
  let fixture: ComponentFixture<EmployeeSeparationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeSeparationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSeparationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
