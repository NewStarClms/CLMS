import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRequestDailogComponent } from './leave-request-dailog.component';

describe('LeaveRequestDailogComponent', () => {
  let component: LeaveRequestDailogComponent;
  let fixture: ComponentFixture<LeaveRequestDailogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveRequestDailogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveRequestDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
