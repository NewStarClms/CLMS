import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PfSettingComponent } from './pf-setting.component';

describe('PfSettingComponent', () => {
  let component: PfSettingComponent;
  let fixture: ComponentFixture<PfSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PfSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PfSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
