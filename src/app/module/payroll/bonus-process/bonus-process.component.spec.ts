import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusProcessComponent } from './bonus-process.component';

describe('BonusProcessComponent', () => {
  let component: BonusProcessComponent;
  let fixture: ComponentFixture<BonusProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BonusProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BonusProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
