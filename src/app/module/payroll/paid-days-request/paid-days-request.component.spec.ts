import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidDaysRequestComponent } from './paid-days-request.component';

describe('PaidDaysRequestComponent', () => {
  let component: PaidDaysRequestComponent;
  let fixture: ComponentFixture<PaidDaysRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaidDaysRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidDaysRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
