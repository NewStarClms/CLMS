import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanteenManualPunchComponent } from './canteen-manual-punch.component';

describe('CanteenManualPunchComponent', () => {
  let component: CanteenManualPunchComponent;
  let fixture: ComponentFixture<CanteenManualPunchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanteenManualPunchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanteenManualPunchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
