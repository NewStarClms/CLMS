import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettelmentReasonComponent } from './settelment-reason.component';

describe('SettelmentReasonComponent', () => {
  let component: SettelmentReasonComponent;
  let fixture: ComponentFixture<SettelmentReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettelmentReasonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettelmentReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
