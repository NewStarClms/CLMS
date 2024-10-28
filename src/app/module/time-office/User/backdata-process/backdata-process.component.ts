import { Component, EventEmitter, Input, OnInit, Output, SimpleChange } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { UserAttendanceDetailService } from 'src/app/services/user-attendance-detail.service';
import { BackDataProcess } from 'src/app/store/model/userActionAttendanceDetail.model';
import * as moment from 'moment';
import { NotificationService } from 'src/app/common/notification.service';

@Component({
  selector: 'app-backdata-process',
  templateUrl: './backdata-process.component.html',
  styleUrls: ['./backdata-process.component.scss']
})
export class BackdataProcessComponent implements OnInit {
 @Input() singlemultidiv:string;
 @Input() employeeID:number;
 @Input() FromDate :string;
 @Input() ToDate :string;
 public backDataProcessInfo : BackDataProcess = {} as BackDataProcess;
 public datepickerConfig: Partial<BsDatepickerConfig>;
 public singlebackDataProcess:boolean;
 public multibackDataProcess:boolean;
 public stateOptions=UI_CONSTANT.stateOptions;
 @Output() backDataProcessdiv = new EventEmitter<boolean>();
 @Output() recallAttendancedetail = new EventEmitter<any>();
 constructor(private attendanceDetailService:UserAttendanceDetailService,
  private notificationService:NotificationService
  ) {
  this.datepickerConfig = Object.assign({},{ 
  containerClass:'theme-default',
  dateInputFormat:'DD-MMM-YYYY',
  adaptivePosition:true,
  initCurrentTime: false });

 }
 ngOnInit(): void {
  // var date = new Date();
  // var firstDay = new Date(date.getFullYear(), date.getMonth()-1);
  //  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  //  this.backDataProcessInfo.fromDate=moment(firstDay).format('DD-MMM-YYYY');
 }


 ngOnChanges(changes: SimpleChange) {
  this.backDataProcessInfo.fromDate=moment(this.FromDate).format('DD-MMM-YYYY');
  this.backDataProcessInfo.toDate=moment(this.ToDate).format('DD-MMM-YYYY');
  if(this.singlemultidiv=='single'){
    this.singlebackDataProcess=true;
    this.multibackDataProcess=false;
    
 }else{
  this.singlebackDataProcess=false;
  this.multibackDataProcess=true;
  
 }
 }
 CancelbackDataProcessForm(){
  this.backDataProcessInfo={} as BackDataProcess;
  this.backDataProcessInfo.fromDate=moment(this.FromDate).format('DD-MMM-YYYY');
  this.backDataProcessInfo.toDate=moment(this.ToDate).format('DD-MMM-YYYY');
  this.backDataProcessdiv.emit(false);
 }
 SavebackDataProcessSingle(){
  const tempbackDatainfo = AppUtil.deepCopy(this.backDataProcessInfo);
  tempbackDatainfo.employeeID = this.employeeID;
  if(this.backDataProcessInfo.fromDate != null){
    tempbackDatainfo.fromDate= moment(this.backDataProcessInfo.fromDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD");
  }else{
    tempbackDatainfo.fromDate=null;
  }
  if(this.backDataProcessInfo.toDate!=null){
    tempbackDatainfo.toDate= moment(this.backDataProcessInfo.toDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD");
  }else{
    tempbackDatainfo.toDate = moment(moment(new Date()).format('YYYY-MM-DD')).format("YYYY-MM-DD");
  }
  if(tempbackDatainfo.fromDate > tempbackDatainfo.toDate){
    this.notificationService.showError('From Date should be less than current date', UI_CONSTANT.SEVERITY.ERROR);
  }else{
    this.attendanceDetailService.SaveBackDataProcessSingle(tempbackDatainfo);
    this.recallAttendancedetail.emit('Ok');
  }
 // New Changes
 this.CancelbackDataProcessForm();
 // End
 }
 SavebackDataProcessMulti(){
  const tempbackDatainfo = AppUtil.deepCopy(this.backDataProcessInfo);
  tempbackDatainfo.employeeID = this.employeeID;
  if(this.backDataProcessInfo.fromDate != null){
    tempbackDatainfo.fromDate= moment(this.backDataProcessInfo.fromDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD");
  }else{
    tempbackDatainfo.fromDate=null;
  }
  if(this.backDataProcessInfo.toDate!=null){
    tempbackDatainfo.toDate= moment(this.backDataProcessInfo.toDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD");
  }else{
    tempbackDatainfo.toDate = moment(moment(new Date()).format('YYYY-MM-DD')).format("YYYY-MM-DD");
  }
  if(tempbackDatainfo.fromDate > tempbackDatainfo.toDate){
    this.notificationService.showError('From Date should be less than current date', UI_CONSTANT.SEVERITY.ERROR);
  }else{
    this.attendanceDetailService.SaveBackDataProcessMulti(tempbackDatainfo);
    this.recallAttendancedetail.emit('Ok');
  }
 this.CancelbackDataProcessForm();
 }
}
