import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoffProcessComponent } from './coff-process.component';

describe('CoffProcessComponent', () => {
  let component: CoffProcessComponent;
  let fixture: ComponentFixture<CoffProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoffProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoffProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
