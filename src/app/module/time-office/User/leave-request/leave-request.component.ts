import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import {  Observable } from 'rxjs';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { NotificationService } from 'src/app/common/notification.service';
import { AuthService } from 'src/app/services/authentication.service';
import { LeaveRequestService } from 'src/app/services/leave-request.service';
import { selectLeaveMasterState } from 'src/app/store/app.state';
import { CancelLeaveRequest, LeaveBalance, LeaveRequest, LeaveRequestByAdmin } from 'src/app/store/model/LeaveRequest.model';
import { User } from 'src/app/store/model/login.model';
import { LeaveModel } from 'src/app/store/model/master-data.model';
import { AttendancesDetail } from 'src/app/store/model/userActionAttendanceDetail.model';

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.scss']
})
export class LeaveRequestComponent implements OnInit {
  public columnDefs!: any[];
  public rowData: Array<LeaveRequestByAdmin>= [];
  public leaveRequestInfo:LeaveRequest = {} as LeaveRequest;
  public leaveTypeList:Array<any>=[];
  public datepickerConfig : Partial<BsDatepickerConfig>;
  timepickerVisible = false;
  public currentUser: Observable<User>;
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
  @Input() FromDate :string;
  @Input() ToDate :string;
@Output() LeaveSinglediv = new EventEmitter<boolean>();
public leaveattendanceListcol:any[]=[];
public leaveattendanceListUI:Array<AttendancesDetail>=[];
public leaveRequestDetailListcol:any[]=[];
public leaveRequestDetailListUI:Array<LeaveRequestByAdmin>=[]
public leaveRequestfromDate:string;
public leaveRequesttoDate:string;
public displayCancelLeaveRequestdiv:boolean;
public cancelLeaveRequestInfo = {} as CancelLeaveRequest;

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

