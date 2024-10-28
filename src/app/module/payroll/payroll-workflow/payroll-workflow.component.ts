import { Component, OnInit } from '@angular/core';
import { UI_CONSTANT } from '../../../common/constants/ui-constants';

@Component({
  selector: 'app-payroll-workflow',
  templateUrl: './payroll-workflow.component.html',
  styleUrls: ['./payroll-workflow.component.scss']
})
export class PayrollWorkflowComponent implements OnInit {

  constructor() { }
 public moduleID:number;
  ngOnInit(): void {
    this.moduleID = UI_CONSTANT.MODULE_ID[2].value;
  }

}
