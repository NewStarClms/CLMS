import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatepassDialogComponent } from './gatepass-dialog.component';

describe('GatepassDialogComponent', () => {
  let component: GatepassDialogComponent;
  let fixture: ComponentFixture<GatepassDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GatepassDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GatepassDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
