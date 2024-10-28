import { Component,EventEmitter, Input, OnInit, Output, SimpleChange } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { UserAttendanceDetailService } from 'src/app/services/user-attendance-detail.service';
import { RosterProcessSingle } from 'src/app/store/model/userActionAttendanceDetail.model';
import * as moment from 'moment';
import { AppUtil } from 'src/app/common/app-util';

@Component({
  selector: 'app-roster-lock-unlock',
  templateUrl: './roster-lock-unlock.component.html',
  styleUrls: ['./roster-lock-unlock.component.scss']
})
export class RosterLockUnlockComponent implements OnInit {
  @Output() rosterSinglediv = new EventEmitter<boolean>();
  @Output() recallAttendancedetail = new EventEmitter<any>();
  public rosterProcessInfo : RosterProcessSingle = {} as RosterProcessSingle;
  public datepickerConfig: Partial<BsDatepickerConfig>;
  public punchdate:string;
  public punchtime:string;
  public rosterProcessList=UI_CONSTANT.RosterLockUnlock;
  public singleroster:boolean;
  public multiroster:boolean;
  @Input() employeeID:number;  
  @Input() FromDate :string;
  @Input() ToDate :string;  
  @Input() singlemultidiv:string;

  constructor(private attendanceDetailService:UserAttendanceDetailService) {
    this.datepickerConfig = Object.assign({},{ 
    containerClass:'theme-default',
    dateInputFormat:'DD-MMM-YYYY',
    adaptivePosition:true,
    initCurrentTime: false });

   }

  ngOnInit(): void {

     var date = new Date();
    // var firstDay = new Date(date.getFullYear(), date.getMonth()-1);
    // var lastDay = new Date(date.getFullYear(), date.getMonth() -0, 0);
    this.rosterProcessInfo.fromDate=moment(this.FromDate).format('DD-MMM-YYYY');
    this.rosterProcessInfo.toDate=moment(this.ToDate).format('DD-MMM-YYYY') ;
  }
  
  ngOnChanges(changes: SimpleChange) {
    this.rosterProcessInfo.fromDate=moment(this.FromDate).format('DD-MMM-YYYY');
    this.rosterProcessInfo.toDate=moment(this.ToDate).format('DD-MMM-YYYY') ;
    if(this.singlemultidiv=='single'){
      this.singleroster=true;
      this.multiroster=false;
   }else{
    this.singleroster=false;
    this.multiroster=true;
   }
  }
  
  SaveRosterProcessData(){
    const temprosterinfo = AppUtil.deepCopy(this.rosterProcessInfo);
    if(this.rosterProcessInfo.fromDate != null){
      temprosterinfo.fromDate= moment(this.rosterProcessInfo.fromDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD");
    }else{
      temprosterinfo.fromDate=null;
    }
    if(this.rosterProcessInfo.toDate!=null){
      temprosterinfo.toDate= moment(this.rosterProcessInfo.toDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD");
    }else{
      temprosterinfo.toDate=null
    }
    temprosterinfo.employeeID = this.employeeID;
    //console.log(temprosterinfo);
    this.attendanceDetailService.SaveRosterLockUnlockSingle(temprosterinfo);
    this.recallAttendancedetail.emit('Ok');
    this.CancelrosterLockUlockForm();
  }
  SaveRosterProcessMultiData(){
    const temprosterinfo = AppUtil.deepCopy(this.rosterProcessInfo);
    if(this.rosterProcessInfo.fromDate != null){
      temprosterinfo.fromDate= moment(this.rosterProcessInfo.fromDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD");
    }else{
      temprosterinfo.fromDate=null;
    }
    if(this.rosterProcessInfo.toDate!=null){
      temprosterinfo.toDate= moment(this.rosterProcessInfo.toDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD");
    }else{
      temprosterinfo.toDate=null
    }
    this.attendanceDetailService.SaveRosterLockUnlockMulti(temprosterinfo);
    this.recallAttendancedetail.emit('Ok');
    this.CancelrosterLockUlockForm();
  }
  CancelrosterLockUlockForm(){
    this.rosterProcessInfo={} as RosterProcessSingle;
    this.rosterProcessInfo.fromDate=moment(this.FromDate).format('DD-MMM-YYYY');
    this.rosterProcessInfo.toDate=moment(this.ToDate).format('DD-MMM-YYYY') ;
    this.rosterSinglediv.emit(false);
  }
}
