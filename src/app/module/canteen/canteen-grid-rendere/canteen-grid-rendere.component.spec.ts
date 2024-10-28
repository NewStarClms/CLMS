import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanteenGridRendereComponent } from './canteen-grid-rendere.component';

describe('CanteenGridRendereComponent', () => {
  let component: CanteenGridRendereComponent;
  let fixture: ComponentFixture<CanteenGridRendereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanteenGridRendereComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanteenGridRendereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
