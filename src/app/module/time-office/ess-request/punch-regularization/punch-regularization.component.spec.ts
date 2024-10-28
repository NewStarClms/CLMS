import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PunchRegularizationComponent } from './punch-regularization.component';

describe('PunchRegularizationComponent', () => {
  let component: PunchRegularizationComponent;
  let fixture: ComponentFixture<PunchRegularizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PunchRegularizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PunchRegularizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
