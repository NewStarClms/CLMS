import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { AppCoreCommonService } from 'src/app/services/app.core-common.services';
import { AttendancePolicyMasterService } from 'src/app/services/attendance-policy-master.service';
import {  selectLeaveMasterState, selectShiftState } from 'src/app/store/app.state';
import { attendancepolicy,  LateEarlyDeductionPolicies,  LateEarlyDeductionPoliciesModel,  LeaveModel,  ShiftModel } from 'src/app/store/model/master-data.model';
import * as moment from 'moment';
import { NotificationService } from 'src/app/common/notification.service';

@Component({
  selector: 'app-add-edit-attendance-policy-master',
  templateUrl: './add-edit-attendance-policy-master.component.html',
  styleUrls: ['./add-edit-attendance-policy-master.component.scss']
})
export class AddEditAttendancePolicyMasterComponent implements OnInit {
  public attendancepolicyInfo:attendancepolicy={} as attendancepolicy;
  @Input() policyattID:number;
  public display:boolean = false;
  datepickerConfig : Partial<BsDatepickerConfig>;
  datePipe: DatePipe = new DatePipe('en-US');
  stateOptions=UI_CONSTANT.stateOptions;
  cutoffDaysList = UI_CONSTANT.cutoffDays;
  maxworkinghourbasedOnList = UI_CONSTANT.maxworkinghourbasedOn;
  otosSettingList = UI_CONSTANT.otosSetting;
  attendanceshifttypeList = UI_CONSTANT.ATTENDANCE_SHIFT_TYPE;
  public defaultShiftList:Array<any>=[];
  public defaultShiftForOWList:Array<any>=[];
  public weeklyOffList = UI_CONSTANT.WEEKLYOFFWEEK;
  public allowShiftList:Array<number>;
  public weeklyOffSunList:Array<number>;
  public weeklyOffMonList:Array<number>;
  public weeklyOffTueList:Array<number>;
  public weeklyOffThrList:Array<number>;
  public weeklyOffWedList:Array<number>;
  public weeklyOffFriList:Array<number>;
  public weeklyOffSatList:Array<number>;
  public divShifttype:boolean=false;
  public oTFormulaList = UI_CONSTANT.OTFORMULA;
  public otRoundFormulaList = UI_CONSTANT.OTROUNDFORMULA;
  public COFdivDetail:boolean=false;
  public allowCOFforList = UI_CONSTANT.ALLOWCOFFOR;
 public allowAutoShift:boolean=false;
  public labelName:string="Save";
public headerdialogName:string="Add Policy Master";
  activeState: any;
  public cofapplicablerequired:boolean=false;
  public punchInShiftList =  UI_CONSTANT.PUNCHINSHIFT;
  public overTimeRounddiv:boolean;
  public allowOTonHdiv:boolean;
  public allowOTonNHdiv:boolean;
  public allowOTonWOdiv:boolean;
  public allDisabledField:boolean=false;
  public isvisible:boolean=false;
  public showHideField:boolean;
  public policyBasedOnList=UI_CONSTANT.POLICY_BASED_ON_LIST;
  public deductFromList=UI_CONSTANT.DEDUCT_FORM_LIST;
  public deductValueList=UI_CONSTANT.DEDUCT_Value_LIST;
  public andORList=UI_CONSTANT.AND_OR_LIST;
  public attendanceStatusList=UI_CONSTANT.ATTENDANCE_STATUS_LIST;
  public leaveTypeList:Array<LeaveModel>=[];
  public leaveTypeListSection:Array<any>;
  public lateEarlyDeductionPoliciesList: Array<LateEarlyDeductionPolicies> = [];
  public lateEarlyDeductionPoliciesListModel: Array<LateEarlyDeductionPoliciesModel> = [];
  public lateEarlyDeductionPoliciesInfo: LateEarlyDeductionPolicies={} as LateEarlyDeductionPolicies;
  public hdnPTSlabCount:number=0;
  public leaveDeductionListed:Array<string>;
  public leaveData:string;
  public leaveDataCount:number=0;
  public hdnbonusSlabCount:number=0;
  public addbtndisabled:boolean;
  public numberOfPhotoList: Array<{ key: string; value: number}>=UI_CONSTANT.NUMBEROFPHOTO;
  public visible:boolean=false;
  
