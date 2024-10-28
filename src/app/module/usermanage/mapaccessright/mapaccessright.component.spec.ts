import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaccessrightComponent } from './mapaccessright.component';

describe('MapaccessrightComponent', () => {
  let component: MapaccessrightComponent;
  let fixture: ComponentFixture<MapaccessrightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapaccessrightComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaccessrightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
