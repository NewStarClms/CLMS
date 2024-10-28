import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSetupComponent } from './report-setup.component';

describe('ReportSetupComponent', () => {
  let component: ReportSetupComponent;
  let fixture: ComponentFixture<ReportSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportSetupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
