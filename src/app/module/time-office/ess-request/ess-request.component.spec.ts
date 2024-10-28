import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssRequestComponent } from './ess-request.component';

describe('EssRequestComponent', () => {
  let component: EssRequestComponent;
  let fixture: ComponentFixture<EssRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EssRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
