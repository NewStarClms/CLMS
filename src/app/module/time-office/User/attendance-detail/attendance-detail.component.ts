import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { NotificationService } from 'src/app/common/notification.service';
import { AppCoreCommonService } from 'src/app/services/app.core-common.services';
import { AuthService } from 'src/app/services/authentication.service';
import { UserAttendanceDetailService } from 'src/app/services/user-attendance-detail.service';
import { currentUserMenuItems, selectUserMenuItems } from 'src/app/store/app.state';
import {  ShiftMappedData } from 'src/app/store/model/master-data.model';
import {  AttendancesDetail } from 'src/app/store/model/userActionAttendanceDetail.model';
import { Menu, MenuRights } from 'src/app/store/model/usermanage.model';


@Component({
  selector: 'app-attendance-detail',
  templateUrl: './attendance-detail.component.html',
  styleUrls: ['./attendance-detail.component.scss']
})
export class AttendanceDetailComponent implements OnInit {
  // single:boolean=true;
  // multiple:boolean;
  public datepickerConfig: Partial<BsDatepickerConfig>;
  public rowData: Array<AttendancesDetail> = [];
  public employeeId:number=0;
  public attDate;
  public fromDate:string;
  public toDate:string;
  public attendanceDetailListCol: any[] = [];
  public attendanceDetails:Array<AttendancesDetail>=[];
  public attendanceDetailsListUI : Array<AttendancesDetail>=[];
  public present: number;
  public absent: number;
  public leave: number;
  public weeklyoff: number;
  public holiday: number;
  public lateArrival: string;
  public earlyDeparture: string ;
  public extraWork: string;
  public otosFlag: string ;
  public attsummary:boolean;
  public otosFlags:boolean;
  public attendanceDetaildiv:boolean;
  public manaualpunchsinglediv:boolean=false;
  public manaualpunchmultidiv:boolean=false;
  public rosterprocesssinglediv:boolean=false;
  public shiftsinglediv:boolean=false;
  public singlemultiDiv:string;
  public attendanceMenu:boolean;
  public shiftcodesList:Array<any>=[];
  public backDataProcessdiv:boolean;
  public attendancemappingDetaildiv:boolean;
  //public actiontype:string;
  public message:string;
  public policyType:number;
  public policyattId:number=0;
  public policyshiftId:number=0;
  public policyholidayId:number=0;
  public policyleaveId:number=0;
  public shiftpolicy:Array<ShiftMappedData>;
  public shiftmappingDetaildiv:boolean;
  public holidaymappingDetaildiv:boolean;
  public leavemappingDetaildiv:boolean;
  public policyMethod:string="selfServiceTimeOffice";
  public rosterprocesslockunlockdiv:boolean;
  public gatepassDetaildiv:boolean;
  public LeaveRequsetDetaildiv:boolean;
  public verificationDialogDiv: boolean;
  public lateEarlyDeductionDialogDiv:boolean;
  public month;
  public year;
  public monthList = UI_CONSTANT.MONTH_LIST;
  public yearList = UI_CONSTANT.YEAR_LIST;
  public menuItems: Array<Menu>= [];
  public menuRights: Array<MenuRights>= [];
  public currentMenuRights: Array<MenuRights>= [];
  public backgroundColor: Array<string>=UI_CONSTANT.BackgroundColors;
  public showingSingleEmployeeAction: boolean=false;
  public showEmployeeDepDesiName:string;
  public visibleEmployeeDepDesiName:boolean=false;
  public essrequestmultiplediv:boolean=false;
  public menuAction: any ={
    Single: {
      ManualPunch: 158,
      AttendanceLock: 159,
      RosterProcess: 160,
      ShiftUpdate: 161,
      Verification: 162,
      LateEarlyDeduction : 163,
      BackDataProcess: 164,
      GatePass: 165,
      LeavePost: 166
    },
    Multiple: {
      ESSRequest: 393,
      ManualPunch: 394,
      AttendanceLock: 395,
      RosterProcess: 396,
      ShiftUpdate: 397,
      Verification: 398,
      LateEarlyDeduction: 399,
      BackDataProcess: 400
    }
  }

