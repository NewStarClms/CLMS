import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { saveAttendancePolicyAction } from '../store/actions/master.action';
import { attendancepolicy, organizationMapping } from '../store/model/master-data.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { AppCoreCommonService } from './app.core-common.services';
import { UserGroupService } from './user-group.service';

@Injectable({
  providedIn: 'root'
})
export class AttendancePolicyMasterService {
  
  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isEditable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  //appCoreService: any;
  private _attendancePolicyMasterDetail:BehaviorSubject<attendancepolicy> = new BehaviorSubject<attendancepolicy>(null);
 attendancePolicyMasterStateList: BehaviorSubject<Array<attendancepolicy>>= new BehaviorSubject<Array<attendancepolicy>>([]);
    private _PolicyMappingDetail:BehaviorSubject<organizationMapping> = new BehaviorSubject<organizationMapping>(null);
  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<any>,
    private userGroupService: UserGroupService,
    private notificationService:NotificationService,
    private appCoreCommonService: AppCoreCommonService,
    private router:Router
  ) {
    this._isEditable.next(false);
    this._isEditable.asObservable();
   }
   setVisibility(val){
    this._visiblePopup.next(val);
    }

    getVisiblity(){
    return this._visiblePopup.asObservable();
    }
    public fetchAttendancePolicyMasterData() {
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.GET;
      serviceConf.path = PATH.FETCH_ATTENDANCE_POLICY_MASTER;
      serviceConf.requestHeader = {};
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
        if (response) {
          this.attendancePolicyMasterStateList.next(response.policyes);
          this._store.dispatch(new saveAttendancePolicyAction(response.policyes));
        }
        return response;
      });
  
    }
    saveAttendancePolicyMaster(params){
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.POST;
      serviceConf.path = PATH.FETCH_ATTENDANCE_POLICY_MASTER;
      serviceConf.requestHeader = {};
      const payload: attendancepolicy = {
        policyID: 0,
    policyTypeID: 1,
    policyName: params.policyName,
    description: params.description,
    mappedOnOrganization: params.mappedOnOrganization,
    mappingStatus: params.mappingStatus,
    attendancePolicyID: 0,
    cutOffDay: params.cutOffDay,
    isOptimistic: params.isOptimistic,
    maxBackDaysAR: params.maxBackDaysAR,
    maxCountInMonthAR: params.maxCountInMonthAR,
    awAasAAA: params.awAasAAA,
    ahAasAAA: params.ahAasAAA,
    minDayToHoliDayAsPaid: params.minDayToHoliDayAsPaid,
    minDayToWeeklyOfAsPaid: params.minDayToWeeklyOfAsPaid,
    maxWorkingHours: params.maxWorkingHours,
    maxWorkingBasedOn: params.maxWorkingBasedOn,
    punchInShift: params.punchInShift,
    halfDayMarking: params.halfDayMarking,
    srtMarking: params.srtMarking,
    otosSetting: params.otosSetting,
    considerOutWork: params.considerOutWork,
    deductOutWork: params.deductOutWork,
    presentOnWeeklyOff: params.presentOnWeeklyOff,
    presentOnHoliday: params.presentOnHoliday,
    missPunchAsAbsent: params.missPunchAsAbsent,
    missPunchAsHalfDay: params.missPunchAsHalfDay,
    roundTheClockWorking: params.roundTheClockWorking,
    workingWithInOutMode: params.workingWithInOutMode,
    workingHoursStartFromShiftStart: params.workingHoursStartFromShiftStart,
    workingHoursEndOnShiftEnd: params.workingHoursEndOnShiftEnd,
    workingHoursRound: params.workingHoursRound,
    statusBasedOnWorkingHoursInShift: params.statusBasedOnWorkingHoursInShift,
    gatePassCountInDay: params.gatePassCountInDay,
    maximumGatePassDuration: params.maximumGatePassDuration,
    minimumGatePassDuration: params.minimumGatePassDuration,
    gatePassCountMonth: params.gatePassCountMonth,
    maximumGatePassDurationInMonth: params.maximumGatePassDurationInMonth,
    allowExceptionForGatePass: params.allowExceptionForGatePass,
    backDayGatePassAllow: params.backDayGatePassAllow,
    maxBackDayGatePass: params.maxBackDayGatePass,
    duplicateCheckMinute: params.duplicateCheckMinute,
    endTimeForInPunch: params.endTimeForInPunch,
    endTimeForOutPunch: params.endTimeForOutPunch,
    allowMaxWorkingHoursInMultiplePunch: params.allowMaxWorkingHoursInMultiplePunch,
    fourPunchInNightShift: params.fourPunchInNightShift,
    shiftType: params.shiftType,
    defaultShiftId: params.defaultShiftId,
    allowShift: params.allowShift,
    autoShift: params.autoShift,
    earlyMinuteAutoShift: params.earlyMinuteAutoShift,
    lateMinuteAutoShift: params.lateMinuteAutoShift,
    woIncludeInRotation: params.woIncludeInRotation,
    hldIncludeInRotation: params.hldIncludeInRotation,
    shiftRotationDays: params.shiftRotationDays,
    allowShiftOnWO: params.allowShiftOnWO,
    defaultShiftOnWO: params.defaultShiftOnWO,
    weeklyOffSun: params.weeklyOffSun,
    weeklyOffMon: params.weeklyOffMon,
    weeklyOffTue: params.weeklyOffTue,
    weeklyOffWed: params.weeklyOffWed,
    weeklyOffThr: params.weeklyOffThr,
    weeklyOffFri: params.weeklyOffFri,
    weeklyOffSat: params.weeklyOffSat,
    otFormula: params.otFormula,
    otInMinus: params.otInMinus,
    allowOTOnHLD: params.allowOTOnHLD,
    deductOTOnHLD: params.deductOTOnHLD,
    maxOTOnHLD: params.maxOTOnHLD,
    allowOTOnWO: params.allowOTOnWO,
    deductOTOnWO: params.deductOTOnWO,
    maxOTOnWO: params.maxOTOnWO,
    allowOTOnNHLD: params.allowOTOnNHLD,
    deductOTOnNHLD: params.deductOTOnNHLD,
    maxOTOnNHLD: params.maxOTOnNHLD,
    minEarlyComingForOT: params.minEarlyComingForOT,
    maxEarlyComingForOT: params.maxEarlyComingForOT,
    minLateGoingForOT: params.minLateGoingForOT,
    maxLateGoingForOT: params.maxLateGoingForOT,
    otRound: params.otRound,
    otRoundFormula: params.otRoundFormula,
    roundValue1: params.roundValue1,
    roundValue2: params.roundValue2,
    secondHalfPresentAndRestOT: params.secondHalfPresentAndRestOT,
    adminApprovalRequiredForOT: params.adminApprovalRequiredForOT,
    managerApprovalRequiredForOT: params.managerApprovalRequiredForOT,
    allowWorkFlowAprovalForOT: params.allowWorkFlowAprovalForOT,
    autoInitiateRequestForOT: params.autoInitiateRequestForOT,
    allowCof: params.allowCof,
    allowCofFor: params.allowCofFor,
    minHoursForFullCof: params.minHoursForFullCof,
    minHoursForHalfCof: params.minHoursForHalfCof,
    cofExpiredDays: params.cofExpiredDays,
    workingDaysCof: params.workingDaysCof,
    weeklyOffCof: params.weeklyOffCof,
    holidayCof: params.holidayCof,
    nationalHolidayCof: params.nationalHolidayCof,
    autoCredit: params.autoCredit,
    maxCreditInMonth: params.maxCreditInMonth,
    adminApprovalRequiredForCof: params.adminApprovalRequiredForCof,
    managerApprovalRequiredForCof: params.managerApprovalRequiredForCof,
    applicableFrom: params.applicableFrom,
    workingHoursAccordingToShift: params.workingHoursAccordingToShift,
    generateMultiple: params.generateMultiple,
    lateEarlyDeductionApplicable: params.lateEarlyDeductionApplicable,
    autoRunLateEarlyDeduction: params.autoRunLateEarlyDeduction,
    webPunch: params.webPunch,
    mobilePunch: params.mobilePunch,
    numberOfPhoto: params.numberOfPhoto,
    geoRadius: params.geoRadius,
    lateEarlyDeductionPolicies:params.lateEarlyDeductionPolicies,
      }
      serviceConf.payloadObjects = payload;
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
        if (response.messageType === 0) {
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
          this.fetchAttendancePolicyMasterData();
          this.router.navigate(['/time-office/attendance-policy/']);
        }else{
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
          this.router.navigate(['/time-office/add-edit-attendance-policy-master/' + params.policyID]);
        }
        return response;
      });
  
    }
    public prepareColumnForGrid(){

      const columnDefs: any[] = [
        
        {
          headerName: 'Policy Name',
          field: 'policyName',
          filter: true,
          autoHeight: true,
          suppressSizeToFit: true,
          sortable: true,
          width: 200,
  
        },
        {
          headerName: 'Description',
          field: 'description',
          filter: true,
          sortable: true,
          width: 210,
        },
        {
          headerName: 'Mapped On Organization',
          field: 'mappedOnOrganization',
          filter: true,
          sortable: true,
          width: 210,
          icons: true,
        },
        {
          headerName: 'Mapping Status',
          field: 'mappingStatus',
          filter: true,
          sortable: true,
          width: 210,         
  
        },
        {
          headerName: "",
          minWidth: 0,
          editable: false,
          colId: "action",
          deleteAllow: true,
          editAllow: true,
          policyMapping:true,
          policyOuMap:true
          //headerName: "",
          //minWidth: 0,
          //editable: false,
          //colId: "action",
          // deleteAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.Attendance_Policy, UI_CONSTANT.ACTIONS.DELETE),
          // editAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.Attendance_Policy, UI_CONSTANT.ACTIONS.UPDATE),
          //policyMapping:true,
          //policyOuMap:true
        }
        
      ]
      return columnDefs;

    }
    deleteCellFromRemote(params) {
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.DELETE;
      serviceConf.path = PATH.FETCH_ATTENDANCE_POLICY_MASTER + '/' + params.data.policyID;
      serviceConf.requestHeader = {};
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
        if (response.messageType === 0) {
             this.fetchAttendancePolicyMasterData()
            this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        }else{
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        }
        return response;
      });
  
    }
    updateStateOfCell(params) {
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.PUT;
      serviceConf.path = PATH.FETCH_ATTENDANCE_POLICY_MASTER;
      serviceConf.requestHeader = {};
      const payload: attendancepolicy = params;
      serviceConf.payloadObjects = payload;
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
        if (response.messageType === 0) {
          this.notificationService.showSuccess('Update successfully', UI_CONSTANT.SEVERITY.SUCCESS);
          this.fetchAttendancePolicyMasterData();
          this.router.navigate(['/time-office/attendance-policy/']);
        }else{
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
          this.router.navigate(['/time-office/add-edit-attendance-policy-master/' + params.policyID]);
        }
        return response;
      });
    }
  
    getCSVReport(data, fileName){
      this.appCoreCommonService.exportExcel(data, fileName);
    }
    fetchAttendancePolicyMasterDetail(id):Observable<any>{
      console.log(id);
      const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.GET;
        serviceConf.path = PATH.FETCH_ATTENDANCE_POLICY_MASTER+"/"+id;
        serviceConf.requestHeader = {};
        this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
          if(response && response.policy){
             this._attendancePolicyMasterDetail.next(response.policy)
             return response.policy;
          }
        });
        return this._attendancePolicyMasterDetail.asObservable();
    }
    SaveOrgnaizationMapping(params) {
     
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.PUT;
      serviceConf.path = PATH.FETCH_ATTENDANCE_POLICY_MASTER+"/organizatioMapping";
      serviceConf.requestHeader = {};
      const payload: organizationMapping = params;
      serviceConf.payloadObjects = {
        policyID: params.policyID,
        policyTypeID: params.policyTypeID,
        workFlowID: params.workFlowID,
        organizationKeyID: params.organizationKeyID,
        locationKeyID: params.locationKeyID,
        organization: params.organization,
        location: params.location 
      };
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
        if (response.messageType === 0) {
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
          this.fetchAttendancePolicyMasterData();
          this.setVisibility(false);
        }else{
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
          this.setVisibility(true);
        }
        return response;
      });
    }
    fetchPolicyMappingDetail(id):Observable<any>{
      const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.GET;
        serviceConf.path = PATH.FETCH_ATTENDANCE_POLICY_MASTER+"/organizatioMapping/"+id;
        serviceConf.requestHeader = {};
        return this.remoteService.httpServiceRequest(serviceConf)?.pipe();
    }
}
