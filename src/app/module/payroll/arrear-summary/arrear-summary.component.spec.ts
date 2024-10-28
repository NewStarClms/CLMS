import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrearSummaryComponent } from './arrear-summary.component';

describe('ArrearSummaryComponent', () => {
  let component: ArrearSummaryComponent;
  let fixture: ComponentFixture<ArrearSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArrearSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrearSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
