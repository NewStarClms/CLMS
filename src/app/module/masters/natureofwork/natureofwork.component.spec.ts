import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NatureofworkComponent } from './natureofwork.component';

describe('NatureofworkComponent', () => {
  let component: NatureofworkComponent;
  let fixture: ComponentFixture<NatureofworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NatureofworkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NatureofworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
