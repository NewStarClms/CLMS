import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PtSettingComponent } from './pt-setting.component';

describe('PtSettingComponent', () => {
  let component: PtSettingComponent;
  let fixture: ComponentFixture<PtSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PtSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PtSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
