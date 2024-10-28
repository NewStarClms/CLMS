import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RosterLockUnlockComponent } from './roster-lock-unlock.component';

describe('RosterLockUnlockComponent', () => {
  let component: RosterLockUnlockComponent;
  let fixture: ComponentFixture<RosterLockUnlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RosterLockUnlockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RosterLockUnlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
