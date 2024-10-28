import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WagesMasterComponent } from './wages-master.component';

describe('WagesMasterComponent', () => {
  let component: WagesMasterComponent;
  let fixture: ComponentFixture<WagesMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WagesMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WagesMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
