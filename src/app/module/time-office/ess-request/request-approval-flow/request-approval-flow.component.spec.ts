import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestApprovalFlowComponent } from './request-approval-flow.component';

describe('RequestApprovalFlowComponent', () => {
  let component: RequestApprovalFlowComponent;
  let fixture: ComponentFixture<RequestApprovalFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestApprovalFlowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestApprovalFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
