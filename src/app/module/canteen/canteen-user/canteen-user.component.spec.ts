import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanteenUserComponent } from './canteen-user.component';

describe('CanteenUserComponent', () => {
  let component: CanteenUserComponent;
  let fixture: ComponentFixture<CanteenUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanteenUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanteenUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
