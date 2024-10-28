import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { saveCanteenPolicyDetailAction, saveCanteenPolicyDetaildAction } from '../store/actions/canteen-policy.action';
import { CanteenPolicyModel, organizationMapping } from '../store/model/canteen.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { AppCoreCommonService } from './app.core-common.services';
import { UserGroupService } from './user-group.service';


@Injectable({
  providedIn: 'root'
})
export class CanteenPolicyService {

  private _attendancePolicyMasterDetail:BehaviorSubject<CanteenPolicyModel> = new BehaviorSubject<CanteenPolicyModel>(null);
  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public _visiblePopups: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isEditable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<any>,
    private userGroupService: UserGroupService,
    private notificationService: NotificationService,
    private appCoreCommonService: AppCoreCommonService,
    private router: Router
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

    setVisibilitys(val){
      this._visiblePopups.next(val);
      }

    getVisiblitys(){
      return this._visiblePopups.asObservable();
      }

  public fetchCanteenPolicyDetailData() {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_CANTEEN_POLICY;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response && response.policyes) {
        this._store.dispatch(new saveCanteenPolicyDetailAction(response.policyes));
      }
      return response;
    });

  }


  fetchCanteenPolicyDetailDataID(params){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_CANTEEN_POLICY_ID+params.data.id;
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf)?.pipe();
  }

  fetchAttendancePolicyMasterDetail(params):Observable<any>{
    console.log(params);
    const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.GET;
      serviceConf.path = PATH.FETCH_CANTEEN_POLICY_ID+params.data.policyID;
      serviceConf.requestHeader = {};
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
        if(response && response.policy){
           this._attendancePolicyMasterDetail.next(response.policy)
           return response.policy;
        }
      });
      return this._attendancePolicyMasterDetail.asObservable();
  }


  fetchAttendancePolicyMasterDetails(params):Observable<any>{
    console.log(params);
    const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.GET;
      serviceConf.path = PATH.FETCH_CANTEEN_POLICY_ID+params;
      serviceConf.requestHeader = {};
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
        if(response && response.policy){
           this._attendancePolicyMasterDetail.next(response.policy)
           return response.policy;
        }
      });
      return this._attendancePolicyMasterDetail.asObservable();
  }

  getCSVReport(data, fileName){
    this.appCoreCommonService.exportExcel(data, fileName);
  }

  public prepareColumnsForGrid() {

    const columnDefs: any[] = [
      {
        headerName: 'policy ID',
        field: 'policyID',
        filter: true,
        autoHeight: true,
        suppressSizeToFit: true,
        sortable: true,
        width: 200,

      },
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
        deleteAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.CanteenPolicy, UI_CONSTANT.ACTIONS.DELETE),
        editAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.CanteenPolicy, UI_CONSTANT.ACTIONS.UPDATE),
        colId: "action",
        policyMapping: false,
        policyOuMap:true
      }
    ]
    return columnDefs;
  }



  prepareColumnForGrid() {
    const columnDefs: any[] = [
      {
        headerName: '',
        field: 'itemID',
        filter: false,
        editable: false,
        sortable: false,
        checkbox: true,
        suppressSizeToFit:true,
        hideData: true
      },
      {
        headerName: 'Item Code',
        field: 'itemCode',
        filter: true,
        autoHeight: true,
        sortable: true,
        width: 180
      },
      {
        headerName: 'Item Name',
        field: 'itemName',
        filter: true,
        editable: false,
        sortable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Item Type',
        field: 'itemType',
        filter: true,
        suppressSizeToFit: true,
        editable: false,
        sortable: true,
      },
      {
        headerName: 'Star Time',
        field: 'startTime',
        filter: true,
        suppressSizeToFit: true,
        editable: false,
        sortable: true,

      },
      {
        headerName: 'End Time',
        field: 'endTime',
        filter: true,
        suppressSizeToFit: true,
        editable: false,
        sortable: true,
      },
      {
        headerName: 'ItemRateAfterSubsidy',
        field: 'itemRateAfterSubsidy',
        filter: true,
        editable: false,
        sortable: true,
      },
      {
        headerName: 'EmployeeContribution',
        field: 'employeeContribution',
        filter: true,
        editable: false,
        sortable: true,
      },
      {
        headerName: 'EmployerContribution',
        field: 'employerContribution',
        filter: true,
        editable: false,
        sortable: true,
      },
      {
        headerName: 'SubsidizedQuantity',
        field: 'subsidizedQuantity',
        filter: true,
        editable: false,
        sortable: true,
      }
    ]

    return columnDefs;
  }

  updateCanteenPolicy(params){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.PUT;
    serviceConf.path = PATH.UPDATE_CANTEEN_POLICY;
    serviceConf.requestHeader = {};
    serviceConf.payloadObjects = params;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        this.fetchCanteenPolicyDetailData();
        this.setVisibility(false);
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true);
      }
      return response;
    });
  }

  saveCanteenPolicy(params){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.POST_CANTEEN_POLICY;
    serviceConf.requestHeader = {};
    const payload: CanteenPolicyModel = {
      policyID:0,
      policyTypeID: params.policyTypeID,
      policyName:params.policyName,
      description:params.description,
      mappedOnOrganization:params.mappedOnOrganization,
      mappingStatus:params.mappingStatus,
      policyBasedOn:params.policyBasedOn,
      mappings:params.mappings,
    }
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
         this.fetchCanteenPolicyDetailData();
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
      return response;
    });

  }


  // Organization


  SaveOrgnaizationMapping(params) {
     
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.PUT;
    serviceConf.path = PATH.UPDATE_CANTEEN_OUMAP;
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
      serviceConf.path = PATH.FETCH_CANTEEN_OUMAP+id;
      serviceConf.requestHeader = {};
      return this.remoteService.httpServiceRequest(serviceConf)?.pipe();
  }


  deleteCellFromRemote(params) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.DELETE;
    serviceConf.path = PATH.DELETE_CANTEEN_POLICY + '/' + params.data.policyID;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
          this.fetchCanteenPolicyDetailData()
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
      }
      else{
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
      return response;
    });

  }
}
