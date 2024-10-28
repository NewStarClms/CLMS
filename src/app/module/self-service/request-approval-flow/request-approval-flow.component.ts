import { Component, Input, OnInit } from '@angular/core';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-request-approval-flow',
  templateUrl: './request-approval-flow.component.html',
  styleUrls: ['./request-approval-flow.component.scss']
})
export class RequestApprovalFlowComponent implements OnInit {
  @Input() workflowID: number;
  @Input() employeeID: number;
  approvalWorkflowHierarchy: any;
  constructor(private employeeService: EmployeeService) {
   }

  ngOnInit(): void {
    
  }
  ngOnChanges() {
    this.approvalWorkflowHierarchy=[];
    this.employeeService.getEmployeeWorkflow(this.employeeID,this.workflowID).subscribe((response) => {
      if (response.approverDetail.responseMessage.messageType === 0 && response.approverDetail.getEmployeeApproverDetails) {
        //donot show anything if its pending with current employee 
        if(response.approverDetail.getEmployeeApproverDetails[0].employeeID!=this.employeeID){ 
           this.approvalWorkflowHierarchy=response.approverDetail.getEmployeeApproverDetails;
         }
      }
   });
  }

}
