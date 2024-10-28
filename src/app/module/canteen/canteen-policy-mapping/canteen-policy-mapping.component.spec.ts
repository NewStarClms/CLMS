import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanteenPolicyMappingComponent } from './canteen-policy-mapping.component';

describe('CanteenPolicyMappingComponent', () => {
  let component: CanteenPolicyMappingComponent;
  let fixture: ComponentFixture<CanteenPolicyMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanteenPolicyMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanteenPolicyMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
