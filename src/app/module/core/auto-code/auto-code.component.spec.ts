import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoCodeComponent } from './auto-code.component';

describe('AutoCodeComponent', () => {
  let component: AutoCodeComponent;
  let fixture: ComponentFixture<AutoCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
