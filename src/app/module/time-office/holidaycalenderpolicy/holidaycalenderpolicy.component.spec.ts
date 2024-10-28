import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidaycalenderpolicyComponent } from './holidaycalenderpolicy.component';

describe('HolidaycalenderpolicyComponent', () => {
  let component: HolidaycalenderpolicyComponent;
  let fixture: ComponentFixture<HolidaycalenderpolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HolidaycalenderpolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidaycalenderpolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
