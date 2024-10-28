import { Component, OnInit } from '@angular/core';
import { AppUtil } from 'src/app/common/app-util';
import { selectEmployeeMasterState, selectLeaveMasterState } from '../../../store/app.state';
import { LeaveMasterService } from '../../../services/leave-master.service';
import { Store } from '@ngrx/store';
import { LeaveModel } from '../../../store/model/master-data.model';
import { UI_CONSTANT } from '../../../common/constants/ui-constants';
import * as moment from 'moment';
import { ConfirmationService } from 'primeng/api';
import { EmployeeMaster } from 'src/app/store/model/employee.model';

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
  leaveDetailsInfo: LeaveModel = {} as LeaveModel;
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
  public leaveCreditNewJoineeRuleList=UI_CONSTANT.LeaveCreditNewJoineeRule;
  
  leaveNotClubListOption:any;
  leaveNotClubListHalfDayOption:any;
  public leaveNotClubListed:Array<number>;
  public accrualIncludeDaysListed:Array<string>;
  public leaveNotClubListOnlyHalfDay:Array<number>;
  public leaveMaaped:string;
  
   empStatusListOption:Array<any>=[];
  public empStatusAllowList:Array<number>;

  empTypeListOption:Array<any>=[];
  public empTypeAllowedList:Array<number>;
  
  constructor(
    private _store: Store<any>,
    private leaveService: LeaveMasterService,
    private confirmationService: ConfirmationService

  ) { 
    this.leaveService.fetchLeaveData();
  }

  ngOnInit(): void {
    this._store.select(selectEmployeeMasterState).subscribe(response=>
      {
        if (response && response.employeeMasterList) {
          const tempempStatusList: EmployeeMaster[] = AppUtil.deepCopy(response.employeeMasterList.employeeStatus);
          this.empStatusListOption=tempempStatusList;
         
          const tempempTypeList: EmployeeMaster[] = AppUtil.deepCopy(response.employeeMasterList.employeeType);
          this.empTypeListOption=tempempTypeList;
        }
      
      });
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
    this.leaveNotClubListOption=UI_CONSTANT.LEAVE_NOT_CLUB_LIST;
    this.leaveNotClubListHalfDayOption=UI_CONSTANT.LEAVE_NOT_CLUB_LIST_HALFDAY;
  }
  addNew() {
    this.labelName = "Save";
    this.headerdialogName = "Add Leave";
    this.leaveDetailsInfo = AppUtil.deepCopy(this.leaveService.setDefaultLeaveData());
    this.leaveService.setVisibility(true);
  }
  exportGridData() {
    this.leaveService.getCSVReport(this.rowData , 'Leave_Master');
  }
  onCellClicked(params) {

    if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
      let action = params.event.path[1].dataset.action;

      if (action === UI_CONSTANT.ACTIONS.EDIT) {
        this.leaveDetailsInfo = params.data;
        if (this.leaveDetailsInfo.leaveID !== 0) {
          this.labelName = "Update";
          this.headerdialogName = "Update Leave Detail";
        let data =this.leaveDetailsInfo.leaveMapped;
        let tempdata=data.trim().toString();
        this.leaveMaaped=tempdata;
        console.log(this.leaveMaaped);
          var leavecode=this.leaveDetailsInfo.leaveCode.toUpperCase().trim();
          this.leaveNotClubListOption= UI_CONSTANT.LEAVE_NOT_CLUB_LIST.filter(x=>x.key!=leavecode);
          this.leaveNotClubListHalfDayOption= UI_CONSTANT.LEAVE_NOT_CLUB_LIST_HALFDAY.filter(x=>x.key!=leavecode);
          if(this.leaveDetailsInfo.leaveNotClubList != null){
            this.leaveNotClubListed = this.leaveDetailsInfo.leaveNotClubList.split('~').map(i => Number(i));
          }
          if(this.leaveDetailsInfo.leaveNotClubListHalfDay != null){
            this.leaveNotClubListOnlyHalfDay = this.leaveDetailsInfo.leaveNotClubListHalfDay.split('~').map(i => Number(i));
          }
          if(this.leaveDetailsInfo.employeeStatusAllowed != null){
            this.empStatusAllowList = this.leaveDetailsInfo.employeeStatusAllowed.split('~').map(i => Number(i));
          }
          if(this.leaveDetailsInfo.employeeTypeAllowed != null){
            this.empTypeAllowedList = this.leaveDetailsInfo.employeeTypeAllowed.split('~').map(i => Number(i));
          }
          if(this.leaveDetailsInfo.accrualDaysInclude != null){
            this.accrualIncludeDaysListed = this.leaveDetailsInfo.accrualDaysInclude.split('~').map(i => String(i));
          }          
        }
        this.leaveService.setVisibility(true);
      }
      if (action === UI_CONSTANT.ACTIONS.DELETE) {
        console.log(params)
        this.confirmationService.confirm({
          message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
          header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
          icon: 'pi pi-info-circle',
          accept: () => {
            const temdata = AppUtil.deepCopy(this.rowData);
            let index = this.rowData.findIndex((item)=>item.leaveID == params.data.leaveID);
            temdata.splice(index,1);
            this.leaveService.deleteCellFromRemote(params);
            this.rowData = temdata;
    
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
    this.leaveDetailsInfo.leaveMapped=this.leaveMaaped;
    if(this.leaveNotClubListed != undefined || this.leaveNotClubListed != null){
      if(this.leaveDetailsInfo.leaveNotClub==true)
      {
      this.leaveDetailsInfo.leaveNotClubList= this.leaveNotClubListed.map( value  => value).join('~');
      }
      else{
        this.leaveDetailsInfo.leaveNotClubList ="null"
      } 
     }
     if(this.leaveNotClubListOnlyHalfDay != undefined || this.leaveNotClubListOnlyHalfDay != null){
    if(this.leaveDetailsInfo.leaveNotClubHalfDay==true)
    {
      this.leaveDetailsInfo.leaveNotClubListHalfDay= this.leaveNotClubListOnlyHalfDay.map( value  => value).join('~');
    }
    else{
      this.leaveDetailsInfo.leaveNotClubListHalfDay ="null"
    }
    }

    if(this.empStatusAllowList != undefined || this.empStatusAllowList != null)
   {
    if(this.leaveDetailsInfo.applicableOnEmployeeStatus==true)
    {
      this.leaveDetailsInfo.employeeStatusAllowed=this.empStatusAllowList.map( value  => value).join('~');
    }
    else{
      this.leaveDetailsInfo.employeeStatusAllowed ="null"
    }
   }
    if(this.empTypeAllowedList != undefined || this.empTypeAllowedList != null)
    {
     if( this.leaveDetailsInfo.applicableOnEmployeeType==true)
     {
       this.leaveDetailsInfo.employeeTypeAllowed=this.empTypeAllowedList.map( value  => value).join('~');
     }
     else{
       this.leaveDetailsInfo.employeeTypeAllowed ="null"
     }
    }
    if(this.accrualIncludeDaysListed != undefined || this.accrualIncludeDaysListed != null){
      
      this.leaveDetailsInfo.accrualDaysInclude= this.accrualIncludeDaysListed.map( value  => value).join('~');
    }  
      else{
        this.leaveDetailsInfo.accrualDaysInclude ="null"
      } 
     
    if(this.leaveDetailsInfo.leaveID >0){
      //console.log(this.leaveDetailsInfo);
      this.leaveService.updateStateOfCell(this.leaveDetailsInfo);
    }
    else{
      console.log(this.leaveDetailsInfo)
     this.leaveService.saveLeaveData(this.leaveDetailsInfo);
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
        this.leaveDetailsInfo.maxTimeDuration = moment(event).format("HH:mm");
        break;
      case this.UICONSTANT.LEAVE_MASTER_FIELD.Minimum_Work_Hours:
        this.leaveDetailsInfo.minmumWorkForLeave  = moment(event).format("HH:mm");
        break;
    }
  }

  cancelLeaveEditdiv(){
    this.leaveService.setVisibility(false);
    // setTimeout(()=>{
    //   location.reload();
    //   }, 400);
  }
  LeaveNotClubListShowHide(event){
    console.log(event);
    if(event == true){
      this.leaveDetailsInfo.leaveNotClub=true;
    }
  
  }
  LeaveNotClubOnlyHalfDayShowHide(event)
  {
    console.log(event);
    if(event==true)
    {
      this.leaveDetailsInfo.leaveNotClubHalfDay=true;
    }
   
  }
  
  EmpStatusAllowedShowHide(event)
  {
    console.log(event)
    if(event==true)
    {
      this.leaveDetailsInfo.applicableOnEmployeeStatus=true;
    }
    
  }
  EmpTypeAllowedShowHide(event)
  {
    console.log(event)
    if(event==true)
    {
      this.leaveDetailsInfo.leaveRequestInAdvance=true;
    }
    
  }
}
