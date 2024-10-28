import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorPassTemplateComponent } from './visitor-pass-template.component';

describe('VisitorPassTemplateComponent', () => {
  let component: VisitorPassTemplateComponent;
  let fixture: ComponentFixture<VisitorPassTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorPassTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorPassTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
