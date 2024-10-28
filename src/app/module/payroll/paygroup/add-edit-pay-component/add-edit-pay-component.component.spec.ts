import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPayComponentComponent } from './add-edit-pay-component.component';

describe('AddEditPayComponentComponent', () => {
  let component: AddEditPayComponentComponent;
  let fixture: ComponentFixture<AddEditPayComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditPayComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditPayComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
