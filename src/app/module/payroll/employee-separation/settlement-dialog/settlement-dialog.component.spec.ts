import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementDialogComponent } from './settlement-dialog.component';

describe('SettlementDialogComponent', () => {
  let component: SettlementDialogComponent;
  let fixture: ComponentFixture<SettlementDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettlementDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettlementDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
