import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { RemoteService } from '../common/remote.service';
import { UserGroupService } from 'src/app/services/user-group.service';
import { NotificationService } from '../common/notification.service';
import { AppCoreCommonService } from 'src/app/services/app.core-common.services';
import { Router } from '@angular/router';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { saveLeavePolicyAction } from '../store/actions/master.action';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { LeavePolicyDetail, organizationMapping } from '../store/model/master-data.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeavePolicyService {
  public _visibleUOPopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public _visibleMapingPopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isEditable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<any>,
    private userGroupService: UserGroupService,
    private notificationService: NotificationService,
    private appCoreCommonService: AppCoreCommonService,
    private router: Router
  ) { }

  public fetchLeavePolicyData() {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_LEAVE_POLICY;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response && response.policyes) {
        this._store.dispatch(new saveLeavePolicyAction(response.policyes));
      }
      return response;
    });

  }

  SaveLeavePolicyData(params){
    const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.POST;
      serviceConf.path = PATH.FETCH_LEAVE_POLICY;
      serviceConf.requestHeader = {};
      serviceConf.payloadObjects = params;
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
        if (response.messageType === 0) {
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
          this.fetchLeavePolicyData();
          this.setVisibility(false);
        }else{
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
          this.setVisibility(true);
        }
        return response;
      });
  }
  updateStateOfCell(params){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.PUT;
    serviceConf.path = PATH.FETCH_LEAVE_POLICY;
    serviceConf.requestHeader = {};
    serviceConf.payloadObjects = params;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        this.fetchLeavePolicyData();
        this.setVisibility(false);
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true);
      }
      return response;
    });
  }
  deleteCellFromRemote(params){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.DELETE;
    serviceConf.path = PATH.FETCH_LEAVE_POLICY+'/'+params.data.policyID;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.fetchLeavePolicyData();
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
      }
      else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
      return response;
    });

   }

   getCSVReport(data, fileName){
    this.appCoreCommonService.exportExcel(data, fileName);
  }

   setOUVisiblity(val) {
    this._visibleUOPopup.next(val);
  }

  getOUVisiblity() {
    return this._visibleUOPopup.asObservable();
  }

  setMappingVisiblity(val) {
    this._visibleMapingPopup.next(val);
  }

  getMappingVisiblity() {
    return this._visibleMapingPopup.asObservable();
  }

  setVisibility(val) {
    this._visiblePopup.next(val);
  }

  getVisiblity() {
    return this._visiblePopup.asObservable();
  }
  public prepareColumnForGrid() {

    const columnDefs: any[] = [
      {
        headerName: ' Name',
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
        headerName: 'MapPolicy',
        field: 'mappingStatus',
        filter: true,
        sortable: true,
        width: 210,
      },
      {
        headerName: 'Map Org.',
        field: 'mappedOnOrganization',
        filter: true,
        sortable: true,
        width: 210,
        icons: true,
      },
      {
        headerName: "",
        minWidth: 0,
        editable: false,
        deleteAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.Leave_Master, UI_CONSTANT.ACTIONS.DELETE),
        editAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.Leave_Master, UI_CONSTANT.ACTIONS.UPDATE),
        colId: "action",
        policyMapping: true,
        policyOuMap:true
      }
    ]
    return columnDefs;

  }

/** fetch Mapped leave policy */
  public fetchMappedLeavePolicyData(policyId) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path= PATH.FETCH_LEAVECODE_MAPPING+policyId;
    // serviceConf.path = path.replace('{policyID}', policyId);
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf)?.pipe();
  }

  /** fetch Mapped Ou data */
  public fetchMappedOUData(policyId) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path= PATH.FETCH_LEAVE_OU_MAPPING+policyId;
    // serviceConf.path = path.replace('{policyID}', policyId);
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf)?.pipe();
  }

  /** save Mapped leave policy */
  public updateMappedLeavePolicyData(payload) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.PUT;
    const path = PATH.FETCH_LEAVECODE_MAPPING;
    serviceConf.path = path;
    serviceConf.requestHeader = {};
    serviceConf.payloadObjects = payload;
    return this.remoteService.httpServiceRequest(serviceConf)?.pipe();
  }

  SaveOrgnaizationMapping(params) {
     
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.PUT;
    serviceConf.path = PATH.FETCH_LEAVE_POLICY+"/organizatioMapping";
    serviceConf.requestHeader = {};
    const payload: organizationMapping = params;
    serviceConf.payloadObjects =  {
      policyID: params.policyID,
      policyTypeID: params.policyTypeID,
      workFlowID: params.workFlowID,
      organizationKeyID: params.organizationKeyID,
      locationKeyID: params.locationKeyID,
      organization: params.organization,
      location: params.location 
    };;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
        this.fetchLeavePolicyData();
        this.setOUVisiblity(false);
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setOUVisiblity(true);
      }
      return response;
    });
  }
  fetchPolicyMappingDetail(id):Observable<any>{
    const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.GET;
      serviceConf.path = PATH.FETCH_LEAVE_POLICY+"/organizatioMapping/"+id;
      serviceConf.requestHeader = {};
      return this.remoteService.httpServiceRequest(serviceConf)?.pipe();
  }
  fetchPolicyDetail(id):Observable<any>{
    const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.GET;
      serviceConf.path = PATH.FETCH_LEAVE_POLICY+"/"+id;
      serviceConf.requestHeader = {};
      return this.remoteService.httpServiceRequest(serviceConf)?.pipe();
  }
  deleteLeavePolicyMapping(policyID,leaveID) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.DELETE;
    serviceConf.path = PATH.FETCH_LEAVECODE_MAPPING + policyID +'/'+ leaveID;
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf)?.pipe();

  }
}
