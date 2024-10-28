import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GratuitySettingComponent } from './gratuity-setting.component';

describe('GratuitySettingComponent', () => {
  let component: GratuitySettingComponent;
  let fixture: ComponentFixture<GratuitySettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GratuitySettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GratuitySettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
