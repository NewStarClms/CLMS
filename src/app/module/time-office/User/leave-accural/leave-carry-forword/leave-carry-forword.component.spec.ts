import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveCarryForwordComponent } from './leave-carry-forword.component';

describe('LeaveCarryForwordComponent', () => {
  let component: LeaveCarryForwordComponent;
  let fixture: ComponentFixture<LeaveCarryForwordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveCarryForwordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveCarryForwordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
