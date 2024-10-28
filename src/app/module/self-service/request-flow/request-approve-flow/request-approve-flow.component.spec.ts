import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestApproveFlowComponent } from './request-approve-flow.component';

describe('RequestApproveFlowComponent', () => {
  let component: RequestApproveFlowComponent;
  let fixture: ComponentFixture<RequestApproveFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestApproveFlowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestApproveFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
