import { Component, OnInit } from '@angular/core';
import { AppUtil } from 'src/app/common/app-util';
import { selectLeaveMasterState } from '../../../../store/app.state';
import { LeaveMasterService } from '../../../../services/leave-master.service';
import { Store } from '@ngrx/store';
import { LeaveModel } from '../../../../store/model/master-data.model';
import { UI_CONSTANT } from '../../../../common/constants/ui-constants';
import * as moment from 'moment';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-leave-master',
  templateUrl: './leave-master.component.html',
  styleUrls: ['./leave-master.component.scss']
})
export class LeaveMasterComponent implements OnInit {
  rowData: Array<LeaveModel>=[];
  columnDefs: any;
  display: boolean = false;
  labelName: string;
  headerdialogName: string;
  leaveDetails: LeaveModel = {} as LeaveModel;
  readonly UICONSTANT = UI_CONSTANT;
  stateOptions = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
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
  constructor(
    private _store: Store<any>,
    private leaveService: LeaveMasterService,
    private confirmationService: ConfirmationService,
    private authenticationService:AuthService

  ) { }

  ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(false);
    this._store.select(selectLeaveMasterState).subscribe(res => {
      if (res && res.leavelList) {
        this.rowData = AppUtil.deepCopy(res.leavelList);
      }
    });
    this.columnDefs = this.leaveService.prepareColumnForGrid();
    this.leaveService.getVisiblity().subscribe(res => {
      this.display = res;
    });
    for(let i=1 ; i<=31 ; i++){
      this.accrualOnDateOption.push({key: i.toString(), value:i.toString()});
    }
  }

  addNew() {
    this.labelName = "Save";
    this.headerdialogName = "Add Leave";
    this.leaveDetails = AppUtil.deepCopy(this.leaveService.setDefaultLeaveData());
    this.leaveService.setVisibility(true);
    console.log(this.leaveDetails, 'jnds');
  }

  exportGridData() {
    // this.branchService.getCSVReport(this.rowData , 'Branch');
  }

  onCellClicked(params) {

    if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
      let action = params.event.path[1].dataset.action;

      if (action === UI_CONSTANT.ACTIONS.EDIT) {
        this.leaveDetails = params.data;
        if (this.leaveDetails.leaveID !== 0) {
          this.labelName = "Update";
          this.headerdialogName = "Update Leave Detail";
        }
        this.leaveService.setVisibility(true);
      }
      if (action === UI_CONSTANT.ACTIONS.DELETE) {
        this.confirmationService.confirm({
          message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
          header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
          icon: 'pi pi-info-circle',
          accept: () => {
            const temdata = AppUtil.deepCopy(this.rowData);
            let index = this.rowData.findIndex((item)=>item.leaveID == params.data.shiftID);
            temdata.splice(index,1);
            this.leaveService.deleteCellFromRemote(params);
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

  SaveLeaveData(leaveForm){
    if(this.leaveDetails.leaveID >0 ){
      this.leaveService.updateStateOfCell(this.leaveDetails);
    }
    else{
      this.leaveService.saveLeaveData(this.leaveDetails);
    }
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
      case this.UICONSTANT.LEAVE_MASTER_FIELD.Max_Time_Duration:
        this.leaveDetails.maxTimeDuration = moment(event).format("HH:mm");
        break;
      case this.UICONSTANT.LEAVE_MASTER_FIELD.Minimum_Work_Hours:
        this.leaveDetails.minmumWorkForLeave  = moment(event).format("HH:mm");
        break;
    }
  }
  cancelLeaveEditdiv(){
    this.leaveService.setVisibility(false);
  }
}
