import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationMapingComponent } from './organization-maping.component';

describe('OrganizationMapingComponent', () => {
  let component: OrganizationMapingComponent;
  let fixture: ComponentFixture<OrganizationMapingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationMapingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationMapingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
