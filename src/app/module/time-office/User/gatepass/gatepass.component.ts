import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { DeleteGatePass, GatePass, GatePassDetail, SearchGatePassDetail } from 'src/app/store/model/userActionAttendanceDetail.model';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { UserAttendanceDetailService } from 'src/app/services/user-attendance-detail.service';
import { NotificationService } from 'src/app/common/notification.service';
import { AppUtil } from 'src/app/common/app-util';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-gatepass',
  templateUrl: './gatepass.component.html',
  styleUrls: ['./gatepass.component.scss']
})
export class GatepassComponent implements OnInit {
public gatepassInfo: GatePass = {} as GatePass;
public deletegatepassInfo:DeleteGatePass = {} as DeleteGatePass;
public searchGatePassInfo : SearchGatePassDetail = {} as SearchGatePassDetail;
public gatePassTypeList=UI_CONSTANT.GATEPASSTYPE;
public datepickerConfig: Partial<BsDatepickerConfig>;
public starttime;
public startDate;
public endDate;
public endtime;
public attendanceDate;
@Input() employeeID:number;  
//@Output() gatePassSinglediv = new EventEmitter<boolean>();
@Output() gatePassSinglediv:EventEmitter<boolean> = new EventEmitter<boolean>(false);
public gatepassDetailListCol: any[] = [];
public gatepassDetailsListUI : Array<GatePassDetail>=[];
public gatepassDetails:Array<GatePassDetail>=[];
public attendanceDateFrom;
public attendanceDateTo;
public deletegatepass:boolean=false;
public duration;
@Input() FromDate :string;
@Input() ToDate :string;



  constructor(private attendanceDetailService:UserAttendanceDetailService,
    private notificationService:NotificationService,private confirmationService:ConfirmationService) { 
    this.datepickerConfig = Object.assign({},{ 
      containerClass:'theme-default',
      dateInputFormat:'DD-MMM-YYYY',
      adaptivePosition:true,
      initCurrentTime: false });
  }

  ngOnInit(): void {
    this.gatepassDetailListCol = [
      { field: 'attendanceDate', header: 'Date',date:true},
      { field: 'startTime', header: 'StartTime',time:true },
      { field: 'endTime', header: 'EndTime',time:true},
      { field: 'gatePassType', header: 'GatePass Type',icon:true},
       { field: 'statusName', header: 'Request Status'},
       { field: 'requestRemark', header: 'Remark'},
      { field: 'requestDate', header: 'Created Date'},
      { field: '', header: 'Cancel',delicon:true },
  ];
  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth()-1);
  var lastDay = new Date(date.getFullYear(), date.getMonth()-0,0);
  this.attendanceDateFrom=moment(this.FromDate).format('DD-MMM-YYYY');
  this.attendanceDateTo=moment(this.ToDate).format('DD-MMM-YYYY') ;
this.searchGatePassInfo.fromDate=moment(firstDay).format('yyyy-MM-DD') + 'T00:00:00' ;
this.searchGatePassInfo.toDate=moment(lastDay).format('yyyy-MM-DD') + 'T00:00:00' ;
// this.attendanceDate=moment(firstDay).format('yyyy-MM-DD') + 'T00:00:00';
this.attendanceDate=moment(this.FromDate).format('DD-MMM-YYYY');
this.getGatePassDetail();
console.log(firstDay,lastDay);
  }
  SaveGatePassData(){
    this.gatepassInfo.employeeID=this.employeeID;
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
   this.attendanceDetailService.SaveGatePassData(this.gatepassInfo);
  }
 
  getenddateTime(event) {
    this.endtime = moment(event).format("HH:mm");
    this.gatepassInfo.endTime = moment(this.endDate).format('yyyy-MM-DD') + 'T' + moment(event).format("HH:mm:ss");
  }
  getstartdateTime(event) {
    this.starttime = moment(event).format("HH:mm");
    this.gatepassInfo.startTime = moment(this.startDate).format('yyyy-MM-DD') + 'T' + moment(event).format("HH:mm:ss");
  }
  getGatePassDetail(){
    this.searchGatePassInfo.employeeID=this.employeeID;
    this.searchGatePassInfo.fromDate=moment(this.attendanceDateFrom).format('yyyy-MM-DD') + 'T00:00:00' ;
    this.searchGatePassInfo.toDate=moment(this.attendanceDateTo).format('yyyy-MM-DD') + 'T00:00:00' ;
    console.log(this.searchGatePassInfo);
    this.attendanceDetailService.fetchGatePassDetailData(this.searchGatePassInfo).subscribe(res=>{
      if(res && res.gatePasses){
        this.gatepassDetailsListUI=[];
        this.gatepassDetails=[];
            this.gatepassDetails = AppUtil.deepCopy(res.gatePasses);
            this.gatepassDetails.forEach(detail=>{
              this.gatepassDetailsListUI.push(detail);
            });
      }
    });
  }
  getdurationTime(event){
    console.log(event)
    this.duration = moment(event).format("HH:mm");
   
    if (this.starttime && this.duration) {
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
    }
  }
  deleteGatePass(params){
    console.log(params);
     this.deletegatepass=true;
     this.deletegatepassInfo.employeeID=this.employeeID;
     this.deletegatepassInfo.requestID=params.gatePassRequestID
  }
  DeleteGatePassData(){
    console.log(this.deletegatepassInfo);
    this.attendanceDetailService.deletegatePassData(this.deletegatepassInfo);
    this.deletegatepass=false;
  }
  getattendanceadte(date){
    console.log(date)
    this.startDate=date;
    this.endDate=date;
  }
  CancelgatePass(){
    this.gatepassInfo={} as GatePass;
    this.gatePassSinglediv.emit(true);
  
 }
}
