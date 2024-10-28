import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { GridApi } from 'ag-grid-community';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { saveHolidayCalenderPolicyAction } from '../store/actions/master.action';
import { HolidayCalenderPolicy, HolidayCalenderPolicyMapping } from '../store/model/holidaycalenderpolicy.model';
import { organizationMapping } from '../store/model/master-data.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { AppCoreCommonService } from './app.core-common.services';
import { UserGroupService } from './user-group.service';

@Injectable({
  providedIn: 'root'
})
export class HolidayCalenderPolicyService {

  private _gridApi:BehaviorSubject<GridApi> = new BehaviorSubject<GridApi>(null);
  holidayCalenderPolicyStateList: BehaviorSubject<Array<HolidayCalenderPolicy>>= new BehaviorSubject<Array<HolidayCalenderPolicy>>([]);
 public  holidayCalenderPolicyMappingStateList: BehaviorSubject<Array<HolidayCalenderPolicyMapping>>= new BehaviorSubject<Array<HolidayCalenderPolicyMapping>>([]);
  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isEditable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public orgnaizationMappingInfo: organizationMapping = {} as organizationMapping;
  public selectedLocation: Array<number>;
  public selectedOrganiztion: Array<number>;
  public _visibleOUPopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _holidayPolicyDetail:BehaviorSubject<HolidayCalenderPolicy> = new BehaviorSubject<HolidayCalenderPolicy>(null);
  setGridApi(data) {
    this._gridApi.next(data);
 }

 getGridApi() {
   return this._gridApi.asObservable();
 }
  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<HolidayCalenderPolicy>,
    private notificationService:NotificationService,
    private appCoreCommonService:AppCoreCommonService,
    private userGroupService:UserGroupService,
    private router: Router,
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

  public fetchHolidayCalenderPolicyData(){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_HOLIDAY_CALENDER_POLICY;
    serviceConf.requestHeader = {};

    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response){
        // console.log('holiday',response.policyes);
        this.holidayCalenderPolicyStateList.next(response.policyes);
        this._store.dispatch(new saveHolidayCalenderPolicyAction(response.policyes));
      }
      return response;
    });

  }
  saveHolidayCalenderPolicy(holidayCalenderPolicyInfo){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_HOLIDAY_CALENDER_POLICY;
    serviceConf.requestHeader = {};
    const payload: HolidayCalenderPolicy = {
      policyID: 0,
      policyTypeID: 3,
      policyName: holidayCalenderPolicyInfo.policyName,
      description: holidayCalenderPolicyInfo.description,
      mappedOnOrganization: holidayCalenderPolicyInfo.mappedOnOrganization,
      mappingStatus: holidayCalenderPolicyInfo.mappingStatus,
      restrictedHolidayApplicable: holidayCalenderPolicyInfo.restrictedHolidayApplicable,
      maximumRestrictedHolidayRequest: holidayCalenderPolicyInfo.maximumRestrictedHolidayRequest,
      restrictedHolidayProdata: holidayCalenderPolicyInfo.restrictedHolidayProdata,
      prodataDate: holidayCalenderPolicyInfo.prodataDate,
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        this.fetchHolidayCalenderPolicyData();
        this.setVisibility(false);
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true);
      }
      return response;
    });

  }
  prepareColumnForGrid() {
    const columnDefs:any[] = [
      {
        headerName: 'Policy Name',
        field: 'policyName',
        filter: true,
        suppressSizeToFit:true,
        editable: true,
        sortable: true,
        width: 180,

    },
    {
      headerName: 'Description',
      field: 'description',
      filter: true,
      suppressSizeToFit:true,
      editable: true,
      sortable: true,
      width: 130,

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
    width: 100,
    cellRenderer: "editableCellRendererComponent",
    editable: false,
    deleteAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.HolidayPolicy, UI_CONSTANT.ACTIONS.DELETE),
    editAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.HolidayPolicy, UI_CONSTANT.ACTIONS.UPDATE),
    colId: "action",
    policyMapping:true,
    policyOuMap:true
  }
    ]
    return columnDefs;
  }
  deleteCellFromRemote(params){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.DELETE;
    serviceConf.path = PATH.FETCH_HOLIDAY_CALENDER_POLICY+'/'+params.data.policyID;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.fetchHolidayCalenderPolicyData();
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
      }
      else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
      return response;
    });

   }
    updateStateOfCell(params){
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.PUT;
      serviceConf.path = PATH.FETCH_HOLIDAY_CALENDER_POLICY;
      serviceConf.requestHeader = {};
      const payload: HolidayCalenderPolicy = params;
      serviceConf.payloadObjects = payload;
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
        if (response.messageType === 0) {
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
          this.fetchHolidayCalenderPolicyData();
          this.setVisibility(false);
        }else{
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
          this.setVisibility(true);
        }
        return response;
      });
    }
  
    getCSVReport(data, fileName){
      this.appCoreCommonService.exportExcel(data, fileName);
    }
    fetchHolidayCalenderPolicyDetail(policyID):Observable<any>{
      const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.GET;
        serviceConf.path = PATH.FETCH_HOLIDAY_CALENDER_POLICY+'/'+policyID;
        serviceConf.requestHeader = {};
        this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
          if(response && response.policy){
             this._holidayPolicyDetail.next(response.policy)
             return response.policy;
          }
        });
        return this._holidayPolicyDetail.asObservable();
    }
   
    SaveOrgnaizationMapping(params) {
     
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.PUT;
      serviceConf.path = PATH.FETCH_HOLIDAY_CALENDER_POLICY+"/organizatioMapping";
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
          this.fetchHolidayCalenderPolicyData();
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
        serviceConf.path = PATH.FETCH_HOLIDAY_CALENDER_POLICY+"/organizatioMapping/"+id;
        serviceConf.requestHeader = {};
        return this.remoteService.httpServiceRequest(serviceConf)?.pipe();
    }
    fetchHolidayCalenderPolicyMapping(policyId,calenderYear):Observable<any>{
      const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.GET;
        serviceConf.path = PATH.FETCH_HOLIDAY_CALENDER_POLICY+'/holidayCalendarMapping/'+policyId+'/'+calenderYear;
        serviceConf.requestHeader = {};
        return this.remoteService.httpServiceRequest(serviceConf)?.pipe();
    }
    setOUVisiblity(val) {
      this._visibleOUPopup.next(val);
    }
  
    getOUVisiblity() {
      return this._visibleOUPopup.asObservable();
    }

    saveHolidayCalenderMappingPolicy(holidayCalenderMappingPolicyInfo){
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.PUT;
      serviceConf.path = PATH.FETCH_HOLIDAY_CALENDER_POLICY+'/holidayCalendarMapping';
      serviceConf.requestHeader = {};
      const payload: HolidayCalenderPolicyMapping = holidayCalenderMappingPolicyInfo;
      serviceConf.payloadObjects = payload;
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
        if (response.messageType === 0) {
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
          this.fetchHolidayCalenderPolicyData();
          this.router.navigate(['/time-office/holiday-calender']);
        }else{
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
          this.router.navigate(['/time-office/holiday-calender/holiday-calender-policy-mapping/' + holidayCalenderMappingPolicyInfo.policyID]);
        }
        return response;
      });
  
    }
}
