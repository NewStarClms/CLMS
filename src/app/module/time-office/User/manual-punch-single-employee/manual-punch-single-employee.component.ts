import { Component, EventEmitter, Input, OnInit, Output, SimpleChange } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ManualPunchSingle, PunchDetail } from 'src/app/store/model/userActionAttendanceDetail.model';
import * as moment from 'moment';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { UserAttendanceDetailService } from 'src/app/services/user-attendance-detail.service';
import { AppUtil } from 'src/app/common/app-util';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-manual-punch-single-employee',
  templateUrl: './manual-punch-single-employee.component.html',
  styleUrls: ['./manual-punch-single-employee.component.scss']
})
export class ManualPunchSingleEmployeeComponent implements OnInit {
 
  @Output() manualPunchdiv = new EventEmitter<boolean>();
  @Output() recallAttendancedetail = new EventEmitter<any>();
  public manualPunchInfo : ManualPunchSingle = {} as ManualPunchSingle;
  public datepickerConfig: Partial<BsDatepickerConfig>;
  public punchdate:string;
  public punchtime:string;
  public inOutList=UI_CONSTANT.INOUTLIST;
  public punchDetailListCol:any[]=[];
  @Input() employeeID:number;
  @Input() FromDate :string;
  @Input() ToDate :string;  
  public punchDetails:Array<PunchDetail>=[];
  public punchDetailsList : Array<PunchDetail>=[];
  public attDate;
  public employeeId:number=0;
  public fromDate:string;
  public toDate:string;
  public CurrentDate:string;

  constructor(private attendanceDetailService:UserAttendanceDetailService,
    private confirmationService:ConfirmationService) {
    this.datepickerConfig = Object.assign({},{ 
    containerClass:'theme-default',
    dateInputFormat:'DD-MMM-YYYY',
    adaptivePosition:true,
    initCurrentTime: false });

    }
  ngOnInit(): void {

    var date = new Date(), 
    y = date.getFullYear(), 
    m = date.getMonth();
    var firstDay = new Date(date.getFullYear(), date.getMonth(),1);
    var lastDay = new Date(date.getFullYear(), date.getMonth()+1,0);
    this.attDate = [ firstDay, lastDay];

    

  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth()-1);
 this.punchdate=moment(this.FromDate).format('DD-MMM-YYYY');
    // var date = new Date();
    // var fromDate = new Date(date.getFullYear(), date.getMonth()-1);
    // this.punchdate=moment(fromDate).format('DD-MMM-YYYY');
  }
  ngAfterViewInit(){
    // setTimeout( ()=>{
    //   this.getpunchDetail();
    //   }, 1000)
  }
  ngOnChanges(changes: SimpleChange){
    this.getpunchDetail();
    //this.punchdate=null;
    //this.punchtime=null;
    if(this.manualPunchInfo)
        this.manualPunchInfo.reason="";
  }
  SaveManualPunchSingleData(){
    const tempmanualPunchInfo = AppUtil.deepCopy(this.manualPunchInfo);
    tempmanualPunchInfo.punchTime= moment(this.punchdate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD")+' '+moment(this.punchtime).format('HH:mm');
    tempmanualPunchInfo.employeeID = this.employeeID;
   //console.log(tempmanualPunchInfo);
   this.attendanceDetailService.saveManualPunchSingle(tempmanualPunchInfo);
   this.recallAttendancedetail.emit();
     setTimeout( ()=>{
    this.getpunchDetail();
    }, 1000)
  }
  punchDetailcol(){
    this.punchDetailListCol = [
      { field: 'punchTime', header: 'Punch Time'},
      { field: 'inOut', header: 'InOut',fulltext:true},
      { field: 'previousDayPunch', header: 'PreviousDayPunch',icons:true},
      { field: 'punchSource', header: 'PunchSource'},
      { field: 'allowDelete', header: 'Delete',delicons:true},
  ];
  }


  getpunchDetail(){
    this.punchdate=moment(this.FromDate).format('DD-MMM-YYYY');
    var date = new Date();
    this.CurrentDate=moment(date).format('DD-MMM-YYYY');
    if(this.attDate != null){
   this.fromDate = moment(this.punchdate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD")+'T00:00';
   this.toDate = moment(this.CurrentDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD")+'T00:00';
    this.attendanceDetailService.fetchPunchDetailData(this.employeeID,this.fromDate,this.toDate).subscribe(result=>{
    if(result){
      console.log(result);
      this.punchDetailsList=[];
      this.punchDetails=[];
      this.punchDetails = AppUtil.deepCopy(result);
      this.punchDetails.forEach(detail=>{
        
        this.punchDetailsList.push(detail);
      });
      console.log(this.punchDetailsList);
    }
  });
  this.punchDetailcol();
      }
    
   
  }



//   getpunchDetail(){
//     let fromDate = moment().startOf('month').format('YYYY-MM-DD')+'T00:00:00';
//     let toDate   = moment().endOf('month').format('YYYY-MM-DD')+'T00:00:00';
//   //console.log(fromDate,toDate);
//      this.attendanceDetailService.fetchPunchDetailData(this.employeeID,fromDate,toDate).subscribe(result=>{
//   //if(result){
//     //console.log(result);
//     this.punchDetailsList=[];
//     this.punchDetails = result;
//     this.punchDetails.forEach(detail=>{
//       this.punchDetailsList.push(detail);
//     });
    
//   //}
//  });
//  this.punchDetailcol();
//   }
  
 
  CancelmanualPunch(){
    this.manualPunchdiv.emit(false);
  }
 
  deleteManualPunch(id,punchSource){
    //console.log(punchSource)
    let messageText:string;
    if(punchSource=="Machine"){
      messageText = UI_CONSTANT.MESSAGE_TEXT.PUNCH_DELETE_WITH_MACHINE;
    }else{
      messageText = UI_CONSTANT.MESSAGE_TEXT.PUNCH_DELETE_WITH_MANUAL;
    }
    this.confirmationService.confirm({
      message: UI_CONSTANT.MESSAGE_TEXT.PUNCH_DELETE_WITH_MACHINE,
      header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
      icon: 'pi pi-info-circle',
      accept: () => {
        this.attendanceDetailService.deleteSingleManualPunch(this.employeeID,id);
         //New Changes
         setTimeout( ()=>{
          this.getpunchDetail();
          }, 1000)
        //End
      },
      reject: (type) => {
          switch(type) {
              case UI_CONSTANT.CONFIRM_EVENT_TYPE.REJECT:
                  // this.notificationService.showError('Comfirmation Rejected', null);
              break;
              case UI_CONSTANT.CONFIRM_EVENT_TYPE.CANCEL:
                // this.notificationService.showWarning('Comfirmation Canceled');
              break;
          }
      }
  });
  }
}
