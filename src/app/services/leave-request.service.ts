import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { CancelLeaveRequest, LeaveBalance, LeaveRequest, LeaveRequestByAdmin, LeaveRequestByEmployee } from '../store/model/LeaveRequest.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { AttendancesDetail } from '../store/model/userActionAttendanceDetail.model';
import { AppCoreCommonService } from './app.core-common.services';
import { RequestFlowService } from './request-flow.service';

@Injectable({
  providedIn: 'root'
})
export class LeaveRequestService {

  defaultColDef: { suppressSizeToFit: boolean; };
  colResizeDefault: string;
  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public _leaveBalanceData:BehaviorSubject<LeaveBalance> = new BehaviorSubject<LeaveBalance>(null);
  private _leaveattendanceDetail:BehaviorSubject<AttendancesDetail> = new BehaviorSubject<AttendancesDetail>(null);
  public _leaveRequestDataEmployee:BehaviorSubject<LeaveRequest> = new BehaviorSubject<LeaveRequest>(null);
  public _leaveRequestDataAdmin:BehaviorSubject<LeaveRequestByAdmin> = new BehaviorSubject<LeaveRequestByAdmin>(null);
  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<LeaveRequestByEmployee>,
    private notificationService: NotificationService,
    private router: Router,
    private appCoreCommonService: AppCoreCommonService,
    private requestFlowService:RequestFlowService
  ) {
    
  }
  setVisibility(val) {
    this._visiblePopup.next(val);
  }
  getVisiblity() {
    return this._visiblePopup.asObservable();
  }
 
  perpareColumnForGridforEmployee() {
    const columnDefs: any[] = [
        
        {
          headerName: 'Detail',
          field: 'visitorName',
          filter: true,
          autoHeight: true,
          suppressSizeToFit:true,
          editable: true,
          sortable: true,
          width: 720,
        },
        {
          headerName: 'Requested Date',
          field: 'companyName',
          filter: true,
          autoHeight: true,
          suppressSizeToFit:true,
          editable: true,
          sortable: true,
          width: 720,
        },
        
        {
          headerName: 'Request Remark',
          field: 'visitTime',
          filter: true,
          autoHeight: true,
          suppressSizeToFit:true,
          editable: true,
          sortable: true,
          width: 720,
        },
        {
          headerName: 'Status',
          field: 'visitEndTime',
          filter: true,
          autoHeight: true,
          suppressSizeToFit:true,
          editable: true,
          sortable: true,
          width: 720,
        },
        {
          headerName: 'Action Source',
          field: 'contactNumber',
          filter: true,
          autoHeight: true,
          suppressSizeToFit:true,
          editable: true,
          sortable: true,
          width: 720,
        },
        {
          headerName: 'Action',
          field: 'visitStatusID',
          width: 720,
        }
      

    ]
    return columnDefs;
  }
  perpareColumnForGridforLeaveBalance(){
    const laeveBalanceListCol: any[] =  [
      {
        headerName: 'Leave Code',
        field: 'leaveCode',
        filter: true,
        editable: true,
        sortable: true,
      },
      {
        headerName: 'Leave Name',
        field: 'leaveName',
        filter: true,
        editable: true,
        sortable: true,
      },
      {
        headerName: 'Accrual',
        field: 'accrualLeave',
        filter: true,
        editable: true,
        sortable: true,
      },
      {
        headerName: 'Consume',
        field: 'consumeLeave',
        filter: true,
        editable: true,
        sortable: true,
      },
      {
        headerName: 'Deduct Leave',
        field: 'deductLeave',
        filter: true,
        editable: true,
        sortable: true,
      },
      {
        headerName: 'Balance',
        field: 'balanceLeave',
        filter: true,
        editable: true,
        sortable: true,
      },
    ]
    return laeveBalanceListCol;
  }
