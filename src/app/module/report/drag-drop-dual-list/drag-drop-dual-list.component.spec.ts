import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragDropDualListComponent } from './drag-drop-dual-list.component';

describe('DragDropDualListComponent', () => {
  let component: DragDropDualListComponent;
  let fixture: ComponentFixture<DragDropDualListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DragDropDualListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DragDropDualListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
