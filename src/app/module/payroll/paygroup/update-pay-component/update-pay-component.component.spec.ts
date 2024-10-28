import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePayComponentComponent } from './update-pay-component.component';

describe('UpdatePayComponentComponent', () => {
  let component: UpdatePayComponentComponent;
  let fixture: ComponentFixture<UpdatePayComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatePayComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePayComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
