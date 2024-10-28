import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { NotificationService } from 'src/app/common/notification.service';
import { AuthService } from 'src/app/services/authentication.service';
import { LeaveRequestService } from 'src/app/services/leave-request.service';
import { selectLeaveMasterState } from 'src/app/store/app.state';
import { LeaveBalance, LeaveRequest, LeaveRequestByAdmin, LeaveRequestByEmployee } from 'src/app/store/model/LeaveRequest.model';
import { LeaveModel } from 'src/app/store/model/master-data.model';
import { AttendancesDetail } from 'src/app/store/model/userActionAttendanceDetail.model';

@Component({
  selector: 'app-leave-request-dailog',
  templateUrl: './leave-request-dailog.component.html',
  styleUrls: ['./leave-request-dailog.component.scss']
})
export class LeaveRequestDailogComponent implements OnInit {
  
  public leaveRequestInfo:LeaveRequest = {} as LeaveRequest;
  public leaveRequestByEmp:LeaveRequestByEmployee = {} as LeaveRequestByEmployee;
  public leaveTypeList:Array<any>=[];
  public datepickerConfig : Partial<BsDatepickerConfig>;
  timepickerVisible = false;
  fromDate:string;
  toDate:string;
  currentdate=moment().toDate();
  public statusList=UI_CONSTANT.SelfServiceLeaveRequest;
  Lstatus:any[];
  public display:boolean;
  public laeveBalanceListCol:any[]=[];
  public laeveBalanceList : Array<LeaveBalance>=[];
  public year:number;
  public HalfDayTypeTo:string="Full";
  public HalfDayTypeFrom:string="Full";
  public halfDateFdisabledFull:boolean;
  public halfDateFdisabledFirst:boolean;
  public halfDateFisabledSecond:boolean;
  public halfDatedisabledFull:boolean;
  public halfDatedisabledFirst:boolean;
  public halfDatedisabledSecond:boolean;
  public leavefromDate:string;
  public leavetoDate:string;
  @Input() employeeID:number; 
  @Input() transactionID:number;
  @Input() requestID:number; 
  @Input() workflowID:number;
  @Input() requestStatus:string;
  @Input() PostButton:boolean;
  @Input() disabledTxt:boolean;
@Output() LeaveSinglediv = new EventEmitter<boolean>();
public leaveattendanceListcol:any[]=[];
public leaveattendanceListUI:Array<AttendancesDetail>=[];
public leaveRequestfromDate:string;
public leaveRequesttoDate:string;

constructor(
  private _store: Store<any>,
  private authenticationService:AuthService,
  private leaveRequestService:LeaveRequestService,
  private notificationService:NotificationService,
) {
  this.datepickerConfig = Object.assign({},{containerClass:'theme-default', 
  adaptivePosition:true,
  dateInputFormat:'DD-MMM-YYYY'});
}

