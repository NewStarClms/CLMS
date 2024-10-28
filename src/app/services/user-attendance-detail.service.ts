import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { AllPolicy, AttendanceMapped, AttendancesDetail, BackDataProcess, DeleteGatePass, DownloadPolicyResponse, GatePass, GatePassDetail, ManualPunchMulti, ManualPunchSingle, PunchDetail, RosterProcessSingle, SearchGatePassDetail, ShiftChange } from '../store/model/userActionAttendanceDetail.model';
import { AppCoreCommonService } from './app.core-common.services';
import { saveLeaveEncashmentTimeoffice } from '../store/model/attendance-process.model';
import { ESSRequestModel } from '../store/model/workflow.model';
import * as moment from 'moment';
import { RequestFlowService } from './request-flow.service';

@Injectable({
  providedIn: 'root'
})
export class UserAttendanceDetailService {

public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
public _visiblemanualMultiPopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
public _visibleRosterPopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
public _visibleRosterLockUnlockPopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
public _visibleShiftPopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
public _visibleBackDataProcessPopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
private _attendanceDetail:BehaviorSubject<Array<AttendancesDetail>> = new BehaviorSubject<Array<AttendancesDetail>>([]);
public _visiblePopupCarryForword: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
public _visiblePopupLeaveEncash: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
public _visiblePopupEssRequest:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
public _visiblePopupRequestByEss: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

private _punchDetail:BehaviorSubject<PunchDetail> = new BehaviorSubject<PunchDetail>(null);
private _employeeMappedShift:BehaviorSubject<AttendanceMapped> = new BehaviorSubject<AttendanceMapped>(null);
private _employeeAllPolicy:BehaviorSubject<AllPolicy> = new BehaviorSubject<AllPolicy>(null);
public _visibleGatePassPopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
public _gatePassDetail: BehaviorSubject<GatePassDetail> = new BehaviorSubject<GatePassDetail>(null);
public _visibleLeaveRequestPopup:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
public _downloadattendancepolicy:BehaviorSubject<string>=new BehaviorSubject<string>(null);
public _downloadleavepolicy:BehaviorSubject<string>=new BehaviorSubject<string>(null);
public _downloadholidaypolicy:BehaviorSubject<string>=new BehaviorSubject<string>(null);

public _visibleVerificationPopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
public _visibleLateEarlyDeduction: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

private _essRequestData:BehaviorSubject<Array<ESSRequestModel>> = new BehaviorSubject<Array<ESSRequestModel>>([]);

constructor
(
    private remoteService: RemoteService<any>,
    private _store: Store<AttendancesDetail>,
    private appCoreCommonService: AppCoreCommonService,
    private notificationService:NotificationService,
    private requestService: RequestFlowService
  ) {
  }
  setVisibilityManualSingle(val){
    this._visiblePopup.next(val);
    }
  getVisiblityManualSingle(){
  return this._visiblePopup.asObservable();
  }
  setVisibilityManualMulti(val){
    this._visiblemanualMultiPopup.next(val);
    }
  getVisiblityManualmulti(){
  return this._visiblemanualMultiPopup.asObservable();
  }
  setVisibilityshift(val){
    this._visibleShiftPopup.next(val);
    }
  getVisiblityshift(){
  return this._visibleShiftPopup.asObservable();
  }
  setVisibilityroster(val){
    this._visibleRosterPopup.next(val);
    }
  getVisiblityroster(){
  return this._visibleRosterPopup.asObservable();
  }
  setVisibilityrosterlockUnlock(val){
    this._visibleRosterLockUnlockPopup.next(val);
    }
  getVisiblityrosterlockUnlock(){
  return this._visibleRosterLockUnlockPopup.asObservable();
  }
  setVisibilitybackData(val){
    this._visibleBackDataProcessPopup.next(val);
    }
  getVisiblitybackData(){
  return this._visibleBackDataProcessPopup.asObservable();
  }
  setVisibilitygatePassData(val){
    this._visibleGatePassPopup.next(val);
    }
  getVisiblitygatePassData(){
  return this._visibleGatePassPopup.asObservable();
  }
  setVisibilityLeaveRequestData(val){
    this._visibleLeaveRequestPopup.next(val);
    }
  getVisiblityLeaveRequestData(){
  return this._visibleLeaveRequestPopup.asObservable();
  }
  setPopupVisibility(val){
    this._visiblePopup.next(val);
  }
  getPopupVisibility(){
     return this._visiblePopup.asObservable();
  }
  setPopupLeaveEncashVisibility(val){
    this._visiblePopupLeaveEncash.next(val);
  }
  getPopupLeaveEncashVisibility(){
     return this._visiblePopupLeaveEncash.asObservable();
  }
  setPopupLeaveCarryForwordVisibility(val){
    this._visiblePopupCarryForword.next(val);
  }
  getPopupLeaveCarryForwordVisibility(){
     return this._visiblePopupCarryForword.asObservable();
  }
  setVerificationPopupVisibility(val){
    this._visibleVerificationPopup.next(val);
    }
  getVerificationPopupVisibility(){
  return this._visibleVerificationPopup.asObservable();
  }

