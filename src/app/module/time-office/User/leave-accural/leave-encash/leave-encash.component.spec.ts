import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveEncashComponent } from './leave-encash.component';

describe('LeaveEncashComponent', () => {
  let component: LeaveEncashComponent;
  let fixture: ComponentFixture<LeaveEncashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveEncashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveEncashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
