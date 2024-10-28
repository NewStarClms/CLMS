import { Injectable } from "@angular/core";
import { HttpMethod } from "../common/constants/http-method.constants";
import { ServiceConfig } from "../store/model/serviceConfig.model";
import { PATH } from '../common/constants/service-path.constants';
import { RemoteService } from '../common/remote.service';
import { Store } from '@ngrx/store';
import { UI_CONSTANT } from "../common/constants/ui-constants";
import { BehaviorSubject, Observable } from "rxjs";
import { SaveRequestLeaveAction, SaveRequestApproveAction } from '../store/actions/request-flow.action';
import { NotificationService } from "../common/notification.service";
import { GatePass, GatePassRequest, PunchRegularizationInfo } from "../store/model/userActionAttendanceDetail.model";
import * as moment from "moment";

@Injectable({
  providedIn: 'root'
})
export class RequestFlowService {
  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public _visibleFlowPopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public _visibleDisplayPopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public _visibleRemarkPopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public _visibleGatePassPopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public _visibleLeaveRequestPopup:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public _visiblePunchRequestPopup:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public _gatePassRequestDataEmployee:BehaviorSubject<GatePass> = new BehaviorSubject<GatePass>(null);
  public _punchRequestDataEmployee:BehaviorSubject<PunchRegularizationInfo> = new BehaviorSubject<PunchRegularizationInfo>(null);
  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<any>,
    private notificationService:NotificationService
  ) {

  }
  setVisibility(val) {
    this._visiblePopup.next(val);
  }
  getVisiblity() {
    return this._visiblePopup.asObservable();
  }


  setflowVisibility(val) {
    this._visibleFlowPopup.next(val);
  }
  getflowVisiblity() {
    return this._visibleFlowPopup.asObservable();
  }

  setDisplayVisibility(val) {
    this._visibleDisplayPopup.next(val);
  }
  getDisplayVisiblity() {
    return this._visibleDisplayPopup.asObservable();
  }

  setRemarkVisibility(val) {
    this._visibleRemarkPopup.next(val);
  }
  getRemarkVisiblity() {
    return this._visibleRemarkPopup.asObservable();
  }

  setGatePassVisibility(val) {
    this._visibleGatePassPopup.next(val);
  }
  getGatePassVisiblity() {
    return this._visibleGatePassPopup.asObservable();
  }
  getLeaveRequestVisiblity(){
    return this._visibleLeaveRequestPopup.asObservable();
  }
  setLeaveRequestVisiblity(val){
    this._visibleLeaveRequestPopup.next(val);
  }
  getPunchRequestVisiblity(){
    return this._visiblePunchRequestPopup.asObservable();
  }
  setPunchRequestVisiblity(val){
    this._visiblePunchRequestPopup.next(val);
  }
  
  fetchRequestData(wfId, reqStatus, dateFrom, dateTo) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_REQUEST_FLOW_DATA + '/?WorkFlowID=' + wfId + '&RequestStatus=' + reqStatus + '&RequestDateFrom=' + dateFrom + '&RequestDateTo=' + dateTo;
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf).subscribe(res=>{
      if(res && res.requests){
        this._store.dispatch(new SaveRequestLeaveAction(res.requests))
      } else{
        this.notificationService.showError(res.message,null);
      }
    })
  }
  fetchRequestApproveData(wfId, reqStatus, dateFrom, dateTo) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_REQUEST_APPROVE_DATA + '/?WorkFlowID=' + wfId + '&RequestStatus=' + reqStatus + '&RequestDateFrom=' + dateFrom + '&RequestDateTo=' + dateTo;
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf).subscribe(res=>{
      if(res && res.requests){
        this._store.dispatch(new SaveRequestApproveAction(res.requests))
      } else{
        this.notificationService.showError(res.message,null);
      }
    })
  }
  fetchWorkflowRequestData(tranID,empID) {
    console.log(tranID)
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_WORKFLOW_REQUESTDETAIL + '/?EmployeeID=' + empID + '&TransactionID=' + tranID;
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf)
  }
  approveEssRequest(payload, selectedStatus, workflowID, fromDate, toDate) {
    const date = new Date(), y = date.getFullYear(), m = date.getMonth();
   // const fromDate = moment(new Date(y, m, 1), UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
    //const toDate = moment( new Date(y, m + 1, 0), UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.APPROVE_REQUEST_BY_ESS;
    serviceConf.requestHeader = {};
    serviceConf.payloadObjects=payload;
    return this.remoteService.httpServiceRequest(serviceConf).subscribe(res => {
      if(res && res.messageType===0){
        const status= UI_CONSTANT.REQUESTSTATUS.filter(v=>v.value === payload.requestStatusID)[0].key;
        this.notificationService.showSuccess(res.message,status);
        this.fetchRequestApproveData(workflowID,selectedStatus,fromDate,toDate);
       // console.log(res);
      }else{
        this.notificationService.showError(res.message,null);
      }
    })
  }
  approveMultipleEssRequest(requests,index, selectedStatus,workflowID, fromDate, toDate) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.APPROVE_REQUEST_BY_ESS;
    serviceConf.requestHeader = {};
    serviceConf.payloadObjects=requests[index];
    return this.remoteService.httpServiceRequest(serviceConf).subscribe(res => {
      if(res && res.messageType===0){
        const status= UI_CONSTANT.REQUESTSTATUS.filter(v=>v.value === requests[index].requestStatusID)[0].key;
        this.notificationService.showSuccess(res.message,status);
        index = index +1;
        if(index < requests.length)
          this.approveMultipleEssRequest(requests,index, selectedStatus,workflowID, fromDate, toDate);
        else{     
          this.fetchRequestApproveData(workflowID,selectedStatus,fromDate,toDate);
        }
       // console.log(res);
      }else{
        this.notificationService.showError(res.message,null);
      }
    })
  }
  undoRequest(payload) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.CANCEL_REQUEST_BY_USER;
    serviceConf.requestHeader = {};
    serviceConf.payloadObjects=payload;
    return this.remoteService.httpServiceRequest(serviceConf).subscribe(res => {
      if(res && res.messageType===0){
        this.notificationService.showSuccess(res.message,null);
        console.log(res);
      }else{
        this.notificationService.showError(res.message,null);
      }
    })
  }
  
  prepareColumnForGrid() {
    const columnDefs: any[] = [
      {
        headerName: 'Action',
        field: 'remark',
        filter: true,
        autoHeight: true,
        suppressSizeToFit: true,
        sortable: true,
        width: 100,
        isRemark: true,
      },
      {
        headerName: 'Detail',
        field: 'inboxName',
        filter: true,
        autoHeight: true,
        suppressSizeToFit: true,
        sortable: true,
      }, {
        headerName: 'Request Date',
        field: 'requestDate',
        filter: true,
        autoHeight: true,
        suppressSizeToFit: true,
        sortable: true,
        cellEditorParams: UI_CONSTANT.MASTER.FORMATDATE
      },

      {
        headerName: 'Request Status',
        field: 'requestStatus',
        filter: true,
        autoHeight: true,
        suppressSizeToFit: true,
        sortable: true,
        highLight: true,
      },
      {
        headerName: 'Subject',
        field: 'inboxSubject',
        filter: true,
        autoHeight: true,
        suppressSizeToFit: true,
        sortable: true,
        width: 130
      },
      {
        headerName: 'Action Source',
        field: 'actionSource',
        filter: true,
        autoHeight: true,
        suppressSizeToFit: true,
        sortable: true,
      },
      {
        headerName: "Info",
        minWidth: 0,
        cellRenderer: "editableCellRendererComponent",
        editable: false,
        deleteAllow: false,
        editAllow: false,
        requestFlow: true,
        requestData: true,
        colId: "action"
      }
    ]
    return columnDefs;

  }
  prepareColumnApproveForGrid() {
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
      // {
      //   headerName: 'Action',
      //   field: 'remark',
      //   filter: true,
      //   autoHeight: true,
      //   suppressSizeToFit: true,
      //   sortable: true,
      //   width: 100,
      //   isAppRemark: true,
      // },
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
        requestData: true,
        colId: "action"
      }
    ]
    return columnDefs;

  }
  fetchReportDetails(reportId, reportTypeId) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_REPORT_SETUP + '/' + reportId + '/' + reportTypeId;
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf)?.pipe();
  }

  saveEmployeeGatePassData(param){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.SAVE_EMPLOYEE_GATE_PASS;
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
  fetchEmployeeGatePassData(param):Observable<any>{
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.SAVE_EMPLOYEE_GATE_PASS+"GetList";
    serviceConf.requestHeader = {};
    const payload: GatePassRequest = param;
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response) {
        console.log('gatepass',response.gatePasses);
        this._gatePassRequestDataEmployee.next(response.gatePasses)
        return response.gatePasses;
        
      }
    });
    return this._gatePassRequestDataEmployee.asObservable();
  }
  fetchEmployeePunchRegData(param):Observable<any>{
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.GET_PUNCH_REGULARIZATION_DATA;
    serviceConf.requestHeader = {};
    const payload: GatePassRequest = param;
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response) {
        console.log('gatepass',response.punchRegularizationes);
        this._punchRequestDataEmployee.next(response.punchRegularizationes)
        return response.punchRegularizationes;
        
      }
    });
    return this._punchRequestDataEmployee.asObservable();
  }

  savePunchRegularizationData(paunchData : PunchRegularizationInfo):Observable<any>{
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.POST_PUNCH_REGULARIZATION_DATA;
    serviceConf.requestHeader = {};
    const payload: PunchRegularizationInfo = paunchData;
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response && response.messageType===0) {
        console.log('gatepass',response);
        this.notificationService.showSuccess(response.message,null);
      } else{
        this.notificationService.showError(response.message,null);
      }
    });
    return this._punchRequestDataEmployee.asObservable();

  }
}