 ngOnInit(): void {}
 ngOnChanges(){
  console.log(this.requestID,this.transactionID)
  if(this.requestID!=0 && this.transactionID!=0){
    //New Changes
   //this.PostButton=false;
   //End
    this.halfDateFdisabledFull=true;
    this.halfDateFdisabledFirst=true;
    this.halfDateFisabledSecond=true;
    this.halfDatedisabledFull=true;
    this.halfDatedisabledFirst=true;
    this.halfDatedisabledSecond=true;
    this.leaveRequestService.fetchLeaveRequestEmployeeData(this.employeeID,this.requestID,this.transactionID,this.workflowID,this.requestStatus).subscribe(res=>{
        if(res && res[0]){
          //console.log(res[0])
          this.leaveRequestInfo=res[0];
          this.leavefromDate=moment(this.leaveRequestInfo.fromDate).format('DD-MMM-YYYY');
          this.leavetoDate=moment(this.leaveRequestInfo.toDate).format('DD-MMM-YYYY');
          console.log(this.leaveRequestInfo.requestRemark)
          this.getleaveAttendanceDetail();
        }
    });
   }else{
    //New Changes
    //this.PostButton=true;
    //End
    this.leavefromDate =moment(this.currentdate).format('DD-MMM-YYYY');
    this.leavetoDate =moment(this.currentdate).format('DD-MMM-YYYY');
    this.getleaveAttendanceDetail();
    this.fnSethalfDaybutton();
   }
  this.year=new Date().getFullYear();
  this.authenticationService.setGlobalFilterVisibility(false);
  this.fromDate = moment(this.currentdate).format('DD-MMM-YYYY');
  this.toDate = moment(this.currentdate).format('DD-MMM-YYYY');
  

  this._store.select(selectLeaveMasterState).subscribe(res => {
    if (res && res.leavelList) {
      const templeaveTypeList: LeaveModel[] = AppUtil.deepCopy(res.leavelList);
        templeaveTypeList.map(y => {
            this.leaveTypeList.push({
              leaveID: y.leaveID,
              leaveName: y.leaveName + ' ( '+y.leaveCode+') '
            });
        });
    }
  });
 
  this.laeveBalanceListCol=[
    { field: 'leaveCode', header: 'Leave'},
    { field: 'accrualLeave', header: 'Accrual'},
    { field: 'consumeLeave', header: 'Consume'},
    { field: 'balanceLeave', header: 'Balance'},
  ]
  
  this.leaveRequestService.fetchLeaveBalanceData(this.employeeID,this.year).subscribe(res=>{
    if(res){
     
      this.laeveBalanceList=[];
      res.forEach(detail=>{
        this.laeveBalanceList.push(detail);
      })
    }
  });
  
 this.getleaveAttendanceDetail();
 
}
SaveleavePostData(){
  this.leaveRequestInfo.employeeID=this.employeeID;
  this.leaveRequestInfo.fromDate=moment(this.leavefromDate).format('yyyy-MM-DD')+'T00:00:00';
  this.leaveRequestInfo.toDate=moment(this.leavetoDate).format('yyyy-MM-DD')+'T00:00:00';
  this.fnSethalfdayValue();
  console.log(this.leaveRequestInfo);
  this.leaveRequestService.saveLeaveRequesrByEmployee(this.leaveRequestInfo);
  
}
fnSethalfdayValue() {
  
  var hlfday = this.HalfDayTypeFrom == 'First' || this.HalfDayTypeTo == 'First' || this.HalfDayTypeTo == 'Second' || this.HalfDayTypeFrom == 'Second';
  this.leaveRequestInfo.halfDayType=hlfday
  if (hlfday == true)
  {
      if (this.leaveRequestInfo.fromDate == this.leaveRequestInfo.toDate) {
          if (this.HalfDayTypeFrom == 'First') {
            this.leaveRequestInfo.halfDayStatus='F';
          } else {
            this.leaveRequestInfo.halfDayStatus='S';
          }
      }
      else {
          if (this.HalfDayTypeFrom == 'Full' && this.HalfDayTypeTo == 'First') {
            this.leaveRequestInfo.halfDayStatus='F';
          }
          else if (this.HalfDayTypeFrom == 'Second' && this.HalfDayTypeTo == 'Full') {
            this.leaveRequestInfo.halfDayStatus='S';
          }
          else {
            this.leaveRequestInfo.halfDayStatus='B';
          }
      }
  }else{
    this.leaveRequestInfo.halfDayStatus='B';
  }
}
CancelleavePost(){
  this.leaveRequestInfo = {} as LeaveRequest;
  this.LeaveSinglediv.emit(false);
}
getCorrectDate(){
  if(this.leavefromDate==null || this.leavetoDate==null) return;

  var fromdate=moment(this.leavefromDate).format('yyyy-MM-DD')+'T00:00:00';
  var todate=moment(this.leavetoDate).format('yyyy-MM-DD')+'T00:00:00';
  
  
  if (todate < fromdate) {
      this.notificationService.showError('From date should be less than or equal to To date', UI_CONSTANT.SEVERITY.ERROR);
      this.leavefromDate=null;
      this.leavetoDate=null;
      return;
    } else {
        this.fnSethalfDaybutton();
        
    }
    this.getleaveAttendanceDetail();
}
fnSethalfDaybutton(){
  var fromdate=moment(this.leavefromDate).format('yyyy-MM-DD')+'T00:00:00';
  var todate=moment(this.leavetoDate).format('yyyy-MM-DD')+'T00:00:00';
  
  if (fromdate == todate) {
    this.halfDatedisabledFull=true;
    this.halfDatedisabledFirst=true;
    this.halfDatedisabledSecond=true;
    this.halfDateFdisabledFirst=false;
    this.halfDateFdisabledFull=false;
    this.halfDateFisabledSecond=false;
  }
  else {
    this.halfDateFdisabledFirst=true;
    this.halfDateFdisabledFull=false;
    this.halfDateFisabledSecond=false;
    
    this.halfDatedisabledFull=false;
  this.halfDatedisabledFirst=false;
  this.halfDatedisabledSecond=true;

  }
}
getleaveAttendanceDetail()
{
  var fromdate=moment(this.leavefromDate).format('yyyy-MM-DD')+'T00:00:00';
  var todate=moment(this.leavetoDate).format('yyyy-MM-DD')+'T00:00:00';
  this.leaveattendanceListcol=[
    { field: 'attendanceDate', header: 'Date'},
    { field: 'shiftView', header: 'Shift'},
    { field: 'inTime', header: 'In Time'},
    { field: 'outTime', header: 'Out Time'},
    { field: 'status', header: 'Status'},
    { field: 'workingHours', header: 'Working Hours'},
  ]
  this.leaveRequestService.fetchleaveAttendanceDetailData(this.employeeID,fromdate,todate).subscribe(res=>{
    if(res && res.attendances){
      this.leaveattendanceListUI=[];
      this.leaveattendanceListUI = AppUtil.deepCopy(res.attendances);
    }
  });
}
}
