import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAlertTemplateComponent } from './edit-alert-template.component';

describe('EditAlertTemplateComponent', () => {
  let component: EditAlertTemplateComponent;
  let fixture: ComponentFixture<EditAlertTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAlertTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAlertTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
