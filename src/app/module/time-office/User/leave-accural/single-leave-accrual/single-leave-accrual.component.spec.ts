import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleLeaveAccrualComponent } from './single-leave-accrual.component';

describe('SingleLeaveAccrualComponent', () => {
  let component: SingleLeaveAccrualComponent;
  let fixture: ComponentFixture<SingleLeaveAccrualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleLeaveAccrualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleLeaveAccrualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
