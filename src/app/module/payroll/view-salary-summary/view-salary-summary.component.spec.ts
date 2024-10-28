import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSalarySummaryComponent } from './view-salary-summary.component';

describe('ViewSalarySummaryComponent', () => {
  let component: ViewSalarySummaryComponent;
  let fixture: ComponentFixture<ViewSalarySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSalarySummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSalarySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
