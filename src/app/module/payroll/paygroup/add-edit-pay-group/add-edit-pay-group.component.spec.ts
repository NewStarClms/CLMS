import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPayGroupComponent } from './add-edit-pay-group.component';

describe('AddEditPayGroupComponent', () => {
  let component: AddEditPayGroupComponent;
  let fixture: ComponentFixture<AddEditPayGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditPayGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditPayGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
