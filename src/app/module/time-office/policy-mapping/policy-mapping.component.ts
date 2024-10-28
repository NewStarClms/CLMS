import { ChangeDetectionStrategy, Component, Input, OnInit, SimpleChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AppUtil } from 'src/app/common/app-util';
import { leaveCodeMappingModel, LeaveModel,  ShiftMappedData,  } from '../../../store/model/master-data.model';
import {  selectEmployeeMasterState, selectLeaveMasterState } from '../../../store/app.state';
import { Store } from '@ngrx/store';
import { UI_CONSTANT } from '../../../common/constants/ui-constants';
import * as moment from 'moment';
import { Accordion } from 'primeng/accordion';
import { LeavePolicyService } from 'src/app/services/leave-policy.service';
import { EmployeeMaster } from 'src/app/store/model/employee.model';
import { NotificationService } from 'src/app/common/notification.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-policy-mapping',
  templateUrl: './policy-mapping.component.html',
  styleUrls: ['./policy-mapping.component.scss']
})
export class PolicyMappingComponent implements OnInit {
  rowData: any;
  labelName = "Save";
  isActive = false;
  readonly UICONSTANT = UI_CONSTANT;
  mappedPolicyList: Array<LeaveModel> = [];
  policyList: Array<LeaveModel> = [];
  mappedPolicyOption: Array<{ label: string, value: number, isActive: boolean, mapped:boolean,isActiveShow:boolean }> = [];
  selectedMappedShift: Array<any> = [];
  stateOptions = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
  shiftTypeOption: Array<{ key: number; value: string; }> = UI_CONSTANT.SHIFT_TYPE;
  leaveDetailsForUI: Array<leaveCodeMappingModel> = [];
  leavePolicyTypeID: number = 0;
  leavePolicyID: number = 0;
  displayshiftMap: boolean;
  leaveTypeOption: Array<{ key: string; value: string }> = UI_CONSTANT.LEAVE_TYPE;
  leaveCycleOption: Array<{ key: string; value: string }> = UI_CONSTANT.LEAVE_CYCLE;
  genderOption: Array<{ key: string; value: string }> = UI_CONSTANT.GENDER;
  leaveMappedOption: Array<{ key: string; value: string }> = UI_CONSTANT.LEAVE_MAPPED;
  accrualTypeOption:  Array<{ key: string; value: string }> = UI_CONSTANT.LEAVE_ACCRUAL_TYPE;
  accrualOnOption: Array<{ key: string; value: string }> = UI_CONSTANT.LEAVE_ACCRUAL_ON;
  roundLeaveOption: Array<{ key: string; value: string }> =  UI_CONSTANT.LEAVE_ROUND_LEAVE;
  accrualIncludeDaysOption: Array<{ key: string; value: string }> =  UI_CONSTANT.ACCRUAL_DAYS_INCLUDE;
  accrualOnJoiningRuleOption: Array<{ key: string; value: string }> = UI_CONSTANT.ACCRUAL_JOINING_RULE;
  accrualOnDateOption: Array<{ key: string; value: string }> =[];
  leaveNotClubListHalfDays = UI_CONSTANT.LEAVE_NOT_CLUB_LIST_HALFDAY;
  leaveNotClubLists = UI_CONSTANT.LEAVE_NOT_CLUB_LIST;
  public leaveNotClubListed:Array<number>;
  public leaveNotClubListOnlyHalfDay:Array<number>;
  employeeStatusallowedList: Array<any> = [];
  employeeTypeList : Array<any> = [];
  public empStatusAllowList:Array<number>;
  public empTypeAllowedList:Array<number>;
  @ViewChild('accordion') accordion: Accordion;
  leaveDetails: leaveCodeMappingModel = {} as leaveCodeMappingModel;
  leaveDetailsUI: LeaveModel[];
  public policyName:string;
  activeIndex:number=0;
// New Changes
  public empTypeListOption:Array<any>=[];
  public empStatusListOption:Array<any>=[];
  public leaveNotClubListOption:Array<any>=[];
// End
  constructor(
    private leavePolicyService: LeavePolicyService,
    private _store: Store,
    private ref: ChangeDetectorRef,
    private notificationService: NotificationService
  ) { }
  @Input() policyID: number;
  @Input() policyTypeID: number;
  @Input() shiftMappedData: Array<ShiftMappedData>;
  @Input() PolicyMethode:string;
  public allDisabledField:boolean=false;
  public isActiveShow:boolean;
  ngOnInit(): void {


       //New  Changes
       this._store.select(selectEmployeeMasterState).subscribe(response=>
        {
          if (response && response.employeeMasterList) {
            const tempempStatusList: EmployeeMaster[] = AppUtil.deepCopy(response.employeeMasterList.employeeStatus);
            this.empStatusListOption=tempempStatusList;
           
            const tempempTypeList: EmployeeMaster[] = AppUtil.deepCopy(response.employeeMasterList.employeeType);
            this.empTypeListOption=tempempTypeList;
          }
        });
        this.leaveNotClubListOption=UI_CONSTANT.LEAVE_NOT_CLUB_LIST;
        // End



    if(this.PolicyMethode=="selfServiceTimeOffice"){
    this.allDisabledField=true;
   // this.leavePolicyID = 83 //this.policyID;
    this.leavePolicyID =this.policyID;
     this.leavePolicyTypeID = this.policyTypeID;
    this.leavePolicyService.fetchPolicyDetail(this.leavePolicyID).subscribe(res=>{
      if(res.policy){
        this.policyName = res.policy.policyName;
      }
    });
     this.selectedMappedShift = [];
     
     this._store.select(selectLeaveMasterState).subscribe(response => {
       if (response && response.leavelList) {
         this.policyList = response.leavelList;
         this.policyList.map(p=>{
           this.mappedPolicyOption.push({
             label:p.leaveCode,
             value: p.leaveID,
             isActive: false,
             mapped:false,
             isActiveShow:false
           });
         })
       }
     });
     if(this.mappedPolicyOption){
      
      this.leavePolicyService.fetchMappedLeavePolicyData(this.leavePolicyID).subscribe(res =>{
        if(res && res.mappings){
          this.mappedPolicyList = AppUtil.deepCopy(res.mappings);
          this.mappedPolicyList.forEach(leave=>{
            const indx = this.mappedPolicyOption.findIndex(x=> x.label.trim() === leave.leaveCode.trim() && leave.mapped===true);
            if(leave.mapped)
               this.selectedMappedShift.push(leave.leaveID);
            if(indx >=0){
              this.mappedPolicyOption[indx].mapped = true;
            }
          });
          
          this.mappedPolicyOption = this.mappedPolicyOption.filter(l => l.mapped !==false)
        }
        this.mappedPolicyOption.forEach(x => {
            let leavePolicyDefaultData: LeaveModel = this.mappedPolicyList.filter(k=>k.leaveID === x.value)[0];
            
            if(leavePolicyDefaultData.applicableOnEmployeeStatus)
            {
              leavePolicyDefaultData.employeeStatusAllowedSel=leavePolicyDefaultData.employeeStatusAllowed.split('~').map(i => Number(i));
            }
            if(leavePolicyDefaultData.applicableOnEmployeeType)
            {
              leavePolicyDefaultData.employeeTypeAllowedSel=leavePolicyDefaultData.employeeTypeAllowed.split('~').map(i => Number(i));
            }
            if(leavePolicyDefaultData.leaveNotClubHalfDay)
            {
              leavePolicyDefaultData.leaveNotClubListHalfDaySel=leavePolicyDefaultData.leaveNotClubListHalfDay.split('~').map(i => Number(i));
            }
            if(leavePolicyDefaultData.leaveNotClub)
            {
              leavePolicyDefaultData.leaveNotClubListSel=leavePolicyDefaultData.leaveNotClubList.split('~').map(i => Number(i));
             }
             if(leavePolicyDefaultData.accrualDaysInclude)
             {
               leavePolicyDefaultData.accrualDaysIncludeSel=leavePolicyDefaultData.accrualDaysInclude.split('~').map(i => String(i));
              }
         
            this.leaveDetailsForUI.push(AppUtil.deepCopy(leavePolicyDefaultData));
            
        });
        this.isActive = true;
      });
     }
    }else{
      this.allDisabledField=false;
    }
        //New Changes 02/01/2023
        for(let i=1 ; i<=31 ; i++){
          this.accrualOnDateOption.push({key: i.toString(), value:i.toString()});
        }
        //
        this._store.select(selectEmployeeMasterState).subscribe(response => {
          if (response && response.employeeMasterList) {
        const tempempStatusList: EmployeeMaster[] = AppUtil.deepCopy(response.employeeMasterList.employeeStatus);
        this.employeeStatusallowedList = tempempStatusList;
        
        const tempempTypeList: EmployeeMaster[] = AppUtil.deepCopy(response.employeeMasterList.employeeType);
          this.employeeTypeList = tempempTypeList;
          
      }
    });
    this.leavePolicyID
}
  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }
  applyFilterGlobal($event: any) {
    return $event.target.value;
  }
  public isMappedShift(id){
    const isacti = (this.selectedMappedShift.indexOf(id) >= 0 )? true : false;
    console.log('isacti',id,isacti,this.selectedMappedShift.indexOf(id),this.selectedMappedShift);
    return isacti; //(this.selectedMappedShift && this.selectedMappedShift.indexOf(id) !== -1 )? true : false;
  }
  ngOnChanges(changes: SimpleChanges) {
    if(this.PolicyMethode!="selfServiceTimeOffice"){
      this.selectedMappedShift = [];
    this.leavePolicyID = changes.policyID.currentValue;
    this.leavePolicyTypeID = changes.policyTypeID.currentValue;
    this.leaveDetails.policyID =  this.leavePolicyID
    this._store.select(selectLeaveMasterState).subscribe(response => {
      if (response && response.leavelList) {
        this.policyList = response.leavelList;
        this.policyList.map(p=>{
          this.mappedPolicyOption.push({
            label:p.leaveCode,
            value: p.leaveID,
            isActive: false,
            mapped:false,
            isActiveShow:false
          });
        })

      }
    });
    if(this.mappedPolicyOption){
      this.leavePolicyService.fetchMappedLeavePolicyData(this.leavePolicyID).subscribe(res =>{
        if(res && res.mappings){

          this.mappedPolicyList = AppUtil.deepCopy(res.mappings);
         
          this.mappedPolicyList.forEach(leave=>{
            const indx = this.mappedPolicyOption.findIndex(x=> x.label.trim() === leave.leaveCode.trim() && leave.mapped===true);
            if(leave.mapped)
               this.selectedMappedShift.push(leave.leaveID);
            if(indx >=0){
              this.mappedPolicyOption[indx].mapped = true;
             
            }
          });
        }
        this.mappedPolicyOption.forEach(x => {
            let leavePolicyDefaultData: LeaveModel = this.mappedPolicyList.filter(k=>k.leaveID === x.value)[0];
            
            if(leavePolicyDefaultData.applicableOnEmployeeStatus)
            {
              leavePolicyDefaultData.employeeStatusAllowedSel=leavePolicyDefaultData.employeeStatusAllowed.split('~').map(i => Number(i));
            }
            if(leavePolicyDefaultData.applicableOnEmployeeType)
            {
              leavePolicyDefaultData.employeeTypeAllowedSel=leavePolicyDefaultData.employeeTypeAllowed.split('~').map(i => Number(i));
            }
            if(leavePolicyDefaultData.leaveNotClubHalfDay)
            {
              leavePolicyDefaultData.leaveNotClubListHalfDaySel=leavePolicyDefaultData.leaveNotClubListHalfDay.split('~').map(i => Number(i));
            }
            if(leavePolicyDefaultData.leaveNotClub)
            {
              leavePolicyDefaultData.leaveNotClubListSel=leavePolicyDefaultData.leaveNotClubList.split('~').map(i => Number(i));
            
             }
             if(leavePolicyDefaultData.accrualDaysInclude)
             {
               leavePolicyDefaultData.accrualDaysIncludeSel=leavePolicyDefaultData.accrualDaysInclude.split('~').map(i => String(i));
              }

            this.leaveDetailsForUI.push(AppUtil.deepCopy(leavePolicyDefaultData));
        });
        this.isActive = true;
      });
    }
    }
    
  }

  

  getdata(e){
    console.log(e,'dddd');
  }
  getShiftDetailByID(Id) {
    // const shiftVal = this.policyList.filter(i => i.shiftID === Id)[0];
    // return shiftVal;
  }
  onTabOpen(e) {
    this.leaveDetails = null;
    this.activeIndex = e.index;
    console.log('index', this.activeIndex);
    let currentPolicy= this.mappedPolicyOption[this.activeIndex];
    this.leaveDetails= this.leaveDetailsForUI.filter((obj)=>{return obj.leaveID===currentPolicy.value})[0];
  }
  saveMapping() {
    if(this.leaveDetails.leaveNotClubListSel != undefined || this.leaveDetails.leaveNotClubListSel != null){
      if(this.leaveDetails.leaveNotClub==true)
      {
      this.leaveDetails.leaveNotClubList= this.leaveDetails.leaveNotClubListSel.map( value  => value).join('~');
      }
      else{
        this.leaveDetails.leaveNotClubList ="null"
      } 
     }
     if(this.leaveDetails.leaveNotClubListHalfDaySel != undefined || this.leaveDetails.leaveNotClubListHalfDaySel != null){
     if(this.leaveDetails.leaveNotClubHalfDay==true)
    {
      this.leaveDetails.leaveNotClubListHalfDay= this.leaveDetails.leaveNotClubListHalfDaySel.map( value  => value).join('~');
    }
    else{
      this.leaveDetails.leaveNotClubListHalfDay ="null"
    }
    }

    if(this.leaveDetails.employeeStatusAllowedSel != undefined || this.leaveDetails.employeeStatusAllowedSel != null)
   {
    if(this.leaveDetails.applicableOnEmployeeStatus==true)
    {
      this.leaveDetails.employeeStatusAllowed=this.leaveDetails.employeeStatusAllowedSel.map( value  => value).join('~');
    }
    else{
      this.leaveDetails.employeeStatusAllowed ="null"
    }
   }
    if(this.leaveDetails.employeeTypeAllowedSel != undefined || this.leaveDetails.employeeTypeAllowedSel != null)
    {
     if(this.leaveDetails.applicableOnEmployeeType==true)
     {
       this.leaveDetails.employeeTypeAllowed=this.leaveDetails.employeeTypeAllowedSel.map( value  => value).join('~');
     }
     else{
       this.leaveDetails.employeeTypeAllowed ="null"
     }
    }
    if(this.leaveDetails.accrualDaysIncludeSel != undefined || this.leaveDetails.accrualDaysIncludeSel != null){
      
      this.leaveDetails.accrualDaysInclude= this.leaveDetails.accrualDaysIncludeSel.map( value  => value).join('~');
    }  
    else{
      this.leaveDetails.accrualDaysInclude ="null"
      } 
   
    this.leaveDetails.policyID = this.policyID;
    this.leaveDetails.policyTypeID = this.policyTypeID;
    this.selectedMappedShift.push(this.leaveDetails.leaveID);
    this.leavePolicyService.updateMappedLeavePolicyData(this.leaveDetails).subscribe(response=>{
        if (response.messageType === 0) {
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)         
          // this.refreshLeavePolicy();
          // this.setMappingVisiblity(false);
        }else{
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
          this.leavePolicyService.setMappingVisiblity(true);
        }
        return response;
    });
    
  }

  updateStateLocaly(event, field) {
    const timeTemp = moment(event).format("HH:mm");
     switch (field) {
       case this.UICONSTANT.LEAVE_MASTER_FIELD.Max_Time_Duration:
         this.leaveDetails.maxTimeDuration = moment(event).format("HH:mm");
         break;
       case this.UICONSTANT.LEAVE_MASTER_FIELD.Minimum_Work_Hours:
         this.leaveDetails.minmumWorkForLeave  = moment(event).format("HH:mm");
         break;
     }
   }
   cancelLeaveEditdiv(){
    //  this.leaveSe/rvice.setVisibility(false);
   }

  keyPressNumbers(event) {
    AppUtil.validateNumbers(event);
  }
  keyPressAlphanumeric(event) {
    AppUtil.validateAlphanumeric(event);
  }

  deleteLeaveMapping(policyID,leaveID){
    console.log(leaveID,policyID);
    this.leavePolicyService.deleteLeavePolicyMapping(policyID,leaveID).subscribe(response=>{
        if (response.messageType === 0) {
            this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
            this.refreshLeavePolicy();
        }else{
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        }
      
    });
   // this.shiftService.setMappingVisiblity(false);
}

