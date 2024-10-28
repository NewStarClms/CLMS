import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayCalenderPolicyMappingComponent } from './holiday-calender-policy-mapping.component';

describe('HolidayCalenderPolicyMappingComponent', () => {
  let component: HolidayCalenderPolicyMappingComponent;
  let fixture: ComponentFixture<HolidayCalenderPolicyMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HolidayCalenderPolicyMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidayCalenderPolicyMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
