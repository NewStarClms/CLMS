import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MulyipleLeaveAccrualComponent } from './mulyiple-leave-accrual.component';

describe('MulyipleLeaveAccrualComponent', () => {
  let component: MulyipleLeaveAccrualComponent;
  let fixture: ComponentFixture<MulyipleLeaveAccrualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MulyipleLeaveAccrualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MulyipleLeaveAccrualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