LeaveNotClubListShowHide(event){
  console.log(event);
  if(event == true){
    this.leaveDetails.leaveNotClub=true;
  }
}

LeaveNotClubOnlyHalfDayShowHide(event)
{
  console.log(event);
  if(event==true)
  {
    this.leaveDetails.leaveNotClubHalfDay=true;
  }
}

EmpStatusAllowedShowHide(event)
{
  console.log(event)
  if(event==true)
  {
    this.leaveDetails.applicableOnEmployeeStatus=true;
  }
}

EmpTypeAllowedShowHide(event)
{
  console.log(event)
  if(event==true)
  {
    this.leaveDetails.leaveRequestInAdvance=true;
  }
}

refreshLeavePolicy(){
  this.leavePolicyService.fetchMappedLeavePolicyData(this.leavePolicyID).subscribe(res =>{
    console.log('res',res);
    if(res && res.mappings){
      this.mappedPolicyOption.forEach(pol => {
        pol.mapped= false,
        pol.isActive=false,
        pol.isActiveShow=false
      });
      this.mappedPolicyList = AppUtil.deepCopy(res.mappings);
      this.mappedPolicyList.forEach(leave=>{
        const indx = this.mappedPolicyOption.findIndex(x=> x.label.trim() === leave.leaveCode.trim() && leave.mapped===true);
        if(leave.mapped)
          this.selectedMappedShift.push(leave.leaveID);
        if(indx >=0){
          this.mappedPolicyOption[indx].mapped = true;
        }
      });
    }

    this.mappedPolicyOption.forEach(x => {
        let leavePolicyDefaultData: LeaveModel = this.mappedPolicyList.filter(k=>k.leaveID === x.value)[0];
        this.leaveDetailsForUI.push(AppUtil.deepCopy(leavePolicyDefaultData));
    });
    // this.leaveDetailsForUI.sort((a, b) => a.leaveID - b.leaveID);//
    let currentPolicy= this.mappedPolicyOption[this.activeIndex];
    this.leaveDetails= this.leaveDetailsForUI.filter((obj)=>{return obj.leaveID===currentPolicy.value})[0];
    //this.leaveDetails = AppUtil.deepCopy(this.leaveDetailsForUI[0]);
    
    console.log('leaveDetails',this.leaveDetails);
    if(this.leaveDetails.leaveNotClubList != null){
      this.leaveNotClubListed = this.leaveDetails.leaveNotClubList.split('~').map(i => Number(i));
    }
    if(this.leaveDetails.leaveNotClubListHalfDay != null){
      this.leaveNotClubListOnlyHalfDay = this.leaveDetails.leaveNotClubListHalfDay.split('~').map(i => Number(i));
    }
    if(this.leaveDetails.employeeStatusAllowed != null){
      this.empStatusAllowList = this.leaveDetails.employeeStatusAllowed.split('~').map(i => Number(i));
    }
    if(this.leaveDetails.employeeTypeAllowed != null){
      this.empTypeAllowedList = this.leaveDetails.employeeTypeAllowed.split('~').map(i => Number(i));
    }
    this.isActive = true;
  });
}

}
