import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorAreasComponent } from './visitor-areas.component';

describe('VisitorAreasComponent', () => {
  let component: VisitorAreasComponent;
  let fixture: ComponentFixture<VisitorAreasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorAreasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
