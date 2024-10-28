import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmpOrganizationComponent } from './edit-emp-organization.component';

describe('EditEmpOrganizationComponent', () => {
  let component: EditEmpOrganizationComponent;
  let fixture: ComponentFixture<EditEmpOrganizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEmpOrganizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEmpOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
