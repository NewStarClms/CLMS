import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { NotificationService } from 'src/app/common/notification.service';
import { LeaveRequestService } from 'src/app/services/leave-request.service';
import { RequestFlowService } from 'src/app/services/request-flow.service';
import { AttendancesDetail, GatePass, GatePassRequest } from 'src/app/store/model/userActionAttendanceDetail.model';

@Component({
  selector: 'app-gatepass-dialog',
  templateUrl: './gatepass-dialog.component.html',
  styleUrls: ['./gatepass-dialog.component.scss']
})
export class GatepassDialogComponent implements OnInit {
  
public gatepassInfo: GatePass = {} as GatePass;
public gatepassrequestInfo : GatePassRequest={} as GatePassRequest;
public gatePassTypeList=UI_CONSTANT.GATEPASSTYPE;
public datepickerConfig: Partial<BsDatepickerConfig>;
public starttimes;
public startDate;
public endDate;
public endtime;
public attendanceDate;
public duration;
public leaveattendanceListcol:any[]=[];
public leaveattendanceListUI:Array<AttendancesDetail>=[];
@Input() employeeID:number;  

@Input() transactionID:number;
@Input() requestID:number; 
@Input() workflowID:number;
@Input() requestStatus:string;
@Input()  PostButton:boolean;
@Input()  disabledTxt:boolean;
@Output() closePopup = new EventEmitter<boolean>();
@Output() onSaveGatePass = new EventEmitter<boolean>();
@Output() gatePassLeaveRefresh=new EventEmitter<any>();

  constructor(private requestFlowService:RequestFlowService,
    private notificationService:NotificationService,
  private leaveRequestService:LeaveRequestService,
    private requestService: RequestFlowService) { 
    this.datepickerConfig = Object.assign({},{ 
      containerClass:'theme-default',
      dateInputFormat:'DD-MMM-YYYY',
      adaptivePosition:true,
      initCurrentTime: false });
  }

  ngOnInit(): void {}
  ngOnChanges(){
    console.log(this.employeeID);
    this.getleaveAttendanceDetail();
    if(this.requestID!=0 && this.transactionID!=0){
      this.gatepassrequestInfo.employeeID=this.employeeID;
      this.gatepassrequestInfo.requestID=this.requestID;
      this.gatepassrequestInfo.transactionID=this.transactionID;
      this.gatepassrequestInfo.requestStatus=this.requestStatus;
      this.gatepassrequestInfo.workFlowID=this.workflowID;
      console.log(this.gatepassrequestInfo)
      this.requestService.fetchEmployeeGatePassData(this.gatepassrequestInfo).subscribe(res=>{
        if(res){
          console.log(res)
          this.gatepassInfo=res[0];
          console.log(this.gatepassInfo)
          if(this.gatepassInfo.attendanceDate !=null){
            this.attendanceDate=moment(this.gatepassInfo.attendanceDate).format('DD-MMM-YYYY');
            this.getleaveAttendanceDetail();
          }
          if(this.gatepassInfo.attendanceDate !=null){
            this.startDate=moment(this.gatepassInfo.startTime).format('DD-MMM-YYYY');
          }
          if(this.gatepassInfo.attendanceDate !=null){
            this.starttimes=moment(this.gatepassInfo.startTime).format('HH:mm');
          }
          if(this.gatepassInfo.attendanceDate !=null){
            this.endDate=moment(this.gatepassInfo.endTime).format('DD-MMM-YYYY');
          }
          if(this.gatepassInfo.attendanceDate !=null){
            this.endtime=moment(this.gatepassInfo.endTime).format('HH:mm');
          }
          if(this.gatepassInfo.attendanceDate !=null){
            this.duration = this.gatepassInfo.duration;
          }
        }
      });
    }
  }

  getenddateTime(event) {
    this.endtime = moment(event).format("HH:mm");
    this.gatepassInfo.endTime = moment(this.endDate).format('yyyy-MM-DD') + 'T' + moment(event).format("HH:mm:ss");
  }
  getstartdateTime(event) {
    this.starttimes = moment(event).format("HH:mm");
    this.gatepassInfo.startTime = moment(this.startDate).format('yyyy-MM-DD') + 'T' + moment(event).format("HH:mm:ss");
  }

