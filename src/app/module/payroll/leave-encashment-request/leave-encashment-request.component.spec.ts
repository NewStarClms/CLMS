import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveEncashmentRequestComponent } from './leave-encashment-request.component';

describe('LeaveEncashmentRequestComponent', () => {
  let component: LeaveEncashmentRequestComponent;
  let fixture: ComponentFixture<LeaveEncashmentRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveEncashmentRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveEncashmentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
