import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { UserAttendanceDetailService } from 'src/app/services/user-attendance-detail.service';
import { LeaveCarryForword, LeaveCarryForwordEntities, LeaveEncashesTimeoffice } from 'src/app/store/model/attendance-process.model';
import { LeaveEncashment } from 'src/app/store/model/payroll-action.model';

@Component({
  selector: 'app-leave-carry-forword',
  templateUrl: './leave-carry-forword.component.html',
  styleUrls: ['./leave-carry-forword.component.scss']
})
export class LeaveCarryForwordComponent implements OnInit {
  @Output() multipleLeavediv = new EventEmitter<boolean>();
  @Output() multipleCarryForworddiv = new EventEmitter<boolean>();
  public paidmonth:string;
  public paidyear:string;
  stateOptions = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
  public monthList=UI_CONSTANT.MONTH_LIST;
  public yearList=UI_CONSTANT.YEAR_LIST;
  public paidStatus:string;
  public paidStatusList=UI_CONSTANT.PAID_STATE_LIST;
  public leaveEncashInfo={} as LeaveCarryForword;
  public leaveEncashdtInfo={} as LeaveCarryForwordEntities;
  public columnDefs!: any[];
  public rowData: Array<LeaveEncashment>= [];
  public selectedEmployees: Array<LeaveEncashment>=[];
  public requestRemark:string;
  leaveProcessdisplay: boolean;
  public leavemonth:string;
  public leaveyear;

  constructor(private userAttendanceService:UserAttendanceDetailService) { }

  ngOnInit(): void {
    var years = new Date().getFullYear();
    this.paidyear=years.toString();
    this.leaveyear=years.toString();
    this.paidmonth="Jan";
    this.paidStatus='U'
    this.getEncashRequestDetail();
    this.columnDefs=this.userAttendanceService.LeaveCarryForwadColumnForGrid();
  }
  getEncashRequestDetail(){
    var leaveyear=this.paidyear;
    this.userAttendanceService.fetchLeaveCarryForwordDetail(this.paidStatus,leaveyear).subscribe(res=>{
      if(res && res.employees){
        this.rowData=res.employees;
      }
    });
  }
  Cancelleavepopup(){
    //this.leaveaccrualInfo = {} as LeaveAccrual;
    this.multipleLeavediv.emit(false);
  }
  saveCarryForWard(){
    this.leaveProcessdisplay=true;
  }
  saveCarryForwardRequest(){
    this.leaveEncashInfo.remark=this.requestRemark;
    this.leaveEncashInfo.leaveYear=Number(this.paidyear);
    let selectedEmployeeIDs = this.selectedEmployees.map(e=>e.employeeID);
    let selectedleaveIds = this.selectedEmployees.map(e=>e.leaveID);
    let selectedecashs = this.selectedEmployees.map(e=>e.encash);
    let daaa=[];
    for (let index = 0; index < selectedEmployeeIDs.length; index++) {
      var leaveEncashdt={} as LeaveEncashesTimeoffice;
      leaveEncashdt.employeeID=selectedEmployeeIDs[index];
      leaveEncashdt.encash=selectedecashs[index];
      leaveEncashdt.leaveID=selectedleaveIds[index];
    daaa.push(leaveEncashdt);
    }
    this.leaveEncashInfo.carryForwardEntities=daaa;
    console.log(this.leaveEncashInfo)
    this.userAttendanceService.saveLeaveLeaveCarryForwordForEmployee(this.leaveEncashInfo);
    this.leaveProcessdisplay=false;
  }
  CancelLevelprocess(){
    this.leaveProcessdisplay=false;
  }
  onCellClicked(params){
    if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
      let action = params.event.path[1].dataset.action;
      
    }
  }
  checkUnCheckAllClicked(chbSelectAll){
    if(chbSelectAll.checked){
     this.selectedEmployees= this.rowData;
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

   cancelCarryForword()
   {
    this.multipleCarryForworddiv.emit(false);
   }
}
