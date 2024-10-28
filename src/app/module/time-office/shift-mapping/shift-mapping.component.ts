import { ChangeDetectionStrategy, Component, Input, OnInit, SimpleChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AppUtil } from 'src/app/common/app-util';
import { ShiftService } from 'src/app/services/shift.service';
import { ShiftMappedData,  ShiftModel } from '../../../store/model/master-data.model';
import { selectShiftMaappedState, selectShiftState } from '../../../store/app.state';
import { Store } from '@ngrx/store';
import { UI_CONSTANT } from '../../../common/constants/ui-constants';
import * as moment from 'moment';
import { Accordion } from 'primeng/accordion';
import { saveShiftMappingData } from 'src/app/store/actions/master.action';
import { AttendancePolicyMasterService } from 'src/app/services/attendance-policy-master.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-shift-mapping',
  templateUrl: './shift-mapping.component.html',
  styleUrls: ['./shift-mapping.component.scss']
})
export class ShiftMappingComponent implements OnInit {
  rowData: any;
  labelName = "Save";
  isActive = false;
  readonly UICONSTANT = UI_CONSTANT;
  mappedShiftList: Array<ShiftMappedData> = [];
  shiftList: Array<ShiftModel> = [];
  mappedShiftOption: Array<{ label: string, value: number, isActive: boolean, mapped:boolean,isActiveShow:boolean }> = [];
  selectedMappedShift: Array<any> = [];
  stateOptions = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
  shiftTypeOption: Array<{ key: number; value: string; }> = UI_CONSTANT.SHIFT_TYPE;
  shiftInfoForUI: Array<ShiftMappedData> = [];
  shiftPolicyTypeID: number = 0;
  shiftPolicyID: number = 0;
  public displayshiftMap: boolean;
  @ViewChild('accordion') accordion: Accordion;
  shiftInfo: ShiftMappedData;
  public allDisabledField:boolean=false;
  public policyName:string;

  constructor(
    private shiftSerivce: ShiftService,
    private _store: Store,
    private ref: ChangeDetectorRef,
    private attendancePolicyMasterService:AttendancePolicyMasterService
  ) { }
  @Input() policyID: number;
  @Input() policyTypeID: number;
  @Input() shiftMappedData: Array<ShiftMappedData>;
  @Input() PolicyMethode:string;

