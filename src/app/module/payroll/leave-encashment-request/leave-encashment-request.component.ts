import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { PayrollActionService } from 'src/app/services/payroll-action.service';
import {  LeaveEncashment, saveLeaveEncashPayment, saveLeaveEncashPaymentDt } from 'src/app/store/model/payroll-action.model';

@Component({
  selector: 'app-leave-encashment-request',
  templateUrl: './leave-encashment-request.component.html',
  styleUrls: ['./leave-encashment-request.component.scss']
})
export class LeaveEncashmentRequestComponent implements OnInit {
  public paidmonth:string;
  public paidyear:string;
  stateOptions = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
  public monthList=UI_CONSTANT.MONTH_LIST;
  public yearList=UI_CONSTANT.YEAR_LIST;
  public paidStatus:string;
  public paidStatusList=UI_CONSTANT.PAID_STATE_LIST;
  public leaveEncashInfo={} as saveLeaveEncashPayment;
  public leaveEncashdtInfo={} as saveLeaveEncashPaymentDt;
  @Output() closediv = new EventEmitter<boolean>();
  public columnDefs!: any[];
  public rowData: Array<LeaveEncashment>= [];
  public selectedEmployees: Array<LeaveEncashment>=[];
  public requestRemark:string;
  
  constructor(private payrollActionService:PayrollActionService) { }

  ngOnInit(): void {
    var years = new Date().getFullYear();
    this.paidyear=years.toString();
    this.paidmonth="Jan";
    this.paidStatus='U'
    this.getEncashPaymentRequestDetail();
    this.columnDefs=this.payrollActionService.EncashPaymentprepareColumnForGrid();
  }
  saveencashPayment(){
    this.leaveEncashInfo.remark=this.requestRemark;
    let selectedEmployeeIDs = this.selectedEmployees.map(e=>e.employeeID);
    let selectedleaveEncashIds = this.selectedEmployees.map(e=>e.leaveEncashmentDetailID);
    let daaa=[];
    for (let index = 0; index < selectedEmployeeIDs.length; index++) {
      let dat = {};
      var leaveEncashdt={} as saveLeaveEncashPaymentDt;
      leaveEncashdt.employeeID=selectedEmployeeIDs[index];
      leaveEncashdt.leaveEncashmentDetailID=selectedleaveEncashIds[index];
    
    daaa.push(leaveEncashdt);
    console.log(daaa);
    }
    this.leaveEncashInfo.paymentEntities=daaa;
    this.payrollActionService.saveLeaveEncashForEmployee(this.leaveEncashInfo)
  }
  getEncashPaymentRequestDetail(){
    var leaveyear=this.paidyear;;
    var datetime = '01-'+this.paidmonth+'-'+this.paidyear;
    this.payrollActionService.getEncashPaymentDetail(this.paidStatus,datetime,leaveyear).subscribe(res=>{
      if(res && res.employees){
        this.rowData=res.employees;
      }
    });
  }
  Close(){
  this.closediv.emit(false);
  }
  onCellClicked(params){
    if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
      let action = params.event.path[1].dataset.action;
      
    }
  }
  checkUnCheckAllClicked(chbSelectAll){
    if(chbSelectAll.checked){
     this.selectedEmployees= this.rowData;
      console.log(this.selectedEmployees);
    }
    else{
      this.selectedEmployees=[];
    }
   }
 
   checkUnCheckRowClicked(params){
     if(params.isSelected){
       this.selectedEmployees.push(params.data);
       console.log(this.selectedEmployees)
     }
     else{
       this.selectedEmployees=this.selectedEmployees.filter(e=>e.employeeID!=params.data.employeeID);
     }
   }
}
