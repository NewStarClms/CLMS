import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LwfSettingComponent } from './lwf-setting.component';

describe('LwfSettingComponent', () => {
  let component: LwfSettingComponent;
  let fixture: ComponentFixture<LwfSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LwfSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LwfSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