  ngOnInit(): void {
    if(this.PolicyMethode =="selfServiceTimeOffice"){
      this.allDisabledField=true;
      this.selectedMappedShift = [];
      this.shiftPolicyID = this.policyID;
      this.shiftPolicyTypeID = this.policyTypeID;
      this.shiftSerivce.fetchShiftMapping(this.shiftPolicyID).subscribe(data=>{
        if(data.mapping){
          //console.log(data.mapping);
          this._store.dispatch(new saveShiftMappingData(data.mapping));
        }
      });
      this.attendancePolicyMasterService.fetchAttendancePolicyMasterDetail(this.shiftPolicyID).subscribe(res =>{
        if(res){
          this.policyName = res.policyName;
        }
      });
       this.shiftTypeOption = UI_CONSTANT.PLEASESELECT.concat(this.shiftTypeOption);
       this._store.select(selectShiftState).subscribe(res => {
         if (res && res.shiftList) {
          console.log(res.shiftList)
           const tempmappedShiftOption = [];
           this.shiftList = AppUtil.deepCopy(res.shiftList);
           let i = 0;
           this.shiftList.forEach(shift => {
             tempmappedShiftOption.push({ label: shift.shiftCode, value: shift.shiftID, 
               isActive: (i === 0) ? true : false,
               mapped: false,
               isActiveShow:true
              });
               
             i++;
           });
           this._store.select(selectShiftMaappedState).subscribe(shiftArr =>{
             if(shiftArr){
               this.mappedShiftList = AppUtil.deepCopy(shiftArr.shiftMapping);
               const selectedShift = [];
              // console.log(shiftArr,'arrshift');
               this.mappedShiftList.map(i => {
                 const shiftData = this.getShiftDetailByID(i.shiftID);
                 i.shiftName = shiftData.shiftName;
                 i.shiftCode = shiftData.shiftCode;
                 i.shiftType = shiftData.shiftType;
                 i.shiftStartTime = shiftData.shiftStartTime;
                 i.shiftEndTime = shiftData.shiftEndTime;
                 i.shiftDuration = shiftData.shiftDuration;
                 i.lunchStartTime = shiftData.lunchStartTime;
                 i.lunchEndTime = shiftData.lunchEndTime;
                 i.lunchDuration = shiftData.lunchDuration;
                 i.lunchIncludeInShiftDuration = shiftData.lunchIncludeInShiftDuration;
                // i.minHoursToPresent=shiftData.minHoursToPresent;
               });
               if (this.mappedShiftList.length > 0) {
                 this.mappedShiftList.forEach(item => {
                   const shiftVal = this.shiftList.filter(i => i.shiftID === item.shiftID)[0]?.shiftID;
                   selectedShift.push(shiftVal);
                   this.selectedMappedShift = selectedShift;
                   this.shiftInfoForUI = AppUtil.deepCopy(this.mappedShiftList);
                 });
                 this.selectedMappedShift.forEach(id=>{
                   tempmappedShiftOption.map(x=>{
                     if(x.value === id){
                       x.mapped = true;
                       x.isActiveShow=false;
                     }
                   })
                 this.mappedShiftOption = AppUtil.deepCopy(tempmappedShiftOption);
                 })
               } else {
                 tempmappedShiftOption.map(x=>x.mapped = false,x=>x.isActiveShow=false);
                 this.mappedShiftOption = AppUtil.deepCopy(tempmappedShiftOption);
                 this.selectedMappedShift = [];
                 this.shiftInfoForUI = [];
               }
           
               this.mappedShiftOption.forEach(x => {
                 if (!this.selectedMappedShift.includes(x.value)) {
                   let shiftMappingDefaultData: ShiftMappedData = {} as ShiftMappedData;
                   shiftMappingDefaultData = this.setshiftMappedDefaultData(x.value);
                   this.shiftInfoForUI.push(shiftMappingDefaultData);
                 }
               });
               this.shiftInfoForUI.sort((a, b) => a.shiftID - b.shiftID);
               this.shiftInfo = this.shiftInfoForUI[0];
               this.isActive = true;
              //  console.log('selectedMappedShift', this.selectedMappedShift);
              //console.log('mapping option', this.mappedShiftOption);
              //  console.log('shiftInfoForUI', this.shiftInfoForUI);
              //  console.log('rowData-id', this.shiftPolicyID);
             }
           });
         }
       });
      
    }
    else{
      this.allDisabledField=false;
    }
  }
  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }
  applyFilterGlobal($event: any) {
    return $event.target.value;
  }
  public isMappedShift(id){
    const isacti = (this.selectedMappedShift.indexOf(id) >= 0 )? true : false;
    //console.log('isacti',id,isacti,this.selectedMappedShift.indexOf(id),this.selectedMappedShift);
    return isacti; //(this.selectedMappedShift && this.selectedMappedShift.indexOf(id) !== -1 )? true : false;
  }
  ngOnChanges(changes: SimpleChanges) {
    this.selectedMappedShift = [];
    this.shiftPolicyID = changes.policyID.currentValue;
    this.shiftPolicyTypeID = changes.policyTypeID.currentValue;
    this.shiftTypeOption = UI_CONSTANT.PLEASESELECT.concat(this.shiftTypeOption);
    this._store.select(selectShiftState).subscribe(res => {
      if (res && res.shiftList) {
        const tempmappedShiftOption = [];
        this.shiftList = AppUtil.deepCopy(res.shiftList);
        let i = 0;
        this.shiftList.forEach(shift => {
          tempmappedShiftOption.push({ label: shift.shiftCode, value: shift.shiftID, 
            isActive: (i === 0) ? true : false,
            mapped: false,
            
          });
          i++;
        });
        this._store.select(selectShiftMaappedState).subscribe(shiftArr =>{
          if(shiftArr){
            this.mappedShiftList = AppUtil.deepCopy(shiftArr.shiftMapping);
            const selectedShift = [];
            //console.log(shiftArr,'arrshift');
            this.mappedShiftList.map(i => {
              const shiftData = this.getShiftDetailByID(i.shiftID);
              i.shiftName = shiftData.shiftName;
              i.shiftCode = shiftData.shiftCode;
              i.shiftType = shiftData.shiftType;
              i.shiftStartTime = shiftData.shiftStartTime;
              i.shiftEndTime = shiftData.shiftEndTime;
              i.shiftDuration = shiftData.shiftDuration;
              i.lunchStartTime = shiftData.lunchStartTime;
              i.lunchEndTime = shiftData.lunchEndTime;
              i.lunchDuration = shiftData.lunchDuration;
              i.lunchIncludeInShiftDuration = shiftData.lunchIncludeInShiftDuration;
             // i.minHoursToPresent=shiftData.minHoursToPresent;
            });
            if (this.mappedShiftList.length > 0) {
              this.mappedShiftList.forEach(item => {
                const shiftVal = this.shiftList.filter(i => i.shiftID === item.shiftID)[0]?.shiftID;
                selectedShift.push(shiftVal);
                this.selectedMappedShift = selectedShift;
                this.shiftInfoForUI = AppUtil.deepCopy(this.mappedShiftList);
              });
              this.selectedMappedShift.forEach(id=>{
                tempmappedShiftOption.map(x=>{
                  if(x.value === id){
                    x.mapped = true;
                  }
                })
              this.mappedShiftOption = AppUtil.deepCopy(tempmappedShiftOption);
              })
            } else {
              tempmappedShiftOption.map(x=>x.mapped = false);
              this.mappedShiftOption = AppUtil.deepCopy(tempmappedShiftOption);
              this.selectedMappedShift = [];
              this.shiftInfoForUI = [];
            }
        
            this.mappedShiftOption.forEach(x => {
              if (!this.selectedMappedShift.includes(x.value)) {
                let shiftMappingDefaultData: ShiftMappedData = {} as ShiftMappedData;
                shiftMappingDefaultData = this.setshiftMappedDefaultData(x.value);
                this.shiftInfoForUI.push(shiftMappingDefaultData);
              }
            });
            this.shiftInfoForUI.sort((a, b) => a.shiftID - b.shiftID);
            this.shiftInfo = this.shiftInfoForUI[0];
            this.isActive = true;
            // console.log('selectedMappedShift', this.selectedMappedShift);
            // console.log('mapping option', this.mappedShiftOption);
            // console.log('shiftInfoForUI', this.shiftInfoForUI);
            // console.log('rowData-id', this.shiftPolicyID);
          }
        });
      }
    });
    
  }
  getShiftDetailByID(Id) {
    const shiftVal = this.shiftList.filter(i => i.shiftID === Id)[0];
    return shiftVal;
  }
  updateStateLocaly(event, field) {
    const timeTemp = moment(event).format("HH:mm");
   // const shiftInfo = this.mappedShiftList[i];
    switch (field) {
      case UI_CONSTANT.SHIFT_MASTER_FIELD.SHIFT_START_TIME:
        this.shiftInfo.shiftStartTime = moment(event).format("HH:mm");
        break;

       case this.UICONSTANT.SHIFT_MASTER_FIELD.SHIFT_END_TIME:
        this.shiftInfo.shiftEndTime = moment(event).format("HH:mm");
        break;
       case this.UICONSTANT.SHIFT_MASTER_FIELD.Shift_Duration:
       this.shiftInfo.shiftDuration = moment(event).format("HH:mm");
       break;
      case this.UICONSTANT.SHIFT_MASTER_FIELD.Lunch_Start_Time:
        this.shiftInfo.lunchStartTime = moment(event).format("HH:mm");

        break;
      case this.UICONSTANT.SHIFT_MASTER_FIELD.Lunch_End_Time:
        this.shiftInfo.lunchEndTime = moment(event).format("HH:mm");

        break;
      case this.UICONSTANT.SHIFT_MASTER_FIELD.Lunch_Duration:
        this.shiftInfo.lunchDuration = moment(event).format("HH:mm");

        break;
      case this.UICONSTANT.SHIFT_MASTER_FIELD.Min_Hours_To_Full_Day_Present:
        this.shiftInfo.minHoursToPresent = moment(event).format("HH:mm");

        break;
      case this.UICONSTANT.SHIFT_MASTER_FIELD.Min_Hours_To_Half_Day_Present:
        this.shiftInfo.minHoursToHalfDay = moment(event).format("HH:mm");

        break;
      case this.UICONSTANT.SHIFT_MASTER_FIELD.Max_Absent_Hours_For_SRT:
        this.shiftInfo.maxHoursForSRT = moment(event).format("HH:mm");

        break;
      case this.UICONSTANT.SHIFT_MASTER_FIELD.First_Half_Consider_Up_to:
        this.shiftInfo.firstHalfConsiderUpto = moment(event).format("HH:mm");

        break;
      case this.UICONSTANT.SHIFT_MASTER_FIELD.Max_Working_Hours:
        this.shiftInfo.maxWorkingHour = moment(event).format("HH:mm");

        break;
      case this.UICONSTANT.SHIFT_MASTER_FIELD.Permissible_Late:
        this.shiftInfo.permissibleLate = moment(event).format("HH:mm");

        break;
      case this.UICONSTANT.SHIFT_MASTER_FIELD.Absent_After_Late:
        this.shiftInfo.absentAfterLate = moment(event).format("HH:mm");

        break;
      case this.UICONSTANT.SHIFT_MASTER_FIELD.Absent_Before_Early:
        this.shiftInfo.absentBeforeEarly = moment(event).format("HH:mm");

        break;
      case this.UICONSTANT.SHIFT_MASTER_FIELD.Permissible_Early:
        this.shiftInfo.permissibleEarly = moment(event).format("HH:mm");

        break;
      case this.UICONSTANT.SHIFT_MASTER_FIELD.HalfDay_After_Late:
        this.shiftInfo.halfDayAfterLate = moment(event).format("HH:mm");

        break;
      case this.UICONSTANT.SHIFT_MASTER_FIELD.HalfDay_Before_Early:
        this.shiftInfo.halfDayBeforeEarly = moment(event).format("HH:mm");

        break;
      case this.UICONSTANT.SHIFT_MASTER_FIELD.Maximum_OT:
        this.shiftInfo.otMax = moment(event).format("HH:mm");

        break;
      case this.UICONSTANT.SHIFT_MASTER_FIELD.Minimum_OT:
        this.shiftInfo.otMin = moment(event).format("HH:mm");

        break;
      case this.UICONSTANT.SHIFT_MASTER_FIELD.OT_Start_After:
        this.shiftInfo.otStartAfter = moment(event).format("HH:mm");

        break;
      case this.UICONSTANT.SHIFT_MASTER_FIELD.OT_Deduction:
        this.shiftInfo.otDeduction = moment(event).format("HH:mm");

        break;
      case this.UICONSTANT.SHIFT_MASTER_FIELD.OT_Remove_After_Late:
        this.shiftInfo.otRemoveAfterLate = moment(event).format("HH:mm");

        break;
      case this.UICONSTANT.SHIFT_MASTER_FIELD.OT_Dinner_Deduction:
        this.shiftInfo.otDinnerDeduction = moment(event).format("HH:mm");

        break;
      case this.UICONSTANT.SHIFT_MASTER_FIELD.OT_Duration_for_Dinner_Deduction:
        this.shiftInfo.otDutationForDinnerDeduction = moment(event).format("HH:mm");

        break;
      case this.UICONSTANT.SHIFT_MASTER_FIELD.Minimum_Work_For_Shift_Allowance:
        this.shiftInfo.minWorkingHourForShiftAllowance = moment(event).format("HH:mm");

        break;
      case this.UICONSTANT.SHIFT_MASTER_FIELD.Late_For_Shift_Allowance:
        this.shiftInfo.lateMinuteForShiftAllowance = moment(event).format("HH:mm");

        break;
      case this.UICONSTANT.SHIFT_MASTER_FIELD.Early_For_Shift_Allowance:
        this.shiftInfo.earlyMinuteForShiftAllowance = moment(event).format("HH:mm");

        break;
    }
  }

  setshiftMappedDefaultData(ID) {
    let shiftData = this.shiftList.filter(i => i.shiftID === ID)[0];

    const shiftInfoTemp: ShiftMappedData = {} as ShiftMappedData;
    shiftInfoTemp.lunchIncludeInShiftDuration = shiftData.lunchIncludeInShiftDuration;
    shiftInfoTemp.shiftAllowanceApplicable = shiftData.shiftAllowanceApplicable;
    shiftInfoTemp.viewOnOTProcess = shiftData.viewOnOTProcess;
    shiftInfoTemp.halfDayLateEarly = shiftData.halfDayLateEarly;
    shiftInfoTemp.absentLateEarly = shiftData.absentLateEarly;
    shiftInfoTemp.absentAfterLate = shiftData.absentAfterLate;
    shiftInfoTemp.absentBeforeEarly = shiftData.absentBeforeEarly;
    shiftInfoTemp.absentLateEarly = shiftData.absentLateEarly;
    shiftInfoTemp.earlyMinuteForShiftAllowance = shiftData.earlyMinuteForShiftAllowance;
    shiftInfoTemp.firstHalfConsiderUpto = shiftData.firstHalfConsiderUpto;
    shiftInfoTemp.halfDayAfterLate = shiftData.halfDayAfterLate;
    shiftInfoTemp.halfDayBeforeEarly = shiftData.halfDayBeforeEarly;
    shiftInfoTemp.halfDayLateEarly = shiftData.halfDayLateEarly;
    shiftInfoTemp.lateMinuteForShiftAllowance = shiftData.lateMinuteForShiftAllowance;
    shiftInfoTemp.lunchDuration = shiftData.lunchDuration;
    shiftInfoTemp.lunchEndTime = shiftData.lunchEndTime;
    shiftInfoTemp.lunchIncludeInShiftDuration = shiftData.lunchIncludeInShiftDuration;
    shiftInfoTemp.lunchStartTime = shiftData.lunchStartTime;
    shiftInfoTemp.maxHoursForSRT = shiftData.maxHoursForSRT;
    shiftInfoTemp.maxWorkingHour = shiftData.maxWorkingHour;
    shiftInfoTemp.minHoursToHalfDay = shiftData.minHoursToHalfDay;
    shiftInfoTemp.minHoursToPresent = shiftData.minHoursToPresent;
    shiftInfoTemp.minWorkingHourForShiftAllowance = shiftData.minWorkingHourForShiftAllowance;
    shiftInfoTemp.otDeduction = shiftData.otDeduction;
    shiftInfoTemp.otDinnerDeduction = shiftData.otDinnerDeduction;
    shiftInfoTemp.otDutationForDinnerDeduction = shiftData.otDutationForDinnerDeduction;
    shiftInfoTemp.otMax = shiftData.otMax;
    shiftInfoTemp.otRemoveAfterLate = shiftData.otRemoveAfterLate;
    shiftInfoTemp.otMin = shiftData.otMin;
    shiftInfoTemp.otStartAfter = shiftData.otStartAfter;
    shiftInfoTemp.permissibleEarly = shiftData.permissibleEarly;
    shiftInfoTemp.permissibleLate = shiftData.permissibleLate;
    shiftInfoTemp.shiftAllowanceAmount = shiftData.shiftAllowanceAmount;
    shiftInfoTemp.shiftName = shiftData.shiftName;
    shiftInfoTemp.shiftID = shiftData.shiftID;
    shiftInfoTemp.shiftCode = shiftData.shiftCode;
    shiftInfoTemp.shiftType = shiftData.shiftType;
    shiftInfoTemp.shiftStartTime = shiftData.shiftStartTime;
    shiftInfoTemp.shiftEndTime = shiftData.shiftEndTime;
    shiftInfoTemp.shiftDuration = shiftData.shiftDuration;
    shiftInfoTemp.lunchStartTime = shiftData.lunchStartTime;
    shiftInfoTemp.lunchEndTime = shiftData.lunchEndTime;
    shiftInfoTemp.lunchDuration = shiftData.lunchDuration;
    shiftInfoTemp.lunchIncludeInShiftDuration = shiftData.lunchIncludeInShiftDuration;
    shiftInfoTemp.policyID = this.shiftPolicyID;
    shiftInfoTemp.policyTypeID = this.shiftPolicyTypeID;
    return shiftInfoTemp;
  }
  keyPressNumbers(event) {
    AppUtil.validateNumbers(event);
  }
  keyPressAlphanumeric(event) {
    AppUtil.validateAlphanumeric(event);
  }

  onTabOpen(e) {
    this.shiftInfo = null;
    const index = e.index;
    //console.log('index', index);
    this.shiftInfo = this.shiftInfoForUI[index];
  }
  saveMapping() {
    //console.log(this.shiftInfo);
    this.shiftSerivce.saveShiftMapping(this.shiftInfo);
    this.selectedMappedShift.push(this.shiftInfo.shiftID);
    //this.shiftService.setMappingVisiblity(false);
  }
  deleteShiftMapping(shiftID,policyID){
      this.shiftSerivce.deleteAttendanceShiftMapping(shiftID,policyID);
     // this.shiftService.setMappingVisiblity(false);
  }
}
