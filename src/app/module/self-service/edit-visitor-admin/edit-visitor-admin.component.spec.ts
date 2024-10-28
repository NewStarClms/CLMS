import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVisitorAdminComponent } from './edit-visitor-admin.component';

describe('EditVisitorAdminComponent', () => {
  let component: EditVisitorAdminComponent;
  let fixture: ComponentFixture<EditVisitorAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditVisitorAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVisitorAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