  setLateEarlyDeductionPopupVisibility(val){
    this._visibleLateEarlyDeduction.next(val);
    }
  getLateEarlyDeductionPopupVisibility(){
  return this._visibleLateEarlyDeduction.asObservable();
  }

  refreshESSRequestGrid(){
    return this._essRequestData.asObservable();
  }
  
    setVisibilityEssRequest(val){
      this._visiblePopupEssRequest.next(val);
      }
    getVisiblityEssRequest(){
    return this._visiblePopupEssRequest.asObservable();
    }

    setRequestByEssPopupVisibility(val){
      this._visiblePopupRequestByEss.next(val);
    }
    getRequestByEssVisibility(){
    return this._visiblePopupRequestByEss.asObservable();
    }
  
  
  fetchAttendanceDetailData(empid,fromdate,todate):Observable<any>{
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_USER_ATTENDANCE_DETAIL+empid+'/'+fromdate+'/'+todate;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response && response.punches){
        // console.log(response);
        // this._attendanceDetail.next(response.punches);
        // this._store.dispatch(new saveAttendanceDetailAction(response.punches));
        this._attendanceDetail.next(response.punches)
        return response.punches;
      }
      
    });
    return this._attendanceDetail.asObservable();
  }
 
  fetchPunchDetailData(empid,fromdate,todate):Observable<any>{
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_USER_PUNCH_DETAIL+'/'+empid+'/'+fromdate+'/'+todate;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response && response.punches){
        // console.log(response.punches);
        this._punchDetail.next(response.punches)
        return response.punches;
      }
    });
    return this._punchDetail.asObservable();
  }
  getCSVReport(data, fileName){
    this.appCoreCommonService.exportExcel(data, fileName);
  }
  saveManualPunchSingle(param){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.SAVE_MANUAL_ATT_PROCESS+'ManualPunch';
    serviceConf.requestHeader = {};
    const payload: ManualPunchSingle = {
      employeeID: param.employeeID,
      punchTime: param.punchTime,
      reason: param.reason,
      inOut: param.inOut,
      systemIP: '00.00.00.00',
      attendancePunchID:0
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
       
      }else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
       
      }
      return response;
    });

  }
  saveManualPunchMulti(param){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.SAVE_MANUAL_ATT_PROCESS+'ManualPunchByRangeRequest';
    serviceConf.requestHeader = {};
    const payload: ManualPunchMulti = {
      employeeID: 0,
  fromDate: param.fromDate,
  toDate: param.toDate,
  punchType: param.punchType,
  punchTime: param.punchTime,
  autoMinut: param.autoMinut,
  weeklyOffInclue: param.weeklyOffInclue,
  holidayInclude: param.holidayInclude,
  inOut: param.inOut,
  machineID: param.machineID,
  reason: param.reason,
  systemIP:'00.00.00.00'
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
       
      }else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
       
      }
      return response;
    });

  }
  SaveRosterProcessSingle(param){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.SAVE_MANUAL_ATT_PROCESS+'RosterProcess';
    serviceConf.requestHeader = {};
    const payload: RosterProcessSingle = {
      employeeID: param.employeeID,
  fromDate: param.fromDate,
  toDate: param.toDate,
  processFlag:param.processFlag
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
      }else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        
      }
      return response;
    });

  }
  SaveRosterProcessMulti(param){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.SAVE_MANUAL_ATT_PROCESS+'RosterProcessRequest';
    serviceConf.requestHeader = {};
    const payload: RosterProcessSingle = {
      employeeID: 0,
  fromDate: param.fromDate,
  toDate: param.toDate,
  processFlag:param.processFlag
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
    
      }else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
       
      }
      return response;
    });

  }
  SaveShiftChangeSingle(param){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.SAVE_MANUAL_ATT_PROCESS+'ShiftChange';
    serviceConf.requestHeader = {};
    const payload: ShiftChange = {
      employeeID: param.employeeID,
      fromDate:param.fromDate,
      toDate: param.toDate,
      shiftCode: param.shiftCode,
      action: param.action,
      replaceWeeklyOff: param.replaceWeeklyOff,
      replaceHoliday: param.replaceHoliday,
      punchProcess: param.punchProcess
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        
      }else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        
      }
      return response;
    });

  }
  SaveShiftChangeMulti(param){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.SAVE_MANUAL_ATT_PROCESS+'ShiftMultiTrasaction';
    serviceConf.requestHeader = {};
    const payload: ShiftChange = {
      employeeID: 0,
      fromDate:param.fromDate,
      toDate: param.toDate,
      shiftCode: param.shiftCode,
      action: param.action,
      replaceWeeklyOff: param.replaceWeeklyOff,
      replaceHoliday: param.replaceHoliday,
      punchProcess: param.punchProcess
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        
      }else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        
      }
      return response;
    });

  }
  fetchEmployeeMappedShiftData(empid):Observable<any>{
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_USER_ATTENDANCE_DETAIL+'EmployeeMappedShift/'+empid;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response && response.shifts){
       // console.log(response);
        this._employeeMappedShift.next(response.shifts)
        return response.shifts;
      }
    });
    return this._employeeMappedShift.asObservable();
  }
  SaveBackDataProcessSingle(param){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.SAVE_MANUAL_ATT_PROCESS+'BackDataProcess';
    serviceConf.requestHeader = {};
    const payload: BackDataProcess = {
      employeeID: param.employeeID,
      fromDate:param.fromDate,
      toDate: param.toDate,
      withRawPunch:param.withRawPunch
    };
    //console.log('single',payload);
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
       
      }else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        
      }
      return response;
    });

  }
  SaveBackDataProcessMulti(param){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.SAVE_MANUAL_ATT_PROCESS+'BackDataProcessRequest';
    serviceConf.requestHeader = {};
    const payload: BackDataProcess = {
      employeeID: 0,
      fromDate:param.fromDate,
      toDate: param.toDate,
      withRawPunch:param.withRawPunch
    };
    //console.log('multi',payload);
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
      }else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
      return response;
    });

  }

  SubmitVerificationProcess(employeeID:number, fromDate: string, toDate:string){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.SUBMIT_VERIFICATION_PROCESS;
    serviceConf.requestHeader = {};
    serviceConf.payloadObjects = {
      employeeID: employeeID,
      fromDate:fromDate,
      toDate: toDate
    };
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
       
      }else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        
      }
      return response;
    });

  }


  submitLateDeductionProcess(employeeID:number, fromDate: string, toDate:string,processFlag:string){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.SUBMIT_LATE_DEDUCTION_PROCESS;
    serviceConf.requestHeader = {};
    serviceConf.payloadObjects = {
      employeeID: employeeID,
      fromDate:fromDate,
      toDate: toDate,
      processFlag:processFlag
    };
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
       
      }else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        
      }
      return response;
    });

  }



  deleteSingleManualPunch(empid,punchId) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.DELETE;
    serviceConf.path = PATH.SAVE_MANUAL_ATT_PROCESS + 'DeleteManualPunch/'+empid+'/'+ punchId ;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
       
      }else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
      return response;
    });

  }
  fetchEmployeeAllPolicyData(empid):Observable<any>{
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_USER_ATTENDANCE_DETAIL+'EmployeeAllPolicy/'+empid;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response && response.policys){
       //console.log(response);
        this._employeeAllPolicy.next(response.policys)
        return response.policys;
      }
    });
    return this._employeeAllPolicy.asObservable();
  }
  SaveRosterLockUnlockSingle(param){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.SAVE_MANUAL_ATT_PROCESS+'RosterLockUnlock';
    serviceConf.requestHeader = {};
    const payload: RosterProcessSingle = {
      employeeID: param.employeeID,
  fromDate: param.fromDate,
  toDate: param.toDate,
  processFlag:param.processFlag
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
      }else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        
      }
      return response;
    });

  }
  SaveRosterLockUnlockMulti(param){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.SAVE_MANUAL_ATT_PROCESS+'RosterLockUnlock';
    serviceConf.requestHeader = {};
    const payload: RosterProcessSingle = {
      employeeID: 0,
  fromDate: param.fromDate,
  toDate: param.toDate,
  processFlag:param.processFlag
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
    
      }else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
       
      }
      return response;
    });

  }
  SaveGatePassData(param){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.GATE_PASS;
    serviceConf.requestHeader = {};
    const payload: GatePass = {
      employeeID: param.employeeID,
      attendanceDate:param.attendanceDate,
      startTime: param.startTime,
      endTime:param.endTime,
      gatePassType:param.gatePassType,
      requestRemark:param.requestRemark,
      duration:param.duration
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
       
      }else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        
      }
      return response;
    });
  }
  fetchGatePassDetailData(param):Observable<any>{
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.GATE_PASS+'/GetList';
    serviceConf.requestHeader = {};
    const payload: SearchGatePassDetail = {
      employeeID: param.employeeID,
  fromDate: param.fromDate,
  toDate: param.toDate,
  requestID:param.requestID,
  transactionID:param.transactionID,
  requestStatus:param.requestStatus,
  workFlowID:param.workFlowID
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response){
       // console.log(response);
        this._gatePassDetail.next(response)
        return response;
      }
    });
    return this._gatePassDetail.asObservable();
  }
  deletegatePassData(param) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.GATE_PASS+'/Cancel';
    serviceConf.requestHeader = {};
     const payload: DeleteGatePass = {
      employeeID: param.employeeID,
      remark:param.remark,
      requestID:param.requestID
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
      }else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
      return response;
    });

  }

  fetchEmployeeAttendance(employeeID:number, fromDt:string, toDt: string){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_EMPLOYEE_ATTENDANCE +employeeID+'/'+fromDt+'/'+toDt;
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf).pipe(map(response =>{
      if(response){
        return response;
      }
    }));
  }

  fetchEmployeeAttendanceStats(fromDt:string){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_EMPLOYEE_ATTENDANCE_STATS +fromDt;
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf).pipe(map(response =>{
      if(response){
        return response;
      }
    }));
  }
  fetchEmployeeAttendanceStatsDownload(fromDt, report){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_EMPLOYEE_ATTENDANCE_STATS_DOWNLOAD;
    serviceConf.requestHeader = {};
    const payload={AttendanceDate: fromDt, Flag: report}
    serviceConf.payloadObjects=payload;
    return this.remoteService.httpServiceRequest(serviceConf).pipe(map(response =>{
      if(response){
        return response;
      }
    }));
  }

  fetchESSRequestDataForAdmin(workflowID,requestStatus,fromDate, toDate):Observable<any>{
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_ADMIN_REQUEST_DATA+"?workflowID="+workflowID+"&requestStatus="+requestStatus;
    if(fromDate) serviceConf.path=serviceConf.path+"&RequestDateFrom="+fromDate;
    if(toDate) serviceConf.path=serviceConf.path+"&RequestDateTo="+toDate;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response && response.requests){
        this._essRequestData.next(response.requests)
        return response.requests;
      }
      
    });
    return this._essRequestData.asObservable();
  }

  approveRejectESSRequestByAdmin(requests: any, index, requestTypeID, fromDate, toDate){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.APPROVE_REJECT_ESS_REQUEST_BY_ADMIN;
    serviceConf.requestHeader = {};
    var payloadObject ={
      transactionID: requests[index].transactionID,
      requestStatusID: requests[index].requestStatusID,
      workFlowID: requests[index].workFlowID,
      remark: requests[index].remark,
      employeeID: requests[index].employeeID
    }
    serviceConf.payloadObjects=payloadObject;
    return this.remoteService.httpServiceRequest(serviceConf).subscribe(res => {
      if(index < requests.length-1){
        index=index+1;
        this.approveRejectESSRequestByAdmin(requests, index, requestTypeID, fromDate, toDate);
      }
      else{
        this.requestService.setRemarkVisibility(false);
        this.fetchESSRequestDataForAdmin(requests[0].workFlowID,requestTypeID,fromDate,toDate);
        this.notificationService.showSuccess(res.message,null);
      }
    })
  }

  prepareColumnForDownload() {
    const columnDefs: any[] = [
      {
        headerName: 'SNo.',
        field: 'sNo',
        filter: true,
        sortable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Employee Code',
        field: 'employeeCode',
        filter: true,
        suppressSizeToFit: true,
        sortable: true,

      },
      {
        headerName: 'Employee Name',
        field: 'employeeName',
        filter: true,
        sortable: true,
        suppressSizeToFit: true
      }, 
      {
        headerName: 'Company',
        field: 'company',
        filter: true,
        sortable: true,
        suppressSizeToFit: true
      }, 
      {
        headerName: 'Department',
        field: 'department',
        filter: true,
        sortable: true,
        suppressSizeToFit: true
      }, 
      {
        headerName: 'Section',
        field: 'section',
        filter: true,
        sortable: true,
        suppressSizeToFit: true
      }, 
    ]
    return columnDefs;
  }
  fetchMonths(){
    var monthList = [
      { Value: "1", Text: 'JAN' },
      { Value: "2", Text: 'FEB' },
      { Value: "3", Text: 'MAR' },
      { Value: "4", Text: 'APR' },
      { Value: "5", Text: 'MAY' },
      { Value: "6", Text: 'JUN' },
      { Value: "7", Text: 'JUL' },
      { Value: "8", Text: 'AUG' },
      { Value: "9", Text: 'SEP' },
      { Value: "10", Text: 'OCT' },
      { Value: "11", Text: 'NOV' },
      { Value: "12", Text: 'DEC' }
   ];
   return monthList;
  }
  fetchYears(){
    let currentYear = new Date().getFullYear(); 
    let earliestYear = 1970;     
    let yearList :any[]=[];
    while (currentYear >= earliestYear) {      
      let yearOb={year: currentYear};
      yearList.push(yearOb);      
      currentYear -= 1;    
    }
    return yearList;
  }
  fnDownloadAttendancePolicy() {//:Observable<any>{
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.DOWNLOAD_POLICY+'Attendance';
    serviceConf.requestHeader = {};
    return this.remoteService.downloadFile(serviceConf);//?.subscribe(response => {
    //   if (response) {
    //     this._downloadattendancepolicy.next(response.message)
    //     return response;
    //   }
    // });
    // return this._downloadattendancepolicy.asObservable();
  }
  fnDownloadLeavePolicy(){//:Observable<any>{
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.DOWNLOAD_POLICY+'Leave';
    serviceConf.requestHeader = {};
    return this.remoteService.downloadFile(serviceConf);//?.subscribe(response => {
    //   if (response) {
    //     this._downloadleavepolicy.next(response.message)
    //     return response;
    //   }
    // });
    // return this._downloadleavepolicy.asObservable();
  }

  fnDownloadHolidayPolicy(){//:Observable<any>{
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.DOWNLOAD_POLICY+'HolidayCalendar';
    serviceConf.requestHeader = {};
    return this.remoteService.downloadFile(serviceConf);//?.subscribe(response =>{
    //   if (response) {
    //     this._downloadholidaypolicy.next(response.message)
    //     return response;
    //   }
    // });
    // return this._downloadholidaypolicy.asObservable();
  }

  LeaveCarryForwadColumnForGrid() {
    const columnDefs:any[] = [
      {
        headerName: '',
        field: 'leaveID',
        filter: false,
        editable: false,
        sortable: false,
        checkbox: true,
        suppressSizeToFit:true,
        hideData: true
        
    },
    {
        headerName: 'Employee Code',
        field: 'employeeCode',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
        width: 180,
      },
      {
        headerName: 'Employee Name',
        field: 'employeeName',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
        width: 130,
      },
      {
        headerName: 'Company',
        field: 'company',
        filter: true,
        sortable: true,
        width:170,
        },
      {
      headerName: 'Department',
      field: 'department',
      filter: true,
      sortable: true,
      width:170,
      },
      {
      headerName: 'Designation',
      field: 'designation',
      filter: true,
      suppressSizeToFit:true,
      sortable: true,
      width:150,
      },
      {
        headerName: 'Branch',
        field: 'branch',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
      },
      {
        headerName: 'Accrual',
        field: 'accrual',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
      },
      {
        headerName: 'Carry Forward',
        field: 'carryForward',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
      },
      {
        headerName: 'Consume',
        field: 'consume',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
      },
      {
        headerName: 'Balance',
        field: 'balance',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
      },
      {
        headerName: 'Laps Leave',
        field: 'lapsLeave',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
        editable: true,
      },
    ]
    return columnDefs;
  }







  LeaveEncashprepareColumnForGrid() {
    const columnDefs:any[] = [
      {
        headerName: '',
        field: 'employeeID',
        filter: false,
        editable: false,
        sortable: false,
        checkbox: true,
        suppressSizeToFit:true,
        hideData: true
        
    },{
        headerName: 'Employee Code',
        field: 'employeeCode',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
        width: 180,
      },
      {
        headerName: 'Employee Name',
        field: 'employeeName',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
        width: 130,
      },
      {
      headerName: 'Department',
      field: 'department',
      filter: true,
      sortable: true,
      width:170,
      },
      {
      headerName: 'Designation',
      field: 'designation',
      filter: true,
      suppressSizeToFit:true,
      sortable: true,
      width:150,
      },
      {
        headerName: 'Leave Code',
        field: 'leaveCode',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
      },
      {
        headerName: 'Accrual',
        field: 'accrual',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
      },
      {
        headerName: 'Encashed',
        field: 'encashed',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
      },
      {
        headerName: 'Encash',
        field: 'encash',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
        textfiled:true
      },
      {
        headerName: 'EncashAmount',
        field: 'encashAmount',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
      },
      {
        headerName: 'Consume',
        field: 'consume',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
      },
      {
        headerName: 'Balance',
        field: 'balance',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
      },
      {
        headerName: 'Paid',
        field: 'paid',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
      },
        
    ]
    return columnDefs;
  }

  prepareColumnForESSRequestGrid() {
    const columnDefs: any[] = [
      {
        headerName: '',
        field: 'requestID',
        filter: false,
        editable: false,
        sortable: false,
        checkbox: true,
        suppressSizeToFit:true,
        hideData: true
            
    },
      {
        headerName: 'Employee',
        field: 'employeeName',
        filter: true,
        autoHeight: true,
        suppressSizeToFit: true,
        sortable: true,
        // width: 230,
      }, 
      {
        headerName: 'Code',
        field: 'employeeCode',
        filter: true,
        autoHeight: true,
        suppressSizeToFit: true,
        sortable: true,
        // width: 230,
      }, 
      {
        headerName: 'Department',
        field: 'department',
        filter: true,
        autoHeight: true,
        suppressSizeToFit: true,
        sortable: true,
        // width: 230,
      }, 
      {
        headerName: 'Designation',
        field: 'designation',
        filter: true,
        autoHeight: true,
        suppressSizeToFit: true,
        sortable: true,
        // width: 230,
      }, 
      {
        headerName: 'Request Status',
        field: 'requestStatus',
        filter: true,
        autoHeight: true,
        suppressSizeToFit: true,
        sortable: true,
        // width: 130,
        highLight: true,
      },
      {
        headerName: 'Subject',
        field: 'inboxSubject',
        filter: true,
        autoHeight: true,
        suppressSizeToFit: true,
        sortable: true,
        width: 100
      },
      {
        headerName: 'Action Source',
        field: 'actionSource',
        filter: true,
        autoHeight: true,
        suppressSizeToFit: true,
        sortable: true,
        width: 130
      },
      {
        headerName: "Info",
        minWidth: 0,
        cellRenderer: "editableCellRendererComponent",
        editable: false,
        deleteAllow: false,
        editAllow: false,
        requestFlow: true,
       
        colId: "action"
      }
    ]
    return columnDefs;

  }
  saveLeaveEncashForEmployee(params){
    const path = PATH.ENCASH_PAYMENT+'Process';
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = path;
    serviceConf.requestHeader = {};
    const payload :saveLeaveEncashmentTimeoffice = params;
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.pipe().subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);

      } else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
    });
  }
  fetchLeaveEncashDetail(flag,leaveyear) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.ENCASH_PAYMENT+"employeeForLeaveEncash?LeaveYear="+leaveyear+"&Flag="+flag;
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf)?.pipe();
  }
  fetchLeaveCarryForwordDetail(flag,leaveyear) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.LEAVE_CARRY_FORWORD+"employeeForLeaveCarryForward?LeaveYear="+leaveyear+"&Flag="+flag;
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf)?.pipe();
  }
  saveLeaveLeaveCarryForwordForEmployee(params){
    const path = PATH.LEAVE_CARRY_FORWORD+'Process';
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = path;
    serviceConf.requestHeader = {};
    const payload :saveLeaveEncashmentTimeoffice = params;
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.pipe().subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);

      } else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
    });
  }
  
}
