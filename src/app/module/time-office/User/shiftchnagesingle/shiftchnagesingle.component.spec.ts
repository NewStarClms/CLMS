import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftchnagesingleComponent } from './shiftchnagesingle.component';

describe('ShiftchnagesingleComponent', () => {
  let component: ShiftchnagesingleComponent;
  let fixture: ComponentFixture<ShiftchnagesingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftchnagesingleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftchnagesingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
