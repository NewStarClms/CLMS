import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpSalStructureComponent } from './emp-sal-structure.component';

describe('EmpSalStructureComponent', () => {
  let component: EmpSalStructureComponent;
  let fixture: ComponentFixture<EmpSalStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpSalStructureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpSalStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