 ngOnInit(): void {
  this.year=new Date().getFullYear();
  console.log(this.employeeID);
  var date = new Date(), y = date.getFullYear(), m = date.getMonth();
//var firstDay = new Date(y, m, 1);
//var lastDay = new Date(y, m + 1, 0);
        var firstDay = new Date(date.getFullYear(), date.getMonth()-1);
        var lastDay = new Date(date.getFullYear(), date.getMonth()-0,0);
        this.leaveRequestfromDate = moment(this.FromDate).format('DD-MMM-YYYY');
        this.leaveRequesttoDate = moment(this.ToDate).format('DD-MMM-YYYY');
  this.authenticationService.setGlobalFilterVisibility(false);
  this.fromDate = moment(this.FromDate).format('DD-MMM-YYYY');
  this.toDate = moment(this.ToDate).format('DD-MMM-YYYY');
  
  this.Lstatus= [{key: 'Approved', value: 1}];
  this.leaveRequestService.getVisiblity().subscribe(res =>{
    this.display = res;
  });
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
 
  this.leavefromDate =moment(this.FromDate).format('DD-MMM-YYYY');
  this.leavetoDate =moment(this.ToDate).format('DD-MMM-YYYY');
  this.laeveBalanceListCol=[
    { field: 'leaveCode', header: 'Leave'},
    { field: 'accrualLeave', header: 'Accrual'},
    { field: 'consumeLeave', header: 'Consume'},
    { field: 'balanceLeave', header: 'Balance'},
  ]
  this.leaveRequestService.fetchLeaveBalanceData(this.employeeID,this.year).subscribe(res=>{
    if(res){
      // console.log('leave',res)
      this.laeveBalanceList=[];
      res.forEach(detail=>{
        this.laeveBalanceList.push(detail);
      })
    }
  });
  this.fnSethalfDaybutton();
 this.getleaveAttendanceDetail();
 this.getleaveRequestDetail();
 this.getleaveRequestDetailcol();
}
SaveleavePostData(){
  this.leaveRequestInfo.employeeID=this.employeeID;
  this.leaveRequestInfo.fromDate=this.formatDateStringToDate(this.leavefromDate);
  this.leaveRequestInfo.toDate=this.formatDateStringToDate(this.leavetoDate);
  this.fnSethalfdayValue();
  console.log(this.leaveRequestInfo);
  this.leaveRequestService.saveLeaveRequesrByAdmin(this.leaveRequestInfo);
  //this.CancelleavePost();
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
  console.log(this.leaveRequestInfo.halfDayStatus);
}
CancelleavePost(){
  this.leaveRequestInfo = {} as LeaveRequest;
  this.LeaveSinglediv.emit(false);
}
getCorrectDate(){
  var fromdate=this.formatDateStringToDate(this.leavefromDate);
  var todate=this.formatDateStringToDate(this.leavetoDate);
  console.log(fromdate,todate)
  if (this.leavefromDate && this.leavetoDate && todate < fromdate) {
      this.notificationService.showError('From date should be less than or equal to To date', UI_CONSTANT.SEVERITY.ERROR);
      this.leavefromDate=null;
      this.leavetoDate=null;
      //console.log('if part');
      return;
    } else {
        this.fnSethalfDaybutton();
        
    }
    if(this.leavefromDate && this.leavetoDate)
          this.getleaveAttendanceDetail();
}
fnSethalfDaybutton(){
  var fromdate=this.formatDateStringToDate(this.leavefromDate);
  var todate=this.formatDateStringToDate(this.leavetoDate);
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
  var fromdate=this.formatDateStringToDate(this.leavefromDate);
  var todate=this.formatDateStringToDate(this.leavetoDate);
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
      
      console.log('leave',this.leaveattendanceListUI);
    }
  });
}
getleaveRequestDetail()
{
  var requestfromdate=this.formatDateStringToDate(this.leaveRequestfromDate);
  var requesttodate=this.formatDateStringToDate(this.leaveRequesttoDate);
  let resultstatus = this.Lstatus.map(({ value }) => value);
  let reqstatus;
  reqstatus = resultstatus.join('~');
  console.log(this.employeeID,reqstatus,requesttodate,requestfromdate)
  this.getleaveRequestDetailcol();
  this.leaveRequestService.fetchLeaveRequestAdminData(this.employeeID,reqstatus,requestfromdate,requesttodate).subscribe(res=>{
    if(res){
      this.leaveRequestDetailListUI=[];
      this.leaveRequestDetailListUI=AppUtil.deepCopy(res);
      this.leaveRequestDetailListUI.forEach(item=>{
        item.fromDate = moment(item.fromDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
      item.toDate = moment(item.toDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
      item.approvedDate = moment(item.approvedDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
      item.cancelledDate =item.cancelledDate !='0001-01-01T00:00:00'?moment(item.cancelledDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT):"";
      });
      console.log(this.leaveRequestDetailListUI);
    }
  });
}
getleaveRequestDetailcol(){
  this.leaveRequestDetailListcol=[
    { field: 'cancelAllow', header: 'Cancel',icons:true},
    { field: 'leaveCode', header: 'LeaveCode'},
    { field: 'fromDate', header: 'FromDate'},
    { field: 'toDate', header: 'ToDate'},
    { field: 'leaveAmount', header: 'LeaveAmount'},
    { field: 'halfDayType', header: 'HalfDayType'},
    { field: 'halfDayStatus', header: 'HalfDayStatus'},
    { field: 'requestRemark', header: 'RequestRemark'},
    { field: 'requestStatus', header: 'RequestStatus'},
    { field: 'actionSource', header: 'ActionSource'},
    { field: 'approvedDate', header: 'ApprovedDate'},
    { field: 'approveRemark', header: 'ApprovedRemark'},
    { field: 'cancelledDate', header: 'CancelDate'},
    { field: 'cancelledRemark', header: 'CancelRemark'},
    { field: 'referenceNumber', header: 'ReferenceNumber'},
    { field: 'documentFullURL', header: 'file'},
  ]
}
fnLeaveRequestCancel(leaveRequestid){
  this.cancelLeaveRequestInfo.remark = "Leave Cancel by Admin";
  this.cancelLeaveRequestInfo.requestID = leaveRequestid;
    this.displayCancelLeaveRequestdiv=true;
}
SaveCancelRequestleaveData(){
  this.cancelLeaveRequestInfo.employeeID = this.employeeID;
  console.log(this.cancelLeaveRequestInfo);
  this.leaveRequestService.CancelleaveRequest(this.cancelLeaveRequestInfo);
  this.displayCancelLeaveRequestdiv=false;
}
ClosecancelRequestleave(){
  this.displayCancelLeaveRequestdiv=false;
}

 formatDateStringToDate(date: any){
   if(date){
     return moment(date).format('yyyy-MM-DD')+'T00:00:00';
   }
   else return "";
 }
}