fetchLeaveBalanceData(employeeId,year):Observable<any>{
  const serviceConf = new ServiceConfig();
  serviceConf.method = HttpMethod.GET;
  serviceConf.path = PATH.FETCH_LEAVE_REQUEST+'LeaveBalance?employeeId='+employeeId+'&year='+year;
  serviceConf.requestHeader = {};
  this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
    if (response && response.policys) {
      // console.log(response.policys);
      this._leaveBalanceData.next(response.policys)
      return response.policys;
      
    }
  });
  return this._leaveBalanceData.asObservable();
}
fetchLeaveRequestEmployeeData(employeeId,requestID,transactionID,workFlowID,reqStatus):Observable<any>{
  const serviceConf = new ServiceConfig();
  serviceConf.method = HttpMethod.GET;
  serviceConf.path = PATH.FETCH_LEAVE_REQUEST+'employee?EmployeeID='+employeeId+'&TransactionID='+transactionID+'&RequestID='+requestID+'&WorkFlowID='+workFlowID+'&RequestStatus='+reqStatus;
  serviceConf.requestHeader = {};
  this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
    if (response) {
      console.log('leaveRequest',response);
      this._leaveRequestDataEmployee.next(response)
      return response;
      
    }
  });
  return this._leaveRequestDataEmployee.asObservable();
}
fetchLeaveRequestAdminData(employeeId,requestStatus,toDate,formDate):Observable<any>{
  const serviceConf = new ServiceConfig();
  serviceConf.method = HttpMethod.GET;
  serviceConf.path = PATH.FETCH_LEAVE_REQUEST+'admin?EmployeeID='+employeeId+'&FromDate='+formDate+'&ToDate='+toDate+'&RequestStatus='+requestStatus;
  serviceConf.requestHeader = {};
  this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
    if (response) {
      console.log('leaveRequest',response);
      this._leaveRequestDataEmployee.next(response)
      return response;
      
    }
  });
  return this._leaveRequestDataEmployee.asObservable();
}
saveLeaveRequesrByAdmin(leaveRequestInfo){
  const serviceConf = new ServiceConfig();
  serviceConf.method = HttpMethod.POST;
  serviceConf.path = PATH.FETCH_LEAVE_REQUEST+'Admin';
  serviceConf.requestHeader = {};
  const payload: LeaveRequest = leaveRequestInfo
  serviceConf.payloadObjects = payload;
  this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
    if (response.messageType === 0) {
      this.notificationService.showSuccess("Leave Request Successfully.", UI_CONSTANT.SEVERITY.SUCCESS);
      this.setVisibility(false);
    }else{
      this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      this.setVisibility(true);
    }
    return response;
  });

}
saveLeaveRequesrByEmployee(leaveRequestInfo){
  const serviceConf = new ServiceConfig();
  serviceConf.method = HttpMethod.POST;
  serviceConf.path = PATH.FETCH_LEAVE_REQUEST+'employee';
  serviceConf.requestHeader = {};
  const payload: LeaveRequest = leaveRequestInfo
  serviceConf.payloadObjects = payload;
  this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
    if (response.messageType === 0) {
      this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
      this.setVisibility(false);
      this.requestFlowService.setLeaveRequestVisiblity(false);
     
      const date = new Date(), y = date.getFullYear(), m = date.getMonth();
      let fromDate = moment(new Date(y, m, 1), UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
      let toDate = moment( new Date(y, m + 1, 0), UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
      const statusArr= leaveRequestInfo.selectedStatus.map(x=>x.value);
      const reqStatus = statusArr.join('~');
      this.requestFlowService.fetchRequestData(1,reqStatus,fromDate,toDate);
    }else{
      this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      this.setVisibility(true);
      this.requestFlowService.setLeaveRequestVisiblity(true);
    }
    return response;
  });

}
fetchleaveAttendanceDetailData(empid,fromdate,todate):Observable<any>{
  const serviceConf = new ServiceConfig();
  serviceConf.method = HttpMethod.GET;
  serviceConf.path = PATH.FETCH_USER_ATTENDANCE_DETAIL+empid+'/'+fromdate+'/'+todate;
  serviceConf.requestHeader = {};
  this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
    if(response && response.punches){
      // console.log(response.punches);
      this._leaveattendanceDetail.next(response.punches)
      return response.punches;
    }
  });
  return this._leaveattendanceDetail.asObservable();
}
CancelleaveRequest(param){
  const serviceConf = new ServiceConfig();
  serviceConf.method = HttpMethod.POST;
  serviceConf.path = PATH.FETCH_LEAVE_REQUEST+'CancelByAdmin';
  serviceConf.requestHeader = {};
  const payload: CancelLeaveRequest = param
  serviceConf.payloadObjects = payload;
  this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
    if (response.messageType === 0) {
      this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
    }else{
      this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      
    }
    return response;
  });
}
}