  constructor(private userAttendanceDetailService : UserAttendanceDetailService,
   private notificationService:NotificationService,
   private http:HttpClient,
   private _store: Store<any>,
   private authenticationService:AuthService,
   private coreService:AppCoreCommonService,
   private activatedRoute:ActivatedRoute,
   private router: Router
   ) {
    this.datepickerConfig = Object.assign({}, {
      containerClass: 'theme-default',
      rangeInputFormat: 'DD-MMM-YYYY',
      adaptivePosition: true,
      initCurrentTime: false
    });
   }
  ngOnInit(): void {
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
 //   var firstDay = new Date(y, m, 1);
 //   var lastDay = new Date(y, m + 1, 0);
      var firstDay = new Date(date.getFullYear(), date.getMonth()-1);
      var lastDay = new Date(date.getFullYear(), date.getMonth()-0,0);
    this.attDate = [ firstDay, lastDay];

    this.fromDate =this.attDate[0];
    this.toDate =this.attDate[1];

    this.authenticationService.setGlobalFilterVisibility(false);
    this.message='Please Select Employee';
    this.attendanceDetailcol('','');
    this.singlemultiDiv='single';
    this.attendanceDetaildiv=false;
    this.attendanceMenu=false;
    this.userAttendanceDetailService.getVisiblityManualSingle().subscribe(res =>{
      this.manaualpunchsinglediv = res;
    });
    this.userAttendanceDetailService.getVisiblityManualmulti().subscribe(res =>{
      this.manaualpunchmultidiv = res;
    });
    this.userAttendanceDetailService.getVisiblityroster().subscribe(res =>{
      this.rosterprocesssinglediv = res;
    });

       // New Changes
       this.userAttendanceDetailService.getVisiblityEssRequest().subscribe(res =>{
        this.essrequestmultiplediv = res;
      });
      //End

    this.userAttendanceDetailService.getVisiblityshift().subscribe(res =>{
      this.shiftsinglediv = res;
    });
    this.userAttendanceDetailService.getVisiblitybackData().subscribe(res =>{
      this.backDataProcessdiv = res;
    });
    this.userAttendanceDetailService.getVisiblityrosterlockUnlock().subscribe(res =>{
      this.rosterprocesslockunlockdiv = res;
    });
    this.userAttendanceDetailService.getVisiblitygatePassData().subscribe(res =>{
      this.gatepassDetaildiv = res;
    });
    this.userAttendanceDetailService.getVisiblityLeaveRequestData().subscribe(res =>{
      this.LeaveRequsetDetaildiv = res;
    });
    this.userAttendanceDetailService.getVerificationPopupVisibility().subscribe(res =>{
      this.verificationDialogDiv = res;
    });

    this.userAttendanceDetailService.getLateEarlyDeductionPopupVisibility().subscribe(res =>{
      this.lateEarlyDeductionDialogDiv = res;
    });
   
    this._store.select(currentUserMenuItems).subscribe(response=>{
      this.menuRights=[];
      if (response && response.currentMenuItemsList) {
       var attendanceMenuID= Number(this.activatedRoute.snapshot.params.id);
        response.currentMenuItemsList.menuItems?.forEach(root => {
           root.childs.forEach(child => {
              if(child.menuId==attendanceMenuID){
                this.menuItems=child.childs;
                child.childs.forEach(element => {
                  this.menuRights.push(...element.menuRights);
                });
              }
                
           });
         
       });
      }
    });
  }
  onChange(menuID) {
   
   // this.actiontype = e.target.value;
    this.showingSingleEmployeeAction= menuID==219? true: false;
    this.currentMenuRights= this.menuRights.filter(m=>m.menuID==menuID && m.menuRightTypeID==3);
    if(this.currentMenuRights){
      this.attendanceMenu=true;
    }

    this.userAttendanceDetailService.setVerificationPopupVisibility(false);
    this.userAttendanceDetailService.setLateEarlyDeductionPopupVisibility(false);
    this.year = this.coreService.getDefaultYearForReport();
    const date = new Date(this.fromDate);
    this.month  =   moment(date, UI_CONSTANT.SHORT_DATE_FORMAT).format("MMM");
    // console.log(this.actiontype)
    if(this.showingSingleEmployeeAction){
      // this.single=true;
      // this.multiple=false;
     // this.singlemultiDiv=e.target.value;
       this.singlemultiDiv='single';
      this.userAttendanceDetailService.setVisibilityManualMulti(false);
      this.userAttendanceDetailService.setVisibilityshift(false);
      this.userAttendanceDetailService.setVisibilityroster(false);
      this.authenticationService.setGlobalFilterVisibility(false);
      this.attendanceMenu=true;
    }
    else{
      // this.single=false;
      // this.multiple=true;
      
      this.attendanceMenu=true;
      this.userAttendanceDetailService.setVisibilityManualSingle(false);
      this.userAttendanceDetailService.setVisibilityshift(false);
      this.userAttendanceDetailService.setVisibilityroster(false);
    // this.singlemultiDiv=e.target.value;
      this.singlemultiDiv='Multiple';
      this.attendanceDetaildiv=false;
     
      this.authenticationService.setGlobalFilterVisibility(true);
      this.employeeId=0;
    }
 }
 onGetEmployeeDetail(event){
  this.employeeId = event.data;
  this.showEmployeeDepDesiName=event.column;
  this.policyType=2;
  this.userAttendanceDetailService.fetchEmployeeMappedShiftData(this.employeeId).subscribe(res=>{
    if(res){
          this.shiftcodesList=res;
    }
});
if(this.employeeId!=0){
  this.userAttendanceDetailService.fetchEmployeeAllPolicyData(this.employeeId).subscribe(res=>{
    if(res){
        let allpolicys=res;
      console.log(allpolicys)
        allpolicys.forEach(detail=>{
        let policyTypes= detail.key;
        let policyIds=detail.value;
        if(policyTypes=='1'){
          this.policyattId=policyIds;
          this.policyshiftId=policyIds;
        }else if(policyTypes=='2'){
          this.policyleaveId=policyIds;
          console.log('leave',this.policyleaveId);
        }else if(policyTypes=='3'){
          this.policyholidayId=policyIds;
          
        }
        });
       
    }
  });
}
else{
  this.notificationService.showError(this.message,UI_CONSTANT.SEVERITY.ERROR);
}
}

onDateChaness(params)
{
  this.fromDate =params[0];
  this.toDate =params[1];
  this.year = this.coreService.getDefaultYearForReport();
  const date = new Date(this.fromDate);
  this.month  =   moment(date, UI_CONSTANT.SHORT_DATE_FORMAT).format("MMM");
}

getAttendanceDetail(){
  if(this.employeeId !=0){
    this.attendanceDetaildiv=true;
    if(this.attDate != null){
      this.fromDate = moment(this.attDate[0], UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD")+'T00:00';
 this.toDate = moment(this.attDate[1], UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD")+'T00:00';
 this.userAttendanceDetailService.fetchAttendanceDetailData(this.employeeId,this.fromDate,this.toDate).subscribe(res=>{
  if(res && res.attendances){
    console.log(res);
    this.attendanceDetailsListUI=[];
this.attendanceDetails=[];
    this.attendanceDetails = AppUtil.deepCopy(res.attendances);
    this.attendanceDetails.forEach(detail=>{
      
      this.attendanceDetailsListUI.push(detail);
    });
    console.log(this.attendanceDetailsListUI);
  }
  if(res && res.summary){
    this.attsummary=true;
    this.present=res.summary.present;
    this.absent=res.summary.absent;
    this.earlyDeparture=res.summary.earlyDeparture;
    this.holiday=res.summary.holiday;
    this.leave=res.summary.leave;
    this.weeklyoff=res.summary.weeklyoff;
    this.lateArrival=res.summary.lateArrival;
    this.extraWork=res.summary.extraWork;
    this.otosFlag=res.summary.otosFlag;

    let otosflag;
    let hidetexts;
    if(res.summary.otosFlag != ""){
      otosflag=res.summary.otosFlag;
    hidetexts = true;
    this.otosFlags=true;
    }else{
      otosflag='';
    hidetexts = false;
    }
   this.attendanceDetailcol(otosflag,hidetexts);
  }
});
this.attendanceDetailcol('','');
    }else{
      // this.fromDate = null;
      // this.toDate   = null;
      this.notificationService.showError('Please Select Date', UI_CONSTANT.SEVERITY.ERROR);
    }
  //console.log(this.fromDate,this.toDate);

  }
  else if(this.employeeId == 0 && this.showingSingleEmployeeAction){
   
    this.notificationService.showError(this.message, UI_CONSTANT.SEVERITY.ERROR);
  }
}
attendanceDetailcol(otosflag,hidetexts){
  this.attendanceDetailListCol = [
    { field: 'attendanceDate', header: 'Date',icons:true},
    { field: 'shiftView', header: 'Shift'},
    { field: 'inTime', header: 'InTime' },
    { field: 'outTime', header: 'OutTime',},
    { field: 'status', header: 'Status'},
     { field: 'workingHours', header: 'Working'},
     { field: 'lateArrival', header: 'Late Arrival'},
    { field: 'earlyDeparture', header: 'Early Departure'},
    { field: 'shiftChangeStage', header: 'Shift Status' },
    { field: 'punchChangeStage', header: 'Punch Status'},
    { field: 'extraWork', header: otosflag,hideText:hidetexts},
];
}

menuClicked(menuRightID: number){
  if(this.showingSingleEmployeeAction && this.employeeId ==0) {
      this.notificationService.showError(this.message, UI_CONSTANT.SEVERITY.ERROR);
      return;
  }
  if(menuRightID ===this.menuAction.Single.ManualPunch || menuRightID === this.menuAction.Multiple.ManualPunch ){
    if(!this.showingSingleEmployeeAction) this.userAttendanceDetailService.setVisibilityManualMulti(true);
    else{
      this.getAttendanceDetail();
      this.userAttendanceDetailService.setVisibilityManualSingle(true); 
    }
  } 
   if(menuRightID ===this.menuAction.Single.AttendanceLock){
    this.userAttendanceDetailService.setVisibilityrosterlockUnlock(true);
    this.visibleEmployeeDepDesiName=true;
    if(this.showingSingleEmployeeAction){
      //this.getAttendanceDetail();
     
    }
  }
  if(menuRightID === this.menuAction.Multiple.AttendanceLock)
  {
    this.userAttendanceDetailService.setVisibilityrosterlockUnlock(true);
    this.visibleEmployeeDepDesiName=false;
  }

   if(menuRightID ===this.menuAction.Single.RosterProcess){
    this.userAttendanceDetailService.setVisibilityroster(true);
    this.visibleEmployeeDepDesiName=true;
    if(this.showingSingleEmployeeAction){
     // this.getAttendanceDetail();
    }
  }
  if(menuRightID === this.menuAction.Multiple.RosterProcess)
  {
    this.userAttendanceDetailService.setVisibilityroster(true);
    this.visibleEmployeeDepDesiName=false;
  }
   if(menuRightID ===this.menuAction.Single.ShiftUpdate){
    this.userAttendanceDetailService.setVisibilityshift(true);
    this.visibleEmployeeDepDesiName=true;
    if(this.showingSingleEmployeeAction){
     // this.getAttendanceDetail();
    }
  }
  if(menuRightID === this.menuAction.Multiple.ShiftUpdate)
  {
    this.userAttendanceDetailService.setVisibilityshift(true);
    this.visibleEmployeeDepDesiName=false;
  }
   if(menuRightID ===this.menuAction.Single.Verification){
    this.userAttendanceDetailService.setVerificationPopupVisibility(true);
    this.visibleEmployeeDepDesiName=true;
  }
  if(menuRightID === this.menuAction.Multiple.Verification)
  {
    this.userAttendanceDetailService.setVerificationPopupVisibility(true);
    this.visibleEmployeeDepDesiName=false;
  }
   if(menuRightID ===this.menuAction.Single.LateEarlyDeduction){
    this.userAttendanceDetailService.setLateEarlyDeductionPopupVisibility(true);
    this.visibleEmployeeDepDesiName=true;
  }
  if(menuRightID === this.menuAction.Multiple.LateEarlyDeduction)
  {
    this.userAttendanceDetailService.setLateEarlyDeductionPopupVisibility(true);
    this.visibleEmployeeDepDesiName=false;
  }
   if(menuRightID ===this.menuAction.Single.BackDataProcess){
    this.userAttendanceDetailService.setVisibilitybackData(true);
    this.visibleEmployeeDepDesiName=true;
    if(this.showingSingleEmployeeAction){
     // this.getAttendanceDetail();
    }
  }
  if(menuRightID === this.menuAction.Multiple.BackDataProcess)
  {
    this.userAttendanceDetailService.setVisibilitybackData(true);
    this.visibleEmployeeDepDesiName=false;
  }
  else if(menuRightID ===this.menuAction.Single.GatePass){
    this.userAttendanceDetailService.setVisibilitygatePassData(true); 
  }
  else if(menuRightID ===this.menuAction.Single.LeavePost && this.showingSingleEmployeeAction){
   // this.getAttendanceDetail();
    this.userAttendanceDetailService.setVisibilityLeaveRequestData(true); 
  }
  else if(menuRightID ===this.menuAction.Multiple.ESSRequest){
    this.userAttendanceDetailService.setVisibilityEssRequest(true);
    //this.router.navigate(['/time-office/ess-request'+"/"+this.activatedRoute.snapshot.params.id]);
  }
}
// showrosterpunchsingle(){
//   if(this.employeeId != 0 && this.actiontype=='single'){
//     this.getAttendanceDetail();
//     this.userAttendanceDetailService.setVisibilityroster(true);
//   }else if(this.actiontype=='multiple'){
//     this.userAttendanceDetailService.setVisibilityroster(true);
//   }
//   else if(this.employeeId == 0){
//     this.notificationService.showError(this.message, UI_CONSTANT.SEVERITY.ERROR);
//   }
// }
// showrosterlockunlocksingle(){
//   if(this.employeeId != 0 && this.actiontype=='single'){
//     this.getAttendanceDetail();
//     this.userAttendanceDetailService.setVisibilityrosterlockUnlock(true);
//   }else if(this.actiontype=='multiple'){
//     this.userAttendanceDetailService.setVisibilityrosterlockUnlock(true);
//   }
//   else if(this.employeeId == 0){
//     this.notificationService.showError(this.message, UI_CONSTANT.SEVERITY.ERROR);
//   }
// }
// showShiftsignle(){
//   if(this.employeeId != 0 && this.actiontype=='single'){
//     this.getAttendanceDetail();
//     this.userAttendanceDetailService.setVisibilityshift(true);
//   }else if(this.actiontype=='multiple'){
//     this.userAttendanceDetailService.setVisibilityshift(true);
//   }
//   else if(this.employeeId == 0){
//     this.notificationService.showError(this.message, UI_CONSTANT.SEVERITY.ERROR);
//   }
// }
// showBackDataProcess(){
//   if(this.employeeId != 0 && this.actiontype=='single'){
//     this.getAttendanceDetail();
//     this.userAttendanceDetailService.setVisibilitybackData(true);
//   }
//   else if(this.actiontype=='multiple'){
//     this.userAttendanceDetailService.setVisibilitybackData(true);
//   }
//   else if(this.employeeId == 0){
//     this.notificationService.showError(this.message, UI_CONSTANT.SEVERITY.ERROR);
//   }
// }
showVerificationDialog(){
  this.userAttendanceDetailService.setVerificationPopupVisibility(true);
}
CancelVerificationRequest(){
  this.userAttendanceDetailService.setVerificationPopupVisibility(false);
}

CancelLateEarlyDeduction()
{
  this.userAttendanceDetailService.setLateEarlyDeductionPopupVisibility(false);
}

submitVerification(){
  var monthyear = '01-' + this.month + '-' + this.year;
  var monthyearDateString = moment(monthyear, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DDTHH:mm:ss");
  if(this.employeeId != 0 && this.showingSingleEmployeeAction){
    this.userAttendanceDetailService.SubmitVerificationProcess(this.employeeId,monthyearDateString, monthyearDateString);
  }
  else if(!this.showingSingleEmployeeAction){
    this.userAttendanceDetailService.SubmitVerificationProcess(0,monthyearDateString, monthyearDateString);
  }
  else if(this.employeeId == 0){
    this.notificationService.showError(this.message, UI_CONSTANT.SEVERITY.ERROR);
  }
}

submitLateEarlyDeduction()
{
  var processFlag='S'
  var processFlags='M'
  var monthyears = '01-' + this.month + '-' + this.year;
  var monthyearDateStrings = moment(monthyears, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DDTHH:mm:ss"); 
  if(this.employeeId != 0 && this.showingSingleEmployeeAction){
    this.userAttendanceDetailService.submitLateDeductionProcess(this.employeeId,monthyearDateStrings,monthyearDateStrings,processFlag);
  }
  else if(!this.showingSingleEmployeeAction){
    this.userAttendanceDetailService.submitLateDeductionProcess(0,monthyearDateStrings, monthyearDateStrings,processFlags);
  }
  else if(this.employeeId == 0){ 
    this.notificationService.showError(this.message, UI_CONSTANT.SEVERITY.ERROR);
  }
  this.lateEarlyDeductionDialogDiv=false;
}



CancelgatePass()
{
  this.userAttendanceDetailService.setVisibilitygatePassData(false);
  this.gatepassDetaildiv=false;
}
// showGatepasssingle(){
//   if(this.employeeId != 0){
//     //this.getAttendanceDetail();
//     this.userAttendanceDetailService.setVisibilitygatePassData(true); 
//   }
//   else{
  
//     this.notificationService.showError(this.message, UI_CONSTANT.SEVERITY.ERROR);
//   }
// }
CancelLeaveRequest()
{
  this.userAttendanceDetailService.setVisibilityLeaveRequestData(false);
  this.LeaveRequsetDetaildiv=false;
}
// showLeaverequestsingle(){
//   if(this.employeeId != 0){
//     this.getAttendanceDetail();
//     this.userAttendanceDetailService.setVisibilityLeaveRequestData(true); 
//   }
//   else{
  
//     this.notificationService.showError(this.message, UI_CONSTANT.SEVERITY.ERROR);
//   }
// }
CancelrosterSinglediv(){
  this.userAttendanceDetailService.setVisibilityroster(false);
}
CancelmanualPunchSignlediv(){
  this.userAttendanceDetailService.setVisibilityManualSingle(false);
}
CancelmanualPunchMultidiv(){
  this.userAttendanceDetailService.setVisibilityManualMulti(false);
}
CancelrosterLockUlockForm(){
  this.userAttendanceDetailService.setVisibilityrosterlockUnlock(false);
}
Cancelshiftdiv(){
  this.userAttendanceDetailService.setVisibilityshift(false);
  }
CancelbackDatadiv(){
  this.userAttendanceDetailService.setVisibilitybackData(false);
}
cancelEssRequestmultidiv()
{
  this.userAttendanceDetailService.setVisibilityEssRequest(false);
}
recallAttDeatil(){
  setTimeout( ()=>{
    this.getAttendanceDetail();
    }, 1000)
  
}

recallBackDayDetail(){
  setTimeout( ()=>{
    this.getAttendanceDetail();
    setTimeout(() => {
      this.getAttendanceDetail();
    }, 2000);
    }, 2000)
}
 


getAttendancePolicyDetail(){
 
  if(this.employeeId != 0 && this.policyattId != 0){
    this.attendancemappingDetaildiv=true;
  }
  else if(this.employeeId ==0) {
    this.notificationService.showError('Please select Employee',UI_CONSTANT.SEVERITY.ERROR);
}
  else if(this.policyattId == 0){
    this.notificationService.showError('Policy Not Mapped For this Employee',UI_CONSTANT.SEVERITY.ERROR);
  }
}
getShiftPolicyDetail(){
  if(this.employeeId != 0 && this.policyshiftId!=0){
    this.shiftmappingDetaildiv=true;
  }
  else if(this.employeeId ==0) {
    this.notificationService.showError('Please select Employee',UI_CONSTANT.SEVERITY.ERROR);
}
  else if(this.policyshiftId == 0){
    this.notificationService.showError('Policy Not Mapped For this Employee',UI_CONSTANT.SEVERITY.ERROR);
  }
}
getHolidayPolicyDetail(){
  if(this.employeeId != 0 && this.policyholidayId!=0){
    this.holidaymappingDetaildiv=true;
    
  }else if(this.employeeId ==0) {
    this.notificationService.showError('Please select Employee',UI_CONSTANT.SEVERITY.ERROR);
}
  else if(this.policyholidayId == 0){
    this.notificationService.showError('Policy Not Mapped For this Employee',UI_CONSTANT.SEVERITY.ERROR);
  }
}
getLeavePolicyDetail(){
  if(this.employeeId != 0 && this.policyleaveId!=0){
    this.leavemappingDetaildiv=true;
  }else if(this.employeeId ==0) {
    this.notificationService.showError('Please select Employee',UI_CONSTANT.SEVERITY.ERROR);
}
  else if(this.policyleaveId == 0){
    this.notificationService.showError('Policy Not Mapped For this Employee',UI_CONSTANT.SEVERITY.ERROR);
  }
}
downloadAttendancePolicyDetail(){
 this.userAttendanceDetailService.fnDownloadAttendancePolicy();//.subscribe(res=>{
//   if(res){
//     console.log(res);
//     window.location.href = res;
//   }
//  });
}
downloadShiftPolicyDetail(){
  this.userAttendanceDetailService.fnDownloadAttendancePolicy();//.subscribe(res=>{
  //   if(res){
  //     console.log(res);
  //     window.location.href = res;
  //   }
  //  });
}
downloadHolidayPolicyDetail(){
  this.userAttendanceDetailService.fnDownloadHolidayPolicy();//.subscribe(res=>{
  //   if(res){
  //     console.log(res);
  //     window.location.href = res;
  //   }
  //  });
}
downloadLeavePolicyDetail(){
  this.userAttendanceDetailService.fnDownloadLeavePolicy();//.subscribe(res=>{
  //   if(res){
  //     console.log(res);
  //     window.location.href = res;
  //   }
  //  });
}
}
