import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfVisitorResquestComponent } from './self-visitor-resquest.component';

describe('SelfVisitorResquestComponent', () => {
  let component: SelfVisitorResquestComponent;
  let fixture: ComponentFixture<SelfVisitorResquestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelfVisitorResquestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfVisitorResquestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
