import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeparationDialogComponent } from './separation-dialog.component';

describe('SeparationDialogComponent', () => {
  let component: SeparationDialogComponent;
  let fixture: ComponentFixture<SeparationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeparationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeparationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
