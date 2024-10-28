import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { NotificationService } from 'src/app/common/notification.service';
import { LeaveRequestService } from 'src/app/services/leave-request.service';
import { RequestFlowService } from 'src/app/services/request-flow.service';
import { AttendancesDetail, GatePass, GatePassRequest, PunchRegularizationInfo } from 'src/app/store/model/userActionAttendanceDetail.model';

@Component({
  selector: 'app-punch-regularization',
  templateUrl: './punch-regularization.component.html',
  styleUrls: ['./punch-regularization.component.scss']
})
export class PunchRegularizationComponent implements OnInit {

  public punchRegularizationInfo: PunchRegularizationInfo = {} as PunchRegularizationInfo;
  public punchRegularizationReqInfo: GatePassRequest = {} as GatePassRequest;
public gatePassTypeList=UI_CONSTANT.GATEPASSTYPE;
public datepickerConfig: Partial<BsDatepickerConfig>;
  public outDate;
public outTime:string;
public inDate:string;
public inTime:string;
public pregDate:string;
public reqType:string;
public punchType:string;
public Remark:string;
public punchTypeOption:Array<{key:string;value:string}>=UI_CONSTANT.PUNCH_TYPE;
public requestTypeOption:Array<{key:string;value:string}>=UI_CONSTANT.PUNCH_REQUEST_TYPE;
public leaveattendanceListUI:Array<AttendancesDetail>=[];
public leaveattendanceListcol:any[]=[];
@Input() employeeID:number;  
@Input() transactionID:number;
@Input() requestID:number; 
@Input() workflowID:number;
@Input() requestStatus:string;
@Input()  PostButton:boolean;
@Input()  disabledTxt:boolean;
@Output() closePopup = new EventEmitter<boolean>();
@Output() punchRegularizationLeaveRefresh=new EventEmitter<any>();

  constructor( 
    private requestService: RequestFlowService,
    private leaveRequestService:LeaveRequestService,
    private notificationService: NotificationService
    ) { 
    this.datepickerConfig = Object.assign({},{ 
      containerClass:'theme-default',
      dateInputFormat:'DD-MMM-YYYY',
      adaptivePosition:true,
      initCurrentTime: false });
  }

  ngOnInit(): void {}
  ngOnChanges(){
    this.getleaveAttendanceDetail();
    if(this.requestID!=0 && this.transactionID!=0){
      this.punchRegularizationReqInfo.employeeID=this.employeeID;
      this.punchRegularizationReqInfo.requestID=this.requestID;
      this.punchRegularizationReqInfo.transactionID=this.transactionID;
      this.punchRegularizationReqInfo.requestStatus=this.requestStatus;
      this.punchRegularizationReqInfo.workFlowID=this.workflowID;
      console.log(this.punchRegularizationReqInfo);
      this.requestService.fetchEmployeePunchRegData(this.punchRegularizationReqInfo).subscribe(res=>{
        if(res){
          console.log(res)
          this.punchRegularizationInfo=res;
          console.log(this.punchRegularizationInfo)
          if(this.punchRegularizationInfo.attendanceDate !=null){
            this.pregDate=moment(this.punchRegularizationInfo.attendanceDate).format('DD-MMM-YYYY');
            this.getleaveAttendanceDetail();
          }
          if(this.punchRegularizationInfo.attendanceDate !=null){
            this.inDate=moment(this.punchRegularizationInfo.inTime).format('DD-MMM-YYYY');
          }
          if(this.punchRegularizationInfo.attendanceDate !=null){
            this.inTime=moment(this.punchRegularizationInfo.inTime).format('HH:mm');
          }
          if(this.punchRegularizationInfo.attendanceDate !=null){
            this.outDate=moment(this.punchRegularizationInfo.outTime).format('DD-MMM-YYYY');
          }
          if(this.punchRegularizationInfo.attendanceDate !=null){
            this.outTime=moment(this.punchRegularizationInfo.outTime).format('HH:mm');
          }
        }
      });
    }
      
  }
  getleaveAttendanceDetail(){
  var fromdate=moment(this.pregDate).format('yyyy-MM-DD')+'T00:00:00';
  var todate=moment(this.pregDate).format('yyyy-MM-DD')+'T00:00:00';
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

getpunchDate(date){
  console.log(date)
  this.inDate=date;
  this.outDate=date;
}

getinDateTime(event) {
  this.inTime = moment(event).format("HH:mm");
  this.punchRegularizationInfo.inTime = moment(this.inDate).format('yyyy-MM-DD') + 'T' + moment(event).format("HH:mm:ss")+'Z';
}

getCorrectDate(){
  var fromdate=moment(this.pregDate).format('yyyy-MM-DD')+'T00:00:00';
  var todate=moment(this.pregDate).format('yyyy-MM-DD')+'T00:00:00';
    this.getleaveAttendanceDetail();
}

getoutDateTime(event){
  this.outTime = moment(event).format("HH:mm");
  this.punchRegularizationInfo.outTime = moment(this.inDate).format('yyyy-MM-DD') + 'T' + moment(event).format("HH:mm:ss")+'Z';

}

closePopups(){
  this.closePopup.emit(true);
}
SavePunchReqData(){
  console.log('punch data',this.punchRegularizationInfo);
  this.punchRegularizationInfo.employeeID=this.employeeID;
  this.punchRegularizationInfo.punchRegularizationRequestID=0;
    // this.punchRegularizationInfo.requestRemark=this.Remark;
    if(this.pregDate !=null){
      this.punchRegularizationInfo.attendanceDate=moment(this.pregDate).format('yyyy-MM-DD')+'T00:00:00Z';;
    }else{
      this.notificationService.showError('Please Attendance Date', UI_CONSTANT.SEVERITY.ERROR);
    }
    if(this.punchRegularizationInfo.requestType == 'I' && this.punchRegularizationInfo.inTime ==null){
      this.notificationService.showError('Please provide In Date/Time', UI_CONSTANT.SEVERITY.ERROR);
    }
    if(this.punchRegularizationInfo.requestType == 'O' && this.punchRegularizationInfo.outTime ==null){
      this.notificationService.showError('Please provide Out Date/Time', UI_CONSTANT.SEVERITY.ERROR);
    }
    if(this.punchRegularizationInfo.requestType === 'I'){
      this.punchRegularizationInfo.outTime=null;
    }else if(this.punchRegularizationInfo.requestType === 'O'){
      this.punchRegularizationInfo.inTime=null;
    }
   this.requestService.savePunchRegularizationData(this.punchRegularizationInfo);
   this.closePopup.emit(true);
   this.punchRegularizationLeaveRefresh.emit();
   this.requestService.setPunchRequestVisiblity(false);

}

}
