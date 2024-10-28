import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { AppCoreCommonService } from './app.core-common.services';
import { saveLeaveData } from '../store/actions/master.action';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { ShiftModel, LeaveModel } from '../store/model/master-data.model';
import { Observable } from 'rxjs';
import { AttendancePolicyMasterService } from './attendance-policy-master.service';
import { UserGroupService } from './user-group.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LeaveMasterService {

  
  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public _visibleMapPopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public _leaveTypeList: BehaviorSubject<LeaveModel> = new BehaviorSubject<LeaveModel>(null);
  private _isEditable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<any>,
    private notificationService:NotificationService,
    private appCoreCommonService: AppCoreCommonService,
    private AttendancePolicyService:AttendancePolicyMasterService,
    private userGroupService: UserGroupService
  ) {
    this._isEditable.next(false);
    this._isEditable.asObservable();
   }

   setMappingVisiblity(val){
    this._visibleMapPopup.next(val);
    }

    getMappingVisiblity(){
    return this._visibleMapPopup.asObservable();
    }
    
   setVisibility(val){
    this._visiblePopup.next(val);
    }

    getVisiblity(){
    return this._visiblePopup.asObservable();
    }

    public fetchLeaveData() {
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.GET;
      serviceConf.path = PATH.FETCH_LEAVE_DATA;
      serviceConf.requestHeader = {};
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
        if (response && response.leaves) {
          console.log('response',response)
          this._store.dispatch(new saveLeaveData(response.leaves));
        }
        return response;
      });
  
    }
    setDefaultLeaveData() {
      let leaveDetailTemp: LeaveModel = {} as LeaveModel;
      leaveDetailTemp ={
      leaveID: 0,
      leaveCode: null,
      leaveName: null,
      leaveType: null,
      leaveMapped: null,
      leaveCycle: null,
      halfDayAllowed: true,
      maxMonthlyRequestCount: 0,
      maxQuarterlyRequestCount: 0,
      maxHalfYearlyRequestCount: 0,
      maxYearlyRequestCount: 0,
      maxMonthlyLeaveCount: 0,
      maxQuarterlyLeaveCount: 0,
      maxHalfYearlyLeaveCount: 0,
      maxYearlyLeaveCount: 0,
      minLeavePerRequest: 0,
      maxLeavePerRequest: 0,
      advanceLeaveAllow: true,
      advanceLeaveCycle: 's',
      woInclude: true,
      daysForWOInclude: 0,
      hoInclude: true,
      daysForHOInclude: 0,
      presentInclude: true,
      negativeAllowed: true,
      negativeLeaveLimit: 0,
      docRequired: true,
      docRequiredWhenLeaveMoreThan: 0,
      leaveRequestInAdvance: true,
      leaveRequestBeforeDays: 0,
      backDatedLeaveAllow: true,
      backDays: 0,
      backDatedLeaveAllowRM: true,
      backDaysRM: 0,
      backDatedLeaveAllowAdmin: true,
      backDaysAdmin: 0,
      leaveNotClub: true,
      leaveNotClubList: null,
      genderAllowed: null,
      applicableOnEmployeeStatus: true,
      employeeStatusAllowed: null,
      applicableOnEmployeeType: true,
      employeeTypeAllowed: null,
      minmumWorkForLeave: null,
      maxTimeDuration: null,
      encashable: true,
      encashableLimit: 0,
      balanceAfterEncashable: 0,
      carryForward: true,
      carryForwardLimit: 0,
      nhoInclude: true,
      leaveNotClubHalfDay: true,
      leaveNotClubListHalfDay: null,
      birthdayLeave: true,
      weddingAnniversaryLeave: true,
      accrual: true,
      accrualType: null,
      accrualOn: null,
      accrualOnDate: null,
      fixed: true,
      leaveCreditNewJoineeRuleID: 0,
      daysOnAccrual: 0,
      leaveAccrued: 0,
      accrualDaysInclude: null,
      accrualDayFromPrevious: true,
      accrualOnEachAccrualDays: true,
      maxAccrualLimit: 0,
      maxAccrualLimitQuarterly: 0,
      maxAccrualLimitHalfYearly: 0,
      maxAccrualLimitYearly: 0,
      roundLeave: 0,
      employeeGenderForLeaveCredit: null,
      visibleToEmployee:false,
      mapped: false,
      leaveNotClubListSel:null,
      leaveNotClubListHalfDaySel:null,
      employeeStatusAllowedSel: null,
      employeeTypeAllowedSel: null,
      accrualDaysIncludeSel:null,
      }
      return leaveDetailTemp;
    }

    public prepareColumnForGrid(){

      const columnDefs: any[] = [
        {
          headerName: 'Code',
          field: 'leaveCode',
          filter: true,
          autoHeight: true,
          suppressSizeToFit: true,
          sortable: true,
          width: 160,
        },
        {
          headerName: ' Name',
          field: 'leaveName',
          filter: true,
          autoHeight: true,
          suppressSizeToFit: true,
          sortable: true,
          width: 200,
  
        },
        {
          headerName: 'Leave Type',
          field: 'leaveType',
          filter: true,
          sortable: true,
          width: 210,
        },
        {
          headerName: 'Leave Mapped',
          field: 'leaveMapped',
          filter: true,
          sortable: true,
          width: 210,
        },  
        {
          headerName: "",
          minWidth: 0,
          editable: false,
          deleteAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.Leave_Master, UI_CONSTANT.ACTIONS.DELETE),
      editAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.Leave_Master, UI_CONSTANT.ACTIONS.UPDATE),
          colId: "action"
        }
      ]
      return columnDefs;

    }

    updateStateOfCell(params) {
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.PUT;
      serviceConf.path = PATH.FETCH_LEAVE_DATA;
      serviceConf.requestHeader = {};
      const payload: ShiftModel = params;
      serviceConf.payloadObjects = payload;
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
        if (response.messageType === 0) {
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
          this.fetchLeaveData();
          this.setVisibility(false);
        }else{
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
          this.setVisibility(true);
        }
        return response;
      });
    }
    
    saveLeaveData(leaveData) {
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.POST;
      serviceConf.path = PATH.FETCH_LEAVE_DATA;
      serviceConf.requestHeader = {};
      const payload: LeaveModel = leaveData
      serviceConf.payloadObjects = payload;
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
        if (response.messageType === 0) {
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
          this.fetchLeaveData();
          this.setVisibility(false);
        }else{
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
          this.setVisibility(true);
        }
        return response;
      });
    }

    deleteCellFromRemote(params) {
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.DELETE;
      serviceConf.path = PATH.FETCH_LEAVE_DATA + '/' + params.data.leaveID;
      serviceConf.requestHeader = {};
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
        if (response.messageType === 0) {
             this.fetchLeaveData()
            this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        }else{
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        }
        return response;
      });
  
    }

    fetchLeaveBalanceData(employeeID: number, year: string){
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.GET;
      serviceConf.path = PATH.FETCH_EMPLOYEE_LEAVE +'?employeeid='+employeeID+'&year='+year;
      serviceConf.requestHeader = {};
      return this.remoteService.httpServiceRequest(serviceConf).pipe(map(response =>{
        if(response){
          return response;
        }
      }));
    }

    getCSVReport(data, fileName){
      this.appCoreCommonService.exportExcel(data, fileName);
    }

    prepareColumnForDashboardGrid(){
      const columnDefs: any[] = [
        {
          headerName: 'Code',
          field: 'leaveCode',
          filter: false,
          autoHeight: false,
          suppressSizeToFit: true,
          sortable: false,
          width: 160,
        },
        {
          headerName: 'AccrualLeave',
          field: 'accrualLeave',
          filter: false,
          autoHeight: false,
          suppressSizeToFit: true,
          sortable: false,
          width: 150,
  
        },
        {
          headerName: 'ConsumeLeave',
          field: 'consumeLeave',
          filter: false,
          autoHeight: false,
          suppressSizeToFit: true,
          sortable: false,
          width: 150,
  
        }
        ,
        {
          headerName: 'BalanceLeave',
          field: 'balanceLeave',
          filter: false,
          autoHeight: false,
          suppressSizeToFit: true,
          sortable: false,
          width: 150,
  
        }
       ]
        return columnDefs;
    }
	
    
}
