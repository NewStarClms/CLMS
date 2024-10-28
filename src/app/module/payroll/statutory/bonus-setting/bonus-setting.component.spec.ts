import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusSettingComponent } from './bonus-setting.component';

describe('BonusSettingComponent', () => {
  let component: BonusSettingComponent;
  let fixture: ComponentFixture<BonusSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BonusSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BonusSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
