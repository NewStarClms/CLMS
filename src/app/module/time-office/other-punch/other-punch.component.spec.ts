import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherPunchComponent } from './other-punch.component';

describe('OtherPunchComponent', () => {
  let component: OtherPunchComponent;
  let fixture: ComponentFixture<OtherPunchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherPunchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherPunchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
