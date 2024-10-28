import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { EditableCellRendererComponent } from '../module/masters/renderer/editable-cell-renderer.component';
import { saveVisitorAdminAction } from '../store/actions/visitorAdmin.action';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { VisitorAdmin, VisitorInOut, OtherVisitor } from '../store/model/visitorAdmin.model';
import { AppCoreCommonService } from './app.core-common.services';
import { Router } from '@angular/router';
import { UserGroupService } from './user-group.service';

@Injectable({
  providedIn: 'root'
})
export class GuestVisitorService {

  frameworkComponents: any = {
    editableCellRendererComponent: EditableCellRendererComponent
  };
  defaultColDef: { suppressSizeToFit: boolean; };
  colResizeDefault: string;
  public _guestVisitorParamsData: BehaviorSubject<any> = new BehaviorSubject<boolean>(null);
  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isEditable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _visitorDetail: BehaviorSubject<VisitorAdmin> = new BehaviorSubject<VisitorAdmin>(null);
  private _visitDetail: BehaviorSubject<VisitorInOut> = new BehaviorSubject<VisitorInOut>(null);
  private _visitorpassDetail: BehaviorSubject<VisitorAdmin> = new BehaviorSubject<VisitorAdmin>(null);
  visitorAdminStateList: BehaviorSubject<Array<VisitorAdmin>> = new BehaviorSubject<Array<VisitorAdmin>>([]);
  private _otpSendStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _otpVerifyStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<VisitorAdmin>,
    private notificationService: NotificationService,
    private router: Router,
    private appCoreCommonService: AppCoreCommonService,
    private userGroupService: UserGroupService
  ) {
    this._isEditable.next(false);
    this._isEditable.asObservable();
  }
  setVisibility(val) {
    this._visiblePopup.next(val);
  }

  getVisiblity() {
    return this._visiblePopup.asObservable();
  }

  setParamsData(data){
    this._guestVisitorParamsData.next(data);
  }
  getParamsData(){
    return this._guestVisitorParamsData.asObservable();
  }
  public fetchVisitorAdminData(formdatetime, todatetime, visitorstatus) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_VISITOR_ADMIN + '?fromDate=' + formdatetime + '&toDate=' + todatetime + '&status=' + visitorstatus;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(result => {
      if (result) {
        this.visitorAdminStateList.next(result.visites);
        this._store.dispatch(new saveVisitorAdminAction(result.visites));
      }
      return result;
    });
  }
  public fetchVisitorRequestData(id): Observable<any> {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_VISITOR_ADMIN + '/VisitorDetail/' + id;
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf)?.pipe();
   

  }
  public fetchVisitDetailData(visitotid, visitorLogId): Observable<any> {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_VISITOR_ADMIN + '/VisitDetail/' + visitotid + '/' + visitorLogId;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response && response.visitor) {
        this._visitDetail.next(response.visitor)
        return response.visitor;
      }
    });
    return this._visitDetail.asObservable();

  }
  saveVisitorAdmin(visitoradminInfo) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_VISITOR_ADMIN + '/VisitRequest';
    serviceConf.requestHeader = {};
    const payload: VisitorAdmin = visitoradminInfo;
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
        this.setVisibility(false);
      } else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true);
      }
      return response;
    });
  }
  perpareColumnForGrid() {
    const columnDefs: any[] = [
      {
        headerName: 'Name',
        field: 'visitorName',
        filter: true,
        autoHeight: true,
        suppressSizeToFit: true,
        editable: true,
        sortable: true,
        width: 720,
      },
      {
        headerName: 'Company',
        field: 'companyName',
        filter: true,
        autoHeight: true,
        suppressSizeToFit: true,
        editable: true,
        sortable: true,
        width: 720,
      },
      {
        headerName: 'Designation',
        field: 'designationName',
        filter: true,
        autoHeight: true,
        suppressSizeToFit: true,
        editable: true,
        sortable: true,
        width: 720,
      },
      {
        headerName: 'Contact Number',
        field: 'contactNumber',
        filter: true,
        autoHeight: true,
        suppressSizeToFit: true,
        editable: true,
        sortable: true,
        width: 720,
      },
      {
        headerName: 'Visit Status',
        field: 'visitStatusID',
        filter: true,
        autoHeight: true,
        suppressSizeToFit: true,
        cellEditorParams: UI_CONSTANT.MASTER.VISITORSTATUS,
        editable: true,
        sortable: true,
        width: 720,
      },

      {
        headerName: "",
        minWidth: 315,
        cellRenderer: "editableCellRendererComponent",
        editable: false,
        colId: "action",
        deleteAllow: false,
        editAllow: true,//this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.Visitor,UI_CONSTANT.ACTIONS.UPDATE),
        visitStatusID: 9,
        gatePassRequest: true
      },

    ]
    return columnDefs;
  }
  updateVisitorInOUT(params: VisitorInOut) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_VISITOR_ADMIN + '/VisitorInOut';
    serviceConf.requestHeader = {};
    console.log(params.items);
    const payload: VisitorInOut = {
      visitor: params.visitor,
      visitorID: params.visitorID,
      visitorLogID: params.visitorLogID,
      visitorTypeID: params.visitorTypeID,
      visitPurposeID: params.visitPurposeID,
      employeeID: params.employeeID,
      visitorAreaID: params.visitorAreaID,
      inGateID: params.inGateID,
      outGateID: params.outGateID,
      expectedIn: params.expectedIn,
      expectedOut: params.expectedOut,
      actualIn: params.actualIn,
      actualOut: params.actualOut,
      visitorPriorityID: params.visitorPriorityID,
      visitStatusID: params.visitStatusID,
      visitRemarks: params.visitRemarks,
      bodyTemperature: params.bodyTemperature,
      inRemarks: params.inRemarks,
      outRemarks: params.outRemarks,
      otherRemarks: params.otherRemarks,
      vehicleTypeID: params.vehicleTypeID,
      vehicleModel: params.vehicleModel,
      vehicleNumber: params.vehicleNumber,
      vehicleDetail: params.vehicleDetail,
      requestSourceID: params.requestSourceID,
      checkInBy: params.checkInBy,
      checkInByDetail: params.checkInByDetail,
      checkOutBy: params.checkOutBy,
      checkOutByDetail: params.checkOutByDetail,
      items: params.items,
      otherVisitors: params.otherVisitors,
      employeeDetail:params.employeeDetail,
      employeeName: params.employeeName,
    employeeDepartment: params.employeeDepartment,
    employeeDesignation: params.employeeDesignation
    }
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0 || response.messageType === "") {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
        this.router.navigate(['/gate-user/visitor-request']);
      } else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.router.navigate(['/gate-user/edit-visitor-admin/' + params.visitorID + '/' + params.visitorLogID]);
      }
      return response;
    });
  }
  updateStateOfCell(visitoradminInfo) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_VISITOR_ADMIN + '/VisitRequest';
    serviceConf.requestHeader = {};
    const payload: VisitorAdmin = visitoradminInfo;
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
        // this.fetchVisitorAdminData();
        this.setVisibility(false);
      } else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true);
      }
      return response;
    });
  }
  getCSVReport(data, fileName) {
    this.appCoreCommonService.exportExcel(data, fileName);
  }
  fetchVisitorPassDetail(id): Observable<any> {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_VISITOR_ADMIN + '/VisitorDetail/' + id;
    serviceConf.requestHeader = {};

    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response && response.visitor) {
        this._visitorpassDetail.next(response.visitor)
        return response.visitor;
      }
    });
    return this._visitorpassDetail.asObservable();
  }
  saveSelfVisitorAdmin(visitorInfo) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_SELF_VISITOR_REQUEST;
    serviceConf.requestHeader = {};
    const payload: VisitorAdmin = visitorInfo;
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
      } else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
      return response;
    });
  }
}