  constructor(private attendancePolicyMasterService:AttendancePolicyMasterService,
    private activatedRoute:ActivatedRoute,
    private _store: Store<any>,
    private router:Router,
    private corecommonServices :AppCoreCommonService,
    private notificationService :NotificationService
    ){
      this.datepickerConfig = Object.assign({},{ 
        containerClass:'theme-default',
        dateInputFormat:'DD-MMM-YYYY',
        adaptivePosition:true,
        initCurrentTime: false });
  }
  ngOnInit(): void {

    this.isvisible=false;
    this._store.select(selectLeaveMasterState).subscribe(res => {
      if (res && res.leavelList) {
        const templeaveTypeList: LeaveModel[] = AppUtil.deepCopy(res.leavelList);
        this.leaveTypeList = templeaveTypeList;
      }
    });


    let policyssid;
    //console.log(this.policyattID);
    if(this.policyattID==0 || this.policyattID==undefined){
      policyssid= this.activatedRoute.snapshot.params.id;
     this.allDisabledField=false;
    }else{
      policyssid = this.policyattID;
      this.allDisabledField=true;
    }
   
         if(policyssid != 0){
          console.log(policyssid);
          this.labelName="Update";
          this.headerdialogName="Update Policy Master";
          this.attendancePolicyMasterService.fetchAttendancePolicyMasterDetail(policyssid).subscribe(res =>{
            if(res){
              // console.log(res)
              this.attendancepolicyInfo= AppUtil.deepCopy(res);
              this.leaveDataCount=this.attendancepolicyInfo.lateEarlyDeductionPolicies.length;
              this.hdnbonusSlabCount = this.attendancepolicyInfo.lateEarlyDeductionPolicies.length;
              if(this.attendancepolicyInfo.allowShift != undefined){
                this.allowShiftList = this.attendancepolicyInfo.allowShift.split('~').map(i => Number(i));
              }
              //console.log(this.allowShiftList);
              this.weeklyOffSunList = this.attendancepolicyInfo.weeklyOffSun?.split('~').map(i => Number(i));
              this.weeklyOffMonList = this.attendancepolicyInfo.weeklyOffMon?.split('~').map(i => Number(i));
              this.weeklyOffTueList = this.attendancepolicyInfo.weeklyOffTue?.split('~').map(i => Number(i));
              this.weeklyOffWedList = this.attendancepolicyInfo.weeklyOffWed?.split('~').map(i => Number(i));
              this.weeklyOffThrList = this.attendancepolicyInfo.weeklyOffThr?.split('~').map(i => Number(i));
              this.weeklyOffFriList = this.attendancepolicyInfo.weeklyOffFri?.split('~').map(i => Number(i));
              this.weeklyOffSatList = this.attendancepolicyInfo.weeklyOffSat?.split('~').map(i => Number(i));
             this.basedOnOverTimeRound(this.attendancepolicyInfo.otRound);
             this.basedOnallowOTonWO(this.attendancepolicyInfo.allowOTOnWO);
             this.basedOnallowOTonNH(this.attendancepolicyInfo.allowOTOnNHLD);
             this.basedOnallowOTonH(this.attendancepolicyInfo.allowOTOnHLD);
             this.mobilePunchShowHide(this.attendancepolicyInfo.mobilePunch);
             if(policyssid != 0){
              this.lateEarlyDeductionPoliciesListModel=[];
             }
             if(this.lateEarlyDeductionPoliciesListModel.length==0)
             {
               this.attendancepolicyInfo.lateEarlyDeductionPolicies.map(item => {
                 this.showHideField=true;
                   this.lateEarlyDeductionPoliciesListModel.push({
                     policyID: this.attendancepolicyInfo.policyID,
                     policyBasedOnBased:item.policyBasedOnBased,
                     attendanceStatus: item.attendanceStatus,
                     eexemptDays:item.eexemptDays,
                     everyDays:item.everyDays,
                     deductFrom:item.deductFrom,
                     deductValue:item.deductValue,
                     leaveList: item.leaveList.split('~').map(i => Number(i)),
                     lateEarlyCondition: item.lateEarlyCondition,
                     lateFrom:item.lateFrom,
                     lateTo: item.lateTo,
                     earlyFrom: item.earlyFrom,
                     earlyTo: item.earlyTo,
                  });
                });
                this.leaveDataCount=this.attendancepolicyInfo.lateEarlyDeductionPolicies.length;
             }


              if(this.attendancepolicyInfo.applicableFrom!=null){
                this.attendancepolicyInfo.applicableFrom= moment(this.attendancepolicyInfo.applicableFrom,"YYYY-MM-DDTHH:mm:ss").format(UI_CONSTANT.SHORT_DATE_FORMAT);
              }
              if(this.attendancepolicyInfo.allowCof == false){
                this.COFdivDetail=false;
              }else if(this.attendancepolicyInfo.allowCof== true){
                this.COFdivDetail= true;
              }
              if(this.attendancepolicyInfo.autoShift == false){
                this.allowAutoShift=false;
              }else if(this.attendancepolicyInfo.autoShift == true){
                this.allowAutoShift= true;
              }
               this.fnshiftType(this.attendancepolicyInfo.shiftType);
              //let shift = this.attendancepolicyInfo.allowShift.split('~').map(i => i);
              // //console.log(shift);
            }
            });
        }else{
          this.setDefaultvalue();
          this.basedOnOverTimeRound(false);
          this.basedOnallowOTonWO(true);
          this.basedOnallowOTonNH(true);
          this.basedOnallowOTonH(true);
          this.mobilePunchShowHide(true);
        }
       
        this._store.select(selectShiftState).subscribe(res =>{
          if(res && res.shiftList)  {
            const temporgnaizationList: ShiftModel[] = AppUtil.deepCopy(res.shiftList);
            temporgnaizationList.map(x => {
              this.defaultShiftList.push({
                value: x.shiftID,
                key: x.shiftName
              });
              this.defaultShiftForOWList.push({
                shiftID: x.shiftID,
                shiftName: x.shiftName
              });
            });
          }
         });
  }

