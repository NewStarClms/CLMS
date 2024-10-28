import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackdataProcessComponent } from './backdata-process.component';

describe('BackdataProcessComponent', () => {
  let component: BackdataProcessComponent;
  let fixture: ComponentFixture<BackdataProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackdataProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackdataProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
