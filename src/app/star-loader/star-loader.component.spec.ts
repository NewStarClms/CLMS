import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarLoaderComponent } from './star-loader.component';

describe('StarLoaderComponent', () => {
  let component: StarLoaderComponent;
  let fixture: ComponentFixture<StarLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StarLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StarLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