  getdurationTime(event){
    console.log(event)
    this.duration = moment(event).format("HH:mm");
    if (this.starttimes && this.duration) {
      this.endtime = this.starttimes;
      var duration = this.duration.split(':');
      var hour = parseInt(duration[0]) ;
      var minutes= parseInt(duration[1]);
      let endDateTime=new Date(this.gatepassInfo.startTime).setHours(new Date(this.gatepassInfo.startTime).getHours()+hour);
      endDateTime=new Date(endDateTime).setMinutes(new Date(this.gatepassInfo.startTime).getMinutes()+minutes);
      this.endtime=moment(endDateTime).format("HH:mm");
      this.gatepassInfo.endTime = moment(endDateTime).format('yyyy-MM-DD') + 'T' + moment(endDateTime).format("HH:mm:ss");
    }
    else {
      this.endtime='';
    }
    /*if (this.starttime && this.duration) {
      var time = this.starttime.split(':');
      var dur = this.duration.split(':');
      var min = parseInt(time[1]) + parseInt(dur[1]);
      var hr = parseInt(time[0]) + parseInt(dur[0]);
      var mint;
      var hrt;
       if (min > 59) {
        hr = hr + 1;
        min = min - 59;
      }
          if (min < 10) { mint = "0" + min }  else { mint = min }
          
          if(hr >=24){
            var hrts="00";
            if(hr==24){
              hrt=hrts;
            }
            else if(hr > 24){
              hrt = parseInt(hrts)+parseInt(dur[0]);
              if(hrt <10){
                hrt='0'+hrt;
              }
            }
            else{
              hrt = hr;
            }
          }
          else{
            hrt = hr;
          }
          
          var eTime = hrt + ':' + mint;
          //console.log('endtime',eTime);
          //else if(hr >= 24){hrt='00';mint=min}
      this.endtime=eTime;
      this.gatepassInfo.endTime = moment(this.endDate).format('yyyy-MM-DD') + 'T' +this.endtime+':00'
    } else {
      this.endtime='';
    }*/
  }

  getattendanceadte(date){
    console.log(date)
    this.startDate=date;
    this.endDate=date;
  }

  SaveGatePassData(){
    this.gatepassInfo.employeeID=this.employeeID;
    this.gatepassInfo.duration=this.duration;
    if(this.attendanceDate !=null){
      this.gatepassInfo.attendanceDate=moment(this.attendanceDate).format('yyyy-MM-DD');
    }else{
      this.notificationService.showError('Please Attendance Date', UI_CONSTANT.SEVERITY.ERROR);
    }
    if(this.gatepassInfo.startTime ==null){
      this.notificationService.showError('Please Start Date Time Date', UI_CONSTANT.SEVERITY.ERROR);
    }
    if(this.gatepassInfo.endTime ==null){
      this.notificationService.showError('Please End Date Time Date', UI_CONSTANT.SEVERITY.ERROR);
    }
   this.requestFlowService.saveEmployeeGatePassData(this.gatepassInfo);
   this.onSaveGatePass.emit(true);
   this.gatePassLeaveRefresh.emit();
   this.requestService.setGatePassVisibility(false);
  }
  closePopups(){
    this.gatepassInfo = {} as GatePass;
  this.closePopup.emit(false);
  }
  getleaveAttendanceDetail()
{
  var fromdate=moment(this.attendanceDate).format('yyyy-MM-DD')+'T00:00:00';
  var todate=moment(this.attendanceDate).format('yyyy-MM-DD')+'T00:00:00';
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
getCorrectDate(){
  var fromdate=moment(this.attendanceDate).format('yyyy-MM-DD')+'T00:00:00';
  var todate=moment(this.attendanceDate).format('yyyy-MM-DD')+'T00:00:00';
    this.getleaveAttendanceDetail();
}
}
