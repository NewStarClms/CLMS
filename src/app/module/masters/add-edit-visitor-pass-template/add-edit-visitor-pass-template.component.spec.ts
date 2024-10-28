import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditVisitorPassTemplateComponent } from './add-edit-visitor-pass-template.component';

describe('AddEditVisitorPassTemplateComponent', () => {
  let component: AddEditVisitorPassTemplateComponent;
  let fixture: ComponentFixture<AddEditVisitorPassTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditVisitorPassTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditVisitorPassTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
