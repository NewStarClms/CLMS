import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsiSettingComponent } from './esi-setting.component';

describe('EsiSettingComponent', () => {
  let component: EsiSettingComponent;
  let fixture: ComponentFixture<EsiSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsiSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EsiSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
