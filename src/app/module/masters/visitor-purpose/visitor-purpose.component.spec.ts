import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorPurposeComponent } from './visitor-purpose.component';

describe('VisitorPurposeComponent', () => {
  let component: VisitorPurposeComponent;
  let fixture: ComponentFixture<VisitorPurposeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorPurposeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorPurposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