  public _visible:boolean=false;
  mobilePunchShowHide(params)
  {
    if(params==true)
    {
      this._visible=true;
    }
    else{
      this._visible=false;
     // this.attendancepolicyInfo.numberOfPhoto=0;
     // this.attendancepolicyInfo.geoRadius=0;
    }
  }


  SaveAttendancePolicyMasterData(){
    //console.log(this.allowShiftList)
    if(this.attendancepolicyInfo.applicableFrom!=null){
      this.attendancepolicyInfo.applicableFrom= moment(this.attendancepolicyInfo.applicableFrom, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DDTHH:mm:ss");
    }
    if(this.allowShiftList != undefined){
      this.attendancepolicyInfo.allowShift = this.allowShiftList.map(value => value).join('~');
      
      }
      //console.log(this.attendancepolicyInfo.autoShift)
      
    if(this.weeklyOffSunList != undefined){
      this.attendancepolicyInfo.weeklyOffSun = this.weeklyOffSunList.map( value  => value).join('~');
      }
  
    if(this.weeklyOffMonList != undefined){
      this.attendancepolicyInfo.weeklyOffMon = this.weeklyOffMonList.map( value  => value).join('~');
      }
      if(this.weeklyOffTueList != undefined){
        this.attendancepolicyInfo.weeklyOffTue = this.weeklyOffTueList.map( value  => value).join('~');
        }
    if(this.weeklyOffWedList != undefined){
      this.attendancepolicyInfo.weeklyOffWed = this.weeklyOffWedList.map( value  => value).join('~');
      }
    if(this.weeklyOffThrList != undefined){
      this.attendancepolicyInfo.weeklyOffThr = this.weeklyOffThrList.map( value  => value).join('~');
      }
    if(this.weeklyOffFriList != undefined){
      this.attendancepolicyInfo.weeklyOffFri = this.weeklyOffFriList.map( value => value).join('~');
      }
    if(this.weeklyOffSatList != undefined){
      this.attendancepolicyInfo.weeklyOffSat = this.weeklyOffSatList.map( value  => value).join('~');
      }
      if(this.attendancepolicyInfo.allowCof==false){
        this.setcofDefaultvalue();
      }
      if(this.attendancepolicyInfo.autoShift == false){
        this.setShiftDefaultvalue();
      }

      this.lateEarlyDeductionPoliciesListModel.map(item => {
        this.lateEarlyDeductionPoliciesList.push({
              policyID: this.attendancepolicyInfo.policyID,
              policyBasedOnBased:item.policyBasedOnBased,
              attendanceStatus: item.attendanceStatus,
              eexemptDays:item.eexemptDays,
              everyDays:item.everyDays,
              deductFrom:item.deductFrom,
              deductValue:item.deductValue,
              leaveList: item.leaveList.join("~"),
              lateEarlyCondition: item.lateEarlyCondition,
              lateFrom:item.lateFrom,
              lateTo: item.lateTo,
              earlyFrom: item.earlyFrom,
              earlyTo: item.earlyTo,
           });
        })
      this.attendancepolicyInfo.lateEarlyDeductionPolicies=this.lateEarlyDeductionPoliciesList;
    if(this.attendancepolicyInfo.policyID > 0){
      this.attendancepolicyInfo.lateEarlyDeductionPolicies=this.lateEarlyDeductionPoliciesList;
      //console.log('attendance Policy',this.attendancepolicyInfo);
      this.attendancePolicyMasterService.updateStateOfCell(this.attendancepolicyInfo);
    } else{
      this.attendancePolicyMasterService.saveAttendancePolicyMaster(this.attendancepolicyInfo);
    }
  }
  CancelattendancepolicyMasterData(){
   this.attendancepolicyInfo = {} as attendancepolicy;
    this.router.navigate(['/time-office/attendance-policy/']);
  }
onTabClose(event) {}
onTabOpen(event) {}
toggle(index: number) {
    this.activeState[index] = !this.activeState[index];
}
keyPressAlphanumeric(event) {
  AppUtil.validateAlphanumeric(event);
}
keyPressNumeric(event) {
  AppUtil.validateNumbers(event);
}
keyPressNumbersWithDecimal(event){
  AppUtil.validateNumbersWithDecimal(event);
}
basedOnModeofTrackCOF(event){
  if(event.value == false){
    this.COFdivDetail=false;
    this.cofapplicablerequired=false;
    this.setcofDefaultvalue();
  }else if(event.value == true){
    this.COFdivDetail= true;
    this.cofapplicablerequired=true;
  }
}
fnshiftType(event){
  if(event == 'R'){
    this.divShifttype=true;
  }else{
    this.divShifttype=false;
  }
}
basedOnModeofTrackallowAutoShift(event){
  if(event.value == false){
    this.allowAutoShift=false;
    this.setShiftDefaultvalue();
  }else if(event.value == true){
    this.allowAutoShift= true;
  }
}
getduplicateCheckMinuteTime(event){
  this.attendancepolicyInfo.duplicateCheckMinute=moment(this.attendancepolicyInfo.duplicateCheckMinute, UI_CONSTANT.LONG_DATE_FORMAT).format("HH:mm");
}
getearlyMinuteAutoShiftTime(event){
  this.attendancepolicyInfo.earlyMinuteAutoShift=moment(this.attendancepolicyInfo.earlyMinuteAutoShift, UI_CONSTANT.LONG_DATE_FORMAT).format("HH:mm");
}
getlateMinuteAutoShiftTime(event){
  this.attendancepolicyInfo.lateMinuteAutoShift=moment(this.attendancepolicyInfo.lateMinuteAutoShift, UI_CONSTANT.LONG_DATE_FORMAT).format("HH:mm");
}
getendTimeForInPunchTime(event){
  this.attendancepolicyInfo.endTimeForInPunch=moment(this.attendancepolicyInfo.endTimeForInPunch, UI_CONSTANT.LONG_DATE_FORMAT).format("HH:mm");
}  
getendTimeForOutPunchTime(event){
  this.attendancepolicyInfo.endTimeForOutPunch=moment(this.attendancepolicyInfo.endTimeForOutPunch, UI_CONSTANT.LONG_DATE_FORMAT).format("HH:mm");
}
getdeductOTOnHLDTime(event){
  this.attendancepolicyInfo.deductOTOnHLD=moment(this.attendancepolicyInfo.deductOTOnHLD, UI_CONSTANT.LONG_DATE_FORMAT).format("HH:mm");
}
getmaxOTOnHLDTime(event){
  this.attendancepolicyInfo.maxOTOnHLD=moment(this.attendancepolicyInfo.maxOTOnHLD, UI_CONSTANT.LONG_DATE_FORMAT).format("HH:mm");
}
getdeductOTOnWOTime(event){
  this.attendancepolicyInfo.deductOTOnWO=moment(this.attendancepolicyInfo.deductOTOnWO, UI_CONSTANT.LONG_DATE_FORMAT).format("HH:mm");
}
getmaxLateGoingForOTTime(event){
  this.attendancepolicyInfo.maxLateGoingForOT=moment(this.attendancepolicyInfo.maxLateGoingForOT, UI_CONSTANT.LONG_DATE_FORMAT).format("HH:mm");
}
getdeductOTOnNHLDTime(event){
  this.attendancepolicyInfo.deductOTOnNHLD=moment(this.attendancepolicyInfo.deductOTOnNHLD, UI_CONSTANT.LONG_DATE_FORMAT).format("HH:mm");
}  
getmaxOTOnNHLDTime(event){
  this.attendancepolicyInfo.maxOTOnNHLD=moment(this.attendancepolicyInfo.maxOTOnNHLD, UI_CONSTANT.LONG_DATE_FORMAT).format("HH:mm");
}
getminEarlyComingForOTTime(event){
  this.attendancepolicyInfo.minEarlyComingForOT=moment(this.attendancepolicyInfo.minEarlyComingForOT, UI_CONSTANT.LONG_DATE_FORMAT).format("HH:mm");
}   
getmaxEarlyComingForOTTime(event){
  this.attendancepolicyInfo.maxEarlyComingForOT=moment(this.attendancepolicyInfo.maxEarlyComingForOT, UI_CONSTANT.LONG_DATE_FORMAT).format("HH:mm");
} 
getminLateGoingForOTTime(event){
  this.attendancepolicyInfo.minLateGoingForOT=moment(this.attendancepolicyInfo.minLateGoingForOT, UI_CONSTANT.LONG_DATE_FORMAT).format("HH:mm");
} 
getmaxWorkingHoursTime(event){
  this.attendancepolicyInfo.maxWorkingHours=moment(this.attendancepolicyInfo.maxWorkingHours, UI_CONSTANT.LONG_DATE_FORMAT).format("HH:mm");
} 
getmaximumGatePassDurationTime(event){
  this.attendancepolicyInfo.maximumGatePassDuration=moment(this.attendancepolicyInfo.maximumGatePassDuration, UI_CONSTANT.LONG_DATE_FORMAT).format("HH:mm");
}  
getminimumGatePassDurationTime(event){
  this.attendancepolicyInfo.minimumGatePassDuration=moment(this.attendancepolicyInfo.minimumGatePassDuration, UI_CONSTANT.LONG_DATE_FORMAT).format("HH:mm");
}
getmaximumGatePassDurationInMonthTime(event){
  this.attendancepolicyInfo.maximumGatePassDurationInMonth=moment(this.attendancepolicyInfo.maximumGatePassDurationInMonth, UI_CONSTANT.LONG_DATE_FORMAT).format("HH:mm");
}  
getmaxOTOnWOTime(event){
  this.attendancepolicyInfo.maxOTOnWO=moment(this.attendancepolicyInfo.maxOTOnWO, UI_CONSTANT.LONG_DATE_FORMAT).format("HH:mm");
}  
getminHoursForFullCofTime(event){
  this.attendancepolicyInfo.minHoursForFullCof=moment(this.attendancepolicyInfo.minHoursForFullCof, UI_CONSTANT.LONG_DATE_FORMAT).format("HH:mm");
}
getminHoursForHalfCofTime(event){
  this.attendancepolicyInfo.minHoursForHalfCof=moment(this.attendancepolicyInfo.minHoursForHalfCof, UI_CONSTANT.LONG_DATE_FORMAT).format("HH:mm");
}
setDefaultvalue(){
    this.attendancepolicyInfo.policyID= 0,
    this.attendancepolicyInfo.policyTypeID= 1,
    this.attendancepolicyInfo.attendancePolicyID= 0,
    this.attendancepolicyInfo.cutOffDay= 0,
    this.attendancepolicyInfo.isOptimistic= true,
    this.attendancepolicyInfo.maxBackDaysAR= 0,
    this.attendancepolicyInfo.maxCountInMonthAR= 0,
    this.attendancepolicyInfo.awAasAAA= false,
    this.attendancepolicyInfo.ahAasAAA= false,
    this.attendancepolicyInfo.minDayToHoliDayAsPaid= 0,
    this.attendancepolicyInfo.minDayToWeeklyOfAsPaid= 0,
    this.attendancepolicyInfo.maxWorkingHours= "00:00",
    this.attendancepolicyInfo.maxWorkingBasedOn= "P",
    this.attendancepolicyInfo.punchInShift= 0,
    this.attendancepolicyInfo.halfDayMarking= true,
    this.attendancepolicyInfo.srtMarking= true,
    this.attendancepolicyInfo.otosSetting= "O",
    this.attendancepolicyInfo.considerOutWork= false,
    this.attendancepolicyInfo.deductOutWork= false,
    this.attendancepolicyInfo.presentOnWeeklyOff= false,
    this.attendancepolicyInfo.presentOnHoliday= false,
    this.attendancepolicyInfo.missPunchAsAbsent= false,
    this.attendancepolicyInfo.missPunchAsHalfDay= false,
    this.attendancepolicyInfo.roundTheClockWorking= false,
    this.attendancepolicyInfo.workingWithInOutMode= false,
    this.attendancepolicyInfo.workingHoursStartFromShiftStart= false,
    this.attendancepolicyInfo.workingHoursEndOnShiftEnd= false,
    this.attendancepolicyInfo.workingHoursRound= 0,
    this.attendancepolicyInfo.statusBasedOnWorkingHoursInShift= false,
    this.attendancepolicyInfo.gatePassCountInDay= 0,
    this.attendancepolicyInfo.maximumGatePassDuration= "00:00",
    this.attendancepolicyInfo.minimumGatePassDuration= "00:00",
    this.attendancepolicyInfo.gatePassCountMonth= 0,
    this.attendancepolicyInfo.maximumGatePassDurationInMonth= "00:00",
    this.attendancepolicyInfo.allowExceptionForGatePass= false,
    this.attendancepolicyInfo.backDayGatePassAllow= false,
    this.attendancepolicyInfo.maxBackDayGatePass= 0,
    this.attendancepolicyInfo.duplicateCheckMinute= "00:00",
    this.attendancepolicyInfo.endTimeForInPunch= "05:00",
    this.attendancepolicyInfo.endTimeForOutPunch= "05:01",
    this.attendancepolicyInfo.allowMaxWorkingHoursInMultiplePunch= false,
    this.attendancepolicyInfo.fourPunchInNightShift= false,
    this.attendancepolicyInfo.shiftType= "string",
    this.attendancepolicyInfo.defaultShiftId= 0,
    this.attendancepolicyInfo.allowShift= null,
    this.attendancepolicyInfo.autoShift= false,
    this.attendancepolicyInfo.earlyMinuteAutoShift= "00:00",
    this.attendancepolicyInfo.lateMinuteAutoShift= "00:00",
    this.attendancepolicyInfo.woIncludeInRotation= false,
    this.attendancepolicyInfo.hldIncludeInRotation= false,
    this.attendancepolicyInfo.shiftRotationDays= 0,
    this.attendancepolicyInfo.allowShiftOnWO= false,
    this.attendancepolicyInfo.defaultShiftOnWO= 0,
    this.attendancepolicyInfo.weeklyOffSun= "0",
    this.attendancepolicyInfo.weeklyOffMon= "0",
    this.attendancepolicyInfo.weeklyOffTue= "0",
    this.attendancepolicyInfo.weeklyOffWed= "0",
    this.attendancepolicyInfo.weeklyOffThr= "0",
    this.attendancepolicyInfo.weeklyOffFri= "0",
    this.attendancepolicyInfo.weeklyOffSat= "0",
    this.attendancepolicyInfo.otFormula= 2,
    this.attendancepolicyInfo.otInMinus= false,
    this.attendancepolicyInfo.allowOTOnHLD= true,
    this.attendancepolicyInfo.deductOTOnHLD= "00:00",
    this.attendancepolicyInfo.maxOTOnHLD= "00:00",
    this.attendancepolicyInfo.allowOTOnWO= true,
    this.attendancepolicyInfo.deductOTOnWO= "00:00",
    this.attendancepolicyInfo.maxOTOnWO= "00:00",
    this.attendancepolicyInfo.allowOTOnNHLD= true,
    this.attendancepolicyInfo.deductOTOnNHLD= "00:00",
    this.attendancepolicyInfo.maxOTOnNHLD= "00:00",
    this.attendancepolicyInfo.minEarlyComingForOT= "00:00",
    this.attendancepolicyInfo.maxEarlyComingForOT= "00:00",
    this.attendancepolicyInfo.minLateGoingForOT= "00:00",
    this.attendancepolicyInfo.maxLateGoingForOT= "00:00",
    this.attendancepolicyInfo.otRound= false,
    this.attendancepolicyInfo.otRoundFormula= 0,
    this.attendancepolicyInfo.roundValue1= 0,
    this.attendancepolicyInfo.roundValue2= 0,
    this.attendancepolicyInfo.secondHalfPresentAndRestOT= false,
    this.attendancepolicyInfo.adminApprovalRequiredForOT= false,
    this.attendancepolicyInfo.managerApprovalRequiredForOT= false,
    this.attendancepolicyInfo.allowWorkFlowAprovalForOT= false,
    this.attendancepolicyInfo.autoInitiateRequestForOT= false,
    this.attendancepolicyInfo.allowCof= false,
    this.attendancepolicyInfo.allowCofFor= "N",
    this.attendancepolicyInfo.minHoursForFullCof= "00:00",
    this.attendancepolicyInfo.minHoursForHalfCof= "00:00",
    this.attendancepolicyInfo.cofExpiredDays= '0',
    this.attendancepolicyInfo.workingDaysCof= false,
    this.attendancepolicyInfo.weeklyOffCof= false,
    this.attendancepolicyInfo.holidayCof= false,
    this.attendancepolicyInfo.nationalHolidayCof= false,
    this.attendancepolicyInfo.autoCredit= false,
    this.attendancepolicyInfo.maxCreditInMonth= 0,
    this.attendancepolicyInfo.adminApprovalRequiredForCof= false,
    this.attendancepolicyInfo.managerApprovalRequiredForCof= true,
    this.attendancepolicyInfo.applicableFrom= null,
    this.attendancepolicyInfo.workingHoursAccordingToShift= false,
    this.attendancepolicyInfo.generateMultiple= false,
    this.attendancepolicyInfo.lateEarlyDeductionApplicable= false,
    this.attendancepolicyInfo.autoRunLateEarlyDeduction= false
    this.weeklyOffSunList = this.attendancepolicyInfo.weeklyOffSun?.split('~').map(i => Number(i));
    this.weeklyOffMonList = this.attendancepolicyInfo.weeklyOffMon?.split('~').map(i => Number(i));
    this.weeklyOffTueList = this.attendancepolicyInfo.weeklyOffTue?.split('~').map(i => Number(i));
    this.weeklyOffWedList = this.attendancepolicyInfo.weeklyOffWed?.split('~').map(i => Number(i));
    this.weeklyOffThrList = this.attendancepolicyInfo.weeklyOffThr?.split('~').map(i => Number(i));
    this.weeklyOffFriList = this.attendancepolicyInfo.weeklyOffFri?.split('~').map(i => Number(i));
    this.weeklyOffSatList = this.attendancepolicyInfo.weeklyOffSat?.split('~').map(i => Number(i));
}
setShiftDefaultvalue(){
  this.attendancepolicyInfo.allowShift=null;
  this.attendancepolicyInfo.earlyMinuteAutoShift='00:00';
  this.attendancepolicyInfo.lateMinuteAutoShift='00:00';
}
basedOnOverTimeRound(event){
  if(event==true){
    this.overTimeRounddiv=true;
  }else{
    this.overTimeRounddiv=false;
  }
}
basedOnallowOTonWO(event){
  if(event==true){
    this.allowOTonWOdiv=true;
  }else{
    this.allowOTonWOdiv=false;
  }
}
basedOnallowOTonNH(event){
  if(event==true){
    this.allowOTonNHdiv=true;
  }else{
    this.allowOTonNHdiv=false;
  }
}
basedOnallowOTonH(event){
  if(event==true){
    this.allowOTonHdiv=true;
  }else{
    this.allowOTonHdiv=false;
  }
}
setcofDefaultvalue(){
  this.attendancepolicyInfo.allowCof= false,
  this.attendancepolicyInfo.allowCofFor= "N",
  this.attendancepolicyInfo.minHoursForFullCof= "00:00",
  this.attendancepolicyInfo.minHoursForHalfCof= "00:00",
  this.attendancepolicyInfo.cofExpiredDays= '0',
  this.attendancepolicyInfo.workingDaysCof= false,
  this.attendancepolicyInfo.weeklyOffCof= false,
  this.attendancepolicyInfo.holidayCof= false,
  this.attendancepolicyInfo.nationalHolidayCof= false,
  this.attendancepolicyInfo.autoCredit= false,
  this.attendancepolicyInfo.maxCreditInMonth= 0,
  this.attendancepolicyInfo.adminApprovalRequiredForCof= false,
  this.attendancepolicyInfo.managerApprovalRequiredForCof= true,
  this.attendancepolicyInfo.applicableFrom= null,
  this.attendancepolicyInfo.workingHoursAccordingToShift= false,
  this.attendancepolicyInfo.generateMultiple= false
}

showHide(event)
 {
 var policyssid
  console.log(event);
  if(event===true)
  {
   this.showHideField=true;
   if(this.hdnbonusSlabCount == 1){
    this.hdnbonusSlabCount= this.hdnbonusSlabCount + 1;
    this.lateEarlyDeductionPoliciesListModel.push({policyID:0,policyBasedOnBased:"",attendanceStatus: "",eexemptDays: 0,everyDays:0,deductFrom:"",deductValue:0,leaveList: [],lateEarlyCondition: "",lateFrom: 0,lateTo: 0,earlyFrom: 0,earlyTo: 0});
  }

  else{
    var policyssid= this.activatedRoute.snapshot.params.id;
      if(policyssid ==0)
      {
        this.hdnbonusSlabCount= this.hdnbonusSlabCount + 1;
        this.lateEarlyDeductionPoliciesListModel.push({policyID:0,policyBasedOnBased:"",attendanceStatus: "",eexemptDays: 0,everyDays:0,deductFrom:"",deductValue:0,leaveList: [],lateEarlyCondition: "",lateFrom: 0,lateTo: 0,earlyFrom: 0,earlyTo: 0});
      }
    }
   }
  else{
    this.showHideField=false;
  }
}
addFiledData(){
  if(this.hdnbonusSlabCount >= 5){
    this.addbtndisabled=true;
    this.notificationService.showError("You Can Add Maximum 5 LeaveEarlyDeductionPolicies", UI_CONSTANT.SEVERITY.ERROR);
  }
  else{
    this.addbtndisabled=false;
    this.hdnbonusSlabCount= this.hdnbonusSlabCount + 1;
    this.lateEarlyDeductionPoliciesListModel.push({policyID:0,policyBasedOnBased:"",attendanceStatus: "",eexemptDays: 0,everyDays:0,deductFrom:"",deductValue:0,leaveList: [],lateEarlyCondition: "",lateFrom: 0,lateTo: 0,earlyFrom: 0,earlyTo: 0});
  }
}
public removebtndisabled:boolean;
removeFiledData(){
  if(this.hdnbonusSlabCount == 0){
    this.removebtndisabled=true;
    this.notificationService.showError("This is default row it could not be deleted", UI_CONSTANT.SEVERITY.ERROR);
  }else{
    this.removebtndisabled=false;
    this.lateEarlyDeductionPoliciesListModel.splice(this.hdnbonusSlabCount,1);
    this.hdnbonusSlabCount= this.hdnbonusSlabCount - 1;

  }
}
removeFiledData1(){
     this.removebtndisabled=false;
     this.lateEarlyDeductionPoliciesListModel.splice(this.hdnbonusSlabCount,1);
     this.hdnbonusSlabCount= this.hdnbonusSlabCount - 1;
}
// End

}
