import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditWorkflowComponent } from './add-edit-workflow.component';

describe('AddEditWorkflowComponent', () => {
  let component: AddEditWorkflowComponent;
  let fixture: ComponentFixture<AddEditWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
