import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RosterprocesssingleComponent } from './rosterprocesssingle.component';

describe('RosterprocesssingleComponent', () => {
  let component: RosterprocesssingleComponent;
  let fixture: ComponentFixture<RosterprocesssingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RosterprocesssingleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RosterprocesssingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
