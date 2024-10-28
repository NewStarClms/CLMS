import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorGeneralSettingComponent } from './visitor-general-setting.component';

describe('VisitorGeneralSettingComponent', () => {
  let component: VisitorGeneralSettingComponent;
  let fixture: ComponentFixture<VisitorGeneralSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorGeneralSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorGeneralSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
