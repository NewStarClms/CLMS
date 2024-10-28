import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveacurralComponent } from './leaveacurral.component';

describe('LeaveacurralComponent', () => {
  let component: LeaveacurralComponent;
  let fixture: ComponentFixture<LeaveacurralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveacurralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveacurralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
