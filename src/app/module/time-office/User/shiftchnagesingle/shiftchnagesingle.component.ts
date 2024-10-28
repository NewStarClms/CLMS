import { Component, EventEmitter, Input, OnInit, Output, SimpleChange } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { UserAttendanceDetailService } from 'src/app/services/user-attendance-detail.service';
import { ShiftChange } from 'src/app/store/model/userActionAttendanceDetail.model';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
@Component({
  selector: 'app-shiftchnagesingle',
  templateUrl: './shiftchnagesingle.component.html',
  styleUrls: ['./shiftchnagesingle.component.scss']
})
export class ShiftchnagesingleComponent implements OnInit {
  @Output() shiftChangeSinglediv = new EventEmitter<boolean>();
  @Output() recallAttendancedetail = new EventEmitter<any>();
  public shiftChangeInfo : ShiftChange = {} as ShiftChange;
  public datepickerConfig: Partial<BsDatepickerConfig>;
  public punchdate:string;
  public punchtime:string;
  public stateOptions=UI_CONSTANT.stateOptions;
  public shiftChangeactionList=UI_CONSTANT.shiftChangeactionList;
  public shiftcodesLists:Array<any>=[];
  @Input() shiftcodeList:Array<any>=[];
    public singleshift:boolean;
  public multishift:boolean;
  @Input() employeeID:number;  
  @Input() FromDate :string;
  @Input() ToDate :string;
  @Input() singlemultidiv:string;
  public shiftcodedropdowndiv:string='';
  constructor(private attendanceDetailService:UserAttendanceDetailService,
    private _store: Store<any>,) {
    this.datepickerConfig = Object.assign({},{ 
    containerClass:'theme-default',
    dateInputFormat:'DD-MMM-YYYY',
    adaptivePosition:true,
    initCurrentTime: false });
   }

  ngOnInit(): void {

    // var date = new Date();
    // var firstDay = new Date(date.getFullYear(), date.getMonth()-1);
    // var lastDay = new Date(date.getFullYear(), date.getMonth()-0, 0);
    // this.shiftChangeInfo.fromDate=moment(firstDay).format('DD-MMM-YYYY');
    // this.shiftChangeInfo.toDate=moment(lastDay).format('DD-MMM-YYYY') ;
  }
    ngOnChanges(changes: SimpleChange) {
      this.shiftChangeInfo.fromDate=moment(this.FromDate).format('DD-MMM-YYYY');
      this.shiftChangeInfo.toDate=moment(this.ToDate).format('DD-MMM-YYYY') ;
     this.shiftcodedropdowndiv='shiftcodedropdowndivshow';
     if(this.singlemultidiv=='single'){
        this.singleshift=true;
        this.multishift=false;
        
     }else{
      this.singleshift=false;
      this.multishift=true;
     }
  }
  SaveShiftChangesingleData(){
    const tempshiftchnageinfo = AppUtil.deepCopy(this.shiftChangeInfo);
    if(this.shiftChangeInfo.fromDate != null){
      tempshiftchnageinfo.fromDate= moment(this.shiftChangeInfo.fromDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD");
    }else{
      tempshiftchnageinfo.fromDate=null;
    }
    if(this.shiftChangeInfo.toDate != null){
      tempshiftchnageinfo.toDate= moment(this.shiftChangeInfo.toDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD");
    }else{
      tempshiftchnageinfo.toDate=null;
    }
    tempshiftchnageinfo.employeeID = this.employeeID;
    tempshiftchnageinfo.punchProcess=true;
    console.log(tempshiftchnageinfo);
   this.attendanceDetailService.SaveShiftChangeSingle(tempshiftchnageinfo);
   this.recallAttendancedetail.emit('Ok');
   this.CancelShiftChange();
  }
  SaveShiftChangeMultiData(){
    const tempshiftchnageinfo = AppUtil.deepCopy(this.shiftChangeInfo);
    if(this.shiftChangeInfo.fromDate != null){
      tempshiftchnageinfo.fromDate= moment(this.shiftChangeInfo.fromDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD");
    }else{
      tempshiftchnageinfo.fromDate=null;
    }
    if(this.shiftChangeInfo.toDate != null){
      tempshiftchnageinfo.toDate= moment(this.shiftChangeInfo.toDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD");
    }else{
      tempshiftchnageinfo.toDate=null;
    }
    tempshiftchnageinfo.punchProcess=true;
    //console.log(tempshiftchnageinfo);
    this.attendanceDetailService.SaveShiftChangeMulti(tempshiftchnageinfo);
    this.recallAttendancedetail.emit();
    this.CancelShiftChange();
  }
  CancelShiftChange(){
    this.shiftChangeInfo={} as ShiftChange;
    this.shiftChangeInfo.fromDate=moment(this.FromDate).format('DD-MMM-YYYY');
    this.shiftChangeInfo.toDate=moment(this.ToDate).format('DD-MMM-YYYY') ;
    this.shiftChangeSinglediv.emit(false);
  }
  getShiftAction(id){
    this.shiftcodesLists=this.shiftcodeList;
    if(id==1){
      this.shiftcodedropdowndiv='';
    }else{
      this.shiftcodedropdowndiv='shiftcodedropdowndivshow';
    }
  }
}
