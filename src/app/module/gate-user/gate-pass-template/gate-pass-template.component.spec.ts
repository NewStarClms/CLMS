import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatePassTemplateComponent } from './gate-pass-template.component';

describe('GatePassTemplateComponent', () => {
  let component: GatePassTemplateComponent;
  let fixture: ComponentFixture<GatePassTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GatePassTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GatePassTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
