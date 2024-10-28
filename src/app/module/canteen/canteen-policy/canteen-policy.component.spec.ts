import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanteenPolicyComponent } from './canteen-policy.component';

describe('CanteenPolicyComponent', () => {
  let component: CanteenPolicyComponent;
  let fixture: ComponentFixture<CanteenPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanteenPolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanteenPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
