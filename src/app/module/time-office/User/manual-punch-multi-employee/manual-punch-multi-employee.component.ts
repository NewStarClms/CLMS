import { Component, EventEmitter, Input, OnInit, Output, SimpleChange } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { UserAttendanceDetailService } from 'src/app/services/user-attendance-detail.service';
import * as moment from 'moment';
import { ManualPunchMulti } from 'src/app/store/model/userActionAttendanceDetail.model';
import { AppUtil } from 'src/app/common/app-util';
@Component({
  selector: 'app-manual-punch-multi-employee',
  templateUrl: './manual-punch-multi-employee.component.html',
  styleUrls: ['./manual-punch-multi-employee.component.scss']
})
export class ManualPunchMultiEmployeeComponent implements OnInit {
  public manualPunchInfo : ManualPunchMulti = {} as ManualPunchMulti;
  public datepickerConfig: Partial<BsDatepickerConfig>;
  public punchdate:string;
  public punchtime:string;
  public inOutList=UI_CONSTANT.INOUTLIST;
  public punchTypeList=UI_CONSTANT.PUNCHTYPELIST;
  @Input() FromDate :string;
  @Input() ToDate :string;  
  @Input() singlemultidiv:string;
  public singleroster:boolean;
  public multiroster:boolean;

  stateOptions=UI_CONSTANT.stateOptions;
  @Output() manualPunchmultidiv=new EventEmitter<boolean>();
  constructor(private attendanceDetailService:UserAttendanceDetailService) {
    this.datepickerConfig = Object.assign({},{ 
    containerClass:'theme-default',
    dateInputFormat:'DD-MMM-YYYY',
    adaptivePosition:true,
    initCurrentTime: false });

   }

  ngOnInit(): void {
    // var date = new Date();
    // var firstDay = new Date(date.getFullYear(), date.getMonth()-1);
    // var lastDay = new Date(date.getFullYear(), date.getMonth() -0, 0);
    // this.manualPunchInfo.fromDate=moment(firstDay).format('DD-MMM-YYYY');
    // this.manualPunchInfo.toDate=moment(lastDay).format('DD-MMM-YYYY') ;

    // console.log(this.FromDate);
    // console.log(this.ToDate);
    // var date = new Date();
   
    this.manualPunchInfo.fromDate=moment(this.FromDate).format('DD-MMM-YYYY');
    this.manualPunchInfo.toDate=moment(this.ToDate).format('DD-MMM-YYYY') ;
  }

  ngOnChanges(changes: SimpleChange) {
    this.manualPunchInfo.fromDate=moment(this.FromDate).format('DD-MMM-YYYY');
    this.manualPunchInfo.toDate=moment(this.ToDate).format('DD-MMM-YYYY') ;
    if(this.singlemultidiv=='single'){
      this.singleroster=true;
      this.multiroster=false;
   }else{
    this.singleroster=false;
    this.multiroster=true;
   }
  }

  keyPressNumeric(event) {
    AppUtil.validateNumbers(event);
   
  }
  SaveManualPunchMultiData(){
    const tempmanualPunchInfo=AppUtil.deepCopy(this.manualPunchInfo);
    tempmanualPunchInfo.punchTime= moment(this.punchtime).format('HH:MM');
    tempmanualPunchInfo.fromDate=moment(this.FromDate).format('DD-MMM-YYYY');
    tempmanualPunchInfo.toDate=moment(this.ToDate).format('DD-MMM-YYYY') ;
    tempmanualPunchInfo.employeeID = 0;
    console.log(tempmanualPunchInfo);
    this.attendanceDetailService.saveManualPunchMulti(tempmanualPunchInfo);
    this.CancelmanualPunch();
  }
  CancelmanualPunch(){
    this.manualPunchInfo={} as ManualPunchMulti;
    this.manualPunchInfo.fromDate=moment(this.FromDate).format('DD-MMM-YYYY');
    this.manualPunchInfo.toDate=moment(this.ToDate).format('DD-MMM-YYYY') ;
    this.manualPunchmultidiv.emit(false);
  }
}
