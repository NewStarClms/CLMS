import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorTypeComponent } from './visitor-type.component';

describe('VisitorTypeComponent', () => {
  let component: VisitorTypeComponent;
  let fixture: ComponentFixture<VisitorTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
