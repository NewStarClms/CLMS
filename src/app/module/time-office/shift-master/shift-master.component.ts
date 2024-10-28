import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ShiftMaster, ShiftModel } from '../../../store/model/master-data.model';
import { ShiftService } from '../../../services/shift.service';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import * as moment from 'moment';
import { ConfirmationService } from 'primeng/api';
import { selectShiftState } from '../../../store/app.state';

@Component({
  selector: 'app-shift-master',
  templateUrl: './shift-master.component.html',
  styleUrls: ['./shift-master.component.scss']
})
export class ShiftMasterComponent implements OnInit {
  readonly UICONSTANT = UI_CONSTANT;
  public columnDefs!: any[][];
  public rowData: Array<ShiftModel> = [];
  shiftInfo: ShiftModel = {} as ShiftModel;
  headerdialogName: string = "Add Shift";
  shiftTypeOption: Array<{ key: number; value: string }> = UI_CONSTANT.SHIFT_TYPE;
  display = false;
  stateOptions = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
  labelName: string = "Save";
  myDate: Date;
  timepickerVisible = false;
  mytime: Date;

  bsConfig = {
    containerClass: 'theme-dark-blue',
    showWeekNumbers: false,
    selectFromOtherMonth: true,
    dateInputFormat: 'DD-MMM-YYYY'
  }
  startTime: string;
  constructor(
    private _store: Store<any>,
    private shiftServices: ShiftService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this._store.select(selectShiftState).subscribe(res => {
      if (res && res.shiftList) {
        this.rowData = AppUtil.deepCopy(res.shiftList);
      }
    });
    this.shiftTypeOption = UI_CONSTANT.PLEASESELECT.concat(this.shiftTypeOption);
    this.columnDefs = this.shiftServices.prepareColumnForGrid();
    this.shiftServices.getVisiblity().subscribe(res => {
      this.display = res;
    });
  }

  addNew() {
    this.labelName = "Save";
    this.headerdialogName = "Add Shift";
    this.shiftInfo = this.setDefaultData();
    this.shiftServices.setVisibility(true);
  }
  setDefaultData() {
    const shiftInfoTemp: ShiftModel = {} as ShiftModel;
    shiftInfoTemp.lunchIncludeInShiftDuration = false;
    shiftInfoTemp.shiftAllowanceApplicable = false;
    shiftInfoTemp.viewOnOTProcess = false;
    shiftInfoTemp.halfDayLateEarly = false;
    shiftInfoTemp.absentLateEarly = false;
    shiftInfoTemp.absentAfterLate = "00:00";
    shiftInfoTemp.absentBeforeEarly = "00:00";
    shiftInfoTemp.absentLateEarly = false;
    shiftInfoTemp.earlyMinuteForShiftAllowance = "00:00";
    shiftInfoTemp.firstHalfConsiderUpto = "00:00";
    shiftInfoTemp.halfDayAfterLate= "00:00";
    shiftInfoTemp.halfDayBeforeEarly = "00:00";
    shiftInfoTemp.halfDayLateEarly = false;
    shiftInfoTemp.lateMinuteForShiftAllowance= "00:00";
    shiftInfoTemp.lunchDuration = "00:00";
    shiftInfoTemp.lunchEndTime = "00:00";
    shiftInfoTemp.lunchIncludeInShiftDuration = false;
    shiftInfoTemp.lunchStartTime = "00:00";
    shiftInfoTemp.maxHoursForSRT = "00:00";
    shiftInfoTemp.maxWorkingHour = "00:00";
    shiftInfoTemp.minHoursToHalfDay = "00:00";
    shiftInfoTemp.minHoursToPresent = "00:00";
    shiftInfoTemp.minWorkingHourForShiftAllowance= "00:00";
    shiftInfoTemp.otDeduction = "00:00";
    shiftInfoTemp.otDinnerDeduction = "00:00";
    shiftInfoTemp.otDutationForDinnerDeduction = "00:00";
    shiftInfoTemp.otMax = "00:00";
    shiftInfoTemp.otRemoveAfterLate="00:00";
    shiftInfoTemp.otMin="00:00";
    shiftInfoTemp.otStartAfter = "00:00";
    shiftInfoTemp.permissibleEarly= "00:00";
    shiftInfoTemp.permissibleLate ="00:00";
    shiftInfoTemp.permissibleLate= "00:00";
    shiftInfoTemp.shiftEndTime= "00:00";
    shiftInfoTemp.shiftDuration= "00:00";
    shiftInfoTemp.shiftStartTime ="00:00";
    shiftInfoTemp.shiftAllowanceAmount = 0;
    return shiftInfoTemp;
  }
  onCellClicked(params) {
    if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
      let action = params.event.path[1].dataset.action;

      if (action === UI_CONSTANT.ACTIONS.EDIT) {
        this.shiftInfo = params.data;
        if (this.shiftInfo.shiftID !== 0) {
          this.labelName = "Update";
          this.headerdialogName = "Update Shift";
        }
        this.shiftServices.setVisibility(true);
      }
      if (action === UI_CONSTANT.ACTIONS.DELETE) {
        this.confirmationService.confirm({
          message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
          header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
          icon: 'pi pi-info-circle',
          accept: () => {
            const temdata = AppUtil.deepCopy(this.rowData);
            let index = this.rowData.findIndex((item)=>item.shiftID == params.data.shiftID);
            temdata.splice(index,1);
            this.shiftServices.deleteCellFromRemote(params);
            this.rowData = temdata;
          },
          reject: (type) => {
            switch (type) {
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

      if (action === UI_CONSTANT.ACTIONS.UPDATE) {
        params.api.stopEditing(false);
        console.log('update', params);
        // this.branchService.updateStateOfCell(params);
      }

      if (action === UI_CONSTANT.ACTIONS.CANCEL) {
        params.api.stopEditing(true);
      }
    }
  }

  exportGridData() {
    this.shiftServices.getCSVReport(this.rowData , 'Shift_Master');
  }
  SaveShiftnData(shiftForm) {
  if(this.shiftInfo.shiftID >0 ){
    this.shiftServices.updateStateOfCell(this.shiftInfo);
  }
  else{
    this.shiftServices.saveShiftData(this.shiftInfo);
  }
  }

  getTime(event) {
    this.shiftInfo.shiftStartTime = moment(event).format("HH:mm");
  }
  gettoTime(event) {
    this.shiftInfo.shiftEndTime = moment(event).format("HH:mm");
  }

  keyPressNumbers(event) {
    AppUtil.validateNumbers(event);
  }
  keyPressAlphanumeric(event) {
    AppUtil.validateAlphanumeric(event);
  }
  updateStateLocaly(event, field) {
   const timeTemp = moment(event).format("HH:mm");
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
        this.shiftInfo.otDinnerDeduction= moment(event).format("HH:mm");

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
  cancelShiftmappingdiv(){
   this.shiftServices.setVisibility(false);
  }
}
