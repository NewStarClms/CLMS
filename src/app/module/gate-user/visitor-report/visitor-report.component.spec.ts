import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorReportComponent } from './visitor-report.component';

describe('VisitorReportComponent', () => {
  let component: VisitorReportComponent;
  let fixture: ComponentFixture<VisitorReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
